const { Client } = require('pg');

async function test7ConnectConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'user',
    password: 'password',
    database: '7connect_main'
  });

  try {
    console.log('🔍 Connecting to PostgreSQL 7connect_main...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL 7connect_main successfully!');

    // Test query
    const result = await client.query('SELECT version();');
    console.log('📋 PostgreSQL version:', result.rows[0].version);

    // Check if database exists
    const dbCheck = await client.query('SELECT current_database();');
    console.log('🗄️ Current database:', dbCheck.rows[0].current_database);

    // Check if tables exist
    const tablesCheck = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    if (tablesCheck.rows.length > 0) {
      console.log('📋 Existing tables:');
      tablesCheck.rows.forEach(row => {
        console.log('  -', row.table_name);
      });
    } else {
      console.log('📋 No tables found - database is empty');
    }

    console.log('✅ PostgreSQL 7connect_main connection test completed successfully!');

  } catch (error) {
    console.error('❌ PostgreSQL 7connect_main connection failed:', error.message);
    console.error('📋 Full error:', error);
  } finally {
    await client.end();
    console.log('🔌 Connection closed');
  }
}

test7ConnectConnection();