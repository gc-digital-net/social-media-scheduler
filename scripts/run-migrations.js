const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Hardcode for migration script
const supabaseUrl = 'https://nalcyoudkabwzdmcgfui.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbGN5b3Vka2Fid3pkbWNnZnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTk0NjQsImV4cCI6MjA3Mzg5NTQ2NH0.TVVPBu0qPB6VceJpNzHiNWyfg4Y8jMAkrIjCJ8MJQII';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

async function runMigrations() {
  console.log('🚀 Running Supabase migrations...\n');
  
  // Note: For production, you'd typically run migrations via Supabase CLI
  // This is a simplified approach for initial setup
  console.log('⚠️  Important: Run these migrations in your Supabase SQL Editor:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/sql/new');
  console.log('   2. Copy and paste the SQL from:');
  console.log('      - supabase/migrations/001_initial_schema.sql');
  console.log('      - supabase/migrations/002_rls_policies.sql (if exists)');
  console.log('   3. Click "Run" to execute the migrations\n');
  
  // Test connection
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const { data, error } = await supabase.from('profiles').select('count').limit(1);
  
  if (error && error.message.includes('does not exist')) {
    console.log('❌ Tables not created yet. Please run the migrations in Supabase SQL Editor.');
  } else if (error) {
    console.log('❌ Error connecting to Supabase:', error.message);
  } else {
    console.log('✅ Supabase connection successful!');
    console.log('✅ Tables appear to be created.');
  }
}

runMigrations().catch(console.error);