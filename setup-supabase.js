const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔧 Setting up Supabase database schema...')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupSchema() {
  try {
    console.log('📋 Creating users table...')

    // Create users table using SQL via POST to rest/v1/rpc/exec_sql
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login_at TIMESTAMP WITH TIME ZONE
      );
    `

    console.log('⚠️  Manual setup required!')
    console.log('\n📋 To complete Supabase setup:')
    console.log('1. Open your Supabase dashboard: https://app.supabase.com')
    console.log('2. Go to the SQL Editor')
    console.log('3. Copy and paste this SQL:')

    const schemaContent = require('fs').readFileSync('./supabase/schema.sql', 'utf8')
    console.log('\n' + '='.repeat(80))
    console.log(schemaContent)
    console.log('='.repeat(80))

    console.log('\n4. Click "Run" to execute the schema')
    console.log('5. After running the schema, test with: node test-supabase-connection.js')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

setupSchema()