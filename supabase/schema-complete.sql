-- Complete Supabase Schema for AI Chatbot
-- Execute this in Supabase SQL Editor
-- Based on Prisma schema converted to PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Core Tables
-- ========================================

-- Users table (matches Prisma User model)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table (matches Prisma UserSession model)
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (matches Prisma Post model)
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  author_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- AI Persona Tables
-- ========================================

-- Personas table (matches Prisma Persona model)
CREATE TABLE IF NOT EXISTS personas (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  slug VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  welcome_message TEXT NOT NULL,
  selected_profile VARCHAR(100) DEFAULT 'islamic_educator',

  -- Text Style Settings
  formality VARCHAR(50) DEFAULT 'professional',
  empathy VARCHAR(50) DEFAULT 'high',
  enthusiasm VARCHAR(50) DEFAULT 'medium',
  humor VARCHAR(50) DEFAULT 'low',
  verbosity VARCHAR(50) DEFAULT 'medium',

  -- Behavior Settings
  knowledge_domain VARCHAR(100) DEFAULT 'islamic_education',
  language_style VARCHAR(50) DEFAULT 'friendly',
  cultural_context VARCHAR(50) DEFAULT 'indonesian',
  expertise VARCHAR(50) DEFAULT 'general',
  personality VARCHAR(50) DEFAULT 'helpful',

  -- Response Settings
  max_length INTEGER DEFAULT 500,
  min_response_time REAL DEFAULT 1.0,
  max_response_time REAL DEFAULT 5.0,
  use_emojis BOOLEAN DEFAULT true,
  include_greeting BOOLEAN DEFAULT true,
  ask_follow_up BOOLEAN DEFAULT true,

  -- AI Settings
  system_prompt TEXT DEFAULT '',
  custom_instructions TEXT DEFAULT '',

  -- Metadata
  is_active BOOLEAN DEFAULT false,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- Chat System Tables
-- ========================================

-- Chat messages table (matches Prisma ChatMessage model)
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  session_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  persona_id TEXT REFERENCES personas(id) ON DELETE SET NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  source VARCHAR(50) DEFAULT 'web',
  whatsapp_id TEXT,

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- WhatsApp Integration Tables
-- ========================================

-- WhatsApp integrations table (matches Prisma WhatsAppIntegration model)
CREATE TABLE IF NOT EXISTS whatsapp_integrations (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) UNIQUE NOT NULL,
  business_id TEXT,
  access_token TEXT,
  api_key TEXT,
  webhook_secret TEXT,
  status VARCHAR(50) DEFAULT 'disconnected',
  last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Configuration
  auto_respond BOOLEAN DEFAULT true,
  welcome_message TEXT DEFAULT '',
  default_message TEXT DEFAULT '',

  -- Statistics
  total_messages INTEGER DEFAULT 0,
  total_media INTEGER DEFAULT 0,
  active_chats INTEGER DEFAULT 0,

  -- Metadata
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp contacts table (matches Prisma WhatsAppContact model)
CREATE TABLE IF NOT EXISTS whatsapp_contacts (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  integration_id TEXT NOT NULL REFERENCES whatsapp_integrations(id) ON DELETE CASCADE,
  phone_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  profile_picture TEXT,
  is_blocked BOOLEAN DEFAULT false,
  is_business BOOLEAN DEFAULT false,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp media table (matches Prisma WhatsAppMedia model)
CREATE TABLE IF NOT EXISTS whatsapp_media (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  integration_id TEXT NOT NULL REFERENCES whatsapp_integrations(id) ON DELETE CASCADE,
  message_id TEXT NOT NULL,
  contact_id TEXT REFERENCES whatsapp_contacts(id) ON DELETE SET NULL,
  media_type VARCHAR(50) NOT NULL,
  media_url TEXT NOT NULL,
  original_name VARCHAR(255),
  mime_type VARCHAR(100),
  file_size INTEGER,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- Knowledge Management Tables
-- ========================================

-- Knowledge categories table (matches Prisma KnowledgeCategory model)
CREATE TABLE IF NOT EXISTS knowledge_categories (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT '#6B7280',
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge documents table (matches Prisma KnowledgeDocument model)
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  category_id TEXT REFERENCES knowledge_categories(id) ON DELETE SET NULL,
  author VARCHAR(255),
  source VARCHAR(100),
  file_path TEXT,
  file_name VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  format VARCHAR(50),
  status VARCHAR(50) DEFAULT 'draft',
  is_indexed BOOLEAN DEFAULT false,
  embedding_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,

  -- RAG Integration
  rag_document_id TEXT,
  last_indexed_at TIMESTAMP WITH TIME ZONE,

  -- Search and SEO
  tags TEXT,
  keywords TEXT,
  priority INTEGER DEFAULT 0,

  -- Metadata
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Document uploads table (matches Prisma DocumentUpload model)
CREATE TABLE IF NOT EXISTS document_uploads (
  id TEXT PRIMARY KEY DEFAULT (substr(gen_random_uuid()::text, 1, 25)),
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_path TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'uploading',
  error_message TEXT,
  processing_log TEXT,

  -- Processing Configuration
  auto_index BOOLEAN DEFAULT true,
  category_id TEXT REFERENCES knowledge_categories(id) ON DELETE SET NULL,
  extract_text BOOLEAN DEFAULT true,

  -- Upload Metadata
  upload_source VARCHAR(50) DEFAULT 'manual',
  uploader_ip INET,
  user_agent TEXT,

  -- Metadata
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  document_id TEXT REFERENCES knowledge_documents(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- Indexes
-- ========================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

-- Personas indexes
CREATE INDEX IF NOT EXISTS idx_personas_user_id ON personas(created_by);
CREATE INDEX IF NOT EXISTS idx_personas_slug ON personas(slug);
CREATE INDEX IF NOT EXISTS idx_personas_is_active ON personas(is_active);
CREATE INDEX IF NOT EXISTS idx_personas_selected_profile ON personas(selected_profile);

-- Chat messages indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_persona_id ON chat_messages(persona_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_source ON chat_messages(source);
CREATE INDEX IF NOT EXISTS idx_chat_messages_whatsapp_id ON chat_messages(whatsapp_id);

-- WhatsApp integrations indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_integrations_user_id ON whatsapp_integrations(created_by);
CREATE INDEX IF NOT EXISTS idx_whatsapp_integrations_status ON whatsapp_integrations(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_integrations_phone_number ON whatsapp_integrations(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_integrations_last_sync_at ON whatsapp_integrations(last_sync_at);

-- WhatsApp contacts indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_integration_id ON whatsapp_contacts(integration_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_phone_number ON whatsapp_contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_is_blocked ON whatsapp_contacts(is_blocked);

-- WhatsApp media indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_media_integration_id ON whatsapp_media(integration_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_media_media_type ON whatsapp_media(media_type);

-- Knowledge categories indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_categories_is_active ON knowledge_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_knowledge_categories_sort_order ON knowledge_categories(sort_order);

-- Knowledge documents indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_category_id ON knowledge_documents(category_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_status ON knowledge_documents(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_is_indexed ON knowledge_documents(is_indexed);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_created_at ON knowledge_documents(created_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_published_at ON knowledge_documents(published_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_source ON knowledge_documents(source);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_priority ON knowledge_documents(priority);

-- Document uploads indexes
CREATE INDEX IF NOT EXISTS idx_document_uploads_status ON document_uploads(status);
CREATE INDEX IF NOT EXISTS idx_document_uploads_created_by ON document_uploads(created_by);
CREATE INDEX IF NOT EXISTS idx_document_uploads_created_at ON document_uploads(created_at);
CREATE INDEX IF NOT EXISTS idx_document_uploads_document_id ON document_uploads(document_id);

-- ========================================
-- Functions and Triggers
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_integrations_updated_at BEFORE UPDATE ON whatsapp_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_contacts_updated_at BEFORE UPDATE ON whatsapp_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_categories_updated_at BEFORE UPDATE ON knowledge_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_documents_updated_at BEFORE UPDATE ON knowledge_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_uploads_updated_at BEFORE UPDATE ON document_uploads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to validate session token (for authentication)
CREATE OR REPLACE FUNCTION validate_session_token(session_token VARCHAR(500))
RETURNS TABLE (
  user_id TEXT,
  email VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50),
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.email,
    u.name,
    u.role,
    u.is_active
  FROM user_sessions s
  JOIN users u ON s.user_id = u.id
  WHERE s.token = validate_session_token.session_token
    AND s.is_active = true
    AND s.expires_at > NOW()
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions
    WHERE expires_at < NOW() OR is_active = false;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Initial Data (Optional)
-- ========================================

-- Create default admin user (password: admin123 - change this in production!)
INSERT INTO users (id, email, name, role, is_active)
VALUES (
  'admin_user_id',
  'admin@admin.com',
  'Admin User',
  'admin',
  true
) ON CONFLICT (id) DO NOTHING;

-- Create default persona
INSERT INTO personas (id, name, welcome_message, selected_profile, is_active, created_by)
VALUES (
  'default_persona_id',
  'AI Assistant',
  'Hello! I am your AI assistant. How can I help you today?',
  'islamic_educator',
  true,
  'admin_user_id'
) ON CONFLICT (id) DO NOTHING;

-- Create default knowledge category
INSERT INTO knowledge_categories (id, name, description, color, icon, is_active, created_by)
VALUES (
  'general_category_id',
  'General',
  'General knowledge and information',
  '#6B7280',
  '📚',
  true,
  'admin_user_id'
) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- Security Notes
-- ========================================

-- This schema includes:
-- 1. Primary keys with UUID generation
-- 2. Foreign key constraints with proper CASCADE/SET NULL actions
-- 3. Indexes for performance optimization
-- 4. Triggers for automatic timestamp updates
-- 5. Functions for session validation and cleanup
-- 6. Basic admin user and default data (CHANGE PASSWORDS IN PRODUCTION!)

-- SECURITY REMINDERS:
-- 1. Change default admin password immediately after deployment
-- 2. Enable Row Level Security (RLS) on user data tables
-- 3. Use service role key only for server-side operations
-- 4. Regularly backup your database
-- 5. Monitor for unusual activity