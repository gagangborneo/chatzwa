# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

 AI chat assistant built with Next.js 14, TypeScript, and Tailwind CSS. The application features a modern chat interface with AI integration supporting both ZAI API and Ollama for local LLM inference. The system includes RAG (Retrieval-Augmented Generation) capabilities with a knowledge base for enhanced AI responses. The application supports bilingual interface (Indonesian and English) with Indonesian as the default language.

## Common Development Commands

### Development
```bash
# Start development server with hot reload
npm run dev

# View development logs
tail -f dev.log
```

### Building and Production
```bash
# Build for production
npm run build

# Start production server
npm run start

# View production logs
tail -f server.log
```

### Code Quality
```bash
# Run linting
npm run lint
```

### Database Operations
```bash
# Push schema changes to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Reset database (dev only)
npm run db:reset
```

### Docker Development
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Build production image
docker-compose build
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Socket.IO for real-time communication
- **Database**: SQLite with Prisma ORM
- **AI Services**: ZAI API (cloud) with Ollama fallback (local)
- **RAG System**: Knowledge base with vector embeddings for enhanced responses
- **Internationalization**: Custom i18n system supporting Indonesian (default) and English
- **Analytics**: Chat metrics, token usage, and knowledge base statistics
- **Deployment**: Docker with multi-stage builds, Redis for caching

### Key Components

#### Server Configuration (`server.ts`)
- Custom Next.js server with Socket.IO integration
- Handles both HTTP requests and WebSocket connections
- Runs on port 3000 with production optimizations

#### Chat Interface (`src/components/chat-interface.tsx`)
- Main UI component with Islamic-themed green design
- Features message history, markdown rendering, and auto-scroll
- Input validation with 1000 character limit
- Loading states and error handling

#### API Routes
- `src/app/api/chat/route.ts`: Main chat endpoint with multi-service AI integration
- `src/app/api/health/route.ts`: Health check endpoint for monitoring
- Smart service prioritization with automatic fallback between OpenRouter, ZAI API, and Ollama
- Response includes AI service metadata for monitoring and debugging
- Supports model-specific configuration and fallback models for reliability

#### Database (`src/lib/db.ts`, `prisma/schema.prisma`)
- SQLite database with Prisma ORM
- Basic User and Post models for extensibility
- Connection pooling and query logging in development

#### Real-time Communication (`src/lib/socket.ts`)
- Socket.IO server setup for WebSocket connections
- Currently implements echo functionality, extensible for real-time chat

#### Dashboard Analytics (`src/app/dashboard/`)
- Modern corporate minimal dashboard design with hierarchical sidebar navigation
- **Dashboard** (main): Overview with key metrics and system status
- **Chatbot AI**: Analytics, Persona, Knowledge Base, Data Sync (RAG)
- **Management**: Account, Billing, Settings, Help
- **Integrations**: WhatsApp, WordPress, Embed Chat, Instagram (Coming Soon), Facebook (Coming Soon)
- Chat metrics including total conversations, message counts, and user engagement
- Knowledge base statistics showing document count, embedding usage, and retrieval performance
- Real-time statistics updates with responsive design
- Bilingual support with language switcher in dashboard header
- Loading states with skeleton UI for better user experience during data fetching

#### Billing Management (`src/app/dashboard/billing/`)
- Comprehensive subscription management with multiple pricing tiers
- Usage tracking and monitoring for conversations, tokens, knowledge base, and team members
- Payment method management with credit card integration
- Billing history with downloadable invoices and payment records
- Quick actions for subscription management and support contact
- Professional plan interface with upgrade/downgrade capabilities

#### Internationalization System (`src/lib/i18n.ts`)
- Custom React context-based i18n implementation
- Supports Indonesian (default) and English languages
- Translation keys for all UI components and messages
- Language preference persisted in localStorage
- Parameter interpolation for dynamic content (e.g., character counts)

### Configuration Files

#### Next.js Configuration (`next.config.ts`)
- TypeScript build errors ignored for rapid development
- ESLint errors ignored during builds
- Webpack hot module replacement disabled in favor of nodemon

#### Docker Setup (`docker-compose.yml`)
- Multi-service architecture with main app, Redis, and optional Nginx/Ollama
- Resource limits and health checks configured
- Persistent volumes for logs and data

#### Environment Variables
The application supports multiple AI service providers with automatic fallback:

**AI Service Priority Configuration:**
- `AI_SERVICE_PRIORITY`: Comma-separated priority list (default: openrouter,zai,ollama)
- The app will try services in order until it finds an available one

