import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const supabaseUrl = 'https://nalcyoudkabwzdmcgfui.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbGN5b3Vka2Fid3pkbWNnZnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTk0NjQsImV4cCI6MjA3Mzg5NTQ2NH0.TVVPBu0qPB6VceJpNzHiNWyfg4Y8jMAkrIjCJ8MJQII';

// We need service role key to run DDL commands
// Using the anon key with RPC function instead
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigrations() {
  console.log('🚀 Executing Supabase migrations...\n');
  
  try {
    // Read migration file
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/001_initial_schema.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf-8');
    
    // Split into individual statements (basic split, may need refinement)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute\n`);
    
    // Note: With anon key, we can't directly execute DDL
    // We'll create a simpler approach - test if tables exist
    
    console.log('Testing current database state...');
    
    // Try to query a table to see if migrations ran
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (!profilesError) {
      console.log('✅ Tables already exist! Migrations appear to be complete.');
      return;
    }
    
    console.log('\n❌ Tables don\'t exist yet.');
    console.log('\n📋 Since we need admin access to create tables, here\'s what to do:\n');
    console.log('Option 1: Use Supabase Dashboard (Easiest)');
    console.log('1. Open: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/sql/new');
    console.log('2. Copy the content from: supabase/migrations/001_initial_schema.sql');
    console.log('3. Paste and click "Run"\n');
    
    console.log('Option 2: Use Supabase CLI (Recommended for production)');
    console.log('1. Install: npm install -g supabase');
    console.log('2. Login: supabase login');
    console.log('3. Link: supabase link --project-ref nalcyoudkabwzdmcgfui');
    console.log('4. Push: supabase db push\n');
    
    // Create a simplified SQL file for easy copy-paste
    const outputPath = path.join(process.cwd(), 'MIGRATION_TO_RUN.sql');
    await fs.writeFile(outputPath, migrationSQL);
    console.log(`💾 Full migration SQL saved to: ${outputPath}`);
    console.log('   You can copy this entire file to the Supabase SQL editor.\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

runMigrations().catch(console.error);