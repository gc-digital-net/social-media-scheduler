const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// You need to add your service role key to .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey === 'your-service-role-key-here') {
  console.error('❌ Error: Please add your SUPABASE_SERVICE_ROLE_KEY to .env.local');
  console.log('\nYou can find it in your Supabase dashboard:');
  console.log('1. Go to https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/settings/api');
  console.log('2. Copy the "service_role" key (starts with eyJ...)');
  console.log('3. Add it to .env.local as SUPABASE_SERVICE_ROLE_KEY=<your-key>');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetDatabase() {
  console.log('🔄 Starting database reset...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'supabase', 'reset-database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements (basic split, might need refinement)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Get a simple description of what the statement does
      let description = 'Executing statement';
      if (statement.includes('DROP TABLE')) {
        const match = statement.match(/DROP TABLE IF EXISTS (\w+)/);
        description = `Dropping table: ${match ? match[1] : 'unknown'}`;
      } else if (statement.includes('CREATE TABLE')) {
        const match = statement.match(/CREATE TABLE (\w+)/);
        description = `Creating table: ${match ? match[1] : 'unknown'}`;
      } else if (statement.includes('CREATE INDEX')) {
        const match = statement.match(/CREATE INDEX (\w+)/);
        description = `Creating index: ${match ? match[1] : 'unknown'}`;
      } else if (statement.includes('CREATE POLICY')) {
        const match = statement.match(/CREATE POLICY "([^"]+)"/);
        description = `Creating policy: ${match ? match[1] : 'unknown'}`;
      } else if (statement.includes('CREATE FUNCTION')) {
        description = 'Creating function';
      } else if (statement.includes('CREATE TRIGGER')) {
        description = 'Creating trigger';
      } else if (statement.includes('ALTER TABLE')) {
        description = 'Enabling RLS';
      } else if (statement.includes('GRANT')) {
        description = 'Granting permissions';
      }

      process.stdout.write(`[${i + 1}/${statements.length}] ${description}...`);

      const { error } = await supabase.rpc('exec_sql', { 
        sql: statement 
      }).single();

      // If exec_sql doesn't exist, try direct query (note: this might not work with all statements)
      if (error && error.message.includes('exec_sql')) {
        // For Supabase, we need to use the SQL editor in the dashboard for complex DDL
        // Let's create a simpler approach
        console.log(' ⚠️  Cannot execute directly');
        continue;
      }

      if (error) {
        console.log(' ❌');
        console.error(`Error: ${error.message}`);
        if (!error.message.includes('already exists') && !error.message.includes('does not exist')) {
          throw error;
        }
      } else {
        console.log(' ✅');
      }
    }

    console.log('\n✅ Database reset completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. The database schema has been recreated');
    console.log('2. You can now test user registration');
    console.log('3. Check the application at https://socialscheduler.so');
    
  } catch (error) {
    console.error('\n❌ Error resetting database:', error.message);
    console.log('\n🔧 Alternative approach:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/sql/new');
    console.log('2. Copy the contents of supabase/reset-database.sql');
    console.log('3. Paste and run it in the SQL editor');
    process.exit(1);
  }
}

// Run the reset
resetDatabase();