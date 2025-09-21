import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTwitterTokens, getTwitterUser } from '@/lib/oauth/twitter'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      new URL(`/connections?error=${error}`, request.url)
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/connections?error=missing_params', request.url)
    )
  }

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?error=unauthorized', request.url)
      )
    }

    // Get the stored code verifier from cookies
    const cookieStore = cookies()
    const codeVerifier = cookieStore.get('twitter_code_verifier')?.value

    if (!codeVerifier) {
      return NextResponse.redirect(
        new URL('/connections?error=invalid_session', request.url)
      )
    }

    // Exchange code for tokens
    const tokens = await getTwitterTokens(code, codeVerifier)
    
    // Get user info
    const twitterUser = await getTwitterUser(tokens.access_token)

    // Parse state to get client_account_id
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    const { client_account_id } = stateData

    // Store the connection in database
    const { data: socialAccount, error: dbError } = await supabase
      .from('social_accounts')
      .upsert({
        client_account_id,
        platform: 'twitter',
        account_name: twitterUser.name,
        account_handle: `@${twitterUser.username}`,
        account_id: twitterUser.id,
        is_active: true,
        metadata: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
          scope: tokens.scope,
          profile_image: twitterUser.profile_image_url
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.redirect(
        new URL('/connections?error=database_error', request.url)
      )
    }

    // Clear the code verifier cookie
    cookieStore.delete('twitter_code_verifier')

    return NextResponse.redirect(
      new URL('/connections?success=twitter_connected', request.url)
    )
  } catch (error) {
    console.error('Twitter OAuth error:', error)
    return NextResponse.redirect(
      new URL('/connections?error=oauth_failed', request.url)
    )
  }
}