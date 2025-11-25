# CLAUDE-DOCUSAURUS.md

## 🚀 Quick Start Commands untuk Claude AI di Docusaurus Project

Copy-paste commands ini saat bekerja dengan Claude AI di project Docusaurus 7Connect.

---

## 📝 PROMPT TEMPLATES (Copy-Paste Ready)

### Prompt 1: Inisialisasi Dokumentasi Awal
```
Claude, saya sedang membuat dokumentasi Docusaurus untuk aplikasi chatbot 7Connect. Tolong buatkan file dokumentasi awal berdasarkan informasi berikut:

**Project Context:**
- Nama aplikasi: 7Connect Chatbot
- Deskripsi: AI Assistant untuk edukasi Islam dengan RAG capabilities
- Location: /home/asif/Develop/chatbot (source code tersedia)
- Tech stack: Next.js 14, TypeScript, Tailwind CSS, Prisma, SQLite
- Fitur utama: Chat interface, Dashboard analytics, RAG system, Multi-language (ID/EN), Billing, Integrations (WhatsApp, WordPress)

**Buatkan file berikut:**
1. docs/intro.md - Pengenalan lengkap dengan Islamic touch
2. docs/getting-started/installation.md - Panduan instalasi step-by-step
3. docs/getting-started/quick-start.md - Quick start guide 5 menit
4. docs/getting-started/configuration.md - Konfigurasi environment variables

**Requirements:**
- Gunakan frontmatter Docusaurus yang proper
- Include callout boxes untuk tips penting
- Tambahkan code examples untuk commands
- Gunakan Islamic-themed green color mentions
- Support bilingual (ID/EN) dengan Indonesian as default
- Include mermaid diagrams untuk architecture
- Add tabs untuk multiple installation options

**Format:** Markdown Docusaurus dengan:
- Proper heading hierarchy
- Code blocks dengan syntax highlighting
- Emoji untuk visual enhancement
- Tables untuk feature comparison
- Internal links untuk navigation
```

### Prompt 2: Dokumentasi Chat Interface
```
Claude, tolong buatkan dokumentasi lengkap untuk Chat Interface 7Connect:

**Source Analysis:**
- Baca file: /home/asif/Develop/chatbot/src/components/chat-interface.tsx
- Baca file: /home/asif/Develop/chatbot/src/app/api/chat/route.ts
- Baca file: /home/asif/Develop/chatbot/src/lib/i18n.ts

**Buatkan docs/user-guide/chat-interface.md dengan:**

**Structure:**
1. **Overview** - Deskripsi chat interface dan capabilities
2. **Features** - Daftar fitur lengkap dengan penjelasan
3. **Usage Guide** - Step-by-step penggunaan
4. **Messages & Formatting** - Markdown support, character limits
5. **Language Settings** - Switch Indonesian/English
6. **Tips & Best Practices** - Cara efektif menggunakan chatbot
7. **Troubleshooting** - Common issues dan solutions

**Visual Elements:**
- Screenshots placeholder: ![Chat Interface](/img/screenshots/chat-interface.png)
- Feature comparison table
- Step-by-step dengan numbered lists
- Code examples untuk API calls
- Mermaid diagram untuk message flow

**Tone:** Friendly, instructional dengan Islamic values
**Target Audience:** End users (non-technical)
**Language:** Indonesian dengan technical terms dalam English
```

### Prompt 3: Dokumentasi Dashboard Analytics
```
Claude, buatkan dokumentasi untuk Dashboard Analytics 7Connect:

**Source Analysis:**
- Baca file: /home/asif/Develop/chatbot/src/app/dashboard/page.tsx
- Baca file: /home/asif/Develop/chatbot/src/components/dashboard/sidebar.tsx
- Baca file: /home/asif/Develop/chatbot/src/components/dashboard/stats-cards.tsx
- Baca file: /home/asif/Develop/chatbot/src/components/dashboard/charts.tsx

**Buatkan docs/user-guide/dashboard.md dengan:**

**Sections:**
1. **Dashboard Overview** - Introduction ke dashboard
2. **Navigation** - Sidebar structure dan menu items
3. **Main Dashboard** - Key metrics dan overview
4. **Analytics Section** - Chat metrics, user engagement
5. **Real-time Updates** - Live statistics dan refresh
6. **Language Switcher** - ID/EN language toggle
7. **Mobile Responsiveness** - Mobile view navigation

**Visual Documentation:**
- Dashboard layout diagram
- Sidebar navigation structure
- Statistics cards explanation
- Charts interpretation guide
- Mobile vs desktop comparison

**Interactive Elements:**
- Tabs untuk different dashboard sections
- Callout boxes untuk important metrics
- Code examples untuk API endpoints
- Table dengan metric definitions

**Include:**
- How to read analytics data
- Export functionality
- Date range filters
- Real-time vs historical data
```

