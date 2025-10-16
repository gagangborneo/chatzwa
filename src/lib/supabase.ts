import { createClient } from '@supabase/supabase-js'

// Check if Supabase is active
const isSupabaseActive = process.env.SUPABASE_ACTIVE === 'true'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

// Create Supabase client (only if active)
export const supabase = isSupabaseActive && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Export helper to check if Supabase is available
export const isSupabaseEnabled = () => isSupabaseActive && supabase !== null

// Helper function to get Supabase client with error handling
export const getSupabaseClient = () => {
  if (!isSupabaseEnabled()) {
    throw new Error('Supabase is not configured or not active')
  }
  return supabase!
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          token: string
          expires_at: string
          is_active: boolean
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          expires_at?: string
          is_active?: boolean
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          expires_at?: string
          is_active?: boolean
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      personas: {
        Row: {
          id: string
          user_id: string
          slug: string
          name: string
          welcome_message: string | null
          selected_profile: string | null
          formality: number | null
          empathy: number | null
          enthusiasm: number | null
          humor: number | null
          verbosity: number | null
          knowledge_domain: string | null
          language_style: string | null
          cultural_context: string | null
          expertise: string | null
          personality: string | null
          max_length: number | null
          min_response_time: number | null
          max_response_time: number | null
          use_emojis: boolean | null
          include_greeting: boolean | null
          ask_follow_up: boolean | null
          system_prompt: string | null
          custom_instructions: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          name: string
          welcome_message?: string | null
          selected_profile?: string | null
          formality?: number | null
          empathy?: number | null
          enthusiasm?: number | null
          humor?: number | null
          verbosity?: number | null
          knowledge_domain?: string | null
          language_style?: string | null
          cultural_context?: string | null
          expertise?: string | null
          personality?: string | null
          max_length?: number | null
          min_response_time?: number | null
          max_response_time?: number | null
          use_emojis?: boolean | null
          include_greeting?: boolean | null
          ask_follow_up?: boolean | null
          system_prompt?: string | null
          custom_instructions?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          name?: string
          welcome_message?: string | null
          selected_profile?: string | null
          formality?: number | null
          empathy?: number | null
          enthusiasm?: number | null
          humor?: number | null
          verbosity?: number | null
          knowledge_domain?: string | null
          language_style?: string | null
          cultural_context?: string | null
          expertise?: string | null
          personality?: string | null
          max_length?: number | null
          min_response_time?: number | null
          max_response_time?: number | null
          use_emojis?: boolean | null
          include_greeting?: boolean | null
          ask_follow_up?: boolean | null
          system_prompt?: string | null
          custom_instructions?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_documents: {
        Row: {
          id: string
          title: string
          content: string
          category_id: string | null
          file_path: string | null
          file_type: string | null
          file_size: number | null
          embedding: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category_id?: string | null
          file_path?: string | null
          file_type?: string | null
          file_size?: number | null
          embedding?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category_id?: string | null
          file_path?: string | null
          file_type?: string | null
          file_size?: number | null
          embedding?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sync_sources: {
        Row: {
          id: string
          name: string
          type: string
          config: string | null
          last_sync_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          config?: string | null
          last_sync_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          config?: string | null
          last_sync_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sync_history: {
        Row: {
          id: string
          source_id: string
          status: string
          records_processed: number
          records_success: number
          records_failed: number
          error_message: string | null
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source_id: string
          status: string
          records_processed?: number
          records_success?: number
          records_failed?: number
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source_id?: string
          status?: string
          records_processed?: number
          records_success?: number
          records_failed?: number
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
      }
    }
  }
}