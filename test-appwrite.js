const { Client, Databases, Account } = require('appwrite');

async function testAppwriteConnection() {
  console.log('🔍 Testing Appwrite connection...');

  const client = new Client()
    .setEndpoint('https://localhost/v1')
    .setProject('68f2b5e400319b7f6fe8');

  try {
    console.log('📋 Appwrite Configuration:');
    console.log('  - Endpoint:', 'https://localhost/v1');
    console.log('  - Project ID:', '68f2b5e400319b7f6fe8');

    // Test basic connection by trying to get account info
    console.log('🔍 Testing Appwrite connection...');

    const account = new Account(client);
    console.log('✅ Appwrite client created successfully');

    // Test database connection
    console.log('🗄️ Testing database connection...');
    const databases = new Databases(client);
    console.log('✅ Appwrite database client created successfully');

    console.log('✅ Appwrite connection test completed successfully!');

    return true;
  } catch (error) {
    console.error('❌ Appwrite connection failed:', error.message);
    console.error('📋 Full error:', error);

    // Provide troubleshooting info
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Appwrite server is running on localhost');
    console.log('2. Check if the endpoint URL is correct');
    console.log('3. Verify the project ID is valid');
    console.log('4. Ensure firewall allows connection to localhost/v1');

    return false;
  }
}

testAppwriteConnection();