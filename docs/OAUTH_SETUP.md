# OAuth Setup Guide

## Overview
This guide will help you set up OAuth authentication for Twitter/X, LinkedIn, and Facebook/Instagram.

## Twitter/X OAuth 2.0 Setup

### 1. Create a Twitter Developer Account
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign up for a developer account if you don't have one
3. Create a new App in the Projects & Apps section

### 2. Configure OAuth 2.0
1. In your app settings, go to "User authentication settings"
2. Enable OAuth 2.0
3. Set App permissions to "Read and write"
4. Add the following redirect URI:
   ```
   http://localhost:3000/api/auth/callback/twitter
   ```
   For production, add:
   ```
   https://yourdomain.com/api/auth/callback/twitter
   ```

### 3. Get Your Credentials
1. Copy your Client ID
2. Generate and copy your Client Secret
3. Add them to your `.env.local`:
   ```
   TWITTER_CLIENT_ID=your_client_id
   TWITTER_CLIENT_SECRET=your_client_secret
   ```

## LinkedIn OAuth 2.0 Setup

### 1. Create a LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click "Create app"
3. Fill in the required information

### 2. Configure OAuth 2.0
1. In your app settings, go to "Auth" tab
2. Add the following redirect URLs:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   https://yourdomain.com/api/auth/callback/linkedin
   ```
3. Request access to the following products:
   - Sign In with LinkedIn
   - Share on LinkedIn
   - Marketing Developer Platform (if available)

### 3. Get Your Credentials
1. Copy your Client ID and Client Secret from the Auth tab
2. Add them to your `.env.local`:
   ```
   LINKEDIN_CLIENT_ID=your_client_id
   LINKEDIN_CLIENT_SECRET=your_client_secret
   ```

## Facebook/Instagram OAuth Setup

### 1. Create a Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/apps)
2. Click "Create App"
3. Choose "Business" type
4. Fill in the app details

### 2. Add Products
1. Add "Facebook Login" product
2. Add "Instagram Basic Display" product
3. Add "Instagram Graph API" (for business accounts)

### 3. Configure OAuth Settings
1. In Facebook Login settings, add OAuth redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/facebook
   https://yourdomain.com/api/auth/callback/facebook
   ```
2. Enable the following permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `instagram_basic`
   - `instagram_content_publish`

### 4. Get Your Credentials
1. Go to Settings > Basic
2. Copy your App ID and App Secret
3. Add them to your `.env.local`:
   ```
   FACEBOOK_CLIENT_ID=your_app_id
   FACEBOOK_CLIENT_SECRET=your_app_secret
   ```

## Environment Variables

Create a `.env.local` file in your project root with all the OAuth credentials:

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Twitter/X OAuth
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Facebook/Instagram OAuth
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# Cron Secret (generate a random string)
CRON_SECRET=your_random_cron_secret_string
```

## Testing OAuth Flows

### Local Development
1. Ensure your app is running on `http://localhost:3000`
2. Navigate to the Connections page
3. Click "Connect" for any platform
4. You'll be redirected to the platform's OAuth consent page
5. Authorize the app
6. You'll be redirected back and the account will be connected

### Production Setup
1. Update all redirect URIs to use your production domain
2. Update `NEXT_PUBLIC_APP_URL` in your production environment
3. Ensure all OAuth credentials are properly set in your production environment variables

## Troubleshooting

### Common Issues

1. **"Redirect URI mismatch" error**
   - Ensure the redirect URI in your app settings exactly matches the one in your code
   - Check for trailing slashes or protocol differences (http vs https)

2. **"Invalid client" error**
   - Verify your Client ID and Client Secret are correct
   - Ensure they're properly set in your environment variables

3. **"Scope not granted" error**
   - Make sure you've requested all necessary permissions in your app settings
   - Some permissions may require app review for production use

4. **Connection not saving**
   - Check Supabase connection and authentication
   - Verify the database tables exist and have proper permissions

## Security Considerations

1. **Never commit OAuth credentials to version control**
   - Always use environment variables
   - Add `.env.local` to `.gitignore`

2. **Use HTTPS in production**
   - OAuth requires secure connections
   - Update all redirect URIs to use HTTPS

3. **Implement token refresh**
   - Tokens expire and need to be refreshed
   - The app automatically handles token refresh when publishing

4. **Store tokens securely**
   - Tokens are encrypted and stored in Supabase
   - Use Row Level Security (RLS) to protect user data

## Rate Limits

Be aware of platform rate limits:
- **Twitter/X**: 300 posts per 3 hours per user
- **LinkedIn**: 150 API calls per day
- **Facebook**: 200 calls per hour per user
- **Instagram**: 25 API calls per hour

The app implements rate limiting and retry logic to handle these limits gracefully.