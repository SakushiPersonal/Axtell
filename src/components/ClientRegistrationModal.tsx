import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, DollarSign, Home, MessageCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface ClientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientRegistrationModal({ isOpen, onClose }: ClientRegistrationModalProps) {
  const { addClient } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // 🎯 NUEVA ESTRUCTURA SIMPLE
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 🎯 MAPEO DIRECTO DE LA NUEVA ESTRUCTURA
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
        characteristics: formData.characteristics || undefined
      };

      await addClient(clientData);
      setSubmitSuccess(true);
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      alert('Error al registrar. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitSuccess(false);
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
    onClose();
  };

  if (!isOpen) return null;

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Registro Exitoso!</h3>
          <p className="text-gray-600 mb-4">
            Gracias por registrarte. Te contactaremos pronto con propiedades que coincidan con tus criterios.
          </p>
          <div className="text-sm text-gray-500">
            Cerrando automáticamente...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Regístrate para recibir nuevas propiedades</h3>
              <p className="text-gray-600 text-sm mt-1">Te notificaremos cuando tengamos propiedades que coincidan con tus criterios</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-red-600" />
                Información Personal
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="+56 9 1234 5678"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* 🎯 NUEVA ESTRUCTURA SIMPLE - Criterios de Búsqueda */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 flex items-center">
                <Home className="w-5 h-5 mr-2 text-red-600" />
                ¿Qué tipo de propiedad buscas?
              </h4>
              
              {/* Tipo de Operación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de operación
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: 'venta', label: 'Venta' },
                    { value: 'arriendo', label: 'Arriendo' },
                    { value: 'ambas', label: 'Ambas' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        type: option.value as 'venta' | 'arriendo' | 'ambas'
                      }))}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        formData.type === option.value
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      disabled={isSubmitting}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ubicación preferida
                </label>
                <select
                  value={formData.ubication}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    ubication: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  <option value="">Cualquier ubicación</option>
                  <option value="Las Condes">Las Condes</option>
                  <option value="Providencia">Providencia</option>
                  <option value="Ñuñoa">Ñuñoa</option>
                  <option value="Vitacura">Vitacura</option>
                  <option value="Lo Barnechea">Lo Barnechea</option>
                  <option value="La Reina">La Reina</option>
                  <option value="Santiago Centro">Santiago Centro</option>
                  <option value="San Miguel">San Miguel</option>
                  <option value="Maipú">Maipú</option>
                  <option value="Puente Alto">Puente Alto</option>
                  <option value="La Florida">La Florida</option>
                </select>
              </div>

              {/* Presupuesto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Presupuesto (CLP)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      value={formData.budgetMin || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        budgetMin: e.target.value ? parseInt(e.target.value) : undefined
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Mínimo"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={formData.budgetMax || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        budgetMax: e.target.value ? parseInt(e.target.value) : undefined
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Máximo"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Habitaciones y Baños */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habitaciones
                  </label>
                  <div className="grid grid-cols-2 gap-2">
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
                      placeholder="Mín."
                      disabled={isSubmitting}
                    />
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
                      placeholder="Máx."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baños
                  </label>
                  <div className="grid grid-cols-2 gap-2">
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
                      placeholder="Mín."
                      disabled={isSubmitting}
                    />
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
                      placeholder="Máx."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Área */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área (m²)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={formData.areaMin || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      areaMin: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Mínimo"
                    disabled={isSubmitting}
                  />
                  <input
                    type="number"
                    value={formData.areaMax || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      areaMax: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Máximo"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Características */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Características deseadas (opcional)
                </label>
                <textarea
                  value={formData.characteristics}
                  onChange={(e) => setFormData(prev => ({ ...prev, characteristics: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Piscina, quincho, jardín, estacionamiento..."
                  rows={3}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separar con comas. Ej: piscina, quincho, jardín
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrando...' : 'Registrarme'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 