### Prompt 4: Dokumentasi RAG & Knowledge Base
```
Claude, buatkan dokumentasi teknis untuk RAG System dan Knowledge Base 7Connect:

**Source Analysis (jika ada):**
- Cari file terkait RAG di /home/asif/Develop/chatbot/
- Cari knowledge base related files
- Review database schema di prisma/schema.prisma

**Buatkan 2 file:**

**docs/user-guide/knowledge-base.md:**
1. **What is RAG?** - Penjelasan sederhana Retrieval-Augmented Generation
2. **Knowledge Base Overview** - Document management system
3. **Uploading Documents** - Cara upload dan manage dokumen
4. **Document Processing** - Automatic indexing dan embedding
5. **Search & Retrieval** - Semantic search capabilities
6. **Categories & Tags** - Organisasi dokumen
7. **Performance Metrics** - Usage statistics

**docs/technical/rag-system.md:**
1. **Architecture Overview** - RAG system architecture
2. **Vector Embeddings** - How embeddings work
3. **Document Processing Pipeline** - Text processing workflow
4. **Search Algorithms** - Semantic search implementation
5. **AI Response Enhancement** - Context injection
6. **Performance Optimization** - Caching dan indexing
7. **API Integration** - Technical implementation

**Technical Elements:**
- Mermaid diagrams untuk RAG pipeline
- API endpoint documentation
- Database schema explanation
- Configuration examples
- Performance benchmarks

**Include Both Indonesian & English sections**
```

### Prompt 5: Dokumentasi Persona Management
```
Claude, buatkan dokumentasi untuk Persona Management 7Connect:

**Source Analysis:**
- Baca file: /home/asif/Develop/chatbot/src/app/dashboard/persona/page.tsx
- Cari persona-related files dan components

**Buatkan docs/user-guide/persona-management.md dengan:**

**Content Structure:**
1. **Persona Overview** - Apa itu persona dan mengapa penting
2. **Predefined Personas** - Default personas yang tersedia
3. **Custom Persona Creation** - Membuat persona baru
4. **Persona Settings** - Configuration options
5. **Response Style** - Tone, language, Islamic values
6. **Knowledge Integration** - Persona dengan knowledge base
7. **Testing & Validation** - Test persona responses

**Key Features to Document:**
- Personality traits configuration
- Response patterns
- Islamic content integration
- Language preferences
- Audience targeting
- Performance metrics

**Visual Elements:**
- Persona creation wizard steps
- Settings interface screenshots
- Response comparison examples
- Configuration flow diagrams

**Practical Examples:**
- Sample persona configurations
- Before/after response comparisons
- Best practice guidelines
- Common use cases
```

### Prompt 6: Dokumentasi Billing & Subscription
```
Claude, buatkan dokumentasi lengkap untuk Billing Management 7Connect:

**Source Analysis:**
- Baca file: /home/asif/Develop/chatbot/src/app/dashboard/billing/page.tsx
- Cari billing-related API routes

**Buatkan docs/admin/billing.md dengan:**

**Sections:**
1. **Subscription Plans** - Overview pricing tiers
2. **Plan Features** - Detailed feature comparison
3. **Billing Dashboard** - Navigation dan overview
4. **Usage Tracking** - Monitoring consumption
5. **Payment Methods** - Adding dan managing payment
6. **Billing History** - Invoices dan payment records
7. **Subscription Management** - Upgrade/downgrade/cancel

**Key Features:**
- Real-time usage metrics
- Token usage tracking
- Knowledge base storage
- Team member limits
- API rate limits
- Support access levels

**Visual Elements:**
- Pricing comparison table
- Usage metrics dashboard
- Billing workflow diagram
- Payment method interface

**Include:**
- Step-by-step subscription setup
- Payment process walkthrough
- Usage limit explanations
- Invoice management
- Support contact information
```

