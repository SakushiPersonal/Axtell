export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'oficina';
  status: 'venta' | 'alquiler';
  bedrooms?: number;
  bathrooms?: number;
  area: number; // in square meters
  location: {
    address: string;
    city: string;
    neighborhood: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  features: string[];
  images: string[];
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  views: number;
  favorites: number;
  availableVisitDays: string[]; // ['monday', 'tuesday', etc.]
  availableVisitHours: string[]; // ['09:00', '10:00', etc.]
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  phone?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  interests?: string;
  budget?: number;
  propertyType: string;
  notes?: string;
  status: 'new' | 'contacted' | 'interested' | 'closed';
  assignedTo?: string; // ID del agente asignado
  createdAt: string;
  lastContact?: string;
}

export interface VisitRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  requestedDate: string;
  requestedTime: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface AppraisalRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyType: string;
  propertyAddress: string;
  propertyArea?: number;
  propertyBedrooms?: number;
  propertyBathrooms?: number;
  propertyDescription: string;
  preferredContactMethod: 'email' | 'phone';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

export interface Analytics {
  totalViews: number;
  totalProperties: number;
  totalClients: number;
  mostViewedProperties: Property[];
  popularNeighborhoods: { name: string; views: number; searches: number }[];
  monthlyStats: { month: string; views: number; inquiries: number }[];
  propertyTypes: { type: string; count: number; percentage: number }[];
  recentVisits: VisitRequest[];
  pendingAppraisals: AppraisalRequest[];
}

export interface SearchFilters {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  city?: string;
  neighborhood?: string;
  features?: string[];
}