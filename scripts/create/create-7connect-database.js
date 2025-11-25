const { Client } = require('pg');

async function create7ConnectDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'user',
    password: 'password',
    database: 'postgres' // Connect to default postgres database first
  });

  try {
    console.log('🔍 Connecting to PostgreSQL server...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL server successfully!');

    // Create 7connect_main database
    console.log('🗄️ Creating database 7connect_main...');
    await client.query('CREATE DATABASE "7connect_main";');
    console.log('✅ Database 7connect_main created successfully!');

    // Test connection to the new database
    console.log('🔍 Testing connection to 7connect_main...');
    await client.query('SELECT 1;'); // Switch to new database
    console.log('✅ Connection to 7connect_main verified!');

    console.log('✅ Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database creation failed:', error.message);
    console.error('📋 Full error:', error);

    if (error.message.includes('already exists')) {
      console.log('ℹ️  Database 7connect_main already exists');
    }
  } finally {
    await client.end();
    console.log('🔌 Connection closed');
  }
}

create7ConnectDatabase();