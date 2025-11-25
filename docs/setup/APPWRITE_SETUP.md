# Appwrite Database Setup Guide

This guide explains how to set up and configure Appwrite as a database provider for the chatbot application.

## Overview

Appwrite is an open-source Backend-as-a-Service (BaaS) platform that provides authentication, database, storage, and more. This chatbot application now supports Appwrite alongside PostgreSQL and Supabase.

## Configuration

### Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Appwrite Configuration (set APPWRITE_ACTIVE=true to enable)
APPWRITE_ACTIVE=false
NEXT_PUBLIC_APPWRITE_PROJECT_ID="68f2b5e400319b7f6fe8"
NEXT_PUBLIC_APPWRITE_PUBLIC_ENDPOINT="https://localhost/v1"
```

### Database Configuration

The application uses the following Appwrite database configuration:

```javascript
// Database ID
APPWRITE_DATABASE_ID = 'chatbot_db'

// Collections
COLLECTIONS = {
  USERS: 'users',
  USER_SESSIONS: 'user_sessions',
  PERSONAS: 'personas',
  CHAT_MESSAGES: 'chat_messages',
  WHATSAPP_INTEGRATIONS: 'whatsapp_integrations',
  WHATSAPP_CONTACTS: 'whatsapp_contacts',
  WHATSAPP_MEDIA: 'whatsapp_media',
  KNOWLEDGE_CATEGORIES: 'knowledge_categories',
  KNOWLEDGE_DOCUMENTS: 'knowledge_documents',
  DOCUMENT_UPLOADS: 'document_uploads',
  POSTS: 'posts'
}
```

## Setup Instructions

### 1. Install Appwrite Server

If you haven't already, install Appwrite server locally:

```bash
# Using Docker (recommended)
docker run -it --rm \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume ~/appwrite:/usr/src/appwrite \
  appwrite/appwrite:1.6.0

# Or follow the official installation guide at https://appwrite.io/docs/installation
```

### 2. Create Project and Database

1. Open Appwrite Console (usually at `http://localhost/v1`)
2. Create a new project with ID: `68f2b5e400319b7f6fe8`
3. Create a database named: `chatbot_db`

### 3. Create Collections

Create the following collections in your Appwrite database:

#### Users Collection
```bash
Collection ID: users
Attributes:
- email (string, required, unique)
- name (string, optional)
- role (string, default: "user")
- isActive (boolean, default: true)
- lastLoginAt (datetime, optional)
- createdAt (datetime, required)
- updatedAt (datetime, required)
```

#### User Sessions Collection
```bash
Collection ID: user_sessions
Attributes:
- userId (string, required, relationship to users)
- token (string, required, unique)
- expiresAt (datetime, required)
- ipAddress (string, optional)
- userAgent (string, optional)
- isActive (boolean, default: true)
- createdAt (datetime, required)
- updatedAt (datetime, required)
```

#### Personas Collection
```bash
Collection ID: personas
Attributes:
- slug (string, optional, unique)
- name (string, required)
- welcomeMessage (string, required)
- selectedProfile (string, default: "islamic_educator")
- formality (string, default: "professional")
- empathy (string, default: "high")
- enthusiasm (string, default: "medium")
- humor (string, default: "low")
- verbosity (string, default: "medium")
- knowledgeDomain (string, default: "islamic_education")
- languageStyle (string, default: "friendly")
- culturalContext (string, default: "indonesian")
- expertise (string, default: "general")
- personality (string, default: "helpful")
- maxLength (integer, default: 500)
- minResponseTime (float, default: 1.0)
- maxResponseTime (float, default: 5.0)
- useEmojis (boolean, default: true)
- includeGreeting (boolean, default: true)
- askFollowUp (boolean, default: true)
- systemPrompt (string, default: "")
- customInstructions (string, default: "")
- isActive (boolean, default: false)
- createdBy (string, optional, relationship to users)
- createdAt (datetime, required)
- updatedAt (datetime, required)
```

#### Chat Messages Collection
```bash
Collection ID: chat_messages
Attributes:
- sessionId (string, required)
- message (string, required)
- response (string, required)
- personaId (string, optional, relationship to personas)
- userId (string, optional, relationship to users)
- source (string, default: "web")
- whatsappId (string, optional)
- ip (string, optional)
- userAgent (string, optional)
- timestamp (datetime, required)
```

#### WhatsApp Integrations Collection
```bash
Collection ID: whatsapp_integrations
Attributes:
- name (string, required)
- phoneNumber (string, required, unique)
- businessId (string, optional)
- accessToken (string, optional)
- apiKey (string, optional)
- webhookSecret (string, optional)
- status (string, default: "disconnected")
- lastSyncAt (datetime, required)
- autoRespond (boolean, default: true)
- welcomeMessage (string, default: "")
- defaultMessage (string, default: "")
- totalMessages (integer, default: 0)
- totalMedia (integer, default: 0)
- activeChats (integer, default: 0)
- createdBy (string, optional, relationship to users)
- createdAt (datetime, required)
- updatedAt (datetime, required)
```

#### WhatsApp Contacts Collection
```bash
Collection ID: whatsapp_contacts
Attributes:
- integrationId (string, required, relationship to whatsapp_integrations)
- phoneNumber (string, required, unique)
- name (string, optional)
- profilePicture (string, optional)
- isBlocked (boolean, default: false)
- isBusiness (boolean, default: false)
- lastMessageAt (datetime, optional)
- createdAt (datetime, required)
- updatedAt (datetime, required)
```

