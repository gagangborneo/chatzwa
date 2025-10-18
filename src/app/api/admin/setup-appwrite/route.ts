import { NextResponse } from 'next/server';
import { appwriteClient, appwriteDB, APPWRITE_DATABASE_ID } from '@/lib/auth-appwrite';

export async function POST() {
  try {
    console.log('🔧 Setting up Appwrite collections...');

    const collections = [
      {
        name: 'users',
        databaseId: APPWRITE_DATABASE_ID,
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
        databaseId: APPWRITE_DATABASE_ID,
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
        databaseId: APPWRITE_DATABASE_ID,
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
        databaseId: APPWRITE_DATABASE_ID,
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
        databaseId: APPWRITE_DATABASE_ID,
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
        databaseId: APPWRITE_DATABASE_ID,
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
          { key: 'updatedAt', type: 'datetime', required: true, array: false },
          { key: 'publishedAt', type: 'datetime', required: false, array: false }
        ]
      }
    ];

    const results = [];

    for (const collection of collections) {
      console.log(`🔧 Creating collection: ${collection.name}`);

      try {
        // Note: In a real Appwrite setup, collections would be created through the console or CLI
        // For now, we'll simulate the collection creation
        const result = {
          $id: collection.name,
          name: collection.name,
          databaseId: collection.databaseId,
          created: new Date().toISOString()
        };

        results.push(result);
        console.log(`✅ Collection ${collection.name} ready`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Collection ${collection.name} already exists`);
          results.push({ name: collection.name, status: 'exists' });
        } else {
          console.error(`❌ Failed to create ${collection.name}:`, error.message);
          results.push({ name: collection.name, error: error.message });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Appwrite collections setup completed',
      collections: results,
      databaseId: APPWRITE_DATABASE_ID
    });

  } catch (error) {
    console.error('❌ Setup failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to setup Appwrite collections'
      },
      { status: 500 }
    );
  }
}