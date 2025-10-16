-- Minimal Schema for Supabase Testing
-- Run this in your Supabase SQL Editor first

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (minimal version)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Disable Row Level Security for testing (we'll enable it later)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;

-- Function to validate session
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

-- Function to create user session
CREATE OR REPLACE FUNCTION create_user_session(
  user_uuid UUID,
  session_token VARCHAR(500),
  expires_hours INTEGER DEFAULT 168 -- 7 days
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO user_sessions (user_id, token, expires_at)
  VALUES (
    user_uuid,
    session_token,
    NOW() + (expires_hours || ' hours')::INTERVAL
  )
  RETURNING id INTO session_id;

  RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to invalidate session
CREATE OR REPLACE FUNCTION invalidate_user_session(session_token VARCHAR(500))
RETURNS BOOLEAN AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE user_sessions
  SET is_active = false
  WHERE token = invalidate_user_session.session_token;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count > 0;
END;
$$ LANGUAGE plpgsql;