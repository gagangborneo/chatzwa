const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🏗️  Creating Supabase tables directly...')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  try {
    console.log('📋 Step 1: Creating users table...')

    // Since we can't execute DDL directly via client, let's try a different approach
    // We'll use Supabase's REST API with service role key to create tables

    // First, let's check if we can at least verify our connection
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      console.log('❌ Cannot access Supabase admin functions:', userError.message)
    } else {
      console.log('✅ Admin access confirmed')
      console.log(`📊 Found ${userData.users.length} users in Supabase Auth`)
    }

    console.log('\n🔄 Alternative approach: Using Supabase Dashboard...')

    // Create a more direct instruction
    const minimalSQL = `
-- Minimal Supabase Schema for AI Chatbot
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Function to validate session
CREATE OR REPLACE FUNCTION validate_session_token(session_token VARCHAR(500))
RETURNS TABLE (
  user_id UUID,
  email VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50),
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.email,
    u.name,
    u.role,
    u.is_active
  FROM user_sessions s
  JOIN users u ON s.user_id = u.id
  WHERE s.token = validate_session_token.session_token
    AND s.is_active = true
    AND s.expires_at > NOW()
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql;
`

    // Save minimal SQL to clipboard-ready format
    require('fs').writeFileSync('./supabase/schema-ready-to-run.sql', minimalSQL)

    console.log('\n📋 SQL Ready!')
    console.log('✅ Content saved to: supabase/schema-ready-to-run.sql')
    console.log('\n🎯 Quick Steps:')
    console.log('1. Open https://app.supabase.com')
    console.log('2. Go to SQL Editor')
    console.log('3. Copy content from supabase/schema-ready-to-run.sql')
    console.log('4. Paste and click "Run"')
    console.log('5. Test with: node test-supabase-connection.js')

    console.log('\n⚡ Pro tip: Use the minimal schema first for testing!')

    // Test one more time to see if tables exist
    console.log('\n🔍 Final check...')
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (error) {
        console.log('❌ Tables still not created')
        console.log('   → Manual execution required')
      } else {
        console.log('🎉 Tables created successfully!')
        console.log('   → Full Supabase mode activated')
      }
    } catch (finalError) {
      console.log('❌ Final check failed:', finalError.message)
    }

  } catch (error) {
    console.error('❌ Table creation failed:', error.message)
  }
}

createTables()