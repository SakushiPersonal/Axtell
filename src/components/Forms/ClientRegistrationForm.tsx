import React, { useState } from 'react';
import { Client } from '../../types';
import { X, User, Phone, Mail, MessageSquare, MapPin } from 'lucide-react';

interface ClientRegistrationFormProps {
  onClose: () => void;
  onSubmit: (clientData: Partial<Client>) => void;
}

const ClientRegistrationForm: React.FC<ClientRegistrationFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Santiago',
    interests: '',
    budget: '',
    propertyType: 'casa',
    notes: ''
  });

  const propertyTypes = [
    { value: 'casa', label: 'Casa' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'comercial', label: 'Local Comercial' },
    { value: 'oficina', label: 'Oficina' }
  ];

  const cities = [
    'Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData: Partial<Client> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      interests: formData.interests,
      budget: formData.budget ? Number(formData.budget) : undefined,
      propertyType: formData.propertyType,
      notes: formData.notes,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSubmit(clientData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Registro de Cliente</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Completa tus datos para que nuestro equipo pueda contactarte y ayudarte a encontrar la propiedad ideal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="h-4 w-4 inline mr-2" />
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Ciudad
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección actual (opcional)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Tu dirección actual"
                />
              </div>
            </div>
          </div>

          {/* Property Interests */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Intereses de Propiedad</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de propiedad de interés
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presupuesto aproximado (CLP)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: 150000000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intereses específicos
                </label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: Cerca de colegios, con jardín, en zona tranquila..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Comentarios adicionales
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Cuéntanos más sobre lo que buscas..."
                />
              </div>
            </div>
          </div>

          {/* Information Notice */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">¿Qué sucede después?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Nuestro equipo revisará tu información</li>
              <li>• Te contactaremos en las próximas 24 horas</li>
              <li>• Te enviaremos propiedades que coincidan con tus intereses</li>
              <li>• Coordinaremos visitas a las propiedades que te interesen</li>
              <li>• Te acompañaremos en todo el proceso de compra o alquiler</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Registrarme
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientRegistrationForm;