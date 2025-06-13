import React, { useState } from 'react';
import { Property, VisitRequest } from '../../types';
import { X, Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';

interface VisitSchedulerProps {
  property: Property;
  onClose: () => void;
  onSchedule: (visitData: Partial<VisitRequest>) => void;
}

const VisitScheduler: React.FC<VisitSchedulerProps> = ({ property, onClose, onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const getDayName = (dayCode: string) => {
    const days: { [key: string]: string } = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return days[dayCode] || dayCode;
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
      
      if (property.availableVisitDays.includes(dayName)) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('es-CL', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return dates;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !clientData.name || !clientData.email || !clientData.phone) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const visitData: Partial<VisitRequest> = {
      propertyId: property.id,
      propertyTitle: property.title,
      clientName: clientData.name,
      clientEmail: clientData.email,
      clientPhone: clientData.phone,
      requestedDate: selectedDate,
      requestedTime: selectedTime,
      message: clientData.message,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSchedule(visitData);
  };

  const availableDates = getAvailableDates();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Agendar Visita</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Property Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-start space-x-4">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-20 h-16 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.location.address}, {property.location.neighborhood}</p>
                <p className="text-sm text-gray-500">Agente: {property.agent.name}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Selecciona una fecha
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Selecciona una fecha</option>
                {availableDates.map(date => (
                  <option key={date.date} value={date.date}>
                    {date.display}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-2" />
                Selecciona un horario
              </label>
              <div className="grid grid-cols-3 gap-2">
                {property.availableVisitHours.map(hour => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => setSelectedTime(hour)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      selectedTime === hour
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="h-4 w-4 inline mr-2" />
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientData.name}
                    onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
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
                    value={clientData.phone}
                    onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
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
                    value={clientData.email}
                    onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    Mensaje adicional (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={clientData.message}
                    onChange={(e) => setClientData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Cuéntanos sobre tu interés en esta propiedad..."
                  />
                </div>
              </div>
            </div>

            {/* Available Days Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Días disponibles para visitas:</h4>
              <div className="flex flex-wrap gap-2">
                {property.availableVisitDays.map(day => (
                  <span key={day} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {getDayName(day)}
                  </span>
                ))}
              </div>
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
                Agendar Visita
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitScheduler;