import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTwitterAuthUrl } from '@/lib/oauth/twitter'
import { getLinkedInAuthUrl } from '@/lib/oauth/linkedin'
import { cookies } from 'next/headers'
import crypto from 'crypto'

/**
 * Generate PKCE code verifier and challenge
 */
function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url')
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url')
  
  return { verifier, challenge }
}

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
    const { platform, client_account_id } = body

    if (!platform || !client_account_id) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Create state parameter with client_account_id
    const state = Buffer.from(JSON.stringify({
      client_account_id,
      user_id: user.id,
      timestamp: Date.now()
    })).toString('base64')

    let authUrl: string

    switch (platform) {
      case 'twitter': {
        // Generate PKCE for Twitter
        const { verifier, challenge } = generatePKCE()
        
        // Store code verifier in secure cookie
        const cookieStore = cookies()
        cookieStore.set('twitter_code_verifier', verifier, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 10 // 10 minutes
        })

        authUrl = getTwitterAuthUrl(state, challenge)
        break
      }

      case 'linkedin': {
        authUrl = getLinkedInAuthUrl(state)
        break
      }

      case 'facebook':
      case 'instagram': {
        // Facebook/Instagram OAuth
        const FB_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID!
        const FB_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback/facebook'
        const scopes = [
          'pages_show_list',
          'pages_read_engagement',
          'pages_manage_posts',
          'instagram_basic',
          'instagram_content_publish'
        ].join(',')

        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FB_CLIENT_ID}&redirect_uri=${FB_REDIRECT_URI}&state=${state}&scope=${scopes}`
        break
      }

      default:
        return NextResponse.json(
          { error: 'Unsupported platform' },
          { status: 400 }
        )
    }

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Connect error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}