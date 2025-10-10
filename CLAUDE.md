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
- Modern corporate minimal dashboard design with sidebar navigation
- Chat metrics including total conversations, message counts, and user engagement
- Knowledge base statistics showing document count, embedding usage, and retrieval performance
- Token usage analytics for cost monitoring and optimization
- Real-time statistics updates with responsive design
- Bilingual support with language switcher in dashboard header
- Loading states with skeleton UI for better user experience during data fetching

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
│   │   ├── loading.tsx        # Dashboard loading skeleton
│   │   └── layout.tsx         # Dashboard layout with sidebar
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Home page with chat interface
│   └── globals.css            # Global styles and Tailwind imports
├── components/
│   ├── ui/                    # Shadcn UI component library
│   ├── chat-interface.tsx     # Main chat component with i18n
│   └── dashboard/             # Dashboard components
│       ├── sidebar.tsx        # Sidebar navigation with i18n
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

### Internationalization (i18n)
- Custom React context-based i18n system with Indonesian as default language
- Language dropdown in dashboard header for switching between Indonesian and English
- All UI components, chat interface, and dashboard support bilingual text
- Translation keys organized by component (dashboard, stats, charts, chat, etc.)
- Parameter interpolation for dynamic values (character counts, percentages, etc.)
- Language preference automatically saved and restored across sessions
- Computer-based terms remain in English across both languages for consistency

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