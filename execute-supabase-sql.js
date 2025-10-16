const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('⚡ Executing Supabase SQL via REST API...')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQL() {
  try {
    const sqlContent = require('fs').readFileSync('./supabase/schema-complete.sql', 'utf8')

    console.log('📋 Step 1: Testing Supabase connection...')

    // Test basic functionality
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) {
      console.log('❌ Auth test failed:', authError.message)
      return
    }
    console.log(`✅ Auth working - Found ${authData.users.length} users`)

    console.log('\n📋 Step 2: Preparing SQL execution...')

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .filter(stmt => stmt.toLowerCase().includes('create') || stmt.toLowerCase().includes('create index'))

    console.log(`📝 Found ${statements.length} CREATE statements to execute`)

    // Try to execute via POST to rest/v1/sql (if available)
    console.log('\n📋 Step 3: Attempting direct SQL execution...')

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (statement.length === 0) continue

      console.log(`\n🔧 Executing statement ${i + 1}/${statements.length}:`)
      console.log(statement.substring(0, 100) + '...')

      try {
        // Try using fetch directly to Supabase REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ query: statement })
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ Statement executed successfully')
        } else {
          const errorText = await response.text()
          console.log(`⚠️  Direct execution failed: ${response.status} ${errorText}`)
        }
      } catch (fetchError) {
        console.log(`❌ Fetch error: ${fetchError.message}`)
      }
    }

    console.log('\n📋 Step 4: Final verification...')

    // Test if tables exist now
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (error) {
        console.log('❌ Tables still not accessible')
        console.log('   Error:', error.message)

        console.log('\n🔄 Manual execution still required:')
        console.log('1. Open https://app.supabase.com')
        console.log('2. Go to SQL Editor')
        console.log('3. Copy content from supabase/schema-ready-to-run.sql')
        console.log('4. Paste and click "Run"')

      } else {
        console.log('🎉 SUCCESS! Tables created and accessible!')
        console.log('   → Full Supabase mode is now active')

        // Test a simple query
        const { data: usersData } = await supabase
          .from('users')
          .select('id, email, created_at')
          .limit(5)

        console.log(`📊 Current users: ${usersData?.length || 0}`)
      }
    } catch (testError) {
      console.log('❌ Final test failed:', testError.message)
    }

  } catch (error) {
    console.error('❌ SQL execution failed:', error.message)
  }
}

executeSQL()