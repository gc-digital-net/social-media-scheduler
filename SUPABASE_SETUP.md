# Supabase Setup Guide

## Prerequisites
- Supabase account (or self-hosted instance)
- Node.js 18+ installed

## Setup Instructions

### 1. Create a Supabase Cloud Project

1. **Go to [https://supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up or login with GitHub**
4. **Create a new project:**
   - Project name: `social-media-scheduler` (or your choice)
   - Database password: Generate a strong one (save it!)
   - Region: Choose closest to your users
   - Pricing plan: Free tier is perfect to start
5. **Wait for project to initialize** (takes ~2 minutes)
6. **Once ready, get your credentials:**
   - Go to Settings → API
   - Copy your `Project URL`
   - Copy your `anon` public key
   - Copy your `service_role` secret key

### 2. Get Your Credentials

After creating your project, get these values:
- **Project URL**: Found in Settings > API
- **Anon Key**: Found in Settings > API (public key)
- **Service Role Key**: Found in Settings > API (secret key - keep secure!)

### 3. Update Environment Variables

Copy the example env file and add your credentials:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run Database Migrations

#### Option A: Using Supabase Dashboard
1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of each file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
3. Run each migration

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 5. Enable Required Extensions

Run this in the SQL editor:
```sql
-- Enable extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron" SCHEMA extensions; -- For scheduled posts
```

### 6. Configure Storage Buckets

In your Supabase dashboard:
1. Go to Storage
2. Create these buckets:
   - `media` - For post images/videos
   - `avatars` - For user profile pictures
   - `workspace-logos` - For workspace branding

Set bucket policies:
```sql
-- Allow authenticated users to upload to media bucket
CREATE POLICY "Users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow public to view media
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');
```

### 7. Set Up Edge Functions (Optional)

For advanced features like scheduled posting:

```bash
# Create edge function for post scheduling
supabase functions new schedule-posts

# Deploy function
supabase functions deploy schedule-posts
```

### 8. Configure Authentication

In Supabase Dashboard > Authentication:

1. **Email Auth**: Enable email/password authentication
2. **OAuth Providers** (optional):
   - Google
   - GitHub
   - Twitter
3. **Email Templates**: Customize confirmation emails
4. **URL Configuration**:
   - Site URL: `http://localhost:3000` (development)
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 9. Test Your Setup

Run the test script:
```bash
npm run test:supabase
```

Or test manually:
```bash
npm run dev
```

Then visit:
- http://localhost:3000/register - Create an account
- http://localhost:3000/login - Sign in
- Check Supabase dashboard for new user in Authentication

## Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Double-check your keys in `.env.local`
   - Make sure you're using the correct key type (anon vs service role)

2. **"relation does not exist"**
   - Run migrations in order
   - Check if all extensions are enabled

3. **"permission denied"**
   - Check RLS policies are properly set
   - Ensure user is authenticated

4. **"Failed to fetch"**
   - Check CORS settings in Supabase
   - Verify your project URL is correct

### Reset Database (if needed)

```sql
-- WARNING: This will delete all data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then re-run migrations
```

## Production Deployment

### Environment Variables
Set these in your production environment (Vercel, Coolify, etc.):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

### Security Checklist
- [ ] RLS enabled on all tables
- [ ] Service role key only on server-side
- [ ] API rate limiting configured
- [ ] Backup strategy in place
- [ ] Monitor database size and performance

## Next Steps

1. Connect social media accounts in `/platforms`
2. Create your first post in `/composer`
3. Set up team members in `/settings/team`
4. Configure AI features (requires OpenAI API key)

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)