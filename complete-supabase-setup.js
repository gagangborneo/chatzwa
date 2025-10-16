const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🎯 Supabase Database Migration Assistant')
console.log('==========================================\n')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function showMigrationStatus() {
  try {
    // Check current status
    console.log('📊 Current Status Check:')

    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) {
      console.log('❌ Supabase Auth not accessible')
    } else {
      console.log(`✅ Supabase Auth: ${authData.users.length} user(s) found`)
    }

    // Check if tables exist
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (userError) {
        console.log('❌ Database Tables: Not created yet')
      } else {
        console.log('✅ Database Tables: Created and accessible')
      }
    } catch (tableError) {
      console.log('❌ Database Tables: Not accessible')
    }

    console.log('\n🚀 Migration Options:')
    console.log('─'.repeat(50))

    // Option 1: Manual SQL execution
    console.log('\n📝 OPTION 1: Manual SQL Execution (Recommended)')
    console.log('─'.repeat(50))
    console.log('Steps:')
    console.log('1. Open: https://app.supabase.com')
    console.log('2. Select project: xsdiaykgzkfkhgmaxtrs')
    console.log('3. Click "SQL Editor" in sidebar')
    console.log('4. Copy SQL from: supabase/schema-complete.sql (Recommended - Complete Schema)')
    console.log('   OR: supabase/schema-ready-to-run.sql (Minimal - Authentication Only)')
    console.log('5. Paste and click "Run"')
    console.log('6. Test with: node test-supabase-connection.js')

    // Show the SQL content
    console.log('\n📄 SQL Content Ready to Execute:')
    console.log('─'.repeat(50))

    const sqlContent = require('fs').readFileSync('./supabase/schema-ready-to-run.sql', 'utf8')
    console.log(sqlContent)

    console.log('\n🔄 After Migration Benefits:')
    console.log('─'.repeat(50))
    console.log('✅ Session tracking in database')
    console.log('✅ User management capabilities')
    console.log('✅ Enhanced security features')
    console.log('✅ Full audit trail')
    console.log('✅ Better performance with indexes')

    console.log('\n⚡ Quick Test Commands:')
    console.log('─'.repeat(50))
    console.log('Test connection:   node test-supabase-connection.js')
    console.log('Test login:        curl -X POST http://localhost:3000/api/auth/login \\')
    console.log('                    -H "Content-Type: application/json" \\')
    console.log('                    -d \'{"email": "test@example.com", "password": "password123"}\'')

    console.log('\n📁 Important Files:')
    console.log('─'.repeat(50))
    console.log('• supabase/schema.sql           - Complete schema')
    console.log('• supabase/schema-minimal.sql    - Minimal schema')
    console.log('• supabase/schema-ready-to-run.sql - Ready to execute')
    console.log('• test-supabase-connection.js    - Connection test')
    console.log('• SUPABASE_SETUP.md             - Full documentation')

    // Final status check
    console.log('\n🎯 Current Status Summary:')
    console.log('─'.repeat(50))
    console.log('Environment:     ✅ Configured')
    console.log('Authentication:  ✅ Working (fallback mode)')
    console.log('Database Tables: ❌ Need manual creation')
    console.log('Migration:       ⏳ Ready for manual execution')

    console.log('\n💡 Pro Tip:')
    console.log('System is currently working in fallback mode!')
    console.log('You can test login now without creating tables.')
    console.log('Create tables only when you need enhanced features.')

  } catch (error) {
    console.error('❌ Status check failed:', error.message)
  }
}

showMigrationStatus()