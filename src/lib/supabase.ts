import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de base de datos
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          role: 'client' | 'vendedor' | 'captador' | 'admin' | 'super_admin'
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          role?: 'client' | 'vendedor' | 'captador' | 'admin' | 'super_admin'
          avatar_url?: string | null
          is_active?: boolean
          created_by?: string | null
        }
        Update: {
          full_name?: string
          phone?: string | null
          role?: 'client' | 'vendedor' | 'captador' | 'admin' | 'super_admin'
          avatar_url?: string | null
          is_active?: boolean
          updated_by?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string | null
          city: string
          interests: string | null
          budget: number | null
          property_type: string
          notes: string | null
          status: string
          assigned_to: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
          last_contact: string | null
        }
        Insert: {
          name: string
          email: string
          phone: string
          address?: string | null
          city?: string
          interests?: string | null
          budget?: number | null
          property_type?: string
          notes?: string | null
          status?: string
          assigned_to?: string | null
          created_by?: string | null
        }
        Update: {
          name?: string
          email?: string
          phone?: string
          address?: string | null
          city?: string
          interests?: string | null
          budget?: number | null
          property_type?: string
          notes?: string | null
          status?: string
          assigned_to?: string | null
          updated_by?: string | null
          last_contact?: string | null
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          phone: string
          whatsapp_number: string | null
          license_number: string | null
          bio: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          user_id?: string | null
          name: string
          email: string
          phone: string
          whatsapp_number?: string | null
          license_number?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_by?: string | null
        }
        Update: {
          user_id?: string | null
          name?: string
          email?: string
          phone?: string
          whatsapp_number?: string | null
          license_number?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_active?: boolean
          updated_by?: string | null
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          property_type: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'oficina'
          listing_type: 'sale' | 'rent'
          bedrooms: number | null
          bathrooms: number | null
          area: number
          address: string
          city: string
          neighborhood: string
          latitude: number | null
          longitude: number | null
          features: string[]
          images: string[]
          agent_id: string
          available_visit_days: string[]
          available_visit_hours: string[]
          is_featured: boolean
          is_active: boolean
          views_count: number
          favorites_count: number
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          title: string
          description: string
          price: number
          property_type: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'oficina'
          listing_type: 'sale' | 'rent'
          bedrooms?: number | null
          bathrooms?: number | null
          area: number
          address: string
          city: string
          neighborhood: string
          latitude?: number | null
          longitude?: number | null
          features?: string[]
          images?: string[]
          agent_id: string
          available_visit_days?: string[]
          available_visit_hours?: string[]
          is_featured?: boolean
          is_active?: boolean
          created_by?: string | null
        }
        Update: {
          title?: string
          description?: string
          price?: number
          property_type?: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'oficina'
          listing_type?: 'sale' | 'rent'
          bedrooms?: number | null
          bathrooms?: number | null
          area?: number
          address?: string
          city?: string
          neighborhood?: string
          latitude?: number | null
          longitude?: number | null
          features?: string[]
          images?: string[]
          agent_id?: string
          available_visit_days?: string[]
          available_visit_hours?: string[]
          is_featured?: boolean
          is_active?: boolean
          updated_by?: string | null
        }
      }
      visit_requests: {
        Row: {
          id: string
          property_id: string
          client_name: string
          client_email: string
          client_phone: string
          requested_date: string
          requested_time: string
          message: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          property_id: string
          client_name: string
          client_email: string
          client_phone: string
          requested_date: string
          requested_time: string
          message?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          created_by?: string | null
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          updated_by?: string | null
        }
      }
      appraisal_requests: {
        Row: {
          id: string
          client_name: string
          client_email: string
          client_phone: string
          property_type: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'oficina'
          property_address: string
          property_area: number | null
          property_bedrooms: number | null
          property_bathrooms: number | null
          property_description: string
          preferred_contact_method: 'email' | 'phone'
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          estimated_value: number | null
          notes: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          client_name: string
          client_email: string
          client_phone: string
          property_type: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'oficina'
          property_address: string
          property_area?: number | null
          property_bedrooms?: number | null
          property_bathrooms?: number | null
          property_description: string
          preferred_contact_method?: 'email' | 'phone'
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          estimated_value?: number | null
          notes?: string | null
          assigned_to?: string | null
          created_by?: string | null
        }
        Update: {
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          estimated_value?: number | null
          notes?: string | null
          assigned_to?: string | null
          updated_by?: string | null
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          property_id: string
        }
        Update: never
      }
      audit_log: {
        Row: {
          id: string
          table_name: string
          record_id: string
          action: 'INSERT' | 'UPDATE' | 'DELETE'
          old_values: any | null
          new_values: any | null
          user_id: string | null
          user_email: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: never
        Update: never
      }
    }
    Functions: {
      increment_property_views: {
        Args: { property_id: string }
        Returns: void
      }
      toggle_property_favorite: {
        Args: { property_id: string; increment: boolean }
        Returns: void
      }
      toggle_user_favorite: {
        Args: { property_id: string }
        Returns: boolean
      }
    }
  }
}