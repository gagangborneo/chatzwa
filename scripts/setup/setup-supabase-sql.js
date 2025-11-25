const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔧 Preparing Supabase database setup...')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('📋 Step 1: Creating tables using Supabase client...')

    // Try to create users table first
    try {
      const { data: existingTables } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'users')

      if (existingTables && existingTables.length > 0) {
        console.log('✅ Users table already exists')
      } else {
        console.log('⚠️  Users table does not exist - manual setup required')
      }
    } catch (error) {
      console.log('❌ Cannot check table existence:', error.message)
    }

    // Read the complete schema
    const schemaContent = fs.readFileSync('./supabase/schema.sql', 'utf8')
    const minimalSchemaContent = fs.readFileSync('./supabase/schema-minimal.sql', 'utf8')

    console.log('\n📝 Schema files ready:')
    console.log('  ✓ supabase/schema.sql (complete)')
    console.log('  ✓ supabase/schema-minimal.sql (minimal)')

    // Create setup instructions
    const instructions = `
🗄️  Supabase Database Setup Instructions

📍 Project URL: ${supabaseUrl}

📋 Steps to complete setup:

1️⃣  Open Supabase Dashboard
   • Go to: https://app.supabase.com
   • Select your project: xsdiaykgzkfkhgmaxtrs

2️⃣  Navigate to SQL Editor
   • Click "SQL Editor" in the left sidebar
   • Click "New query"

3️⃣  Choose Schema Option:

   OPTION A - Minimal Setup (Recommended for testing):
   ┌─────────────────────────────────────────────────────────────┐
   │  Copy the entire content of: supabase/schema-minimal.sql    │
   │  Paste into SQL Editor                                       │
   │  Click "Run" button                                         │
   └─────────────────────────────────────────────────────────────┘

   OPTION B - Complete Setup (Full features):
   ┌─────────────────────────────────────────────────────────────┐
   │  Copy the entire content of: supabase/schema.sql           │
   │  Paste into SQL Editor                                       │
   │  Click "Run" button                                         │
   └─────────────────────────────────────────────────────────────┘

4️⃣  Verify Setup
   Run this command after executing SQL:
   node test-supabase-connection.js

🎯 Expected Results:
• Users table with UUID primary key
• User_sessions table for session management
• Functions for session validation
• Proper indexes for performance

⚡ Current Status:
• Supabase Auth: ✅ Working (fallback mode)
• Custom Tables: ❌ Not created yet
• Migration: ⏳ Pending manual execution

🔄 After Setup:
The system will automatically switch from fallback mode to full Supabase mode.
You'll get enhanced features like session tracking and user management.
`

    console.log(instructions)

    // Save instructions to file
    fs.writeFileSync('./SUPABASE_SETUP_INSTRUCTIONS.md', instructions)
    console.log('\n📄 Instructions saved to: SUPABASE_SETUP_INSTRUCTIONS.md')

    // Create a simple test to verify current state
    console.log('\n🔍 Testing current database state...')
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (error) {
        console.log('❌ Tables not created yet')
        console.log('   Error:', error.message)
        console.log('   → Manual SQL execution required')
      } else {
        console.log('✅ Tables exist and are accessible!')
        console.log('   → System ready for full Supabase mode')
      }
    } catch (testError) {
      console.log('❌ Database test failed:', testError.message)
    }

  } catch (error) {
    console.error('❌ Setup preparation failed:', error.message)
  }
}

setupDatabase()