**OpenRouter (Recommended - Multi-Model Gateway):**
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `OPENROUTER_MODEL`: Model name (default: deepseek/deepseek-chat-v3.1:free)
- `OPENROUTER_BASE_URL`: API endpoint (default: https://openrouter.ai/api/v1)
- `OPENROUTER_MAX_TOKENS`: Maximum tokens (default: 4000)
- `OPENROUTER_TEMPERATURE`: Response creativity 0-1 (default: 0.7)
- `OPENROUTER_FALLBACK_MODEL`: Backup model if primary fails

**ZAI API (Alternative Cloud Service):**
- `ZAI_API_KEY`: Your ZAI API key
- `ZAI_API_URL`: API endpoint (default: https://api.z.ai/v1)
- `ZAI_MODEL`: Model name (default: zai-gpt-4)
- `ZAI_MAX_TOKENS`: Maximum tokens (default: 4000)
- `ZAI_TEMPERATURE`: Response creativity 0-1 (default: 0.7)

**Ollama (Local Service):**
- `OLLAMA_BASE_URL`: Ollama service URL (default: http://localhost:11434)
- `OLLAMA_MODEL`: Model name (default: llama2)
- `OLLAMA_MAX_TOKENS`: Maximum tokens (default: 4000)
- `OLLAMA_TEMPERATURE`: Response creativity 0-1 (default: 0.7)
- `OLLAMA_TIMEOUT`: Request timeout in milliseconds (default: 60000)

**Example Configuration:**
```bash
# Primary: OpenRouter with DeepSeek model
OPENROUTER_API_KEY=sk-or-v1-your-api-key
OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free
AI_SERVICE_PRIORITY=openrouter,ollama,zai

# Fallback: Local Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

### Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Main chat API endpoint with RAG
│   │   └── health/route.ts    # Health check endpoint
│   ├── dashboard/
│   │   ├── page.tsx           # Dashboard with analytics
│   │   ├── chat/
│   │   │   ├── page.tsx       # Chat analytics page
│   │   │   └── loading.tsx    # Chat analytics loading skeleton
│   │   ├── knowledge/
│   │   │   ├── page.tsx       # Knowledge base management page
│   │   │   └── loading.tsx    # Knowledge base loading skeleton
│   │   ├── billing/
│   │   │   ├── page.tsx       # Billing and subscription management page
│   │   │   └── loading.tsx    # Billing loading skeleton
│   │   ├── sync/
│   │   │   ├── page.tsx       # Data synchronization (RAG) management page
│   │   │   └── loading.tsx    # RAG sync loading skeleton
│   │   ├── persona/
│   │   │   ├── page.tsx       # AI personality and communication settings page
│   │   │   └── loading.tsx    # Persona loading skeleton
│   │   ├── account/
│   │   │   ├── page.tsx       # User profile and account management page
│   │   │   └── loading.tsx    # Account loading skeleton
│   │   ├── loading.tsx        # Dashboard loading skeleton
│   │   └── layout.tsx         # Dashboard layout with sidebar
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Home page with chat interface
│   └── globals.css            # Global styles and Tailwind imports
├── components/
│   ├── ui/                    # Shadcn UI component library
│   ├── chat-interface.tsx     # Main chat component with i18n
│   └── dashboard/             # Dashboard components
│       ├── sidebar.tsx        # Hierarchical sidebar navigation with i18n
│       ├── language-dropdown.tsx # Language switcher component
│       ├── stats-cards.tsx    # Statistics cards with i18n
│       └── charts.tsx         # Analytics charts with i18n
├── lib/
│   ├── db.ts                  # Prisma client configuration
│   ├── socket.ts              # Socket.IO setup
│   ├── i18n.ts                # Internationalization system
│   └── utils.ts               # Utility functions (cn helper)
└── hooks/                     # Custom React hooks
```

## Development Guidelines

### AI Service Integration
- The app automatically detects and uses Ollama if environment variables are set
- Otherwise falls back to ZAI API for cloud-based AI processing
- Both services use the same system prompt for consistent Islamic education assistance

### RAG and Knowledge Base
- Knowledge base system with vector embeddings for enhanced context retrieval
- RAG implementation improves AI responses with domain-specific Islamic education content
- Supports document ingestion, embedding generation, and semantic search
- Knowledge base statistics track document count, embedding usage, and retrieval performance

### Dashboard Navigation Structure
The application uses a hierarchical sidebar navigation system organized into logical categories:

#### Main Dashboard (Top Level)
- **Dashboard**: `/dashboard` - Main overview page with key metrics and system health

#### Chatbot AI Category
- **Analytics**: `/dashboard/chat` - Chat performance metrics, conversation analytics, user engagement statistics
- **Persona**: `/dashboard/persona` - AI personality and response behavior configuration
- **Knowledge Base**: `/dashboard/knowledge` - Document management, indexing, and retrieval system
- **Data Sync (RAG)**: `/dashboard/sync` - Data synchronization, vector embeddings, and source management

#### Management Category
- **Account**: `/dashboard/account` - User profile and account settings
- **Billing**: `/dashboard/billing` - Subscription management, payment methods, and usage tracking
- **Settings**: `/dashboard/settings` - Application preferences and configuration options
- **Help**: `/dashboard/help` - Documentation, tutorials, and support resources

#### Integrations Category
- **WhatsApp**: `/dashboard/integrations/whatsapp` - WhatsApp integration and configuration
- **WordPress**: `/dashboard/integrations/wordpress` - WordPress plugin and content sync
- **Embed Chat**: `/dashboard/integrations/embed-chat` - Website chat widget configuration
- **Instagram**: `/dashboard/integrations/instagram` - Instagram integration (Coming Soon)
- **Facebook**: `/dashboard/integrations/facebook` - Facebook integration (Coming Soon)

#### Navigation Features
- **Active State Tracking**: Sidebar items highlight based on current URL with proper pathname detection
- **Hierarchical Organization**: Logical grouping of related features for better user experience
- **Coming Soon Badges**: Visual indicators for future integrations under development
- **Responsive Design**: Mobile-friendly sidebar with collapsible navigation
- **Bilingual Labels**: All navigation items support Indonesian and English translations
- **Smart URL Detection**: Automatic active state detection for main dashboard vs sub-pages

### Internationalization (i18n)
- Custom React context-based i18n system with Indonesian as default language
- Language dropdown in dashboard header for switching between Indonesian and English
- All UI components, chat interface, and dashboard support bilingual text
- Translation keys organized by component (dashboard, stats, charts, chat, sync, etc.)
- Parameter interpolation for dynamic values (character counts, percentages, etc.)
- Language preference automatically saved and restored across sessions
- Computer-based terms remain in English across both languages for consistency
- Navigation-specific translations with proper context and hierarchy

### UI Theme
- **Chat Interface**: Islamic-themed green color palette (`from-green-600 via-emerald-600 to-teal-600`)
- **Dashboard**: Modern corporate minimal design with clean typography and subtle gradients
- **Navigation**: Responsive sidebar with collapsible menu and intuitive iconography
- **Responsive**: Optimized for mobile and desktop with adaptive layouts
- **Professional**: Suitable for educational foundation with corporate aesthetic

### Database Schema
- Currently uses basic User/Post models
- Designed to be extensible for additional features like user authentication, message history, etc.

### Performance Considerations
- Docker containers configured with memory limits (1GB for app, 256MB for Redis)
- Next.js standalone output for optimized production builds
- Health checks and automatic restart policies in Docker setup
- Loading states and skeleton UI for improved perceived performance
- Next.js loading.tsx files provide instant visual feedback during route transitions

### Security Notes
- Input validation on message length (1000 character limit)
- XSS protection through output encoding in markdown rendering
- Non-root user execution in Docker containers
- CORS configured for Socket.IO connections

## Testing and Monitoring

### Health Checks
- Application health endpoint at `/api/health`
- Docker health checks every 30 seconds
- Custom healthcheck script for container monitoring

### Logging
- Development logs saved to `dev.log`
- Production logs saved to `server.log`
- Docker logs with rotation (10MB max, 3 files retained)

## Deployment Notes

### Local Development
- Use `npm run dev` for hot reloading with nodemon
- Database changes require `npm run db:push` or migration commands
- Environment variables should be configured in `.env.local`

### Production Deployment
- Use Docker Compose for full stack deployment
- Redis container for caching and session management
- Optional Nginx reverse proxy for SSL termination and load balancing
- Resource limits and scaling configured in docker-compose.yml

### Environment Configuration
- Production: `NODE_ENV=production`, `NEXT_TELEMETRY_DISABLED=1`
- Development: Automatic hot reload and query logging
- Database URL configurable via `DATABASE_URL` environment variable

## Loading States and User Experience

### Next.js Loading Files
The application implements Next.js loading.tsx files to provide instant visual feedback during route transitions:

### Loading State Benefits
- **Improved Perceived Performance**: Users see immediate visual feedback instead of blank screens
- **Better UX**: Skeleton UI matches the actual page layout, reducing layout shift
- **Progressive Loading**: Content loads incrementally without jarring transitions
- **Consistent Experience**: All dashboard pages follow the same loading pattern
- **Accessibility**: Loading states are properly announced and include visual indicators

### Implementation Details
- Uses Tailwind CSS `animate-pulse` for smooth loading animations
- `bg-muted` color class for consistent skeleton appearance
- Proper spacing and sizing to match actual content dimensions
- Loader2 icons from Lucide React for loading spinners
- Responsive design maintained in loading states

## Data Synchronization (RAG) System

### Overview
The RAG (Retrieval-Augmented Generation) system provides comprehensive data synchronization and document indexing capabilities for enhancing AI responses with domain-specific content. The system supports multiple data sources, real-time sync monitoring, and vector embedding management.

### Key Features

#### Data Source Management
- **Multi-Source Support**: Database, CMS, files, and API integrations
- **Connection Testing**: Validate data source connections before configuration
- **Authentication**: Secure credential management for all data source types
- **Real-time Status**: Monitor connection status and sync health
- **Flexible Configuration**: Support for various file formats and data structures

#### Synchronization Engine
- **Automated Sync**: Configurable sync intervals (hourly, daily, weekly)
- **Real-time Monitoring**: Track sync progress, success rates, and errors
- **Batch Processing**: Efficient processing of large document sets
- **Retry Logic**: Automatic retry with configurable limits for failed operations
- **Incremental Updates**: Only process changed or new documents to optimize performance

#### Vector Embeddings
- **Multiple Model Support**: Integration with popular embedding providers
- **Usage Tracking**: Monitor embedding consumption and storage
- **Dimension Management**: Support for different vector dimensions
- **Storage Optimization**: Efficient storage allocation and cleanup
- **Performance Metrics**: Track retrieval quality and response times

#### Sync History & Analytics
- **Detailed Logs**: Complete sync history with timestamps and duration
- **Error Tracking**: Comprehensive error reporting with retry options
- **Performance Analytics**: Sync speed, success rates, and document processing metrics
- **Usage Reports**: Detailed reports on embedding usage and storage allocation
- **Real-time Dashboards**: Live monitoring of all sync operations

### Configuration Options

#### Sync Intervals
- **Every Hour**: For frequently changing content
- **Every 6 Hours**: Balanced approach for moderate update frequency
- **Every 12 Hours**: Less frequent updates for stable content
- **Daily**: Standard daily sync for most use cases
- **Weekly**: Weekly sync for rarely changing content

#### Advanced Settings
- **Batch Size**: Number of documents processed per batch (default: 10)
- **Max Retries**: Maximum retry attempts for failed operations (default: 3)
- **Timeout**: Network timeout in seconds (default: 30)
- **Auto-indexing**: Automatic document indexing after upload
- **Default Category**: Category assignment for uncategorized documents

### Supported Data Source Types

#### Database Connections
- **MySQL/MariaDB**: Direct database integration with table selection
- **PostgreSQL**: Advanced database with JSON support
- **SQLite**: Local file-based databases
- **MongoDB**: NoSQL database with collection support

#### File Systems
- **Local Files**: Direct file system access with monitoring
- **Cloud Storage**: S3, Google Cloud Storage, Azure Blob
- **Document Repositories**: SharePoint, Google Drive, OneDrive
- **FTP/SFTP**: Remote file server connections

#### CMS & APIs
- **WordPress**: Direct WordPress database or REST API integration
- **Headless CMS**: Strapi, Contentful, Sanity, etc.
- **Custom APIs**: RESTful API with authentication support
- **Web Scraping**: Automated web content extraction

### Technical Implementation

#### Real-time Updates
- WebSocket connections for live sync progress
- Server-sent events for status updates
- Progressive loading of sync results
- Automatic dashboard refresh on completion

#### Error Handling
- Comprehensive error logging with context
- User-friendly error messages and resolution steps
- Automatic retry with exponential backoff
- Manual override options for critical errors

#### Performance Optimization
- Efficient vector operations with batch processing
- Memory management for large document sets
- Background processing for non-blocking operations
- Caching for frequently accessed embeddings

### Integration Points

#### AI Chat Enhancement
- Real-time context retrieval from indexed documents
- Semantic search for relevant content extraction
- Context injection into AI prompts for accurate responses
- Source attribution for transparency and verification

#### Knowledge Base Synergy
- Shared document storage and processing
- Unified tagging and categorization system
- Cross-reference between sync and manual uploads
- Centralized search and retrieval interface

### Internationalization
The RAG system includes comprehensive translation support:

#### Indonesian Translations
- `sync.*` keys for all UI elements and messages
- Contextual translations for technical terms
- User-friendly error messages and instructions
- Professional terminology for business users

#### English Translations
- Complete English localization for international use
- Consistent terminology with technical documentation
- Clear and concise user interface text
- Industry-standard terminology for RAG operations
