const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('👤 Creating test user in Supabase...')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestUser() {
  try {
    // Try to create user using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'password123',
      email_confirm: true
    })

    if (authError) {
      console.log('❌ Auth user creation failed:', authError.message)

      // Try to sign up instead (if admin is not available)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123'
      })

      if (signUpError) {
        console.log('❌ Sign up failed:', signUpError.message)
        return false
      }

      console.log('✅ User signed up successfully!')
      console.log('User ID:', signUpData.user?.id)
    } else {
      console.log('✅ Auth user created successfully!')
      console.log('User ID:', authData.user?.id)
    }

    // Now try to create user in our custom table
    const userId = authData?.user?.id
    if (userId) {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
          is_active: true
        }])
        .select()

      if (profileError) {
        console.log('❌ Profile creation failed:', profileError.message)
        console.log('This means the database schema is not set up yet.')
      } else {
        console.log('✅ User profile created successfully!')
        console.log('Profile:', profileData[0])
      }
    }

    console.log('\n📋 Next steps:')
    console.log('1. If profile creation failed, run the schema SQL in Supabase SQL Editor')
    console.log('2. Use this command to test login:')
    console.log('   curl -X POST http://localhost:3000/api/auth/login \\')
    console.log('     -H "Content-Type: application/json" \\')
    console.log('     -d \'{"email": "test@example.com", "password": "password123"}\'')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

createTestUser()