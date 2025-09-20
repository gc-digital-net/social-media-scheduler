#!/usr/bin/env node

/**
 * Test script to verify Supabase connection and setup
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

async function testSupabase() {
  log('\n🔍 Testing Supabase Connection...', 'blue');
  
  // Check environment variables
  log('\n1. Checking environment variables...', 'yellow');
  
  if (!supabaseUrl) {
    log('❌ NEXT_PUBLIC_SUPABASE_URL is not set', 'red');
    return false;
  }
  log('✅ NEXT_PUBLIC_SUPABASE_URL is set', 'green');
  
  if (!supabaseAnonKey) {
    log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set', 'red');
    return false;
  }
  log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set', 'green');
  
  if (!supabaseServiceKey) {
    log('⚠️  SUPABASE_SERVICE_ROLE_KEY is not set (optional for client-side)', 'yellow');
  } else {
    log('✅ SUPABASE_SERVICE_ROLE_KEY is set', 'green');
  }
  
  // Test connection with anon key
  log('\n2. Testing connection with anon key...', 'yellow');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Try to fetch from a system table
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      // Check if it's a "table doesn't exist" error
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        log('⚠️  Tables not created yet. Please run migrations first.', 'yellow');
        log('   Run the SQL files in supabase/migrations/ folder', 'yellow');
      } else if (error.message.includes('JWT')) {
        log('❌ Invalid API keys. Please check your credentials.', 'red');
      } else {
        log(`⚠️  Connection successful but query failed: ${error.message}`, 'yellow');
      }
    } else {
      log('✅ Successfully connected to Supabase!', 'green');
    }
  } catch (error) {
    log(`❌ Failed to connect: ${error.message}`, 'red');
    return false;
  }
  
  // Test service role connection if key exists
  if (supabaseServiceKey) {
    log('\n3. Testing connection with service role key...', 'yellow');
    
    try {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      
      // Try to fetch auth users (requires service role)
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });
      
      if (error) {
        log(`⚠️  Service role test failed: ${error.message}`, 'yellow');
      } else {
        log('✅ Service role key is valid!', 'green');
        log(`   Found ${users?.length || 0} user(s) in database`, 'blue');
      }
    } catch (error) {
      log(`⚠️  Service role test failed: ${error.message}`, 'yellow');
    }
  }
  
  // Check if tables exist
  log('\n4. Checking database tables...', 'yellow');
  
  const requiredTables = [
    'profiles',
    'workspaces',
    'workspace_members',
    'platform_connections',
    'posts',
    'post_queue',
    'media_library',
    'templates',
    'analytics',
  ];
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  let tablesFound = 0;
  
  for (const table of requiredTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(0);
      
      if (!error || !error.message.includes('does not exist')) {
        log(`  ✅ Table '${table}' exists`, 'green');
        tablesFound++;
      } else {
        log(`  ❌ Table '${table}' not found`, 'red');
      }
    } catch (error) {
      log(`  ❌ Table '${table}' check failed`, 'red');
    }
  }
  
  log(`\n📊 Found ${tablesFound}/${requiredTables.length} required tables`, tablesFound === requiredTables.length ? 'green' : 'yellow');
  
  // Summary
  log('\n' + '='.repeat(50), 'blue');
  
  if (tablesFound === requiredTables.length) {
    log('✅ Supabase is fully configured and ready!', 'green');
    log('\nNext steps:', 'blue');
    log('1. Run: npm run dev', 'yellow');
    log('2. Visit: http://localhost:3000/register', 'yellow');
    log('3. Create an account and start using the app!', 'yellow');
  } else if (tablesFound === 0) {
    log('⚠️  Supabase connection works but database is not set up', 'yellow');
    log('\nNext steps:', 'blue');
    log('1. Go to your Supabase dashboard', 'yellow');
    log('2. Open the SQL editor', 'yellow');
    log('3. Run the migrations in supabase/migrations/', 'yellow');
    log('4. Run this test again', 'yellow');
  } else {
    log('⚠️  Partial setup detected', 'yellow');
    log('\nSome tables are missing. Please check your migrations.', 'blue');
  }
  
  log('='.repeat(50) + '\n', 'blue');
}

// Run the test
testSupabase().catch(console.error);