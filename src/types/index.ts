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

export interface Analytics {
  totalViews: number;
  totalProperties: number;
  totalClients: number;
  mostViewedProperties: Property[];
  popularNeighborhoods: { name: string; views: number; searches: number }[];
  monthlyStats: { month: string; views: number; inquiries: number }[];
  propertyTypes: { type: string; count: number; percentage: number }[];
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