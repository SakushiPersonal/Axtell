// Media file interface for images and videos
export interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size: number;
  uploadedAt: string;
  thumbnailUrl?: string; // Para videos, thumbnail generado
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent';
  propertyType: 'house' | 'apartment' | 'commercial' | 'land';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  location: string;
  address: string;
  images: string[]; // DEPRECATED: Mantener por compatibilidad durante migración
  media: MediaFile[]; // NUEVO: Reemplaza images
  features: string[];
  status: 'available' | 'sold' | 'rented' | 'pending';
  createdAt: string;
  updatedAt: string;
  captadorId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'vendedor' | 'captador';
  phone?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  
  // 🎯 NUEVA ESTRUCTURA CLARA Y ORGANIZADA
  type?: 'venta' | 'arriendo' | 'ambas'; // Tipo de operación que busca
  ubication?: string; // Ubicación preferida
  
  // Presupuesto
  budgetMin?: number; // Presupuesto mínimo en CLP
  budgetMax?: number; // Presupuesto máximo en CLP
  
  // Habitaciones
  roomsMin?: number; // Mínimo de habitaciones
  roomsMax?: number; // Máximo de habitaciones
  
  // Baños
  bathroomsMin?: number; // Mínimo de baños
  bathroomsMax?: number; // Máximo de baños
  
  // Área
  areaMin?: number; // Área mínima en m²
  areaMax?: number; // Área máxima en m²
  
  // Características extras
  characteristics?: string; // Características como piscina, quincho, jardín, etc.
  
  // Campos estándar
  createdAt: string;
  updatedAt: string;
  vendedorId?: string; // ID del creador/vendedor
}



export interface Visit {
  id: string;
  propertyId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  vendedorId?: string;
}

export interface Analytics {
  totalProperties: number;
  totalClients: number;
  totalVisits: number;
  pendingVisits: number;
  thisMonthVisits: number;
  conversionRate: number;
  topProperties: {
    property: Property;
    views: number;
  }[];
  monthlyViews: {
    month: string;
    views: number;
  }[];
  recentActivity: {
    id: string;
    type: 'property_added' | 'visit_scheduled' | 'client_added';
    description: string;
    timestamp: string;
  }[];
}

// 📱 SISTEMA WHATSAPP - Nuevos tipos simplificados
export interface WhatsAppMessage {
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
}

export interface WhatsAppStats {
  pendingMessages: number;
}