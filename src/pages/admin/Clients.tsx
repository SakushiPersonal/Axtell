import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Client } from '../../types';

export default function AdminClients() {
  const { user } = useAuth();
  const { clients, addClient, updateClient, deleteClient, refreshClients } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'ambas' as 'venta' | 'arriendo' | 'ambas',
    ubication: '',
    budgetMin: undefined as number | undefined,
    budgetMax: undefined as number | undefined,
    roomsMin: undefined as number | undefined,
    roomsMax: undefined as number | undefined,
    bathroomsMin: undefined as number | undefined,
    bathroomsMax: undefined as number | undefined,
    areaMin: undefined as number | undefined,
    areaMax: undefined as number | undefined,
    characteristics: ''
  });

  useEffect(() => {
    if (user) {
      refreshClients();
    }
  }, [user]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  // Todos los usuarios autenticados (vendedores y admins) pueden ver todos los clientes
  const userClients = clients;

  // Apply search filter
  const filteredClients = userClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const clientData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: formData.type,
        ubication: formData.ubication || undefined,
        budgetMin: formData.budgetMin,
        budgetMax: formData.budgetMax,
        roomsMin: formData.roomsMin,
        roomsMax: formData.roomsMax,
        bathroomsMin: formData.bathroomsMin,
        bathroomsMax: formData.bathroomsMax,
        areaMin: formData.areaMin,
        areaMax: formData.areaMax,
        characteristics: formData.characteristics || undefined,
        vendedorId: user.role === 'vendedor' ? user.id : undefined
      };

      if (editingClient) {
        await updateClient(editingClient.id, clientData);
      } else {
        await addClient(clientData);
      }

      resetForm();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      alert('Error al guardar el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: 'ambas',
      ubication: '',
      budgetMin: undefined,
      budgetMax: undefined,
      roomsMin: undefined,
      roomsMax: undefined,
      bathroomsMin: undefined,
      bathroomsMax: undefined,
      areaMin: undefined,
      areaMax: undefined,
      characteristics: ''
    });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client: Client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      type: client.type || 'ambas',
      ubication: client.ubication || '',
      budgetMin: client.budgetMin,
      budgetMax: client.budgetMax,
      roomsMin: client.roomsMin,
      roomsMax: client.roomsMax,
      bathroomsMin: client.bathroomsMin,
      bathroomsMax: client.bathroomsMax,
      areaMin: client.areaMin,
      areaMax: client.areaMax,
      characteristics: client.characteristics || ''
    });
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      deleteClient(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600">
            {user.role === 'admin' ? 'Administra todos los clientes del sistema' : 'Administra todos los clientes'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar clientes por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-500">Cliente desde {client.createdAt}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
              
              {client.type && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Busca: </span>
                  <span className="text-gray-600 capitalize">{client.type}</span>
                </div>
              )}

              {client.ubication && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Ubicación: </span>
                  <span className="text-gray-600">{client.ubication}</span>
                </div>
              )}

              {(client.budgetMin !== undefined || client.budgetMax !== undefined) && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Presupuesto: </span>
                  <span className="text-gray-600">
                    {client.budgetMin !== undefined && formatPrice(client.budgetMin)}
                    {client.budgetMin !== undefined && client.budgetMax !== undefined && ' - '}
                    {client.budgetMax !== undefined && formatPrice(client.budgetMax)}
                  </span>
                </div>
              )}

              {(client.roomsMin !== undefined || client.roomsMax !== undefined) && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Habitaciones: </span>
                  <span className="text-gray-600">
                    {client.roomsMin !== undefined && client.roomsMin}
                    {client.roomsMin !== undefined && client.roomsMax !== undefined && ' - '}
                    {client.roomsMax !== undefined && client.roomsMax}
                  </span>
                </div>
              )}

              {client.characteristics && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Características: </span>
                  <span className="text-gray-600">{client.characteristics}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron clientes.</p>
        </div>
      )}

      {/* Client Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información básica */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">📋 Información Personal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono * 📱
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+56 9 XXXX XXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      📱 Número para notificaciones WhatsApp automáticas
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3">Criterios de Búsqueda (Para Notificaciones Automáticas)</h4>
                  
                  {/* Tipo de operación */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Operación</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'venta' | 'arriendo' | 'ambas' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="venta">Venta</option>
                      <option value="arriendo">Arriendo</option>
                      <option value="ambas">Ambas</option>
                    </select>
                  </div>

                  {/* Ubicación */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación Preferida</label>
                    <input 
                      type="text"
                      value={formData.ubication}
                      onChange={(e) => setFormData(prev => ({ ...prev, ubication: e.target.value }))}
                      placeholder="Ej: Las Condes, Viña del Mar, Valparaíso, Concepción..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Escribe cualquier ciudad, comuna o región donde el cliente desee buscar propiedades
                    </p>
                  </div>

                  {/* Presupuesto */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto Mínimo</label>
                      <input 
                        type="number"
                        value={formData.budgetMin || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          budgetMin: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        placeholder="Ej: 50000000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto Máximo</label>
                      <input 
                        type="number"
                        value={formData.budgetMax || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          budgetMax: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        placeholder="Ej: 150000000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Habitaciones */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones Mínimas</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="10"
                        value={formData.roomsMin || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          roomsMin: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones Máximas</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="10"
                        value={formData.roomsMax || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          roomsMax: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Baños */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Baños Mínimos</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="10"
                        value={formData.bathroomsMin || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          bathroomsMin: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Baños Máximos</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="10"
                        value={formData.bathroomsMax || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          bathroomsMax: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Área */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Área Mínima (m²)</label>
                      <input 
                        type="number"
                        value={formData.areaMin || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          areaMin: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        placeholder="Ej: 80"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Área Máxima (m²)</label>
                      <input 
                        type="number"
                        value={formData.areaMax || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          areaMax: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        placeholder="Ej: 200"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Características */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Características Deseadas</label>
                    <textarea
                      value={formData.characteristics}
                      onChange={(e) => setFormData(prev => ({ ...prev, characteristics: e.target.value }))}
                      placeholder="Piscina, quincho, jardín, estacionamiento, etc."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500">
                      Separar con comas. Ej: piscina, quincho, jardín
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-800">
                      ✅ <strong>Sistema de Matching Automático:</strong> Cuando se publique una propiedad que coincida con estos criterios, 
                      el cliente recibirá automáticamente una notificación por WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Guardando...' : editingClient ? 'Actualizar' : 'Crear'} Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}