const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials not found')
  console.log('SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

console.log('🔗 Testing Supabase connection...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1)

    if (error) {
      console.log('❌ Connection test failed:', error.message)
      console.log('\n📋 This likely means the database schema is not set up yet.')
      console.log('You need to:')
      console.log('1. Go to your Supabase dashboard: https://app.supabase.com')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Copy the contents of supabase/schema.sql')
      console.log('4. Paste and run the SQL script')

      return false
    }

    console.log('✅ Supabase connection successful!')
    console.log('📊 Database schema is ready')
    return true

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

testConnection()