### Prompt 7: Dokumentasi Integrations
```
Claude, buatkan dokumentasi untuk Integrations 7Connect:

**Source Analysis:**
- Cari integration-related files di /home/asif/Develop/chatbot/
- Review WhatsApp, WordPress integration files

**Buatkan docs/admin/integrations.md dengan:**

**Integration Coverage:**
1. **Integration Overview** - Available integrations
2. **WhatsApp Integration** - Setup dan configuration
3. **WordPress Plugin** - Website integration
4. **Embed Chat Widget** - Custom website chat
5. **Instagram Integration** - Social media integration (Coming Soon)
6. **Facebook Integration** - Social media integration (Coming Soon)

**For Each Integration:**
- Requirements dan prerequisites
- Step-by-step setup guide
- Configuration options
- API key management
- Testing procedures
- Troubleshooting common issues

**Technical Documentation:**
- Webhook configurations
- API authentication
- Data synchronization
- Rate limiting
- Error handling

**Visual Elements:**
- Integration workflow diagrams
- Setup screenshots placeholder
- Configuration examples
- Testing checklists
```

### Prompt 8: Technical Architecture Documentation
```
Claude, buatkan dokumentasi teknis lengkap untuk 7Connect Architecture:

**Source Analysis:**
- Baca: /home/asif/Develop/chatbot/package.json
- Baca: /home/asif/Develop/chatbot/next.config.ts
- Baca: /home/asif/Develop/chatbot/prisma/schema.prisma
- Baca: /home/asif/Develop/chatbot/server.ts
- Review struktur folder lengkap

**Buatkan docs/technical/architecture.md dengan:**

**Architecture Sections:**
1. **System Overview** - High-level architecture
2. **Tech Stack Deep Dive** - Detailed technology breakdown
3. **Next.js Architecture** - App router, API routes, middleware
4. **Database Design** - Prisma schema dan relationships
5. **AI Services Integration** - ZAI API dan Ollama
6. **Real-time Communication** - Socket.IO implementation
7. **RAG Pipeline** - Document processing dan vector search
8. **Security Architecture** - Authentication, authorization, data protection

**Technical Diagrams:**
- System architecture mermaid diagram
- Database relationship diagram
- API request flow diagram
- RAG processing pipeline
- Microservices architecture

**Code Examples:**
- API route implementations
- Database models
- Middleware configurations
- Environment variable examples
- Docker configuration

**Performance & Scalability:**
- Caching strategies
- Database optimization
- CDN configuration
- Load balancing considerations
- Monitoring setup
```

### Prompt 9: API Reference Documentation
```
Claude, buatkan dokumentasi API Reference lengkap untuk 7Connect:

**Source Analysis:**
- Baca semua API route files di /home/asif/Develop/chatbot/src/app/api/
- Extract endpoint definitions, parameters, responses

**Buatkan docs/technical/api-reference.md dengan:**

**API Documentation Structure:**
1. **Authentication** - API keys, tokens, security
2. **Base URL & Headers** - Endpoint configuration
3. **Chat API** - /api/chat endpoint
4. **Health Check** - /api/health endpoint
5. **WebSocket Events** - Socket.IO events
6. **Error Handling** - Error codes dan responses
7. **Rate Limiting** - API usage limits

**For Each Endpoint:**
- HTTP method dan URL
- Request parameters (query, body, headers)
- Request body schema dengan examples
- Response schema dengan examples
- Error responses
- Code examples (JavaScript, Python, curl)

**OpenAPI Specification:**
- Generate OpenAPI spec
- Include in documentation
- API testing examples
- Postman collection export

**Authentication Examples:**
```javascript
// Example API calls
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    message: 'Your message here'
  })
});
```

**Rate Limiting Info:**
- Requests per minute
- Token limits
- Response headers for rate limit info
```

### Prompt 10: Deployment Documentation
```
Claude, buatkan dokumentasi deployment lengkap untuk 7Connect:

**Source Analysis:**
- Baca: /home/asif/Develop/chatbot/docker-compose.yml
- Baca: /home/asif/Develop/chatbot/Dockerfile (jika ada)
- Review environment configuration files

**Buatkan docs/technical/deployment.md dengan:**

**Deployment Options:**
1. **Local Development** - Setup development environment
2. **Docker Deployment** - Container-based deployment
3. **Cloud Deployment** - AWS, Google Cloud, Azure
4. **VPS Deployment** - Virtual private server setup
5. **Platform as a Service** - Vercel, Netlify, Railway

**For Each Method:**
- Requirements dan prerequisites
- Step-by-step deployment guide
- Environment configuration
- Database setup
- SSL/TLS configuration
- Monitoring dan logging

**Docker Deployment Focus:**
```yaml
# Docker Compose Configuration
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - redis
      - postgres

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: chatbot
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

