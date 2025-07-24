import { Property, Client, Visit, Analytics } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Casa Moderna en Las Condes',
    description: 'Hermosa casa moderna con vista panorámica, ubicada en el exclusivo sector de Las Condes. Cuenta con amplios espacios, jardín privado y piscina.',
    price: 450000000,
    type: 'sale',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    location: 'Las Condes, Santiago',
    address: 'Av. Kennedy 5678',
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Piscina', 'Jardín', 'Garaje', 'Terraza', 'Vista panorámica'],
    status: 'available',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    captadorId: '3',
    views: 245
  },
  {
    id: '2',
    title: 'Departamento Céntrico en Providencia',
    description: 'Moderno departamento en el corazón de Providencia, cerca del metro y centros comerciales. Ideal para profesionales jóvenes.',
    price: 2800000,
    type: 'rent',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    location: 'Providencia, Santiago',
    address: 'Av. Providencia 1234',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Balcón', 'Estacionamiento', 'Bodega', 'Gimnasio', 'Portería'],
    status: 'available',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    captadorId: '3',
    views: 189
  },
  {
    id: '3',
    title: 'Oficina Comercial en Vitacura',
    description: 'Espaciosa oficina comercial en moderno edificio corporativo. Perfecta para empresas en crecimiento.',
    price: 3500000,
    type: 'rent',
    propertyType: 'commercial',
    area: 120,
    location: 'Vitacura, Santiago',
    address: 'Av. Vitacura 3456',
    images: [
      'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: ['Aire acondicionado', 'Sala de reuniones', 'Recepción', 'Estacionamiento'],
    status: 'available',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
    captadorId: '3',
    views: 156
  }
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    email: 'carlos@email.com',
    phone: '+56 9 1111 1111',
    interests: ['Casa', 'Las Condes'],
    budget: { min: 300000000, max: 500000000 },
    preferredPropertyTypes: ['house'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    vendedorId: '2'
  },
  {
    id: '2',
    name: 'Ana Martínez',
    email: 'ana@email.com',
    phone: '+56 9 2222 2222',
    interests: ['Departamento', 'Providencia'],
    budget: { min: 2000000, max: 3500000 },
    preferredPropertyTypes: ['apartment'],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
    vendedorId: '2'
  }
];

export const mockVisits: Visit[] = [
  {
    id: '1',
    propertyId: '1',
    clientName: 'Carlos Rodríguez',
    clientEmail: 'carlos@email.com',
    clientPhone: '+56 9 1111 1111',
    preferredDate: '2024-02-15',
    preferredTime: '15:00',
    message: 'Interesado en conocer más detalles sobre la propiedad',
    status: 'pending',
    createdAt: '2024-02-01',
    vendedorId: '2'
  },
  {
    id: '2',
    propertyId: '2',
    clientName: 'Ana Martínez',
    clientEmail: 'ana@email.com',
    clientPhone: '+56 9 2222 2222',
    preferredDate: '2024-02-16',
    preferredTime: '10:00',
    status: 'confirmed',
    createdAt: '2024-02-02',
    vendedorId: '2'
  }
];
