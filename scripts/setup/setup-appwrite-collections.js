const { Client, Databases } = require('appwrite');

async function setupAppwriteCollections() {
  console.log('🔧 Setting up Appwrite collections...');

  const client = new Client()
    .setEndpoint('https://localhost/v1')
    .setProject('68f2b5e400319b7f6fe8');

  const databases = new Databases(client);
  const databaseId = '68f2b7e0002968518650';

  const collections = [
    {
      name: 'users',
      databaseId,
      attributes: [
        { key: 'email', type: 'string', required: true, array: false, unique: true },
        { key: 'name', type: 'string', required: false, array: false },
        { key: 'role', type: 'string', required: false, array: false, default: 'user' },
        { key: 'isActive', type: 'boolean', required: false, array: false, default: true },
        { key: 'lastLoginAt', type: 'datetime', required: false, array: false },
        { key: 'createdAt', type: 'datetime', required: true, array: false },
        { key: 'updatedAt', type: 'datetime', required: true, array: false }
      ]
    },
    {
      name: 'user_sessions',
      databaseId,
      attributes: [
        { key: 'userId', type: 'string', required: true, array: false },
        { key: 'token', type: 'string', required: true, array: false, unique: true },
        { key: 'expiresAt', type: 'datetime', required: true, array: false },
        { key: 'ipAddress', type: 'string', required: false, array: false },
        { key: 'userAgent', type: 'string', required: false, array: false },
        { key: 'isActive', type: 'boolean', required: false, array: false, default: true },
        { key: 'createdAt', type: 'datetime', required: true, array: false },
        { key: 'updatedAt', type: 'datetime', required: true, array: false }
      ]
    },
    {
      name: 'personas',
      databaseId,
      attributes: [
        { key: 'slug', type: 'string', required: false, array: false, unique: true },
        { key: 'name', type: 'string', required: true, array: false },
        { key: 'welcomeMessage', type: 'string', required: true, array: false },
        { key: 'selectedProfile', type: 'string', required: false, array: false, default: 'islamic_educator' },
        { key: 'formality', type: 'string', required: false, array: false, default: 'professional' },
        { key: 'empathy', type: 'string', required: false, array: false, default: 'high' },
        { key: 'enthusiasm', type: 'string', required: false, array: false, default: 'medium' },
        { key: 'humor', type: 'string', required: false, array: false, default: 'low' },
        { key: 'verbosity', type: 'string', required: false, array: false, default: 'medium' },
        { key: 'knowledgeDomain', type: 'string', required: false, array: false, default: 'islamic_education' },
        { key: 'languageStyle', type: 'string', required: false, array: false, default: 'friendly' },
        { key: 'culturalContext', type: 'string', required: false, array: false, default: 'indonesian' },
        { key: 'expertise', type: 'string', required: false, array: false, default: 'general' },
        { key: 'personality', type: 'string', required: false, array: false, default: 'helpful' },
        { key: 'maxLength', type: 'integer', required: false, array: false, default: 500 },
        { key: 'minResponseTime', type: 'float', required: false, array: false, default: 1.0 },
        { key: 'maxResponseTime', type: 'float', required: false, array: false, default: 5.0 },
        { key: 'useEmojis', type: 'boolean', required: false, array: false, default: true },
        { key: 'includeGreeting', type: 'boolean', required: false, array: false, default: true },
        { key: 'askFollowUp', type: 'boolean', required: false, array: false, default: true },
        { key: 'systemPrompt', type: 'string', required: false, array: false, default: '' },
        { key: 'customInstructions', type: 'string', required: false, array: false, default: '' },
        { key: 'isActive', type: 'boolean', required: false, array: false, default: false },
        { key: 'createdBy', type: 'string', required: false, array: false },
        { key: 'createdAt', type: 'datetime', required: true, array: false },
        { key: 'updatedAt', type: 'datetime', required: true, array: false }
      ]
    },
    {
      name: 'chat_messages',
      databaseId,
      attributes: [
        { key: 'sessionId', type: 'string', required: true, array: false },
        { key: 'message', type: 'string', required: true, array: false },
        { key: 'response', type: 'string', required: true, array: false },
        { key: 'personaId', type: 'string', required: false, array: false },
        { key: 'userId', type: 'string', required: false, array: false },
        { key: 'source', type: 'string', required: false, array: false, default: 'web' },
        { key: 'whatsappId', type: 'string', required: false, array: false },
        { key: 'ip', type: 'string', required: false, array: false },
        { key: 'userAgent', type: 'string', required: false, array: false },
        { key: 'timestamp', type: 'datetime', required: true, array: false }
      ]
    },
    {
      name: 'knowledge_categories',
      databaseId,
      attributes: [
        { key: 'name', type: 'string', required: true, array: false, unique: true },
        { key: 'description', type: 'string', required: false, array: false },
        { key: 'color', type: 'string', required: false, array: false, default: '#6B7280' },
        { key: 'icon', type: 'string', required: false, array: false },
        { key: 'isActive', type: 'boolean', required: false, array: false, default: true },
        { key: 'sortOrder', type: 'integer', required: false, array: false, default: 0 },
        { key: 'createdBy', type: 'string', required: false, array: false },
        { key: 'createdAt', type: 'datetime', required: true, array: false },
        { key: 'updatedAt', type: 'datetime', required: true, array: false }
      ]
    },
    {
      name: 'knowledge_documents',
      databaseId,
      attributes: [
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
        { key: 'status', type: 'string', required: false, array: false, default: 'draft' },
        { key: 'isIndexed', type: 'boolean', required: false, array: false, default: false },
        { key: 'embeddingCount', type: 'integer', required: false, array: false, default: 0 },
        { key: 'viewCount', type: 'integer', required: false, array: false, default: 0 },
        { key: 'ragDocumentId', type: 'string', required: false, array: false },
        { key: 'lastIndexedAt', type: 'datetime', required: false, array: false },
        { key: 'tags', type: 'string', required: false, array: false },
        { key: 'keywords', type: 'string', required: false, array: false },
        { key: 'priority', type: 'integer', required: false, array: false, default: 0 },
        { key: 'createdBy', type: 'string', required: false, array: false },
        { key: 'createdAt', type: 'datetime', required: true, array: false },
        key: 'updatedAt', type: 'datetime', required: true, array: false },
        { key: 'publishedAt', type: 'datetime', required: false, array: false }
      ]
    }
  ];

  try {
    console.log('📋 Creating Appwrite collections in database:', databaseId);

    for (const collection of collections) {
      console.log(`🔧 Creating collection: ${collection.name}`);

      try {
        const result = await databases.createCollection(
          databaseId,
          collection.name,
          collection.attributes
        );
        console.log(`✅ Created collection: ${collection.name} (ID: ${result.$id})`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Collection ${collection.name} already exists`);
        } else {
          console.error(`❌ Failed to create ${collection.name}:`, error.message);
        }
      }
    }

    console.log('✅ Appwrite collections setup completed!');

    // Test database connection
    console.log('🔍 Testing Appwrite database connection...');
    const listResult = await databases.listCollections(databaseId);
    console.log(`📋 Found ${listResult.collections.length} collections in database`);

    listResult.collections.forEach(collection => {
      console.log(`  - ${collection.name} (${collection.$id})`);
    });

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('📋 Full error:', error);
  }
}

setupAppwriteCollections();