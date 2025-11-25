# Supabase Integration Setup Guide

This guide explains how to configure and use Supabase as the backend database for your AI Chatbot application.

## 📋 Prerequisites

- A Supabase account ([supabase.com](https://supabase.com))
- Node.js and npm installed
- This chatbot application repository

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization (or create a new one)
4. Set up your project:
   - **Project Name**: `ai-chatbot` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the nearest region to your users
5. Click "Create new project"

### 2. Get Supabase Credentials

1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. You'll find:
   - **Project URL** (looks like `https://xxxxxxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key

### 3. Configure Environment Variables

Create or update your `.env.local` file with:

```bash
# Supabase Configuration (set SUPABASE_ACTIVE=true to enable)
SUPABASE_ACTIVE=true
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Setup Database Schema

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the SQL script

This will create all necessary tables:
- `users` - User accounts
- `user_sessions` - Authentication sessions
- `personas` - AI chatbot personalities
- `knowledge_categories` - Knowledge base categories
- `knowledge_documents` - Knowledge base documents
- `sync_sources` - Data synchronization sources
- `sync_history` - Synchronization history

## 🔧 Configuration Options

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SUPABASE_ACTIVE` | Yes | Enable/disable Supabase | `true` |
| `SUPABASE_URL` | Yes | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes | Public anon key | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key | `eyJhbGciOiJIUzI1NiIs...` |

### Switching Between Auth Systems

#### To Enable Supabase:
```bash
# In .env.local
SUPABASE_ACTIVE=true
```

#### To Disable Supabase (use local auth):
```bash
# In .env.local
SUPABASE_ACTIVE=false
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Personas Table
```sql
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  welcome_message TEXT,
  selected_profile VARCHAR(50),
  -- ... AI personality fields
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Authentication Flow

### With Supabase Enabled (`SUPABASE_ACTIVE=true`):

1. **Registration**: Creates user in Supabase Auth + users table
2. **Login**: Validates with Supabase Auth + creates JWT token
3. **Session Management**: Stores sessions in user_sessions table
4. **User Data**: Stored in users table with custom fields

### With Local Auth (`SUPABASE_ACTIVE=false`):

1. **Registration**: Not available (mock credentials only)
2. **Login**: Validates against hardcoded credentials
3. **Session Management**: JWT tokens only
4. **User Data**: Mock data

## 🚦 API Response Changes

### Login Response with Supabase:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user",
      "isActive": true
    },
    "token": "jwt-token-here",
    "authProvider": "supabase"
  }
}
```

### Auth Me Response with Supabase:
```json
{
  "success": true,
  "authenticated": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user",
      "isActive": true
    },
    "authProvider": "supabase"
  }
}
```

## 🔍 Testing the Integration

### 1. Test Local Auth (Current):
```bash
# Ensure SUPABASE_ACTIVE=false
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@admin.com", "password": "admin"}'
```

### 2. Test Supabase Auth:
```bash
# Ensure SUPABASE_ACTIVE=true
# First create a user via Supabase Dashboard or register API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "password": "your-password"}'
```

### 3. Check Auth Provider:
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛠️ Development Tools

### Supabase CLI (Optional)
For advanced development, you can use the Supabase CLI:

```bash
# Install
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

### Database Functions

The schema includes several useful database functions:

- `cleanup_expired_sessions()` - Remove expired sessions
- `get_user_by_email(email)` - Get user by email
- `create_user_session()` - Create user session
- `validate_session_token(token)` - Validate session token
- `invalidate_user_session(token)` - Invalidate specific session
- `invalidate_all_user_sessions(userId)` - Invalidate all user sessions

## 📝 Monitoring and Logging

The application logs authentication events with provider information:

```
✅ Login successful for: user@example.com (Provider: supabase)
✅ Logout successful for: user@example.com (Provider: supabase)
```

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Row Level Security**: Supabase tables have RLS policies configured
3. **JWT Tokens**: Always validate tokens on the server side
4. **Session Expiration**: Sessions expire after 7 days by default
5. **Password Security**: Use strong passwords in production

## 🔧 Customization

### Adding Custom Fields to Users Table

1. Update the schema in Supabase SQL Editor
2. Update the TypeScript types in `src/lib/supabase.ts`
3. Update the auth functions in `src/lib/auth-supabase.ts`

### Custom Authentication Flow

You can extend the auth system by:
1. Adding new providers (OAuth, SAML, etc.)
2. Implementing custom session management
3. Adding multi-factor authentication
4. Integrating with existing user databases

## 🐛 Troubleshooting

### Common Issues:

1. **"Supabase is not enabled"**
   - Check that `SUPABASE_ACTIVE=true`
   - Verify Supabase URL and keys are correct

2. **"Database error"**
   - Ensure schema.sql was executed
   - Check table permissions in Supabase

3. **"Auth error: Invalid login credentials"**
   - Verify user exists in Supabase Auth
   - Check email and password are correct

4. **"JWT verification failed"**
   - Check JWT_SECRET is set
   - Verify token hasn't expired

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=* npm run dev
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/with-nextjs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)