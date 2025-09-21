import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { postTweet, refreshTwitterToken } from '@/lib/oauth/twitter'
import { postToLinkedIn, refreshLinkedInToken } from '@/lib/oauth/linkedin'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { post_id } = body

    if (!post_id) {
      return NextResponse.json(
        { error: 'Missing post_id' },
        { status: 400 }
      )
    }

    // Fetch post details
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select(`
        *,
        post_platforms!inner(
          platform,
          social_account_id
        )
      `)
      .eq('id', post_id)
      .single()

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Update post status to publishing
    await supabase
      .from('posts')
      .update({ status: 'publishing' })
      .eq('id', post_id)

    const publishResults = []
    const errors = []

    // Publish to each platform
    for (const platformConfig of post.post_platforms) {
      try {
        // Fetch social account details
        const { data: account, error: accountError } = await supabase
          .from('social_accounts')
          .select('*')
          .eq('id', platformConfig.social_account_id)
          .single()

        if (accountError || !account) {
          errors.push({
            platform: platformConfig.platform,
            error: 'Account not found'
          })
          continue
        }

        // Check if token needs refresh
        const metadata = account.metadata as any
        const expiresAt = metadata.expires_at ? new Date(metadata.expires_at) : null
        const needsRefresh = expiresAt && expiresAt < new Date()

        let accessToken = metadata.access_token

        // Refresh token if needed
        if (needsRefresh && metadata.refresh_token) {
          try {
            let newTokens
            
            switch (platformConfig.platform) {
              case 'twitter':
                newTokens = await refreshTwitterToken(metadata.refresh_token)
                break
              case 'linkedin':
                if (metadata.refresh_token) {
                  newTokens = await refreshLinkedInToken(metadata.refresh_token)
                }
                break
            }

            if (newTokens) {
              accessToken = newTokens.access_token
              
              // Update stored tokens
              await supabase
                .from('social_accounts')
                .update({
                  metadata: {
                    ...metadata,
                    access_token: newTokens.access_token,
                    refresh_token: newTokens.refresh_token || metadata.refresh_token,
                    expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString()
                  }
                })
                .eq('id', account.id)
            }
          } catch (refreshError) {
            console.error('Token refresh error:', refreshError)
            errors.push({
              platform: platformConfig.platform,
              error: 'Token refresh failed'
            })
            continue
          }
        }

        // Publish based on platform
        let publishResult

        switch (platformConfig.platform) {
          case 'twitter': {
            publishResult = await postTweet(
              accessToken,
              post.content,
              post.media_urls
            )
            break
          }

          case 'linkedin': {
            const authorId = metadata.person_id || metadata.organization_id
            const isOrg = !!metadata.organization_id
            
            publishResult = await postToLinkedIn(
              accessToken,
              authorId,
              post.content,
              post.media_urls,
              isOrg
            )
            break
          }

          case 'facebook':
          case 'instagram': {
            // Facebook/Instagram publishing
            const pageId = metadata.page_id || metadata.instagram_id
            const endpoint = platformConfig.platform === 'instagram' 
              ? `https://graph.facebook.com/v18.0/${pageId}/media`
              : `https://graph.facebook.com/v18.0/${pageId}/feed`

            const params: any = {
              message: post.content,
              access_token: accessToken
            }

            if (post.media_urls && post.media_urls.length > 0) {
              if (platformConfig.platform === 'instagram') {
                params.image_url = post.media_urls[0]
                params.caption = post.content
                delete params.message
              } else {
                params.url = post.media_urls[0]
              }
            }

            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params)
            })

            if (!response.ok) {
              throw new Error(await response.text())
            }

            publishResult = await response.json()
            break
          }

          default:
            errors.push({
              platform: platformConfig.platform,
              error: 'Unsupported platform'
            })
            continue
        }

        publishResults.push({
          platform: platformConfig.platform,
          success: true,
          result: publishResult
        })

        // Store publish record
        await supabase
          .from('post_analytics')
          .insert({
            post_id,
            platform: platformConfig.platform,
            published_at: new Date().toISOString(),
            platform_post_id: publishResult.id || publishResult.data?.id,
            initial_metrics: {}
          })

      } catch (platformError: any) {
        console.error(`Publishing to ${platformConfig.platform} failed:`, platformError)
        errors.push({
          platform: platformConfig.platform,
          error: platformError.message
        })
      }
    }

    // Update post status
    const finalStatus = errors.length === 0 ? 'published' : 
                       errors.length < post.post_platforms.length ? 'partial' : 'failed'

    await supabase
      .from('posts')
      .update({
        status: finalStatus,
        published_at: finalStatus === 'published' ? new Date().toISOString() : null,
        error_message: errors.length > 0 ? JSON.stringify(errors) : null
      })
      .eq('id', post_id)

    return NextResponse.json({
      success: errors.length === 0,
      results: publishResults,
      errors
    })

  } catch (error: any) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check publishing status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const postId = searchParams.get('post_id')

  if (!postId) {
    return NextResponse.json(
      { error: 'Missing post_id' },
      { status: 400 }
    )
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select('id, status, published_at, error_message')
    .eq('id', postId)
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(post)
}