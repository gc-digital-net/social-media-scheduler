import { createClient } from '@/lib/supabase/server'

// Twitter OAuth 2.0 configuration
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID!
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!
const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback/twitter'

// OAuth 2.0 endpoints
const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize'
const TWITTER_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token'
const TWITTER_REVOKE_URL = 'https://api.twitter.com/2/oauth2/revoke'

// Scopes required for posting
const SCOPES = [
  'tweet.read',
  'tweet.write',
  'users.read',
  'offline.access'
].join(' ')

export interface TwitterTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string
  token_type: string
}

/**
 * Generate Twitter OAuth 2.0 authorization URL
 */
export function getTwitterAuthUrl(state: string, codeChallenge: string) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TWITTER_CLIENT_ID,
    redirect_uri: TWITTER_REDIRECT_URI,
    scope: SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  })

  return `${TWITTER_AUTH_URL}?${params.toString()}`
}

/**
 * Exchange authorization code for access tokens
 */
export async function getTwitterTokens(
  code: string,
  codeVerifier: string
): Promise<TwitterTokens> {
  const response = await fetch(TWITTER_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: TWITTER_REDIRECT_URI,
      code_verifier: codeVerifier
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get Twitter tokens: ${error}`)
  }

  return response.json()
}

/**
 * Refresh Twitter access token
 */
export async function refreshTwitterToken(refreshToken: string): Promise<TwitterTokens> {
  const response = await fetch(TWITTER_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to refresh Twitter token: ${error}`)
  }

  return response.json()
}

/**
 * Get Twitter user info
 */
export async function getTwitterUser(accessToken: string) {
  const response = await fetch('https://api.twitter.com/2/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get Twitter user: ${error}`)
  }

  const data = await response.json()
  return data.data
}

/**
 * Post a tweet
 */
export async function postTweet(
  accessToken: string,
  text: string,
  mediaIds?: string[]
) {
  const body: any = { text }
  
  if (mediaIds && mediaIds.length > 0) {
    body.media = {
      media_ids: mediaIds
    }
  }

  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to post tweet: ${error}`)
  }

  return response.json()
}

/**
 * Upload media to Twitter (for images)
 */
export async function uploadTwitterMedia(
  accessToken: string,
  mediaBuffer: Buffer,
  mediaType: string
) {
  // Twitter v1.1 API is still used for media upload
  const formData = new FormData()
  formData.append('media', new Blob([mediaBuffer], { type: mediaType }))

  const response = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: formData
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to upload media: ${error}`)
  }

  const data = await response.json()
  return data.media_id_string
}

/**
 * Revoke Twitter access
 */
export async function revokeTwitterAccess(accessToken: string) {
  const response = await fetch(TWITTER_REVOKE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      token: accessToken,
      token_type_hint: 'access_token'
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to revoke Twitter access: ${error}`)
  }

  return true
}