**Production Checklist:**
- Environment variables configuration
- Database migrations
- SSL certificates
- Backup strategies
- Monitoring setup
- Performance optimization
- Security hardening

**Maintenance Procedures:**
- Update processes
- Backup schedules
- Monitoring alerts
- Log rotation
- Security updates
```

---

## 🔧 COMMAND TEMPLATES (Copy-Paste Ready)

### Setup Docusaurus Project
```
Claude, tolong setup Docusaurus project untuk dokumentasi 7Connect:

**Steps:**
1. Initialize Docusaurus dengan template classic
2. Setup structure folder sesuai guide di DOCUSAURUS.md
3. Konfigurasi docusaurus.config.js untuk 7Connect theme
4. Setup sidebars.js dengan proper navigation
5. Create custom CSS dengan Islamic green theme
6. Setup i18n untuk Indonesian (default) dan English

**Configuration Requirements:**
- Base URL: https://docs.7connect.com (placeholder)
- Theme: Islamic green (#059669 primary color)
- Navbar: Documentation, Blog, GitHub, Language Switcher
- Footer: Links to documentation, community, more resources
- Code blocks: Support TypeScript, JavaScript, Bash, JSON

**Commands to Execute:**
```bash
npx @docusaurus/init@latest init 7connect-docs classic
cd 7connect-docs
npm install @docusaurus/plugin-content-docs
```

**Files to Create/Modify:**
- docusaurus.config.js
- sidebars.js
- src/css/custom.css
- docs/intro.md (empty template)
- docs/getting-started/installation.md (empty template)

**Folder Structure:**
- docs/
  - getting-started/
  - user-guide/
  - admin/
  - technical/
  - development/
- static/img/
- src/components/
- src/css/
```

### Update Existing Documentation
```
Claude, tolong update dokumentasi 7Connect berdasarkan perubahan terbaru:

**Changes to Document:**
[List perubahan yang terjadi pada aplikasi]

**Tasks:**
1. Analyze changes in source code
2. Update existing documentation files
3. Add new documentation if needed
4. Update screenshots/diagrams if necessary
5. Check and update all internal links
6. Ensure consistency across all documentation

**Review Checklist:**
- [ ] Technical accuracy of all information
- [ ] Consistency in terminology and tone
- [ ] All code examples are up-to-date
- [ ] Screenshots reflect current UI
- [ ] Internal links work correctly
- [ ] Bilingual consistency (ID/EN)
- [ ] SEO optimization maintained

**Files to Review:**
- docs/intro.md
- docs/getting-started/*.md
- docs/user-guide/*.md
- docs/admin/*.md
- docs/technical/*.md
- docusaurus.config.js
- sidebars.js

**Output Required:**
- List of files that need updates
- Specific changes needed for each file
- New files that need to be created
- Any breaking changes in documentation
```

### Documentation Review & Enhancement
```
Claude, tolong review dan enhance dokumentasi 7Connect:

**Review Areas:**
1. **Content Quality** - Accuracy, clarity, completeness
2. **Structure & Navigation** - Logical flow, easy to find information
3. **Visual Elements** - Screenshots, diagrams, code examples
4. **User Experience** - Readability, mobile-friendly, interactive elements
5. **SEO & Discovery** - Meta tags, search optimization
6. **Maintenance** - Easy to update, versioning

**Enhancement Tasks:**
- Add more practical examples and use cases
- Include troubleshooting sections for common issues
- Enhance visual elements with better diagrams and screenshots
- Improve mobile responsiveness
- Add interactive elements (tabs, collapsible sections)
- Include best practices and tips throughout
- Add more cross-references between related topics
- Improve search optimization with better keywords

**Specific Improvements Needed:**
[List improvement areas based on current documentation]

**Quality Standards:**
- All code examples tested and working
- Screenshots up-to-date with current UI
- All internal links functional
- Consistent formatting and style
- Proper frontmatter for all pages
- Mobile-responsive design
- Loading performance optimized
```

### Create Tutorial Documentation
```
Claude, buatkan tutorial documentation untuk 7Connect:

**Tutorial Topics to Create:**
1. **5-Minute Quick Start** - Setup dan first chat
2. **Complete Setup Guide** - From zero to production
3. **Advanced Configuration** - Custom settings dan optimizations
4. **Integration Tutorials** - WhatsApp, WordPress setup
5. **Custom Persona Creation** - Create branded AI assistant
6. **Knowledge Base Setup** - Document management and RAG
7. **Analytics & Monitoring** - Track performance and usage
8. **Troubleshooting Guide** - Common issues and solutions

**For Each Tutorial:**
- Learning objectives
- Prerequisites
- Step-by-step instructions
- Screenshots for each major step
- Code examples where applicable
- Expected outcomes
- Next steps and further learning
- Troubleshooting section

**Tutorial Format:**
```markdown
---
title: "Tutorial: Nama Tutorial"
description: "Deskripsi singkat tutorial"
sidebar_position: 1
tags: [tutorial, beginner, setup]
estimated_time: "15 menit"
difficulty: "beginner|intermediate|advanced"
---

# Tutorial: Nama Tutorial

## 🎯 Learning Objectives
- [ ] Objective 1
- [ ] Objective 2

## ⚡ Prerequisites
- Requirement 1
- Requirement 2

## 📝 Step-by-Step Guide
### Step 1: Title
[Detailed instructions with screenshots]

## ✅ Expected Outcome
[Description of what user should achieve]

## 🚀 Next Steps
[Further learning and resources]
```

**Visual Elements:**
- Progress indicators
- Step numbers
- Checkboxes for completion tracking
- Warning/info boxes for important notes
- Code snippets with copy buttons
- Screenshots with annotations
```

---

## 📋 QUICK COPY-PASTE CHEATSHEET

### Installation Commands
```bash
# Initialize Docusaurus
npx @docusaurus/init@latest init 7connect-docs classic

# Navigate to project
cd 7connect-docs

# Install additional dependencies
npm install @docusaurus/plugin-ideal-image
npm install @docusaurus/theme-live-codeblock
npm install mermaid

# Start development server
npm run start
```

### Build Commands
```bash
# Build for production
npm run build

# Serve production build locally
npm run serve

# Deploy to GitHub Pages
npm run deploy

# Clear build cache
rm -rf .docusaurus
```

### Common Configuration Snippets
```javascript
// Add to docusaurus.config.js
themes: ['@docusaurus/theme-live-codeblock'],
plugins: [
  [
    '@docusaurus/plugin-ideal-image',
    {
      quality: 70,
      max: 1030, // max resized image's size
      min: 640, // min resized image's size
      steps: 2, // the max number of images generated between min and max
    },
  ],
],
```

### Markdown Frontmatter Template
```markdown
---
title: "Page Title"
description: "Meta description for SEO"
sidebar_position: 1
sidebar_label: "Label in Sidebar"
tags: [tag1, tag2, tag3]
last_update:
  date: "2024-01-15"
  author: "Author Name"
estimated_time: "5 min read"
difficulty: "beginner"
---
```

### Component Templates
```jsx
// Custom Feature Card
import React from 'react';
import clsx from 'clsx';

export default function FeatureCard({title, description, icon}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="card">
        <div className="card__header">
          <h3>{icon} {title}</h3>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
```

### Custom CSS Snippets
```css
/* 7Connect Theme Variables */
:root {
  --ifm-color-primary: #059669;
  --ifm-color-primary-dark: #047857;
  --ifm-color-primary-light: #10b981;
  --ifm-font-family-base: 'Inter', system-ui, sans-serif;
}

/* Islamic Theme Elements */
.hero__title {
  background: linear-gradient(135deg, #059669, #10b981, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Custom Callouts */
.alert--info {
  border-left: 4px solid var(--ifm-color-primary);
}
```

---

## 🚨 IMPORTANT REMINDERS

### Before Using Prompts:
1. **Navigate to Docusaurus project directory**
2. **Read current documentation structure**
3. **Identify specific files to modify**
4. **Check existing content for consistency**

### After Claude Generates Content:
1. **Review all generated files**
2. **Test internal links and navigation**
3. **Check code examples for accuracy**
4. **Verify frontmatter completeness**
5. **Test mobile responsiveness**
6. **Build project to check for errors**

### Quality Checks:
- All screenshots uploaded to `/static/img/`
- Internal links use correct paths
- Code blocks have proper language tags
- Frontmatter contains all required fields
- Mobile-friendly layout maintained
- SEO meta tags optimized

Copy-paste prompt templates ini saat bekerja dengan Claude AI untuk efisiensi maksimal! 🎯