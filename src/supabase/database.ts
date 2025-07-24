import { supabase } from './supabaseClient';
import { 
  ProfileDB, PropertyDB, ClientDB, VisitDB, WhatsAppMessageDB,
  ProfileInsert, PropertyInsert, ClientInsert, VisitInsert, WhatsAppMessageInsert,
  ProfileUpdate, PropertyUpdate, ClientUpdate, VisitUpdate
} from '../types/database';
import { whatsappMessageDBToWhatsAppMessage } from '../utils/databaseConverters';

// ==================== PROFILES ====================

export const profileService = {
  // Obtener todos los perfiles
  async getAll(): Promise<ProfileDB[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Obtener perfil por ID
  async getById(id: string): Promise<ProfileDB | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 es "no rows returned"
    return data;
  },

  // Crear nuevo perfil (cuando se registra un usuario)
  async create(profile: ProfileInsert): Promise<ProfileDB> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Actualizar perfil
  async update(id: string, updates: ProfileUpdate): Promise<ProfileDB> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Eliminar perfil (desactivar)
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ==================== PROPERTIES ====================

export const propertyService = {
  // Obtener todas las propiedades
  async getAll(): Promise<PropertyDB[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        captador:profiles!captador_id(name, email)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Obtener propiedad por ID
  async getById(id: string): Promise<PropertyDB | null> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        captador:profiles!captador_id(name, email)
      `)
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Crear nueva propiedad
  async create(property: PropertyInsert): Promise<PropertyDB> {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Actualizar propiedad
  async update(id: string, updates: PropertyUpdate): Promise<PropertyDB> {
    const { data, error } = await supabase
      .from('properties')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Eliminar propiedad
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Incrementar vistas de propiedad
  async incrementViews(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_property_views', {
      property_id: id
    });
    
    if (error) throw error;
  },

  // Obtener propiedades por captador
  async getByCaptador(captadorId: string): Promise<PropertyDB[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('captador_id', captadorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// ==================== CLIENTS ====================

export const clientService = {
  // Obtener todos los clientes
  async getAll(): Promise<ClientDB[]> {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        vendedor:profiles!vendedor_id(name, email)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Obtener cliente por ID
  async getById(id: string): Promise<ClientDB | null> {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        vendedor:profiles!vendedor_id(name, email)
      `)
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Crear nuevo cliente
  async create(client: ClientInsert): Promise<ClientDB> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Actualizar cliente
  async update(id: string, updates: ClientUpdate): Promise<ClientDB> {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Eliminar cliente
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Obtener clientes por vendedor
  async getByVendedor(vendedorId: string): Promise<ClientDB[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('vendedor_id', vendedorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// ==================== VISITS ====================

export const visitService = {
  // Obtener todas las visitas
  async getAll(): Promise<VisitDB[]> {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        property:properties!property_id(title, address),
        vendedor:profiles!vendedor_id(name, email)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Obtener visita por ID
  async getById(id: string): Promise<VisitDB | null> {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        property:properties!property_id(title, address),
        vendedor:profiles!vendedor_id(name, email)
      `)
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Crear nueva visita
  async create(visit: VisitInsert): Promise<VisitDB> {
    const { data, error } = await supabase
      .from('visits')
      .insert(visit)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Actualizar visita
  async update(id: string, updates: VisitUpdate): Promise<VisitDB> {
    try {
      console.log('🔧 visitService.update - ID:', id);
      console.log('🔧 visitService.update - Updates:', updates);
      
      // ✅ VERIFICAR QUE EL ID SEA VÁLIDO
      if (!id || typeof id !== 'string') {
        throw new Error('ID de visita inválido');
      }
      
      // ✅ VERIFICAR QUE HAYA DATOS PARA ACTUALIZAR
      if (!updates || Object.keys(updates).length === 0) {
        throw new Error('No hay datos para actualizar');
      }
      
      const { data, error } = await supabase
        .from('visits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error de Supabase:', error);
        throw new Error(`Error al actualizar visita: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No se pudo actualizar la visita - sin datos retornados');
      }
      
      console.log('✅ visitService.update - Resultado:', data);
      return data;
      
    } catch (error) {
      console.error('❌ visitService.update - Error completo:', error);
      throw error;
    }
  },

  // Eliminar visita
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('visits')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Obtener visitas por propiedad
  async getByProperty(propertyId: string): Promise<VisitDB[]> {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Obtener visitas por vendedor
  async getByVendedor(vendedorId: string): Promise<VisitDB[]> {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('vendedor_id', vendedorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Obtener visitas pendientes
  async getPending(): Promise<VisitDB[]> {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        property:properties!property_id(title, address)
      `)
      .eq('status', 'pending')
      .order('preferred_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
};

// ==================== ANALYTICS ====================

export const analyticsService = {
  // Obtener estadísticas básicas
  async getBasicStats() {
    const [
      { count: totalProperties },
      { count: totalClients },
      { count: pendingVisits },
      { data: viewsData }
    ] = await Promise.all([
      supabase.from('properties').select('*', { count: 'exact', head: true }),
      supabase.from('clients').select('*', { count: 'exact', head: true }),
      supabase.from('visits').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('properties').select('views')
    ]);

    const totalViews = viewsData?.reduce((sum, prop) => sum + (prop.views || 0), 0) || 0;

    return {
      totalProperties: totalProperties || 0,
      totalClients: totalClients || 0,
      totalViews,
      pendingVisits: pendingVisits || 0
    };
  },

  // Obtener propiedades más vistas
  async getTopProperties(limit: number = 5): Promise<PropertyDB[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('views', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Obtener actividad reciente
  async getRecentActivity(limit: number = 10) {
    const [visits, clients, properties] = await Promise.all([
      supabase
        .from('visits')
        .select('*, property:properties!property_id(title)')
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('properties')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(3)
    ]);

    const activity: Array<{
      id: string;
      type: 'visit' | 'client' | 'property';
      message: string;
      timestamp: string;
      status: string;
    }> = [];

    // Agregar visitas recientes
    visits.data?.forEach(visit => {
      activity.push({
        id: `visit-${visit.id}`,
        type: 'visit',
        message: `Nueva visita agendada para "${visit.property?.title || 'Propiedad'}"`,
        timestamp: visit.created_at,
        status: visit.status
      });
    });

    // Agregar clientes recientes
    clients.data?.forEach(client => {
      activity.push({
        id: `client-${client.id}`,
        type: 'client',
        message: `Nuevo cliente registrado: ${client.name}`,
        timestamp: client.created_at,
        status: 'new'
      });
    });

    // Agregar propiedades recientes
    properties.data?.forEach(property => {
      activity.push({
        id: `property-${property.id}`,
        type: 'property',
        message: `Propiedad actualizada: "${property.title}"`,
        timestamp: property.updated_at,
        status: property.status
      });
    });

    // Ordenar por timestamp y limitar
    return activity
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
};

// ==========================================
// 📱 SERVICIO DE MENSAJES WHATSAPP
// ==========================================
export const whatsappMessageService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return (data || []).map(whatsappMessageDBToWhatsAppMessage);
      
    } catch (error) {
      throw new Error(`Error al obtener mensajes WhatsApp: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  async create(messageData: WhatsAppMessageInsert) {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .insert([messageData])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('No se pudo crear el mensaje - sin datos retornados');
      }
      
      return whatsappMessageDBToWhatsAppMessage(data);
      
    } catch (error) {
      throw new Error(`Error al crear mensaje WhatsApp: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  async createMany(messagesData: WhatsAppMessageInsert[]) {
    try {
      if (messagesData.length === 0) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .insert(messagesData)
        .select();
      
      if (error) {
        throw error;
      }
      
      return (data || []).map(whatsappMessageDBToWhatsAppMessage);
      
    } catch (error) {
      throw new Error(`Error al crear mensajes WhatsApp: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  async delete(id: string) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('ID de mensaje inválido');
      }
      
      const { error } = await supabase
        .from('whatsapp_messages')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
    } catch (error) {
      throw new Error(`Error al eliminar mensaje WhatsApp: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  async deleteMany(ids: string[]) {
    try {
      if (ids.length === 0) {
        return;
      }
      
      const { error } = await supabase
        .from('whatsapp_messages')
        .delete()
        .in('id', ids);
      
      if (error) {
        throw error;
      }
      
    } catch (error) {
      throw new Error(`Error al eliminar mensajes WhatsApp: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  async getCount() {
    try {
      const { count, error } = await supabase
        .from('whatsapp_messages')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        throw error;
      }
      
      return count || 0;
      
    } catch (error) {
      throw new Error(`Error al contar mensajes WhatsApp: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}; 