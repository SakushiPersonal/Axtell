import { Property, Client, Visit, User, WhatsAppMessage } from '../types';
import { ProfileDB, PropertyDB, ClientDB, VisitDB, WhatsAppMessageDB } from '../types/database';

// Convertir Profile de DB a User de la aplicación
export function profileToUser(profile: ProfileDB): User {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    phone: profile.phone,
    createdAt: profile.created_at.split('T')[0], // Convertir a formato de fecha simple
    isActive: profile.is_active
  };
}

// Convertir Property de DB a Property de la aplicación
export function propertyDBToProperty(propertyDB: PropertyDB): Property {
  return {
    id: propertyDB.id,
    title: propertyDB.title,
    description: propertyDB.description,
    price: propertyDB.price,
    type: propertyDB.type,
    propertyType: propertyDB.property_type,
    bedrooms: propertyDB.bedrooms,
    bathrooms: propertyDB.bathrooms,
    area: propertyDB.area,
    location: propertyDB.location,
    address: propertyDB.address,
    images: propertyDB.images,
    media: propertyDB.media || [], // NUEVO: Campo media desde BD
    features: propertyDB.features,
    status: propertyDB.status,
    createdAt: propertyDB.created_at.split('T')[0],
    updatedAt: propertyDB.updated_at.split('T')[0],
    captadorId: propertyDB.captador_id
    // ❌ views: Se removió el sistema de views
  };
}

// Convertir Property de la aplicación a PropertyDB para insertar
export function propertyToPropertyInsert(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): any {
  return {
    title: property.title,
    description: property.description,
    price: property.price,
    type: property.type,
    property_type: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    location: property.location,
    address: property.address,
    images: property.images || [],
    media: property.media || [], // NUEVO: Campo media para insertar
    features: property.features || [],
    status: property.status || 'available',
    captador_id: property.captadorId
    // ❌ views: Se removió el sistema de views
  };
}

// Convertir Client de DB a Client de la aplicación
export function clientDBToClient(clientDB: ClientDB): Client {
  return {
    id: clientDB.id,
    name: clientDB.name,
    email: clientDB.email,
    phone: clientDB.phone,
    
    // 🎯 MAPEO DIRECTO DE LA NUEVA ESTRUCTURA
    type: clientDB.type,
    ubication: clientDB.ubication,
    
    // Presupuesto
    budgetMin: clientDB.budget_min,
    budgetMax: clientDB.budget_max,
    
    // Habitaciones
    roomsMin: clientDB.rooms_min,
    roomsMax: clientDB.rooms_max,
    
    // Baños
    bathroomsMin: clientDB.bathrooms_min,
    bathroomsMax: clientDB.bathrooms_max,
    
    // Área
    areaMin: clientDB.area_min,
    areaMax: clientDB.area_max,
    
    // Características
    characteristics: clientDB.characteristics,
    
    // Campos estándar
    createdAt: clientDB.created_at.split('T')[0],
    updatedAt: clientDB.updated_at.split('T')[0],
    vendedorId: clientDB.vendedor_id
  };
}

// Convertir Client de la aplicación a ClientDB para insertar
export function clientToClientInsert(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): any {
  return {
    name: client.name,
    email: client.email,
    phone: client.phone,
    
    // 🎯 MAPEO DIRECTO DE LA NUEVA ESTRUCTURA
    type: client.type,
    ubication: client.ubication,
    
    // Presupuesto
    budget_min: client.budgetMin,
    budget_max: client.budgetMax,
    
    // Habitaciones
    rooms_min: client.roomsMin,
    rooms_max: client.roomsMax,
    
    // Baños
    bathrooms_min: client.bathroomsMin,
    bathrooms_max: client.bathroomsMax,
    
    // Área
    area_min: client.areaMin,
    area_max: client.areaMax,
    
    // Características
    characteristics: client.characteristics,
    
    // Vendedor
    vendedor_id: client.vendedorId
  };
}

// Convertir Visit de DB a Visit de la aplicación
export function visitDBToVisit(visitDB: VisitDB): Visit {
  return {
    id: visitDB.id,
    propertyId: visitDB.property_id,
    clientName: visitDB.client_name,
    clientEmail: visitDB.client_email,
    clientPhone: visitDB.client_phone,
    preferredDate: visitDB.preferred_date,
    preferredTime: visitDB.preferred_time,
    message: visitDB.message || undefined,
    status: visitDB.status,
    createdAt: visitDB.created_at ? visitDB.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    vendedorId: visitDB.vendedor_id || undefined
  };
}

// Convertir Visit de la aplicación a VisitDB para insertar
export function visitToVisitInsert(visit: Omit<Visit, 'id' | 'createdAt'>): any {
  return {
    property_id: visit.propertyId,
    client_name: visit.clientName,
    client_email: visit.clientEmail,
    client_phone: visit.clientPhone,
    preferred_date: visit.preferredDate,
    preferred_time: visit.preferredTime,
    message: visit.message,
    status: visit.status || 'pending',
    vendedor_id: visit.vendedorId
  };
}

// ================== WHATSAPP MESSAGE CONVERTERS ==================
export function whatsappMessageDBToWhatsAppMessage(messageDB: WhatsAppMessageDB): WhatsAppMessage {
  return {
    id: messageDB.id,
    client_id: messageDB.client_id,
    property_id: messageDB.property_id,
    client_name: messageDB.client_name,
    client_phone: messageDB.client_phone,
    property_title: messageDB.property_title,
    property_price: messageDB.property_price,
    message: messageDB.message,
    whatsapp_url: messageDB.whatsapp_url,
    created_at: messageDB.created_at,
    created_by: messageDB.created_by
  };
} 