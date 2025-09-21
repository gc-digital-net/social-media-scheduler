import { createClient } from '@/lib/supabase/server'

// LinkedIn OAuth 2.0 configuration
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!
const LINKEDIN_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback/linkedin'

// OAuth 2.0 endpoints
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization'
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2'

// Scopes for posting and profile access
const SCOPES = [
  'r_liteprofile',
  'r_emailaddress',
  'w_member_social'
].join(' ')

export interface LinkedInTokens {
  access_token: string
  expires_in: number
  refresh_token?: string
  refresh_token_expires_in?: number
}

/**
 * Generate LinkedIn OAuth 2.0 authorization URL
 */
export function getLinkedInAuthUrl(state: string) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    state,
    scope: SCOPES
  })

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`
}

/**
 * Exchange authorization code for access tokens
 */
export async function getLinkedInTokens(code: string): Promise<LinkedInTokens> {
  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: LINKEDIN_REDIRECT_URI,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get LinkedIn tokens: ${error}`)
  }

  return response.json()
}

/**
 * Get LinkedIn user profile
 */
export async function getLinkedInProfile(accessToken: string) {
  const response = await fetch(`${LINKEDIN_API_BASE}/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-RestLi-Protocol-Version': '2.0.0'
    }
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get LinkedIn profile: ${error}`)
  }

  return response.json()
}

/**
 * Get LinkedIn user's organization ID (for company pages)
 */
export async function getLinkedInOrganizations(accessToken: string) {
  const response = await fetch(
    `${LINKEDIN_API_BASE}/organizationAcls?q=roleAssignee&projection=(elements*(organization~(id,name,logoV2(original~:playableStreams))))`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-RestLi-Protocol-Version': '2.0.0'
      }
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get LinkedIn organizations: ${error}`)
  }

  return response.json()
}

/**
 * Post to LinkedIn
 */
export async function postToLinkedIn(
  accessToken: string,
  authorId: string,
  text: string,
  mediaUrls?: string[],
  isOrganization: boolean = false
) {
  const author = isOrganization 
    ? `urn:li:organization:${authorId}`
    : `urn:li:person:${authorId}`

  const body: any = {
    author,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text
        },
        shareMediaCategory: mediaUrls && mediaUrls.length > 0 ? 'IMAGE' : 'NONE'
      }
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    }
  }

  // Add media if present
  if (mediaUrls && mediaUrls.length > 0) {
    body.specificContent['com.linkedin.ugc.ShareContent'].media = mediaUrls.map(url => ({
      status: 'READY',
      description: {
        text: 'Image'
      },
      media: url,
      title: {
        text: 'Image'
      }
    }))
  }

  const response = await fetch(`${LINKEDIN_API_BASE}/ugcPosts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-RestLi-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to post to LinkedIn: ${error}`)
  }

  return response.json()
}

/**
 * Register image upload on LinkedIn
 */
export async function registerLinkedInUpload(
  accessToken: string,
  ownerId: string,
  isOrganization: boolean = false
) {
  const owner = isOrganization
    ? `urn:li:organization:${ownerId}`
    : `urn:li:person:${ownerId}`

  const body = {
    registerUploadRequest: {
      recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
      owner,
      serviceRelationships: [
        {
          relationshipType: 'OWNER',
          identifier: 'urn:li:userGeneratedContent'
        }
      ]
    }
  }

  const response = await fetch(`${LINKEDIN_API_BASE}/assets?action=registerUpload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-RestLi-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to register LinkedIn upload: ${error}`)
  }

  return response.json()
}

/**
 * Upload image to LinkedIn
 */
export async function uploadLinkedInImage(
  uploadUrl: string,
  imageBuffer: Buffer,
  accessToken: string
) {
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/octet-stream'
    },
    body: imageBuffer
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to upload image to LinkedIn: ${error}`)
  }

  return true
}

/**
 * Refresh LinkedIn token (if refresh token is available)
 * Note: LinkedIn refresh tokens are not always provided
 */
export async function refreshLinkedInToken(refreshToken: string): Promise<LinkedInTokens> {
  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to refresh LinkedIn token: ${error}`)
  }

  return response.json()
}