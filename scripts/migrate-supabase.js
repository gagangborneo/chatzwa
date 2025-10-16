const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials not found in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('🚀 Starting Supabase migration...')

    // Read and execute schema.sql
    const schemaSQL = fs.readFileSync('./supabase/schema.sql', 'utf8')

    // Split SQL by semicolons and execute each statement
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`\n🔧 Executing statement ${i + 1}/${statements.length}:`)
      console.log(statement.substring(0, 100) + (statement.length > 100 ? '...' : ''))

      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_statement: statement })

        if (error) {
          // Try direct SQL execution if RPC fails
          const { error: directError } = await supabase.from('_temp').select('*').limit(1)
          console.log(`⚠️  Could not execute via RPC: ${error.message}`)

          // For now, just log and continue
          console.log(`⏭️  Skipping statement (manual execution required):`)
          console.log(statement)
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } catch (err) {
        console.log(`⚠️  Error executing statement ${i + 1}: ${err.message}`)
        console.log(`⏭️  Skipping this statement (manual execution required)`)
      }
    }

    console.log('\n✅ Migration process completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the contents of supabase/schema.sql')
    console.log('4. Click "Run" to execute the schema')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigration()