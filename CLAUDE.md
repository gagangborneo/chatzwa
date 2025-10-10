# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Attallah Assistant is an Islamic Education Foundation AI chat assistant built with Next.js 14, TypeScript, and Tailwind CSS. The application features a modern chat interface with AI integration supporting both ZAI API and Ollama for local LLM inference. The system includes RAG (Retrieval-Augmented Generation) capabilities with a knowledge base for enhanced AI responses. The application supports bilingual interface (Indonesian and English) with Indonesian as the default language.

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
- `src/app/api/chat/route.ts`: Main chat endpoint with AI service integration
- `src/app/api/health/route.ts`: Health check endpoint for monitoring
- Smart switching between ZAI API and Ollama based on environment configuration

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
The application supports optional Ollama integration:
- `OLLAMA_BASE_URL`: Ollama service URL (default: http://localhost:11434)
- `OLLAMA_MODEL`: Model name (default: llama2)
- If unset, falls back to ZAI API

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

#### Dashboard Loading (`src/app/dashboard/loading.tsx`)
- Skeleton UI for main dashboard statistics cards
- Header and navigation placeholders
- Content area placeholders with animated pulse effects
- Loading spinner indicator

#### Chat Analytics Loading (`src/app/dashboard/chat/loading.tsx`)
- Skeleton UI for chat metrics overview
- Tab headers placeholder
- Charts area placeholders
- Recent conversations table skeleton
- Performance metrics loading states

#### Knowledge Base Loading (`src/app/dashboard/knowledge/loading.tsx`)
- Knowledge-specific statistics skeleton (documents, embeddings, storage)
- Two-tab layout placeholders (Knowledge Data, Upload Files)
- Document management table skeleton
- Upload interface placeholders
- Recent indexing activity skeleton

#### Billing Loading (`src/app/dashboard/billing/loading.tsx`)
- Usage statistics skeleton (conversations, tokens, knowledge base, team members)
- Subscription management interface placeholders
- Payment methods and billing history table skeleton
- Pricing plans grid with feature lists
- Current plan and quick actions area skeleton

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

## Billing and Subscription Management

### Subscription Tiers
The application offers three subscription plans designed for different organizational needs:

#### Starter Plan (IDR 299,000/month or IDR 3,230,000/year)
- **Basic Features**: 500 conversations/month, basic AI models, email support
- **Knowledge Base**: 100 documents limit
- **Team Size**: 1 team member
- **Use Case**: Small organizations and individual users

#### Professional Plan (IDR 990,000/month or IDR 10,780,000/year) - Most Popular
- **Advanced Features**: Unlimited conversations, advanced AI models, priority support
- **Knowledge Base**: 2,000 documents limit
- **Team Size**: 15 team members
- **Additional**: API access, custom integrations
- **Use Case**: Medium to large organizations with comprehensive needs

#### Enterprise Plan (IDR 2,990,000/month or IDR 32,500,000/year)
- **Premium Features**: Unlimited everything, custom AI models, 24/7 dedicated support
- **Knowledge Base**: Unlimited documents
- **Team Size**: Unlimited team members
- **Additional**: Advanced API features, on-premise deployment, SLA guarantee
- **Use Case**: Large enterprises with custom requirements

### Usage Monitoring
Real-time usage tracking for:
- **Conversations**: Monthly conversation limits with percentage indicators
- **Tokens**: AI token usage for cost monitoring
- **Knowledge Base**: Document storage and embedding usage
- **Team Members**: Active team member count against plan limits

### Billing Features
- **Payment Methods**: Credit card management with automatic billing
- **Billing History**: Complete invoice history with download capabilities
- **Usage Alerts**: Notifications when approaching plan limits
- **Quick Actions**: Easy access to subscription management and support
- **Multi-currency Support**: Indonesian Rupiah (IDR) with proper formatting

### Billing Integration
- **Automatic Renewals**: Monthly or yearly billing cycles with automatic renewal
- **Invoice Generation**: Professional invoices with detailed breakdown
- **Tax Compliance**: Indonesian tax compliance for local businesses
- **Export Capabilities**: Download invoices for accounting purposes
- **Email Notifications**: Billing reminders and confirmations

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

### User Interface

#### Sync Dashboard (`/dashboard/sync`)
- **Statistics Overview**: Real-time sync metrics and health indicators
- **Four-Tab Interface**: Organized access to data sources, sync history, embeddings, and settings
- **Responsive Design**: Optimized for desktop and mobile monitoring
- **Loading States**: Comprehensive skeleton UI for better user experience
- **Bilingual Support**: Full Indonesian and English translation support

#### Tab Interfaces

**Data Sources Tab**
- List view of all configured data sources with status indicators
- Connection status (Connected, Error, Idle)
- Last sync timestamp with relative time display
- Action buttons for manual sync, edit, and test connections
- Add/Edit data source modal with configuration forms

**Sync History Tab**
- Chronological list of all sync operations
- Operation status (Success, Failed, In Progress)
- Document processing counts and duration tracking
- Error details with retry capabilities
- Filter and search functionality for specific sync operations

**Embeddings Tab**
- Current embedding usage statistics with visual indicators
- Available models and provider information
- Storage allocation and usage monitoring
- Model management with configuration options
- Performance metrics and quality indicators

**Settings Tab**
- Auto-sync configuration with interval selection
- Batch size and retry limit settings
- Timeout configuration for network operations
- Advanced sync options and preferences
- Save and reset functionality for all settings

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

### Loading States
The sync interface includes comprehensive loading states:

#### Sync Loading (`src/app/dashboard/sync/loading.tsx`)
- Skeleton UI for sync statistics cards
- Tab headers and content placeholders
- Data sources table skeleton with status indicators
- Sync history timeline placeholders
- Embeddings usage visualization skeleton
- Settings form placeholder with inputs and toggles

### Monitoring and Maintenance

#### Health Monitoring
- Real-time sync operation health checks
- Data source connection monitoring
- Embedding service status tracking
- Automated alerting for sync failures

#### Maintenance Operations
- Automatic cleanup of failed sync attempts
- Embedding storage optimization and cleanup
- Archive management for historical sync data
- Performance metrics collection and analysis

## AI Persona Management System

### Overview
The Persona system provides comprehensive AI personality and communication style customization, allowing administrators to tailor the AI assistant's behavior, tone, and responses to match organizational needs and user preferences. The system offers granular control over every aspect of AI communication.

### Key Features

#### Welcome Message Configuration
- **Custom Welcome Messages**: Personalized greetings for different contexts and user segments
- **Template Library**: Pre-defined templates for various interaction styles (Friendly, Professional, Islamic)
- **Live Preview**: Real-time preview of how welcome messages appear in the chat interface
- **Character Limits**: Configurable message length with character count display
- **Emoji Support**: Easy emoji insertion to enhance message expressiveness

#### Text Style Customization
- **Formality Levels**: Casual, Professional, and Formal communication styles
- **Empathy Settings**: Low, Medium, and High empathy levels for emotional connection
- **Enthusiasm Control**: Adjustable enthusiasm levels from calm to very enthusiastic
- **Humor Integration**: Configurable humor levels for engaging interactions
- **Verbosity Settings**: Concise, Medium, or Detailed response lengths

#### Behavior Settings
- **Knowledge Domains**: Specialization in Islamic Education, General, Education, or Religious topics
- **Language Styles**: Friendly, Professional, Academic, or Casual communication approaches
- **Cultural Context**: Indonesian, Islamic, Western, or Neutral cultural framing
- **Expertise Levels**: General, Intermediate, Expert, or Scholar knowledge depth
- **Personality Types**: Helpful, Formal, Friendly, Teacher, or Guide archetypes

#### Response Configuration
- **Length Controls**: Maximum response character limits with slider control (100-1000 characters)
- **Timing Settings**: Minimum and maximum response time configuration (0.5-10 seconds)
- **Format Options**: Emoji usage, greeting inclusion, and follow-up question prompts
- **Real-time Adjustment**: Live preview of response timing and formatting changes

#### Advanced Settings
- **Response Patterns**: Context usage, adaptive responses, personalized answers, and proactive help
- **Safety Controls**: Content filtering, respectful language enforcement, and Islamic values compliance
- **Privacy Options**: Enhanced privacy mode for sensitive conversations
- **Custom Instructions**: Free-form text for specialized AI behavior instructions

### User Interface

#### Persona Dashboard (`/dashboard/persona`)
- **Four-Tab Interface**: Organized access to Welcome, Style, Behavior, and Advanced settings
- **Real-time Preview**: Live preview of welcome messages and style changes
- **Interactive Controls**: Sliders, switches, and dropdowns for intuitive configuration
- **Status Indicators**: Visual feedback for save status and configuration validation
- **Responsive Design**: Optimized for both desktop and mobile management

#### Tab Interfaces

**Welcome Message Tab**
- Text area with character counter for custom welcome message composition
- Quick template buttons for common greeting styles
- Live chat preview showing how the message appears to users
- Emoji insertion button for expressive greetings
- Template library with culturally appropriate options

**Text Style Tab**
- Dropdown selectors for formality, empathy, enthusiasm, humor, and verbosity
- Real-time style summary showing current AI communication approach
- Visual badges indicating current style settings
- Tips and recommendations for optimal style selection
- Interactive preview of how style changes affect AI responses

**Behavior Tab**
- Comprehensive settings for knowledge domain and language style
- Cultural context configuration for appropriate responses
- Expertise level selection to match user expectations
- Personality type configuration for consistent AI behavior
- Response timing and formatting controls with slider adjustments

**Advanced Tab**
- Response pattern toggles for adaptive and personalized interactions
- Safety settings for content filtering and respectful communication
- Islamic values enforcement for faith-appropriate responses
- Custom instruction text area for specialized AI behavior
- Privacy mode configuration for sensitive conversation handling

### Configuration Examples

#### Educational Institution Setup
```
Welcome: "Assalamualaikum! Selamat datang di portal pendidikan kami. Saya siap membantu dengan informasi tentang program, kurikulum, dan pendaftaran. 📚"
Style: Professional, High Empathy, Medium Enthusiasm, Low Humor, Medium Verbosity
Domain: Islamic Education
Cultural Context: Indonesian
Personality: Teacher
```

#### General Customer Service Setup
```
Welcome: "Halo! Saya adalah asisten digital Anda. Ada yang bisa saya bantu hari ini? 😊"
Style: Casual, Medium Empathy, High Enthusiasm, Medium Humor, Concise Verbosity
Domain: General
Cultural Context: Indonesian
Personality: Helpful
```

#### Formal Academic Setup
```
Welcome: "Selamat datang. Saya adalah asisten akademis yang siap membantu dengan pertanyaan seputar penelitian dan pembelajaran."
Style: Formal, Medium Empathy, Low Enthusiasm, Low Humor, Detailed Verbosity
Domain: Education
Cultural Context: Neutral
Personality: Formal
```

### Technical Implementation

#### State Management
- React state management for real-time configuration updates
- Automatic save functionality with visual feedback
- Reset functionality to restore default settings
- Form validation and error handling for user inputs

#### UI Components
- **Slider Controls**: For numeric values (response time, length limits)
- **Switch Toggles**: For boolean settings (emoji usage, safety features)
- **Dropdown Selectors**: For categorical choices (formality, personality types)
- **Text Areas**: For custom messages and instructions
- **Preview Panels**: Live preview of configuration changes

#### Responsive Design
- Mobile-optimized interface with collapsible sections
- Touch-friendly controls and appropriate spacing
- Progressive disclosure of advanced settings
- Consistent design language with existing dashboard components

### Integration Points

#### Chat Interface Integration
- Real-time application of persona settings to chat responses
- Consistent welcome message display across all user sessions
- Dynamic response generation based on configured style parameters
- Context-aware behavior adjustment during conversations

#### Multi-language Support
- Full Indonesian and English localization for all persona settings
- Culturally appropriate template suggestions
- Language-specific response style recommendations
- Regional cultural context integration

### Monitoring and Analytics

#### Configuration Tracking
- Version history of persona configuration changes
- User feedback collection on AI interaction quality
- Performance metrics for response effectiveness
- A/B testing support for different persona configurations

#### Quality Assurance
- Automated validation of persona settings
- Consistency checks across language translations
- Cultural appropriateness verification
- Safety and compliance monitoring

### Loading States
The persona interface includes comprehensive loading states:

#### Persona Loading (`src/app/dashboard/persona/loading.tsx`)
- Skeleton UI for all four tab interfaces
- Welcome message configuration placeholders
- Text style control placeholders with form elements
- Behavior settings skeleton with sliders and dropdowns
- Advanced settings loading states with toggles and text areas
- Save/reset button loading animations

### Best Practices

#### Persona Configuration Guidelines
- **Consistency**: Maintain consistent personality across all interactions
- **Cultural Appropriateness**: Align style with target audience cultural expectations
- **Clarity**: Use clear, understandable language in welcome messages
- **Accessibility**: Ensure responses are accessible to users with different needs
- **Safety**: Enable appropriate safety filters for your use case

#### Organizational Implementation
- **Stakeholder Input**: Involve education experts and community leaders in persona design
- **User Testing**: Test persona configurations with actual user groups
- **Iterative Improvement**: Continuously refine based on user feedback
- **Documentation**: Maintain clear documentation of persona rationale and decisions
- **Training**: Train staff on persona management and customization options

## Account Management System

### Overview
The Account system provides comprehensive user profile and security management capabilities, allowing users to manage their personal information, security settings, notification preferences, and view detailed account statistics. The system offers granular control over account security and privacy settings.

### Key Features

#### Profile Management
- **Personal Information**: Complete profile management with personal and professional details
- **Profile Picture**: Custom avatar upload with preview and crop functionality
- **Contact Details**: Email, phone, and institutional information management
- **Professional Info**: Job title, department, and institution details
- **Bio Section**: Personal biography with character limits and rich text support
- **Account Statistics**: Real-time display of account age, storage usage, and plan details

#### Security Settings
- **Password Management**: Secure password change with current password verification
- **Two-Factor Authentication**: Optional 2FA setup with authenticator app integration
- **Recovery Codes**: Emergency access codes for account recovery scenarios
- **Login Activity**: Comprehensive monitoring of login sessions and devices
- **Session Management**: View and logout from active sessions across devices
- **Security Alerts**: Real-time notifications for suspicious activities

#### Notification Preferences
- **Email Notifications**: Granular control over email notification types
- **Product Updates**: Optional notifications about new features and improvements
- **Chat Notifications**: Alerts for new messages and chat interactions
- **Billing Reminders**: Timely notifications for upcoming payments and renewals
- **Security Alerts**: Critical notifications about account security changes
- **System Alerts**: Important system status and maintenance notifications
- **Marketing Communications**: Optional marketing emails and promotional content

#### Account Statistics
- **Usage Metrics**: Comprehensive tracking of login count, storage usage, and API calls
- **Activity Monitoring**: Detailed statistics on chat interactions and document management
- **Plan Information**: Current subscription details and billing cycle information
- **Storage Analytics**: Visual representation of storage usage against plan limits
- **Account History**: Timeline of account creation, upgrades, and major changes

### User Interface

#### Account Dashboard (`/dashboard/account`)
- **Four-Tab Interface**: Organized access to Profile, Security, Notifications, and Statistics
- **Real-time Updates**: Instant feedback for all configuration changes
- **Visual Feedback**: Success messages and loading indicators for all actions
- **Responsive Design**: Optimized for both desktop and mobile account management
- **Export Functionality**: Download account profile and data for backup purposes

#### Tab Interfaces

**Profile Tab**
- **Profile Picture Section**: Avatar upload with preview and crop functionality
- **Personal Information Card**: Complete profile form with validation
- **Contact Details**: Email, phone, and professional information fields
- **Bio Section**: Rich text area with character counter for personal introduction
- **Account Statistics**: Visual display of account age, storage, and plan details
- **Export Options**: Download profile data in various formats

**Security Tab**
- **Password Management**: Secure password change form with validation
- **Two-Factor Authentication**: 2FA setup with QR code and recovery codes
- **Login Activity**: Comprehensive session monitoring with device details
- **Recent Logins**: Chronological list of recent login attempts with location data
- **Session Management**: View and terminate active sessions across devices
- **Security Alerts**: Configuration for security notification preferences

**Notifications Tab**
- **Email Notifications**: Granular toggles for different email notification types
- **System Notifications**: Control over system alerts and maintenance notices
- **Communication Preferences**: Settings for marketing and promotional emails
- **Frequency Controls**: Options for daily, weekly, or immediate notifications
- **Privacy Settings**: Control over data sharing and communication preferences

**Statistics Tab**
- **Usage Metrics Dashboard**: Visual representation of account usage statistics
- **Storage Analytics**: Progress bars and charts for storage consumption
- **Plan Information**: Current subscription details and upgrade options
- **Activity History**: Timeline of account usage and major events
- **Export Options**: Download statistics and activity reports

### Security Implementation

#### Password Security
- **Secure Password Storage**: Hashed passwords with salt for maximum security
- **Password Strength Validation**: Real-time feedback on password complexity
- **Password Change Workflow**: Multi-step verification for password updates
- **Password History**: Prevention of password reuse with history tracking

#### Two-Factor Authentication
- **TOTP Support**: Time-based One-Time Password authentication
- **Authenticator App Integration**: Support for Google Authenticator and similar apps
- **Backup Codes**: Emergency recovery codes for account access
- **Setup Process**: Step-by-step guided setup with QR code generation
- **Fallback Options**: Multiple recovery methods for account access

#### Session Management
- **Secure Session Tokens**: JWT-based session management with expiration
- **Device Tracking**: Monitoring of login devices and locations
- **Session Expiration**: Automatic session timeout and renewal
- **Multi-Device Support**: Simultaneous login across multiple devices
- **Session Revocation**: Immediate logout capability for security concerns

### Data Management

#### Profile Data
- **Structured Storage**: Organized storage for personal and professional information
- **Data Validation**: Real-time validation for all profile fields
- **Privacy Controls**: Granular control over data sharing and visibility
- **Data Export**: Complete profile data export in standard formats
- **Data Retention**: Configurable data retention policies and cleanup

#### Notification Data
- **Preference Storage**: Secure storage of user notification preferences
- **Frequency Control**: Configurable notification frequency and timing
- **Channel Management**: Control over email, SMS, and in-app notifications
- **Unsubscribe Options**: Easy opt-out for all notification types
- **Compliance**: GDPR and privacy regulation compliance

### Integration Points

#### Authentication System
- **Single Sign-On**: Integration with external authentication providers
- **OAuth Support**: Social login integration with major platforms
- **User Management**: Integration with user management and admin systems
- **Role-Based Access**: Support for different user roles and permissions
- **API Authentication**: Secure API access with token-based authentication

#### Notification System
- **Email Service Integration**: Connection with email service providers
- **SMS Gateway**: SMS notification delivery through trusted providers
- **Push Notifications**: Mobile app push notification integration
- **Webhook Support**: Custom webhook notifications for external systems
- **Template Management**: Dynamic notification templates with personalization

### Technical Implementation

#### State Management
- **React State Management**: Efficient state management for form data and UI state
- **Form Validation**: Real-time validation with error handling
- **Optimistic Updates**: Immediate UI feedback with background synchronization
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Persistence**: Automatic saving of user preferences and settings

#### UI Components
- **Form Components**: Custom form components with validation and styling
- **Modal Dialogs**: Confirmation dialogs for critical actions
- **Progress Indicators**: Visual feedback for ongoing operations
- **Charts and Graphs**: Data visualization for statistics and usage metrics
- **Responsive Layout**: Mobile-first responsive design principles

#### API Integration
- **RESTful APIs**: Standard REST API endpoints for account operations
- **GraphQL Support**: Efficient data fetching with GraphQL queries
- **WebSocket Integration**: Real-time updates for security notifications
- **Rate Limiting**: API protection with rate limiting and throttling
- **Authentication**: Secure API authentication with token-based access

### Monitoring and Analytics

#### Security Monitoring
- **Login Tracking**: Comprehensive monitoring of login attempts and patterns
- **Anomaly Detection**: Automatic detection of suspicious activities
- **Security Alerts**: Real-time notifications for security events
- **Audit Logs**: Complete audit trail of account changes and activities
- **Compliance Reporting**: Automated compliance reporting and documentation

#### Usage Analytics
- **User Behavior**: Tracking of user interaction patterns and preferences
- **Feature Usage**: Analytics on feature adoption and usage frequency
- **Performance Metrics**: Monitoring of system performance and user experience
- **Conversion Tracking**: Analysis of user journey and conversion metrics
- **Custom Reports**: Configurable reports for different stakeholders

### Loading States
The account interface includes comprehensive loading states:

#### Account Loading (`src/app/dashboard/account/loading.tsx`)
- Skeleton UI for all four tab interfaces
- Profile picture and personal information placeholders
- Security settings loading states with form elements
- Notification preferences skeleton with toggle switches
- Statistics dashboard loading with charts and metrics
- Save button loading animations

### Best Practices

#### Security Guidelines
- **Strong Passwords**: Enforce strong password requirements and regular updates
- **Multi-Factor Authentication**: Recommend 2FA for all user accounts
- **Regular Security Reviews**: Periodic security audits and vulnerability assessments
- **Employee Training**: Security awareness training for all account users
- **Incident Response**: Clear procedures for handling security incidents

#### User Experience
- **Intuitive Navigation**: Clear organization of account settings and features
- **Progressive Disclosure**: Advanced settings hidden behind appropriate UI elements
- **Contextual Help**: In-app help and documentation for complex features
- **Feedback Mechanisms**: Easy ways for users to provide feedback and report issues
- **Accessibility**: WCAG compliance for users with disabilities

#### Data Protection
- **Data Minimization**: Collect only necessary user data
- **Encryption**: End-to-end encryption for sensitive data transmission
- **Access Control**: Role-based access control for account data
- **Regular Backups**: Automated backup of account data and configurations
- **Disaster Recovery**: Plans for data recovery and system restoration

## Help and Support System

### Overview
The Help system provides comprehensive FAQ-style documentation and support resources, allowing users to quickly find answers to common questions and access assistance when needed. The system features an intuitive search interface, organized FAQ categories, and multiple support contact options.

### Key Features

#### FAQ Management
- **Categorized Questions**: Six main categories covering all aspects of the application
- **Popular Questions**: Highlighted frequently asked questions for quick access
- **Search Functionality**: Real-time search across questions and answers
- **Expandable Interface**: Collapsible categories and questions for easy navigation
- **Popular Content Indicators**: Star icons for popular and frequently accessed questions

#### Search System
- **Real-time Filtering**: Instant search results as users type
- **Comprehensive Search**: Searches both questions and detailed answers
- **Category Filtering**: Automatically filters categories based on search matches
- **Search Highlighting**: Visual indication of matching content
- **Empty State Handling**: Helpful messages when no results are found

#### Support Resources
- **Quick Links**: Direct access to video tutorials, documentation, community forums, and support contact
- **Multiple Contact Methods**: Email, phone, and live chat support options
- **Support Hours**: Clear indication of availability and response times
- **Community Access**: Links to user community and discussion forums

### FAQ Categories

#### Getting Started
- **What is Attallah**: Overview of the AI assistant and its capabilities
- **How to Start**: Step-by-step guidance for first-time users
- **First Message**: Tips for initiating conversations with the AI
- **Supported Languages**: Information about bilingual support (Indonesian and English)

#### Features
- **Persona Settings**: AI personality and communication style customization
- **Knowledge Base**: Document management and RAG system information
- **Data Sync**: RAG synchronization and data source management
- **Analytics**: Usage statistics and performance monitoring

#### Account Management
- **Password Management**: Secure password change and recovery procedures
- **Two-Factor Authentication**: 2FA setup and management instructions
- **Profile Updates**: Personal information and account details management
- **Account Deletion**: Process and implications of account closure

#### Billing and Subscription
- **Pricing Plans**: Detailed comparison of available subscription tiers
- **Payment Methods**: Accepted payment options and billing procedures
- **Invoice Management**: Download and management of billing invoices
- **Refund Policy**: Information about refund requests and processing

#### Integrations
- **WhatsApp Integration**: Setup and configuration for WhatsApp connectivity
- **WordPress Plugin**: Installation and usage of WordPress integration
- **Embed Chat**: Website chat widget implementation
- **API Access**: Developer API documentation and access procedures

#### Technical Support
- **Browser Support**: Compatible browsers and recommended versions
- **Mobile App**: Mobile application availability and features
- **Data Security**: Information about data protection and privacy
- **Troubleshooting**: Common issues and resolution steps

### User Interface

#### Help Dashboard (`/dashboard/help`)
- **Search Interface**: Prominent search bar with real-time filtering
- **Popular Questions Sidebar**: Top 5 frequently accessed questions
- **FAQ Categories**: Main content area with organized question categories
- **Quick Links Grid**: Easy access to additional resources
- **Contact Support Section**: Multiple contact methods with availability information

#### Interactive Elements
- **Expandable Categories**: Click-to-expand FAQ categories with smooth animations
- **Question Toggle**: Individual question expansion for answer viewing
- **Search Bar**: Real-time search with visual feedback
- **Quick Link Cards**: Hover effects and visual indicators for resource links
- **Contact Cards**: Professional layout for support contact information

#### Visual Design
- **Color Coding**: Each category has distinctive colors and icons
- **Popular Indicators**: Star icons for popular questions
- **Progressive Disclosure**: Content revealed on-demand for better UX
- **Responsive Layout**: Optimized for desktop and mobile viewing
- **Loading States**: Skeleton UI for better perceived performance

### Search Implementation

#### Search Algorithm
- **Text Matching**: Case-insensitive search across question and answer text
- **Real-time Filtering**: Instant results as user types in search box
- **Category Filtering**: Automatic category hiding/showing based on content matches
- **Performance Optimization**: Efficient filtering for large FAQ databases

#### Search UI Components
- **Search Input**: Prominently placed search bar with icon
- **Search Results**: Dynamic updating of FAQ content based on search
- **Clear Functionality**: Easy search term clearing and reset
- **Empty States**: Helpful messages when no search results found

### Contact Support Integration

#### Support Channels
- **Email Support**: support@attallah.id with response time information
- **Phone Support**: +62 21 1234 5678 with business hours
- **Live Chat**: In-app chat support with availability indicators
- **Community Forum**: User-to-user support and discussions

#### Support Information
- **Availability**: Clear indication of support hours and response times
- **Response Time**: Expected timeframes for different support channels
- **Language Support**: Information about multi-language support availability
- **Emergency Support**: Procedures for urgent support needs

### Content Management

#### FAQ Organization
- **Hierarchical Structure**: Categories contain related questions and answers
- **Popular Content Tracking**: Automatic identification of frequently accessed content
- **Regular Updates**: Systematic review and update of FAQ content
- **User Feedback**: Mechanisms for users to rate FAQ helpfulness

#### Translation Support
- **Bilingual Content**: Complete Indonesian and English translations
- **Contextual Translation**: Culturally appropriate translations for technical terms
- **Consistent Terminology**: Standardized terminology across all languages
- **Dynamic Switching**: Language switching preserves search state and navigation

### Technical Implementation

#### Component Architecture
- **React State Management**: Efficient state for search, expanded categories, and questions
- **Dynamic Rendering**: Conditional rendering based on search and expansion state
- **Performance Optimization**: Efficient filtering and rendering of FAQ content
- **Responsive Design**: Mobile-first responsive layout principles

#### Data Structure
- **Categorized FAQ**: Structured data organization with categories and questions
- **Search Index**: Optimized data structure for fast search operations
- **Popular Tracking**: Analytics integration for popular question identification
- **Translation Keys**: Comprehensive internationalization support

### Integration Points

#### Dashboard Navigation
- **Sidebar Integration**: Help page accessible from main dashboard navigation
- **Breadcrumb Support**: Clear navigation path indication
- **Mobile Navigation**: Responsive sidebar and mobile-friendly navigation
- **Quick Access**: Direct links to help from relevant dashboard sections

#### Analytics Integration
- **Usage Tracking**: Monitoring of help page usage and popular content
- **Search Analytics**: Tracking of search terms and result effectiveness
- **User Feedback**: Collection of user satisfaction and helpfulness ratings
- **Support Metrics**: Monitoring of support channel usage and effectiveness

### Loading States
The help interface includes comprehensive loading states:

#### Help Loading (`src/app/dashboard/help/loading.tsx`)
- Skeleton UI for search bar and quick links grid
- Popular questions sidebar loading placeholders
- FAQ categories with expandable section skeletons
- Contact support section loading states
- Consistent animation patterns with other dashboard pages

### User Experience Enhancements

#### Navigation Features
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML structure
- **Focus Management**: Logical tab order and focus indicators
- **Mobile Gestures**: Touch-friendly interactions for mobile devices

#### Performance Features
- **Instant Search**: Real-time search results without page refresh
- **Smooth Animations**: CSS transitions for expanding/collapsing content
- **Lazy Loading**: Efficient rendering of large FAQ datasets
- **Caching**: Browser caching for improved repeat visit performance

#### Accessibility Features
- **WCAG Compliance**: Full accessibility compliance for users with disabilities
- **High Contrast**: Proper color contrast ratios for readability
- **Resize Support**: Text resizing and zoom support
- **Alternative Text**: Descriptive alt text for all images and icons

### Monitoring and Maintenance

#### Content Quality
- **Regular Reviews**: Scheduled reviews of FAQ content accuracy and relevance
- **User Feedback Integration**: Incorporation of user suggestions and corrections
- **Analytics-Driven Updates**: Content updates based on usage patterns and search analytics
- **Expert Review**: Subject matter expert validation of technical content

#### Performance Monitoring
- **Search Performance**: Monitoring of search speed and result relevance
- **User Engagement**: Tracking of time spent on help page and content interaction
- **Support Metrics**: Analysis of support channel effectiveness and user satisfaction
- **Content Analytics**: Identification of popular content and knowledge gaps

### Best Practices

#### FAQ Content Guidelines
- **Clear Answers**: Provide clear, concise answers to common questions
- **Step-by-Step Instructions**: Include detailed steps for complex procedures
- **Visual Aids**: Use screenshots, diagrams, and videos when helpful
- **Regular Updates**: Keep content current with product changes and improvements

#### User Support Strategy
- **Multi-Channel Support**: Offer multiple support channels for different user preferences
- **Self-Service Focus**: Emphasize self-service through comprehensive FAQ content
- **Community Building**: Foster user community for peer support and knowledge sharing
- **Continuous Improvement**: Regularly improve support based on user feedback and metrics