# Database Reset Instructions

## Quick Setup via Supabase Dashboard

Since you're getting user creation errors, follow these steps to completely reset your database:

### Step 1: Get Your Service Role Key
1. Go to: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/settings/api
2. Find the "service_role" key (it's the second one, starts with `eyJ...`)
3. Copy it

### Step 2: Run the Reset Script via Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/sql/new
2. Copy ALL the contents from the file: `supabase/reset-database.sql`
3. Paste it into the SQL editor
4. Click "Run" button

This will:
- Drop all existing tables
- Create fresh tables with proper structure
- Set up RLS policies
- Create triggers for automatic profile creation

### Step 3: Verify the Setup
After running the SQL, check:
1. Go to Table Editor: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/editor
2. You should see these tables:
   - profiles
   - workspaces
   - social_accounts
   - posts
   - post_queue
   - analytics
   - ai_generations
   - bio_links
   - competitors
   - templates
   - approvals

### Step 4: Test User Registration
1. Go to your app: https://socialscheduler.so
2. Try signing up with a new email
3. Check your email for the confirmation link
4. The user should be created successfully

## Important Notes

### The Profile Trigger
The most important part is this trigger that automatically creates a profile when a user signs up:
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

This ensures that whenever someone signs up, they automatically get a profile entry.

### RLS Policies
Row Level Security is enabled on all tables. Users can only:
- View and edit their own data
- Cannot see other users' data
- Public can view active bio links

## Troubleshooting

If you still get errors after this:

1. **Check Supabase Logs**
   - Go to: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/logs/edge-logs
   - Look for any error messages

2. **Check Auth Settings**
   - Go to: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/auth/configuration
   - Make sure email auth is enabled
   - Check that your site URL is set to: https://socialscheduler.so

3. **Environment Variables**
   Make sure your Coolify deployment has these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL=https://nalcyoudkabwzdmcgfui.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbGN5b3Vka2Fid3pkbWNnZnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTk0NjQsImV4cCI6MjA3Mzg5NTQ2NH0.TVVPBu0qPB6VceJpNzHiNWyfg4Y8jMAkrIjCJ8MJQII`
   - `NEXT_PUBLIC_APP_URL=https://socialscheduler.so`