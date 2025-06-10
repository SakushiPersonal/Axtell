import { Property, User, Analytics } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Casa Moderna en Zona Residencial',
    description: 'Hermosa casa de dos plantas en excelente ubicación. Cuenta con amplio jardín, garaje para dos vehículos y acabados de primera calidad.',
    price: 350000,
    type: 'casa',
    status: 'venta',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    location: {
      address: 'Av. Principal 1234',
      city: 'Ciudad Capital',
      neighborhood: 'Las Flores',
      coordinates: { lat: -34.6037, lng: -58.3816 }
    },
    features: ['Jardín', 'Garaje', 'Piscina', 'Seguridad 24h', 'Cocina equipada'],
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent: {
      id: '1',
      name: 'María González',
      phone: '+54 11 1234-5678',
      email: 'maria@axtellpropiedades.com'
    },
    views: 156,
    favorites: 23,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Apartamento Luminoso Centro',
    description: 'Departamento de 2 ambientes en pleno centro de la ciudad. Ideal para inversión o primera vivienda. Excelente conectividad.',
    price: 180000,
    type: 'apartamento',
    status: 'venta',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    location: {
      address: 'Calle Central 567',
      city: 'Ciudad Capital',
      neighborhood: 'Centro',
      coordinates: { lat: -34.6118, lng: -58.3960 }
    },
    features: ['Balcón', 'Portero eléctrico', 'Ascensor', 'Calefacción central'],
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent: {
      id: '2',
      name: 'Carlos Rodríguez',
      phone: '+54 11 2345-6789',
      email: 'carlos@axtellpropiedades.com'
    },
    views: 89,
    favorites: 12,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-22'
  },
  {
    id: '3',
    title: 'Terreno Comercial Estratégico',
    description: 'Lote comercial en zona de alto tránsito. Ideal para desarrollo comercial o residencial. Todos los servicios disponibles.',
    price: 220000,
    type: 'terreno',
    status: 'venta',
    area: 450,
    location: {
      address: 'Ruta Nacional 789',
      city: 'Ciudad Capital',
      neighborhood: 'Zona Industrial',
      coordinates: { lat: -34.5890, lng: -58.3974 }
    },
    features: ['Esquina', 'Agua corriente', 'Energía eléctrica', 'Gas natural', 'Cloacas'],
    images: [
      'https://images.pexels.com/photos/2402235/pexels-photo-2402235.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent: {
      id: '1',
      name: 'María González',
      phone: '+54 11 1234-5678',
      email: 'maria@axtellpropiedades.com'
    },
    views: 67,
    favorites: 8,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15'
  },
  {
    id: '4',
    title: 'Oficina Premium Microcentro',
    description: 'Oficina completamente equipada en edificio corporativo. Vista panorámica, aire acondicionado central y estacionamiento.',
    price: 1800,
    type: 'oficina',
    status: 'alquiler',
    bathrooms: 2,
    area: 120,
    location: {
      address: 'Torre Empresarial, Piso 15',
      city: 'Ciudad Capital',
      neighborhood: 'Microcentro',
      coordinates: { lat: -34.6037, lng: -58.3700 }
    },
    features: ['Aire acondicionado', 'Internet fibra óptica', 'Estacionamiento', 'Seguridad', 'Recepción'],
    images: [
      'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent: {
      id: '2',
      name: 'Carlos Rodríguez',
      phone: '+54 11 2345-6789',
      email: 'carlos@axtellpropiedades.com'
    },
    views: 45,
    favorites: 5,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-28'
  },
  {
    id: '5',
    title: 'Casa Familiar con Piscina',
    description: 'Amplia casa familiar en barrio tranquilo. Perfecta para familias, con gran patio, piscina y parrilla. Muy luminosa.',
    price: 2200,
    type: 'casa',
    status: 'alquiler',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    location: {
      address: 'Barrio Los Olivos 456',
      city: 'Ciudad Capital',
      neighborhood: 'Los Olivos',
      coordinates: { lat: -34.5703, lng: -58.4370 }
    },
    features: ['Piscina', 'Parrilla', 'Garaje', 'Jardín amplio', 'Cocina equipada', 'Lavadero'],
    images: [
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent: {
      id: '1',
      name: 'María González',
      phone: '+54 11 1234-5678',
      email: 'maria@axtellpropiedades.com'
    },
    views: 134,
    favorites: 18,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-20'
  },
  {
    id: '6',
    title: 'Local Comercial Céntrico',
    description: 'Local comercial en la principal avenida comercial. Gran vidriera, excelente ubicación para cualquier tipo de negocio.',
    price: 1500,
    type: 'comercial',
    status: 'alquiler',
    bathrooms: 1,
    area: 80,
    location: {
      address: 'Av. Comercial 890',
      city: 'Ciudad Capital',
      neighborhood: 'Centro Comercial',
      coordinates: { lat: -34.6080, lng: -58.3730 }
    },
    features: ['Gran vidriera', 'Depósito', 'Aire acondicionado', 'Alarma', 'Acceso para discapacitados'],
    images: [
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent: {
      id: '2',
      name: 'Carlos Rodríguez',
      phone: '+54 11 2345-6789',
      email: 'carlos@axtellpropiedades.com'
    },
    views: 78,
    favorites: 9,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    role: 'client',
    phone: '+54 11 9876-5432',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Ana López',
    email: 'ana@email.com',
    role: 'client',
    phone: '+54 11 8765-4321',
    createdAt: '2024-01-15'
  },
  {
    id: 'admin1',
    name: 'Administrador',
    email: 'admin@axtellpropiedades.com',
    role: 'admin',
    createdAt: '2024-01-01'
  }
];

export const mockAnalytics: Analytics = {
  totalViews: 569,
  totalProperties: 6,
  totalClients: 2,
  mostViewedProperties: mockProperties.sort((a, b) => b.views - a.views).slice(0, 3),
  popularNeighborhoods: [
    { name: 'Las Flores', views: 156, searches: 45 },
    { name: 'Los Olivos', views: 134, searches: 38 },
    { name: 'Centro', views: 89, searches: 32 },
    { name: 'Microcentro', views: 78, searches: 25 },
    { name: 'Centro Comercial', views: 67, searches: 18 }
  ],
  monthlyStats: [
    { month: 'Enero', views: 320, inquiries: 45 },
    { month: 'Febrero', views: 249, inquiries: 38 },
    { month: 'Marzo', views: 0, inquiries: 0 }
  ],
  propertyTypes: [
    { type: 'Casa', count: 2, percentage: 33.3 },
    { type: 'Apartamento', count: 1, percentage: 16.7 },
    { type: 'Terreno', count: 1, percentage: 16.7 },
    { type: 'Oficina', count: 1, percentage: 16.7 },
    { type: 'Comercial', count: 1, percentage: 16.7 }
  ]
};