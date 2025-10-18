const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'user',
    password: 'password',
    database: 'chatbot'
  });

  try {
    console.log('🔍 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    // Test query
    const result = await client.query('SELECT version();');
    console.log('📋 PostgreSQL version:', result.rows[0].version);

    // Check if database exists
    const dbCheck = await client.query('SELECT current_database();');
    console.log('🗄️ Current database:', dbCheck.rows[0].current_database);

    console.log('✅ PostgreSQL connection test completed successfully!');

  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    console.error('📋 Full error:', error);
  } finally {
    await client.end();
    console.log('🔌 Connection closed');
  }
}

testConnection();