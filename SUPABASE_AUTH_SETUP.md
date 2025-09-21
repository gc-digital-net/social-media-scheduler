# Supabase Auth Configuration for Production

## Required Settings in Supabase Dashboard

### 1. Configure Redirect URLs
Go to: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/auth/url-configuration

Add these to **Redirect URLs**:
```
https://socialscheduler.so/auth/callback
https://socialscheduler.so/dashboard
https://socialscheduler.so/login
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
http://localhost:3000/login
```

### 2. Set Site URL
In the same page, set:
- **Site URL**: `https://socialscheduler.so`

### 3. Configure Email Templates (Optional)
Go to: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/auth/email-templates

Update the confirmation email to use your production URL:
- Change `{{ .SiteURL }}` to `https://socialscheduler.so` in templates

### 4. Enable Email Provider
Go to: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/auth/configuration

Ensure:
- **Email Auth** is enabled
- **Confirm Email** is enabled (recommended for production)

## Environment Variables

Make sure these are set in Coolify:
```
NEXT_PUBLIC_SUPABASE_URL=https://nalcyoudkabwzdmcgfui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbGN5b3Vka2Fid3pkbWNnZnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTk0NjQsImV4cCI6MjA3Mzg5NTQ2NH0.TVVPBu0qPB6VceJpNzHiNWyfg4Y8jMAkrIjCJ8MJQII
NEXT_PUBLIC_APP_URL=https://socialscheduler.so
```

## Testing

1. Try registering a new user at https://socialscheduler.so/register
2. Check email for confirmation link
3. Click the link - it should redirect to https://socialscheduler.so/auth/callback
4. You should be logged in and redirected to /dashboard

## Common Issues

### "Redirect URL not allowed"
- Make sure all URLs are added to Supabase redirect URLs list
- Check that NEXT_PUBLIC_APP_URL is set correctly

### Email not sending
- Check spam folder
- Verify email settings in Supabase dashboard
- Consider using a custom SMTP provider for production

### User created but can't login
- Check if email confirmation is required
- Verify the profile trigger is working (check profiles table)