#### WhatsApp Media Collection
```bash
Collection ID: whatsapp_media
Attributes:
- integrationId (string, required, relationship to whatsapp_integrations)
- messageId (string, required)
- contactId (string, optional, relationship to whatsapp_contacts)
- mediaType (string, required)
- mediaUrl (string, required)
- originalName (string, optional)
- mimeType (string, optional)
- fileSize (integer, optional)
- thumbnailUrl (string, optional)
- createdAt (datetime, required)
```

#### Knowledge Categories Collection
```bash
Collection ID: knowledge_categories
Attributes:
- name (string, required, unique)
- description (string, optional)
- color (string, default: "#6B7280")
- icon (string, optional)
- isActive (boolean, default: true)
- sortOrder (integer, default: 0)
- createdBy (string, optional, relationship to users)
- createdAt (datetime, required)
- updatedAt (datetime, required)
```

#### Knowledge Documents Collection
```bash
Collection ID: knowledge_documents
Attributes:
- title (string, required)
- content (string, required)
- description (string, optional)
- categoryId (string, optional, relationship to knowledge_categories)
- author (string, optional)
- source (string, optional)
- filePath (string, optional)
- fileName (string, optional)
- fileSize (integer, optional)
- mimeType (string, optional)
- format (string, optional)
- status (string, default: "draft")
- isIndexed (boolean, default: false)
- embeddingCount (integer, default: 0)
- viewCount (integer, default: 0)
- ragDocumentId (string, optional)
- lastIndexedAt (datetime, optional)
- tags (string, optional)
- keywords (string, optional)
- priority (integer, default: 0)
- createdBy (string, optional, relationship to users)
- createdAt (datetime, required)
- updatedAt (datetime, required)
- publishedAt (datetime, optional)
```

#### Document Uploads Collection
```bash
Collection ID: document_uploads
Attributes:
- fileName (string, required)
- originalName (string, required)
- fileSize (integer, required)
- mimeType (string, required)
- filePath (string, required)
- status (string, default: "uploading")
- errorMessage (string, optional)
- processingLog (string, optional)
- autoIndex (boolean, default: true)
- categoryId (string, optional, relationship to knowledge_categories)
- extractText (boolean, default: true)
- uploadSource (string, default: "manual")
- uploaderIp (string, optional)
- userAgent (string, optional)
- createdBy (string, optional, relationship to users)
- createdAt (datetime, required)
- updatedAt (datetime, required)
- completedAt (datetime, optional)
- documentId (string, optional, relationship to knowledge_documents)
```

#### Posts Collection
```bash
Collection ID: posts
Attributes:
- title (string, required)
- content (string, optional)
- published (boolean, default: false)
- authorId (string, required, relationship to users)
- createdAt (datetime, required)
- updatedAt (datetime, required)
```

### 4. Enable Appwrite in Your Application

Set `APPWRITE_ACTIVE=true` in your `.env.local` file:

```bash
APPWRITE_ACTIVE=true
NEXT_PUBLIC_APPWRITE_PROJECT_ID="68f2b5e400319b7f6fe8"
NEXT_PUBLIC_APPWRITE_PUBLIC_ENDPOINT="https://localhost/v1"
```

### 5. Test the Configuration

Run the test script to verify your Appwrite connection:

```bash
node test-appwrite.js
```

## Usage

### Authentication

Appwrite handles authentication through its built-in account system. The application automatically uses Appwrite authentication when `APPWRITE_ACTIVE=true`.

### Database Operations

The application uses the Appwrite SDK for all database operations:

```javascript
import { appwriteDBOperations } from '@/lib/auth-appwrite'

// Create a document
await appwriteDBOperations.createDocument('users', userData)

// Get a document
await appwriteDBOperations.getDocument('users', userId)

// List documents
await appwriteDBOperations.listDocuments('users', [Query.equal('email', email)])

// Update a document
await appwriteDBOperations.updateDocument('users', userId, updates)

// Delete a document
await appwriteDBOperations.deleteDocument('users', userId)
```

## Priority Order

The application uses the following priority order for authentication:

1. **Appwrite** (if `APPWRITE_ACTIVE=true`)
2. **Supabase** (if `SUPABASE_ACTIVE=true`)
3. **Local/PostgreSQL** (fallback)

## Troubleshooting

### Connection Issues

1. **Make sure Appwrite server is running**: Check if you can access the Appwrite console
2. **Verify endpoint URL**: The default is `https://localhost/v1`
3. **Check project ID**: Ensure it matches your Appwrite project
4. **Network issues**: Make sure your firewall allows localhost connections

### Collection Not Found

1. **Create missing collections**: Use the collection definitions above
2. **Check collection IDs**: Ensure they match exactly with the code
3. **Verify permissions**: Make sure your API key has the required permissions

### Authentication Issues

1. **Check APPWRITE_ACTIVE**: Ensure it's set to `true`
2. **Verify project configuration**: Check project ID and endpoint
3. **Review collection permissions**: Ensure proper read/write access

## Benefits of Using Appwrite

- **Built-in Authentication**: No need to implement auth from scratch
- **Real-time Updates**: WebSocket support for real-time features
- **Security**: Built-in security features and permissions
- **Scalability**: Designed for production workloads
- **Open Source**: Full control over your data and infrastructure