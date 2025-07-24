// Tipos de base de datos para Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // UUID del usuario autenticado de Supabase
          email: string;
          name: string;
          role: 'admin' | 'vendedor' | 'captador';
          phone?: string;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'vendedor' | 'captador';
          phone?: string;
          is_active?: boolean;
        };
        Update: {
          email?: string;
          name?: string;
          role?: 'admin' | 'vendedor' | 'captador';
          phone?: string;
          updated_at?: string;
          is_active?: boolean;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          type: 'sale' | 'rent';
          property_type: 'house' | 'apartment' | 'commercial' | 'land';
          bedrooms?: number;
          bathrooms?: number;
          area: number;
          location: string;
          address: string;
          images: string[];
          media: any[]; // NUEVO: Campo media para archivos multimedia
          features: string[];
          status: 'available' | 'sold' | 'rented' | 'pending';
          created_at: string;
          updated_at: string;
          captador_id: string; // FK a profiles
          views: number;
        };
        Insert: {
          title: string;
          description: string;
          price: number;
          type: 'sale' | 'rent';
          property_type: 'house' | 'apartment' | 'commercial' | 'land';
          bedrooms?: number;
          bathrooms?: number;
          area: number;
          location: string;
          address: string;
          images?: string[];
          media?: any[]; // NUEVO: Campo media para insertar
          features?: string[];
          status?: 'available' | 'sold' | 'rented' | 'pending';
          captador_id: string;
          views?: number;
        };
        Update: {
          title?: string;
          description?: string;
          price?: number;
          type?: 'sale' | 'rent';
          property_type?: 'house' | 'apartment' | 'commercial' | 'land';
          bedrooms?: number;
          bathrooms?: number;
          area?: number;
          location?: string;
          address?: string;
          images?: string[];
          media?: any[]; // NUEVO: Campo media para actualizar
          features?: string[];
          status?: 'available' | 'sold' | 'rented' | 'pending';
          updated_at?: string;
          captador_id?: string;
          views?: number;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          type?: 'venta' | 'arriendo' | 'ambas'; // Tipo de operación
          ubication?: string; // Ubicación preferida
          budget_min?: number; // Presupuesto mínimo
          budget_max?: number; // Presupuesto máximo
          rooms_min?: number; // Habitaciones mínimas
          rooms_max?: number; // Habitaciones máximas
          bathrooms_min?: number; // Baños mínimos
          bathrooms_max?: number; // Baños máximos
          area_min?: number; // Área mínima
          area_max?: number; // Área máxima
          characteristics?: string; // Características extras
          created_at: string;
          updated_at: string;
          vendedor_id?: string; // FK a profiles (creador)
          // CAMPOS LEGACY (temporalmente mantenidos para migración)
          interests?: string;
          preferred_property_types?: string;
        };
        Insert: {
          name: string;
          email: string;
          phone: string;
          type?: 'venta' | 'arriendo' | 'ambas';
          ubication?: string;
          budget_min?: number;
          budget_max?: number;
          rooms_min?: number;
          rooms_max?: number;
          bathrooms_min?: number;
          bathrooms_max?: number;
          area_min?: number;
          area_max?: number;
          characteristics?: string;
          vendedor_id?: string;
        };
        Update: {
          name?: string;
          email?: string;
          phone?: string;
          type?: 'venta' | 'arriendo' | 'ambas';
          ubication?: string;
          budget_min?: number;
          budget_max?: number;
          rooms_min?: number;
          rooms_max?: number;
          bathrooms_min?: number;
          bathrooms_max?: number;
          area_min?: number;
          area_max?: number;
          characteristics?: string;
          updated_at?: string;
          vendedor_id?: string;
        };
      };
      visits: {
        Row: {
          id: string;
          property_id: string; // FK a properties
          client_name: string;
          client_email: string;
          client_phone: string;
          preferred_date: string;
          preferred_time: string;
          message?: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
          vendedor_id?: string; // FK a profiles
        };
        Insert: {
          property_id: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          preferred_date: string;
          preferred_time: string;
          message?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          vendedor_id?: string;
        };
        Update: {
          property_id?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string;
          preferred_date?: string;
          preferred_time?: string;
          message?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          updated_at?: string;
          vendedor_id?: string;
        };
      };
      whatsapp_messages: {
        Row: {
          id: string;
          client_id: string;
          property_id: string;
          client_name: string;
          client_phone: string;
          property_title: string;
          property_price: number;
          message: string;
          whatsapp_url: string;
          created_at: string;
          created_by?: string;
        };
        Insert: {
          client_id: string;
          property_id: string;
          client_name: string;
          client_phone: string;
          property_title: string;
          property_price: number;
          message: string;
          whatsapp_url: string;
          created_by?: string;
        };
        Update: {
          client_name?: string;
          client_phone?: string;
          property_title?: string;
          property_price?: number;
          message?: string;
          whatsapp_url?: string;
        };
      };
    };
  };
}

// Tipos para convertir entre los tipos de la aplicación y los tipos de la base de datos
export type ProfileDB = Database['public']['Tables']['profiles']['Row'];
export type PropertyDB = Database['public']['Tables']['properties']['Row'];
export type ClientDB = Database['public']['Tables']['clients']['Row'];
export type VisitDB = Database['public']['Tables']['visits']['Row'];
export type WhatsAppMessageDB = Database['public']['Tables']['whatsapp_messages']['Row'];

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type VisitInsert = Database['public']['Tables']['visits']['Insert'];
export type WhatsAppMessageInsert = Database['public']['Tables']['whatsapp_messages']['Insert'];

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];
export type VisitUpdate = Database['public']['Tables']['visits']['Update'];
export type WhatsAppMessageUpdate = Database['public']['Tables']['whatsapp_messages']['Update']; 