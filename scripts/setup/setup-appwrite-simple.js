const { Client, Databases } = require('appwrite');

async function setupAppwriteCollections() {
  console.log('🔧 Setting up Appwrite collections...');

  const client = new Client()
    .setEndpoint('https://localhost/v1')
    .setProject('68f2b5e400319b7f6fe8')
    .setKey('YOUR_API_KEY'); // Need API key for admin operations

  const databases = new Databases(client);
  const databaseId = '68f2b7e0002968518650';

  try {
    console.log('📋 Creating Appwrite collections in database:', databaseId);

    // Users Collection
    try {
      await databases.createCollection(
        databaseId,
        'users',
        [
          { key: 'email', type: 'string', required: true, array: false, unique: true },
          { key: 'name', type: 'string', required: false, array: false },
          { key: 'role', type: 'string', required: false, array: false },
          { key: 'isActive', type: 'boolean', required: false, array: false },
          { key: 'lastLoginAt', type: 'datetime', required: false, array: false },
          { key: 'createdAt', type: 'datetime', required: true, array: false },
          { key: 'updatedAt', type: 'datetime', required: true, array: false }
        ]
      );
      console.log('✅ Created collection: users');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Collection users already exists');
      } else {
        console.error('❌ Failed to create users:', error.message);
      }
    }

    // User Sessions Collection
    try {
      await databases.createCollection(
        databaseId,
        'user_sessions',
        [
          { key: 'userId', type: 'string', required: true, array: false },
          { key: 'token', type: 'string', required: true, array: false, unique: true },
          { key: 'expiresAt', type: 'datetime', required: true, array: false },
          { key: 'ipAddress', type: 'string', required: false, array: false },
          { key: 'userAgent', type: 'string', required: false, array: false },
          { key: 'isActive', type: 'boolean', required: false, array: false },
          { key: 'createdAt', type: 'datetime', required: true, array: false },
          { key: 'updatedAt', type: 'datetime', required: true, array: false }
        ]
      );
      console.log('✅ Created collection: user_sessions');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Collection user_sessions already exists');
      } else {
        console.error('❌ Failed to create user_sessions:', error.message);
      }
    }

    // Personas Collection
    try {
      await databases.createCollection(
        databaseId,
        'personas',
        [
          { key: 'slug', type: 'string', required: false, array: false, unique: true },
          { key: 'name', type: 'string', required: true, array: false },
          { key: 'welcomeMessage', type: 'string', required: true, array: false },
          { key: 'selectedProfile', type: 'string', required: false, array: false },
          { key: 'formality', type: 'string', required: false, array: false },
          { key: 'empathy', type: 'string', required: false, array: false },
          { key: 'enthusiasm', type: 'string', required: false, array: false },
          { key: 'humor', type: 'string', required: false, array: false },
          { key: 'verbosity', type: 'string', required: false, array: false },
          { key: 'knowledgeDomain', type: 'string', required: false, array: false },
          { key: 'languageStyle', type: 'string', required: false, array: false },
          { key: 'culturalContext', type: 'string', required: false, array: false },
          { key: 'expertise', type: 'string', required: false, array: false },
          { key: 'personality', type: 'string', required: false, array: false },
          { key: 'maxLength', type: 'integer', required: false, array: false },
          { key: 'minResponseTime', type: 'float', required: false, array: false },
          { key: 'maxResponseTime', type: 'float', required: false, array: false },
          { key: 'useEmojis', type: 'boolean', required: false, array: false },
          { key: 'includeGreeting', type: 'boolean', required: false, array: false },
          { key: 'askFollowUp', type: 'boolean', required: false, array: false },
          { key: 'systemPrompt', type: 'string', required: false, array: false },
          { key: 'customInstructions', type: 'string', required: false, array: false },
          { key: 'isActive', type: 'boolean', required: false, array: false },
          { key: 'createdBy', type: 'string', required: false, array: false },
          { key: 'createdAt', type: 'datetime', required: true, array: false },
          { key: 'updatedAt', type: 'datetime', required: true, array: false }
        ]
      );
      console.log('✅ Created collection: personas');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Collection personas already exists');
      } else {
        console.error('❌ Failed to create personas:', error.message);
      }
    }

    // Chat Messages Collection
    try {
      await databases.createCollection(
        databaseId,
        'chat_messages',
        [
          { key: 'sessionId', type: 'string', required: true, array: false },
          { key: 'message', type: 'string', required: true, array: false },
          { key: 'response', type: 'string', required: true, array: false },
          { key: 'personaId', type: 'string', required: false, array: false },
          { key: 'userId', type: 'string', required: false, array: false },
          { key: 'source', type: 'string', required: false, array: false },
          { key: 'whatsappId', type: 'string', required: false, array: false },
          { key: 'ip', type: 'string', required: false, array: false },
          { key: 'userAgent', type: 'string', required: false, array: false },
          { key: 'timestamp', type: 'datetime', required: true, array: false }
        ]
      );
      console.log('✅ Created collection: chat_messages');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Collection chat_messages already exists');
      } else {
        console.error('❌ Failed to create chat_messages:', error.message);
      }
    }

    // Knowledge Categories Collection
    try {
      await databases.createCollection(
        databaseId,
        'knowledge_categories',
        [
          { key: 'name', type: 'string', required: true, array: false, unique: true },
          { key: 'description', type: 'string', required: false, array: false },
          { key: 'color', type: 'string', required: false, array: false },
          { key: 'icon', type: 'string', required: false, array: false },
          { key: 'isActive', type: 'boolean', required: false, array: false },
          { key: 'sortOrder', type: 'integer', required: false, array: false },
          { key: 'createdBy', type: 'string', required: false, array: false },
          { key: 'createdAt', type: 'datetime', required: true, array: false },
          { key: 'updatedAt', type: 'datetime', required: true, array: false }
        ]
      );
      console.log('✅ Created collection: knowledge_categories');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Collection knowledge_categories already exists');
      } else {
        console.error('❌ Failed to create knowledge_categories:', error.message);
      }
    }

    // Knowledge Documents Collection
    try {
      await databases.createCollection(
        databaseId,
        'knowledge_documents',
        [
          { key: 'title', type: 'string', required: true, array: false },
          { key: 'content', type: 'string', required: true, array: false },
          { key: 'description', type: 'string', required: false, array: false },
          { key: 'categoryId', type: 'string', required: false, array: false },
          { key: 'author', type: 'string', required: false, array: false },
          { key: 'source', type: 'string', required: false, array: false },
          { key: 'filePath', type: 'string', required: false, array: false },
          { key: 'fileName', type: 'string', required: false, array: false },
          { key: 'fileSize', type: 'integer', required: false, array: false },
          { key: 'mimeType', type: 'string', required: false, array: false },
          { key: 'format', type: 'string', required: false, array: false },
          { key: 'status', type: 'string', required: false, array: false },
          { key: 'isIndexed', type: 'boolean', required: false, array: false },
          { key: 'embeddingCount', type: 'integer', required: false, array: false },
          { key: 'viewCount', type: 'integer', required: false, array: false },
          { key: 'ragDocumentId', type: 'string', required: false, array: false },
          { key: 'lastIndexedAt', type: 'datetime', required: false, array: false },
          { key: 'tags', type: 'string', required: false, array: false },
          { key: 'keywords', type: 'string', required: false, array: false },
          { key: 'priority', type: 'integer', required: false, array: false },
          { key: 'createdBy', type: 'string', required: false, array: false },
          { key: 'createdAt', type: 'datetime', required: true, array: false },
          { key: 'updatedAt', type: 'datetime', required: true, array: false },
          { key: 'publishedAt', type: 'datetime', required: false, array: false }
        ]
      );
      console.log('✅ Created collection: knowledge_documents');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Collection knowledge_documents already exists');
      } else {
        console.error('❌ Failed to create knowledge_documents:', error.message);
      }
    }

    // Test database connection
    console.log('🔍 Testing Appwrite database connection...');
    const listResult = await databases.listCollections(databaseId);
    console.log(`📋 Found ${listResult.collections.length} collections in database`);

    listResult.collections.forEach(collection => {
      console.log(`  - ${collection.name} (${collection.$id})`);
    });

    console.log('✅ Appwrite collections setup completed!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('📋 Full error:', error);
  }
}

setupAppwriteCollections();