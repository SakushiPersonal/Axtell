import React, { createContext, useContext, useState, useEffect } from 'react';
import { WhatsAppMessage, WhatsAppStats } from '../types';
import { whatsappMessageService } from '../supabase/database';

interface WhatsAppContextType {
  // Estado
  messages: WhatsAppMessage[];
  stats: WhatsAppStats;
  loading: boolean;
  
  // Acciones
  refreshMessages: () => Promise<void>;
  sendMessage: (message: WhatsAppMessage) => Promise<void>;
  sendAllPending: () => Promise<void>;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar mensajes desde la base de datos
  const refreshMessages = async () => {
    try {
      setLoading(true);
      const data = await whatsappMessageService.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Error cargando mensajes de WhatsApp:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar mensajes al iniciar
  useEffect(() => {
    refreshMessages();
  }, []);

  // Calcular estadísticas simplificadas
  const stats: WhatsAppStats = React.useMemo(() => {
    return {
      pendingMessages: messages.length, // Todos los mensajes en la DB son pendientes
    };
  }, [messages]);

  // Acciones
  const sendMessage = async (message: WhatsAppMessage) => {
    try {
      window.open(message.whatsapp_url, '_blank');
      await whatsappMessageService.delete(message.id);
      setMessages(prev => prev.filter(m => m.id !== message.id));
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const sendAllPending = async () => {
    try {
      // Abrir todas las URLs de WhatsApp
      messages.forEach((message, index) => {
        setTimeout(() => {
          window.open(message.whatsapp_url, `_blank_${message.id}`);
        }, index * 200);
      });
      
      // Eliminar todos los mensajes de la base de datos
      const messageIds = messages.map(m => m.id);
      await whatsappMessageService.deleteMany(messageIds);
      
      // Limpiar la lista local
      setMessages([]);
    } catch (error) {
      console.error('Error enviando mensajes:', error);
    }
  };

  const value: WhatsAppContextType = {
    messages,
    stats,
    loading,
    refreshMessages,
    sendMessage,
    sendAllPending,
  };

  return (
    <WhatsAppContext.Provider value={value}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error('useWhatsApp debe usarse dentro de un WhatsAppProvider');
  }
  return context;
} 