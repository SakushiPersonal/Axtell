import { Property, User, Analytics, VisitRequest, AppraisalRequest } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Casa Moderna en Zona Residencial',
    description: 'Hermosa casa de dos plantas en excelente ubicación. Cuenta con amplio jardín, garaje para dos vehículos y acabados de primera calidad.',
    price: 280000000, // CLP
    type: 'casa',
    status: 'venta',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    location: {
      address: 'Av. Principal 1234',
      city: 'Santiago',
      neighborhood: 'Las Condes',
      coordinates: { lat: -33.4489, lng: -70.6693 }
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
      phone: '+56 9 1234 5678',
      email: 'maria@axtellpropiedades.com'
    },
    views: 156,
    favorites: 23,
    availableVisitDays: ['monday', 'tuesday', 'wednesday', 'friday'],
    availableVisitHours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Apartamento Luminoso Centro',
    description: 'Departamento de 2 ambientes en pleno centro de la ciudad. Ideal para inversión o primera vivienda. Excelente conectividad.',
    price: 145000000, // CLP
    type: 'apartamento',
    status: 'venta',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    location: {
      address: 'Calle Central 567',
      city: 'Santiago',
      neighborhood: 'Centro',
      coordinates: { lat: -33.4372, lng: -70.6506 }
    },
    features: ['Balcón', 'Portero eléctrico', 'Ascensor', 'Calefacción central'],
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent: {
      id: '2',
      name: 'Carlos Rodríguez',
      phone: '+56 9 2345 6789',
      email: 'carlos@axtellpropiedades.com'
    },
    views: 89,
    favorites: 12,
    availableVisitDays: ['tuesday', 'thursday', 'saturday'],
    availableVisitHours: ['10:00', '11:00', '15:00', '16:00', '17:00'],
    createdAt: '2024-01-18',
    updatedAt: '2024-01-22'
  },
  {
    id: '3',
    title: 'Terreno Comercial Estratégico',
    description: 'Lote comercial en zona de alto tránsito. Ideal para desarrollo comercial o residencial. Todos los servicios disponibles.',
    price: 180000000, // CLP
    type: 'terreno',
    status: 'venta',
    area: 450,
    location: {
      address: 'Ruta Nacional 789',
      city: 'Santiago',
      neighborhood: 'Maipú',
      coordinates: { lat: -33.5110, lng: -70.7580 }
    },
    features: ['Esquina', 'Agua corriente', 'Energía eléctrica', 'Gas natural', 'Cloacas'],
    images: [
      'https://images.pexels.com/photos/2402235/pexels-photo-2402235.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent: {
      id: '1',
      name: 'María González',
      phone: '+56 9 1234 5678',
      email: 'maria@axtellpropiedades.com'
    },
    views: 67,
    favorites: 8,
    availableVisitDays: ['monday', 'wednesday', 'friday'],
    availableVisitHours: ['09:00', '10:00', '14:00', '15:00'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15'
  },
  {
    id: '4',
    title: 'Oficina Premium Microcentro',
    description: 'Oficina completamente equipada en edificio corporativo. Vista panorámica, aire acondicionado central y estacionamiento.',
    price: 1450000, // CLP monthly
    type: 'oficina',
    status: 'alquiler',
    bathrooms: 2,
    area: 120,
    location: {
      address: 'Torre Empresarial, Piso 15',
      city: 'Santiago',
      neighborhood: 'Providencia',
      coordinates: { lat: -33.4255, lng: -70.6110 }
    },
    features: ['Aire acondicionado', 'Internet fibra óptica', 'Estacionamiento', 'Seguridad', 'Recepción'],
    images: [
      'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent: {
      id: '2',
      name: 'Carlos Rodríguez',
      phone: '+56 9 2345 6789',
      email: 'carlos@axtellpropiedades.com'
    },
    views: 45,
    favorites: 5,
    availableVisitDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    availableVisitHours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    createdAt: '2024-01-25',
    updatedAt: '2024-01-28'
  },
  {
    id: '5',
    title: 'Casa Familiar con Piscina',
    description: 'Amplia casa familiar en barrio tranquilo. Perfecta para familias, con gran patio, piscina y parrilla. Muy luminosa.',
    price: 1800000, // CLP monthly
    type: 'casa',
    status: 'alquiler',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    location: {
      address: 'Barrio Los Olivos 456',
      city: 'Santiago',
      neighborhood: 'Ñuñoa',
      coordinates: { lat: -33.4569, lng: -70.5987 }
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
      phone: '+56 9 1234 5678',
      email: 'maria@axtellpropiedades.com'
    },
    views: 134,
    favorites: 18,
    availableVisitDays: ['saturday', 'sunday'],
    availableVisitHours: ['10:00', '11:00', '15:00', '16:00'],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-20'
  },
  {
    id: '6',
    title: 'Local Comercial Céntrico',
    description: 'Local comercial en la principal avenida comercial. Gran vidriera, excelente ubicación para cualquier tipo de negocio.',
    price: 1200000, // CLP monthly
    type: 'comercial',
    status: 'alquiler',
    bathrooms: 1,
    area: 80,
    location: {
      address: 'Av. Comercial 890',
      city: 'Santiago',
      neighborhood: 'Santiago Centro',
      coordinates: { lat: -33.4378, lng: -70.6504 }
    },
    features: ['Gran vidriera', 'Depósito', 'Aire acondicionado', 'Alarma', 'Acceso para discapacitados'],
    images: [
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    agent: {
      id: '2',
      name: 'Carlos Rodríguez',
      phone: '+56 9 2345 6789',
      email: 'carlos@axtellpropiedades.com'
    },
    views: 78,
    favorites: 9,
    availableVisitDays: ['monday', 'wednesday', 'friday'],
    availableVisitHours: ['09:00', '10:00', '11:00', '14:00', '15:00'],
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
    phone: '+56 9 9876 5432',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Ana López',
    email: 'ana@email.com',
    role: 'client',
    phone: '+56 9 8765 4321',
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

export const mockVisitRequests: VisitRequest[] = [
  {
    id: '1',
    propertyId: '1',
    propertyTitle: 'Casa Moderna en Zona Residencial',
    clientName: 'Pedro Silva',
    clientEmail: 'pedro@email.com',
    clientPhone: '+56 9 1111 2222',
    requestedDate: '2024-02-15',
    requestedTime: '10:00',
    message: 'Interesado en conocer más detalles sobre la propiedad',
    status: 'pending',
    createdAt: '2024-02-01'
  },
  {
    id: '2',
    propertyId: '2',
    propertyTitle: 'Apartamento Luminoso Centro',
    clientName: 'Carmen Torres',
    clientEmail: 'carmen@email.com',
    clientPhone: '+56 9 3333 4444',
    requestedDate: '2024-02-18',
    requestedTime: '15:00',
    status: 'confirmed',
    createdAt: '2024-02-02'
  }
];

export const mockAppraisalRequests: AppraisalRequest[] = [
  {
    id: '1',
    clientName: 'Roberto Mendoza',
    clientEmail: 'roberto@email.com',
    clientPhone: '+56 9 5555 6666',
    propertyType: 'casa',
    propertyAddress: 'Los Aromos 123, Providencia',
    propertyArea: 150,
    propertyBedrooms: 3,
    propertyBathrooms: 2,
    propertyDescription: 'Casa de dos pisos con jardín, construida hace 10 años',
    preferredContactMethod: 'phone',
    status: 'pending',
    createdAt: '2024-02-03'
  },
  {
    id: '2',
    clientName: 'Lucia Vargas',
    clientEmail: 'lucia@email.com',
    clientPhone: '+56 9 7777 8888',
    propertyType: 'apartamento',
    propertyAddress: 'Av. Libertador 456, Las Condes',
    propertyArea: 80,
    propertyBedrooms: 2,
    propertyBathrooms: 1,
    propertyDescription: 'Departamento en edificio moderno con vista panorámica',
    preferredContactMethod: 'email',
    status: 'in-progress',
    createdAt: '2024-02-05'
  }
];

export const mockAnalytics: Analytics = {
  totalViews: 569,
  totalProperties: 6,
  totalClients: 2,
  mostViewedProperties: mockProperties.sort((a, b) => b.views - a.views).slice(0, 3),
  popularNeighborhoods: [
    { name: 'Las Condes', views: 156, searches: 45 },
    { name: 'Ñuñoa', views: 134, searches: 38 },
    { name: 'Centro', views: 89, searches: 32 },
    { name: 'Providencia', views: 78, searches: 25 },
    { name: 'Santiago Centro', views: 67, searches: 18 }
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
  ],
  recentVisits: mockVisitRequests,
  pendingAppraisals: mockAppraisalRequests
};