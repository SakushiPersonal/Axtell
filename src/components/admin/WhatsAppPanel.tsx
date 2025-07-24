import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  CheckCircle, 
  Clock, 
  Eye, 
  ExternalLink,
  Play,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { useWhatsApp } from '../../contexts/WhatsAppContext';
import { WhatsAppMessage } from '../../types';

export default function WhatsAppPanel() {
  const {
    messages,
    stats,
    loading,
    refreshMessages,
    sendMessage,
    sendAllPending
  } = useWhatsApp();

  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MessageCard = ({ message }: { message: WhatsAppMessage }) => (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">{message.client_name}</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock className="w-3 h-3 mr-1" />
                Pendiente
              </span>
            </div>
            <p className="text-sm text-gray-600">{message.client_phone}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{formatDate(message.created_at)}</p>
        </div>
      </div>

      <div className="mb-3">
        <h5 className="font-medium text-gray-900 mb-1">{message.property_title}</h5>
        <p className="text-sm text-gray-600">{formatPrice(message.property_price)}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => sendMessage(message)}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Send className="w-4 h-4 mr-1" />
            Enviar
          </button>
          <button
            onClick={() => window.open(message.whatsapp_url, '_blank')}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Abrir WhatsApp
          </button>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(message.message);
            alert('Mensaje copiado al portapapeles');
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
          title="Copiar mensaje"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-8 h-8 mr-3 text-green-600" />
            WhatsApp
          </h1>
          <p className="text-gray-600">Gestión de mensajes automáticos</p>
        </div>
        
        {messages.length > 0 && (
          <div className="flex space-x-3">
            <button
              onClick={refreshMessages}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
            <button
              onClick={sendAllPending}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              disabled={loading}
            >
              <Play className="w-5 h-5" />
              <span>Enviar Todos ({messages.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Card - Simplificado */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mensajes Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingMessages}</p>
              <p className="text-sm text-gray-500 mt-1">
                {loading ? 'Actualizando...' : 'Listos para enviar'}
              </p>
            </div>
            <MessageCircle className="w-12 h-12 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mensajes...</p>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mensajes Pendientes ({messages.length})</h3>
            {messages.map(message => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes pendientes</h3>
            <p className="text-gray-600">Los nuevos mensajes aparecerán cuando agregues propiedades que coincidan con clientes.</p>
            <button
              onClick={refreshMessages}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              Actualizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 