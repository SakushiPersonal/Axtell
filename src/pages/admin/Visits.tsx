import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Visit } from '../../types';

export default function AdminVisits() {
  const { user } = useAuth();
  const { visits, properties, updateVisit, deleteVisit, refreshVisits, refreshProperties } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);

  useEffect(() => {
    if (user) {
      refreshVisits();
      refreshProperties();
    }
  }, [user]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  // Todos los usuarios autenticados (vendedores y admins) pueden ver todas las visitas
  const userVisits = visits;

  // Apply search and filters
  const filteredVisits = userVisits.filter(visit => {
    const matchesSearch = visit.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.clientPhone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (visitId: string, newStatus: Visit['status']) => {
    try {
      await updateVisit(visitId, { status: newStatus });
      setEditingVisit(null);

    } catch (error) {
      console.error('Error al actualizar visita:', error);
      alert('Error al actualizar el estado de la visita. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta visita?')) {
      deleteVisit(id);
    }
  };

  const getPropertyTitle = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.title : 'Propiedad no encontrada';
  };

  const getStatusColor = (status: Visit['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Visit['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Visit['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'completed':
        return '🎉';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  if (!user.role || (user.role !== 'admin' && user.role !== 'vendedor')) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Visitas</h1>
          <p className="text-gray-600">
            {user.role === 'admin' ? 'Administra todas las visitas del sistema' : 'Administra todas las visitas'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {filteredVisits.length} visitas
          </div>
        </div>
      </div>

      {/* Visits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVisits.map((visit) => (
          <div key={visit.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{visit.clientName}</h3>
                  <p className="text-sm text-gray-500">{getPropertyTitle(visit.propertyId)}</p>
                </div>
              </div>
              {/* 🎯 BOTONES SIMPLIFICADOS - Solo cambio de estado y eliminar */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingVisit(visit)}
                  className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                  title="Cambiar estado de la visita"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(visit.id)}
                  className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Eliminar visita"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{visit.preferredDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{visit.preferredTime}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{visit.clientEmail}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{visit.clientPhone}</span>
              </div>

              {visit.message && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Mensaje del cliente: </span>
                  <span className="italic">"{visit.message}"</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className={`px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(visit.status)}`}>
                  <span className="mr-2">{getStatusIcon(visit.status)}</span>
                  {getStatusText(visit.status)}
                </div>
                <span className="text-xs text-gray-500">
                  Creada: {visit.createdAt}
                </span>
              </div>

              {/* 🎯 INFORMACIÓN CONTEXTUAL POR ESTADO - Solo visual, sin botones redundantes */}
              {visit.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-yellow-800 font-medium text-sm">
                    ⏳ Visita Pendiente
                  </div>
                  <div className="text-yellow-600 text-xs mt-1">
                    Usa el botón de editar para confirmar o cancelar
                  </div>
                </div>
              )}

              {visit.status === 'confirmed' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-blue-800 font-medium text-sm">
                    ✅ Visita Confirmada
                  </div>
                  <div className="text-blue-600 text-xs mt-1">
                    Recordar contactar al cliente antes de la fecha
                  </div>
                </div>
              )}

              {visit.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-green-800 font-medium text-sm">
                    🎉 Visita Completada
                  </div>
                  <div className="text-green-600 text-xs mt-1">
                    Esta visita fue realizada exitosamente
                  </div>
                </div>
              )}

              {visit.status === 'cancelled' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-red-800 font-medium text-sm">
                    ❌ Visita Cancelada
                  </div>
                  <div className="text-red-600 text-xs mt-1">
                    Esta visita fue cancelada
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredVisits.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron visitas.</p>
        </div>
      )}

      {/* 🎯 MODAL MEJORADO PARA CAMBIO DE ESTADO */}
      {editingVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Edit className="w-5 h-5 mr-2 text-indigo-600" />
              Cambiar Estado de Visita
            </h3>
            
            <div className="space-y-4">
              {/* Información de la visita */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Cliente:</span> {editingVisit.clientName}</p>
                  <p><span className="font-medium">Propiedad:</span> {getPropertyTitle(editingVisit.propertyId)}</p>
                  <p><span className="font-medium">Fecha:</span> {editingVisit.preferredDate} a las {editingVisit.preferredTime}</p>
                  <p><span className="font-medium">Estado actual:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(editingVisit.status)}`}>
                      {getStatusIcon(editingVisit.status)} {getStatusText(editingVisit.status)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Opciones de estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecciona el nuevo estado:
                </label>
                <div className="space-y-2">
                  {[
                    { status: 'pending', description: 'La visita está pendiente de confirmación' },
                    { status: 'confirmed', description: 'La visita ha sido confirmada con el cliente' },
                    { status: 'completed', description: 'La visita se realizó exitosamente' },
                    { status: 'cancelled', description: 'La visita fue cancelada' }
                  ].map(({ status, description }) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(editingVisit.id, status as Visit['status'])}
                      className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md ${
                        editingVisit.status === status
                          ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                          : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                      disabled={editingVisit.status === status}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(status as Visit['status'])}`}>
                            {getStatusIcon(status as Visit['status'])} {getStatusText(status as Visit['status'])}
                          </span>
                          {editingVisit.status === status && (
                            <span className="ml-2 text-xs text-indigo-600 font-medium">(Actual)</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setEditingVisit(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}