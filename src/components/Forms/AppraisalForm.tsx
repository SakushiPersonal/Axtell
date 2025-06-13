import React, { useState } from 'react';
import { AppraisalRequest } from '../../types';
import { X, Home, User, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

interface AppraisalFormProps {
  onClose: () => void;
  onSubmit: (appraisalData: Partial<AppraisalRequest>) => void;
}

const AppraisalForm: React.FC<AppraisalFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    propertyType: 'casa',
    propertyAddress: '',
    propertyArea: '',
    propertyBedrooms: '',
    propertyBathrooms: '',
    propertyDescription: '',
    preferredContactMethod: 'email' as 'email' | 'phone'
  });

  const propertyTypes = [
    { value: 'casa', label: 'Casa' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'comercial', label: 'Local Comercial' },
    { value: 'oficina', label: 'Oficina' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appraisalData: Partial<AppraisalRequest> = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      propertyType: formData.propertyType,
      propertyAddress: formData.propertyAddress,
      propertyArea: formData.propertyArea ? Number(formData.propertyArea) : undefined,
      propertyBedrooms: formData.propertyBedrooms ? Number(formData.propertyBedrooms) : undefined,
      propertyBathrooms: formData.propertyBathrooms ? Number(formData.propertyBathrooms) : undefined,
      propertyDescription: formData.propertyDescription,
      preferredContactMethod: formData.preferredContactMethod,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSubmit(appraisalData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Solicitar Tasación</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Completa el formulario y nos pondremos en contacto contigo para realizar una tasación gratuita de tu propiedad.
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
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
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
                  value={formData.clientPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
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
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Propiedad</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Home className="h-4 w-4 inline mr-2" />
                  Tipo de propiedad *
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
                  Superficie (m²)
                </label>
                <input
                  type="number"
                  value={formData.propertyArea}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyArea: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: 120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dormitorios
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.propertyBedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyBedrooms: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baños
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.propertyBathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyBathrooms: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: 2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Dirección *
                </label>
                <input
                  type="text"
                  required
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Dirección completa de la propiedad"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Descripción de la propiedad *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.propertyDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describe tu propiedad: antigüedad, estado, características especiales, etc."
                />
              </div>
            </div>
          </div>

          {/* Contact Preference */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencia de Contacto</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={formData.preferredContactMethod === 'email'}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredContactMethod: e.target.value as 'email' }))}
                  className="mr-2"
                />
                <Mail className="h-4 w-4 mr-2" />
                Contacto por email
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={formData.preferredContactMethod === 'phone'}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredContactMethod: e.target.value as 'phone' }))}
                  className="mr-2"
                />
                <Phone className="h-4 w-4 mr-2" />
                Contacto telefónico
              </label>
            </div>
          </div>

          {/* Information Notice */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">¿Qué incluye nuestra tasación?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Análisis del mercado inmobiliario local</li>
              <li>• Evaluación de características y estado de la propiedad</li>
              <li>• Comparación con propiedades similares</li>
              <li>• Informe detallado con valor estimado</li>
              <li>• Asesoramiento para maximizar el valor de venta</li>
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
              Solicitar Tasación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppraisalForm;