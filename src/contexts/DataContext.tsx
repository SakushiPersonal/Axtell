import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Property, Client, Visit, User, Analytics } from '../types';
import { 
  propertyService, 
  clientService, 
  visitService, 
  profileService,
  analyticsService,
  whatsappMessageService 
} from '../supabase/database';
import whatsappService from '../services/whatsappService';
import { useAuth } from './AuthContext';
import {
  propertyDBToProperty,
  propertyToPropertyInsert,
  clientDBToClient,
  clientToClientInsert,
  visitDBToVisit,
  visitToVisitInsert,
  profileToUser
} from '../utils/databaseConverters';

interface DataContextType {
  // Properties
  properties: Property[];
  loadingProperties: boolean;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Property>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  
  // Clients
  clients: Client[];
  loadingClients: boolean;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  
  // Visits
  visits: Visit[];
  loadingVisits: boolean;
  addVisit: (visit: Omit<Visit, 'id' | 'createdAt'>) => Promise<void>;
  updateVisit: (id: string, visit: Partial<Visit>) => Promise<void>;
  deleteVisit: (id: string) => Promise<void>;
  
  // Users
  users: User[];
  loadingUsers: boolean;
  addUser: (user: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Analytics
  analytics: Analytics | null;
  loadingAnalytics: boolean;
  refreshAnalytics: () => Promise<void>;
  
  // Refresh functions
  refreshProperties: () => Promise<void>;
  refreshClients: () => Promise<void>;
  refreshVisits: () => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Estados existentes
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Hook de autenticación
  const { createUserAsAdmin, user } = useAuth();

  // 🚀 CARGA AUTOMÁTICA INICIAL DE DATOS
  useEffect(() => {
    const loadInitialData = async () => {
      // No cargar datos si no hay conexión de autenticación establecida
      if (user === undefined) return; // undefined = aún cargando auth
      
      console.log('🚀 DataContext: Iniciando carga automática de datos...');
      console.log('👤 Usuario actual:', user ? `${user.name} (${user.role})` : 'Anónimo');

      try {
        // Para TODOS los usuarios (incluidos anónimos), cargar propiedades
        if (properties.length === 0 && !loadingProperties) {
          console.log('🏠 Cargando propiedades automáticamente...');
          await refreshProperties();
        }

        // Si hay usuario autenticado, cargar datos adicionales según el rol
        if (user) {
          // Para administradores y vendedores, cargar todo
          if (user.role === 'admin' || user.role === 'vendedor') {
            if (clients.length === 0 && !loadingClients) {
              console.log('👥 Cargando clientes automáticamente...');
              await refreshClients();
            }
            
            if (visits.length === 0 && !loadingVisits) {
              console.log('📅 Cargando visitas automáticamente...');
              await refreshVisits();
            }
            
            if (users.length === 0 && !loadingUsers && user.role === 'admin') {
              console.log('👤 Cargando usuarios automáticamente...');
              await refreshUsers();
            }
          }
          
          // Para captadores, solo propiedades y sus propios datos
          if (user.role === 'captador') {
            // Los captadores pueden ver algunas métricas básicas
            if (!analytics && !loadingAnalytics) {
              console.log('📊 Cargando analytics básicos...');
              await refreshAnalytics();
            }
          }
        }

        console.log('✅ Carga automática de datos completada');
      } catch (error) {
        console.error('❌ Error en carga automática de datos:', error);
      }
    };

    loadInitialData();
  }, [user]); // Ejecutar cuando el usuario cambie

  // 🔄 ACTUALIZACIÓN PERIÓDICA DE PROPIEDADES (para usuarios anónimos)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Solo para usuarios no autenticados o con rol público
    if (user === null || user?.role === 'captador') {
      // Actualizar propiedades cada 5 minutos para mantener datos frescos
      interval = setInterval(async () => {
        if (!loadingProperties) {
          console.log('🔄 Actualizando propiedades automáticamente...');
          await refreshProperties();
        }
      }, 5 * 60 * 1000); // 5 minutos
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user, loadingProperties]);

  // Funciones de refresh
  const refreshProperties = async () => {
    setLoadingProperties(true);
    try {
      const propertyData = await propertyService.getAll();
      setProperties(propertyData.map(propertyDBToProperty));
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
      // Si hay error de autenticación, limpiar datos
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const refreshClients = async () => {
    setLoadingClients(true);
    try {
      const clientData = await clientService.getAll();
      setClients(clientData.map(clientDBToClient));
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const refreshVisits = async () => {
    setLoadingVisits(true);
    try {
      const visitData = await visitService.getAll();
      setVisits(visitData.map(visitDBToVisit));
    } catch (error) {
      console.error('Error al cargar visitas:', error);
    } finally {
      setLoadingVisits(false);
    }
  };

  const refreshUsers = async () => {
    setLoadingUsers(true);
    try {
      const userData = await profileService.getAll();
      setUsers(userData.map(profileToUser));
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const refreshAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      // Calcular métricas básicas desde los datos disponibles
      const totalProperties = properties.length;
      const totalClients = clients.length;
      const totalVisits = visits.length;
      const pendingVisits = visits.filter(v => v.status === 'pending').length;
      
      // Calcular visitas de este mes
      const thisMonth = new Date();
      const thisMonthVisits = visits.filter(v => {
        const visitDate = new Date(v.createdAt);
        return visitDate.getMonth() === thisMonth.getMonth() && 
               visitDate.getFullYear() === thisMonth.getFullYear();
      }).length;
      
      // Calcular tasa de conversión
      const completedVisits = visits.filter(v => v.status === 'completed').length;
      const conversionRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;

      // Datos simulados para monthly views y top properties
      const monthlyViews = [
        { month: 'Enero', views: Math.floor(totalVisits * 0.15) },
        { month: 'Febrero', views: Math.floor(totalVisits * 0.18) },
        { month: 'Marzo', views: Math.floor(totalVisits * 0.16) },
        { month: 'Abril', views: Math.floor(totalVisits * 0.17) },
        { month: 'Mayo', views: Math.floor(totalVisits * 0.19) },
        { month: 'Junio', views: Math.floor(totalVisits * 0.15) }
      ];

      // Top properties simplificado
      const topProperties = properties.slice(0, 5).map(property => ({
        property,
        views: Math.floor(Math.random() * 50) + 10 // Datos simulados
      }));

      // Actividad reciente
      const recentActivity = [
        ...properties.slice(0, 3).map(p => ({
          id: `prop_${p.id}`,
          type: 'property_added' as const,
          description: `Nueva propiedad agregada: ${p.title}`,
          timestamp: p.createdAt
        })),
        ...visits.slice(0, 3).map(v => ({
          id: `visit_${v.id}`,
          type: 'visit_scheduled' as const,
          description: `Visita programada por ${v.clientName}`,
          timestamp: v.createdAt
        })),
        ...clients.slice(0, 2).map(c => ({
          id: `client_${c.id}`,
          type: 'client_added' as const,
          description: `Nuevo cliente registrado: ${c.name}`,
          timestamp: c.createdAt
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

      const analyticsData: Analytics = {
        totalProperties,
        totalClients,
        totalVisits,
        pendingVisits,
        thisMonthVisits,
        conversionRate: Math.round(conversionRate * 100) / 100,
        topProperties,
        monthlyViews,
        recentActivity
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error al cargar analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Property functions
  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const insertData = propertyToPropertyInsert(propertyData);
      const newPropertyDB = await propertyService.create(insertData);
      const newProperty = propertyDBToProperty(newPropertyDB);
      
      setProperties(prev => [newProperty, ...prev]);

      // 📱 GENERAR MENSAJES DE WHATSAPP EN BASE DE DATOS
      try {
        console.log('📱 Generando mensajes de WhatsApp para nueva propiedad...');
        
        if (clients.length > 0) {
          const messageData = whatsappService.generateMessagesForProperty(
            newProperty, 
            clients, 
            user?.id // Pasar el ID del usuario que creó la propiedad
          );
          
          if (messageData.length > 0) {
            // Guardar mensajes en la base de datos
            await whatsappMessageService.createMany(messageData);
            
            console.log(`✅ ${messageData.length} mensajes de WhatsApp guardados en la base de datos`);
          } else {
            console.log('ℹ️ No se encontraron clientes con criterios coincidentes');
          }
        } else {
          console.log('ℹ️ No hay clientes registrados para notificar');
        }
      } catch (whatsappError) {
        console.error('❌ Error generando mensajes de WhatsApp:', whatsappError);
        // No fallar la creación de la propiedad por errores de WhatsApp
      }
      
      return newProperty;
    } catch (error) {
      console.error('Error al agregar propiedad:', error);
      throw error;
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>) => {
    try {
      const updateData: any = {};
      if (propertyData.title) updateData.title = propertyData.title;
      if (propertyData.description) updateData.description = propertyData.description;
      if (propertyData.price) updateData.price = propertyData.price;
      if (propertyData.type) updateData.type = propertyData.type;
      if (propertyData.propertyType) updateData.property_type = propertyData.propertyType;
      if (propertyData.bedrooms) updateData.bedrooms = propertyData.bedrooms;
      if (propertyData.bathrooms) updateData.bathrooms = propertyData.bathrooms;
      if (propertyData.area) updateData.area = propertyData.area;
      if (propertyData.location) updateData.location = propertyData.location;
      if (propertyData.address) updateData.address = propertyData.address;
      if (propertyData.images) updateData.images = propertyData.images;
      if (propertyData.media) updateData.media = propertyData.media; // NUEVO: Guardar campo media
      if (propertyData.features) updateData.features = propertyData.features;
      if (propertyData.status) updateData.status = propertyData.status;

      const updatedProperty = await propertyService.update(id, updateData);
      const convertedProperty = propertyDBToProperty(updatedProperty);
      
      setProperties(prev => prev.map(p => p.id === id ? convertedProperty : p));
    } catch (error) {
      console.error('Error al actualizar propiedad:', error);
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await propertyService.delete(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      throw error;
    }
  };

  // Client functions
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const insertData = clientToClientInsert(clientData);
      const newClientDB = await clientService.create(insertData);
      const newClient = clientDBToClient(newClientDB);
      
      setClients(prev => [newClient, ...prev]);
    } catch (error) {
      console.error('Error al agregar cliente:', error);
      throw error;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      console.log('🔄 Actualizando cliente con nueva estructura:', id, clientData);
      
      // 🎯 MAPEO DIRECTO CON LA NUEVA ESTRUCTURA
      const updateData: any = {};
      
      // Campos básicos
      if (clientData.name) updateData.name = clientData.name;
      if (clientData.email) updateData.email = clientData.email;
      if (clientData.phone) updateData.phone = clientData.phone;
      if (clientData.vendedorId) updateData.vendedor_id = clientData.vendedorId;

      // Nueva estructura - Mapeo directo
      if (clientData.type !== undefined) updateData.type = clientData.type;
      if (clientData.ubication !== undefined) updateData.ubication = clientData.ubication;
      
      // Presupuesto
      if (clientData.budgetMin !== undefined) updateData.budget_min = clientData.budgetMin;
      if (clientData.budgetMax !== undefined) updateData.budget_max = clientData.budgetMax;
      
      // Habitaciones
      if (clientData.roomsMin !== undefined) updateData.rooms_min = clientData.roomsMin;
      if (clientData.roomsMax !== undefined) updateData.rooms_max = clientData.roomsMax;
      
      // Baños
      if (clientData.bathroomsMin !== undefined) updateData.bathrooms_min = clientData.bathroomsMin;
      if (clientData.bathroomsMax !== undefined) updateData.bathrooms_max = clientData.bathroomsMax;
      
      // Área
      if (clientData.areaMin !== undefined) updateData.area_min = clientData.areaMin;
      if (clientData.areaMax !== undefined) updateData.area_max = clientData.areaMax;
      
      // Características
      if (clientData.characteristics !== undefined) updateData.characteristics = clientData.characteristics;

      console.log('📝 Datos a enviar a BD (nueva estructura):', updateData);

      const updatedClient = await clientService.update(id, updateData);
      const convertedClient = clientDBToClient(updatedClient);
      
      setClients(prev => prev.map(c => c.id === id ? convertedClient : c));
      
      console.log('✅ Cliente actualizado exitosamente con nueva estructura');
    } catch (error) {
      console.error('❌ Error al actualizar cliente:', error);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await clientService.delete(id);
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  };

  // Visit functions
  const addVisit = async (visitData: Omit<Visit, 'id' | 'createdAt'>) => {
    try {
      const insertData = visitToVisitInsert(visitData);
      const newVisitDB = await visitService.create(insertData);
      const newVisit = visitDBToVisit(newVisitDB);
      
      setVisits(prev => [newVisit, ...prev]);
    } catch (error) {
      console.error('Error al agregar visita:', error);
      throw error;
    }
  };

  const updateVisit = async (id: string, visitData: Partial<Visit>) => {
    try {
      console.log('🔄 Actualizando visita:', { id, visitData });
      
      // ✅ MAPEO DIRECTO Y SIMPLIFICADO
      const updateData: any = {};
      
      // Solo actualizar los campos que realmente están presentes
      if (visitData.status !== undefined) {
        updateData.status = visitData.status;
        console.log('📝 Actualizando estado a:', visitData.status);
      }
      if (visitData.propertyId !== undefined) updateData.property_id = visitData.propertyId;
      if (visitData.clientName !== undefined) updateData.client_name = visitData.clientName;
      if (visitData.clientEmail !== undefined) updateData.client_email = visitData.clientEmail;
      if (visitData.clientPhone !== undefined) updateData.client_phone = visitData.clientPhone;
      if (visitData.preferredDate !== undefined) updateData.preferred_date = visitData.preferredDate;
      if (visitData.preferredTime !== undefined) updateData.preferred_time = visitData.preferredTime;
      if (visitData.message !== undefined) updateData.message = visitData.message;
      if (visitData.vendedorId !== undefined) updateData.vendedor_id = visitData.vendedorId;

      console.log('🔧 Datos a actualizar en BD:', updateData);

      const updatedVisit = await visitService.update(id, updateData);
      console.log('✅ Visita actualizada en BD:', updatedVisit);
      
      const convertedVisit = visitDBToVisit(updatedVisit);
      console.log('🔄 Visita convertida:', convertedVisit);
      
      setVisits(prev => prev.map(v => v.id === id ? convertedVisit : v));
      console.log('✅ Estado local actualizado');
      
    } catch (error) {
      console.error('❌ Error detallado al actualizar visita:', error);
      throw error;
    }
  };

  const deleteVisit = async (id: string) => {
    try {
      await visitService.delete(id);
      setVisits(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error al eliminar visita:', error);
      throw error;
    }
  };

  // User functions
  const addUser = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
    try {
      const result = await createUserAsAdmin(userData.email, userData.password, {
        name: userData.name,
        role: userData.role,
        phone: userData.phone
      });

      if (result.success && result.user) {
        setUsers(prev => [result.user!, ...prev]);
      } else {
        throw new Error(result.error?.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const updateData: any = {};
      if (userData.name) updateData.name = userData.name;
      if (userData.email) updateData.email = userData.email;
      if (userData.role) updateData.role = userData.role;
      if (userData.phone !== undefined) updateData.phone = userData.phone;
      if (userData.isActive !== undefined) updateData.is_active = userData.isActive;

      const updatedProfile = await profileService.update(id, updateData);
      const convertedUser = profileToUser(updatedProfile);
      
      setUsers(prev => prev.map(u => u.id === id ? convertedUser : u));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await profileService.update(id, { is_active: false });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: false } : u));
    } catch (error) {
      console.error('Error al desactivar usuario:', error);
      throw error;
    }
  };

  const value: DataContextType = {
    properties,
    loadingProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    clients,
    loadingClients,
    addClient,
    updateClient,
    deleteClient,
    visits,
    loadingVisits,
    addVisit,
    updateVisit,
    deleteVisit,
    users,
    loadingUsers,
    addUser,
    updateUser,
    deleteUser,
    analytics,
    loadingAnalytics,
    refreshAnalytics,
    refreshProperties,
    refreshClients,
    refreshVisits,
    refreshUsers
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}