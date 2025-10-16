-- Supabase Schema for AI Chatbot Application
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom UUID function if needed
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-generate user_id if not provided
  IF NEW.id IS NULL OR NEW.id = '' THEN
    NEW.id := uuid_generate_v4();
  END IF;

  -- Set default values
  IF NEW.role IS NULL THEN NEW.role := 'user'; END IF;
  IF NEW.is_active IS NULL THEN NEW.is_active := true; END IF;
  IF NEW.created_at IS NULL THEN NEW.created_at := NOW(); END IF;
  IF NEW.updated_at IS NULL THEN NEW.updated_at := NOW(); END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create trigger for users
CREATE TRIGGER handle_new_user_trigger
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
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

-- Create trigger for user_sessions
CREATE TRIGGER handle_updated_at_user_sessions
BEFORE UPDATE ON user_sessions
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Personas table
CREATE TABLE IF NOT EXISTS personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  welcome_message TEXT,
  selected_profile VARCHAR(50),
  formality INTEGER CHECK (formality >= 1 AND formality <= 10),
  empathy INTEGER CHECK (empathy >= 1 AND empathy <= 10),
  enthusiasm INTEGER CHECK (enthusiasm >= 1 AND enthusiasm <= 10),
  humor INTEGER CHECK (humor >= 1 AND humor <= 10),
  verbosity INTEGER CHECK (verbosity >= 1 AND verbosity <= 10),
  knowledge_domain VARCHAR(255),
  language_style VARCHAR(100),
  cultural_context VARCHAR(100),
  expertise VARCHAR(255),
  personality TEXT,
  max_length INTEGER,
  min_response_time INTEGER,
  max_response_time INTEGER,
  use_emojis BOOLEAN DEFAULT false,
  include_greeting BOOLEAN DEFAULT true,
  ask_follow_up BOOLEAN DEFAULT false,
  system_prompt TEXT,
  custom_instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for personas
CREATE TRIGGER handle_updated_at_personas
BEFORE UPDATE ON personas
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Knowledge categories table
CREATE TABLE IF NOT EXISTS knowledge_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Default blue color
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for knowledge_categories
CREATE TRIGGER handle_updated_at_knowledge_categories
BEFORE UPDATE ON knowledge_categories
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Knowledge documents table
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES knowledge_categories(id) ON DELETE SET NULL,
  file_path VARCHAR(1000),
  file_type VARCHAR(50),
  file_size BIGINT,
  embedding TEXT, -- Store vector embedding as JSON string
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for knowledge_documents
CREATE TRIGGER handle_updated_at_knowledge_documents
BEFORE UPDATE ON knowledge_documents
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Sync sources table
CREATE TABLE IF NOT EXISTS sync_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- 'database', 'cms', 'file_system', 'api', etc.
  config JSONB, -- Store configuration as JSON
  last_sync_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for sync_sources
CREATE TRIGGER handle_updated_at_sync_sources
BEFORE UPDATE ON sync_sources
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Sync history table
CREATE TABLE IF NOT EXISTS sync_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES sync_sources(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL, -- 'running', 'completed', 'failed', 'cancelled'
  records_processed INTEGER DEFAULT 0,
  records_success INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_personas_user_id ON personas(user_id);
CREATE INDEX IF NOT EXISTS idx_personas_is_active ON personas(is_active);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_category_id ON knowledge_documents(category_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_is_active ON knowledge_documents(is_active);
CREATE INDEX IF NOT EXISTS idx_sync_sources_type ON sync_sources(type);
CREATE INDEX IF NOT EXISTS idx_sync_history_source_id ON sync_history(source_id);
CREATE INDEX IF NOT EXISTS idx_sync_history_status ON sync_history(status);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_history ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid()::text = id::text);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON user_sessions
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own sessions" ON user_sessions
FOR DELETE USING (auth.uid()::text = user_id::text);

-- Personas policies
CREATE POLICY "Users can view own personas" ON personas
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own personas" ON personas
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own personas" ON personas
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own personas" ON personas
FOR DELETE USING (auth.uid()::text = user_id::text);

-- Knowledge categories policies (public read)
CREATE POLICY "Everyone can view knowledge categories" ON knowledge_categories
FOR SELECT USING (is_active = true);

-- Knowledge documents policies
CREATE POLICY "Users can view active knowledge documents" ON knowledge_documents
FOR SELECT USING (is_active = true);

-- Sync sources policies
CREATE POLICY "Users can view own sync sources" ON sync_sources
FOR SELECT USING (auth.uid()::text = (config->>'user_id') OR config IS NULL);

CREATE POLICY "Users can manage own sync sources" ON sync_sources
FOR ALL USING (auth.uid()::text = (config->>'user_id'));

-- Sync history policies
CREATE POLICY "Users can view related sync history" ON sync_history
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM sync_sources
    WHERE sync_sources.id = sync_history.source_id
    AND (auth.uid()::text = (sync_sources.config->>'user_id') OR sync_sources.config IS NULL)
  )
);

-- Insert sample knowledge categories
INSERT INTO knowledge_categories (name, description, color) VALUES
('General', 'General knowledge and information', '#3B82F6'),
('Technical', 'Technical documentation and guides', '#10B981'),
('Support', 'Customer support and help content', '#F59E0B'),
('Products', 'Product information and specifications', '#EF4444'),
('Company', 'Company policies and procedures', '#8B5CF6')
ON CONFLICT (name) DO NOTHING;

-- Create function to cleanup expired sessions
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

-- Create function to get user by email
CREATE OR REPLACE FUNCTION get_user_by_email(user_email VARCHAR(255))
RETURNS TABLE (
  id UUID,
  email VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50),
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.name, u.role, u.is_active, u.created_at, u.updated_at, u.last_login_at
  FROM users u
  WHERE u.email = get_user_by_email.user_email
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create function to create user session
CREATE OR REPLACE FUNCTION create_user_session(
  user_uuid UUID,
  session_token VARCHAR(500),
  expires_hours INTEGER DEFAULT 168, -- 7 days default
  user_ip_address INET DEFAULT NULL,
  user_agent_info TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO user_sessions (user_id, token, expires_at, ip_address, user_agent)
  VALUES (
    user_uuid,
    session_token,
    NOW() + (expires_hours || ' hours')::INTERVAL,
    user_ip_address,
    user_agent_info
  )
  RETURNING id INTO session_id;

  RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to validate session
CREATE OR REPLACE FUNCTION validate_session_token(session_token VARCHAR(500))
RETURNS TABLE (
  user_id UUID,
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

-- Create function to invalidate session
CREATE OR REPLACE FUNCTION invalidate_user_session(session_token VARCHAR(500))
RETURNS BOOLEAN AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE user_sessions
  SET is_active = false, updated_at = NOW()
  WHERE token = invalidate_user_session.session_token;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Create function to invalidate all user sessions
CREATE OR REPLACE FUNCTION invalidate_all_user_sessions(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE user_sessions
  SET is_active = false, updated_at = NOW()
  WHERE user_id = invalidate_all_user_sessions.user_uuid;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Comment the schema
COMMENT ON TABLE users IS 'User accounts for the chatbot system';
COMMENT ON TABLE user_sessions IS 'User authentication sessions';
COMMENT ON TABLE personas IS 'AI chatbot personality configurations';
COMMENT ON TABLE knowledge_categories IS 'Categories for organizing knowledge base';
COMMENT ON TABLE knowledge_documents IS 'Knowledge base documents with embeddings';
COMMENT ON TABLE sync_sources IS 'Data sources for synchronization';
COMMENT ON TABLE sync_history IS 'History of synchronization operations';