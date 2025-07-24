import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to the backend
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Dirección',
      details: ['Av. Providencia 1234, Oficina 567', 'Providencia, Santiago', 'Chile']
    },
    {
      icon: Phone,
      title: 'Teléfonos',
      details: ['+56 2 2345 6789', '+56 9 8765 4321', 'WhatsApp: +56 9 1234 5678']
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@axtell.cl', 'ventas@axtell.cl', 'soporte@axtell.cl']
    },
    {
      icon: Clock,
      title: 'Horarios',
      details: ['Lunes a Viernes: 9:00 - 18:00', 'Sábados: 10:00 - 14:00', 'Domingos: Cerrado']
    }
  ];

  const offices = [
    {
      name: 'Oficina Principal - Providencia',
      address: 'Av. Providencia 1234, Oficina 567',
      phone: '+56 2 2345 6789',
      manager: 'Carlos Mendoza'
    },
    {
      name: 'Sucursal Las Condes',
      address: 'Av. Kennedy 5678, Local 123',
      phone: '+56 2 3456 7890',
      manager: 'María González'
    },
    {
      name: 'Sucursal Vitacura',
      address: 'Av. Vitacura 9012, Oficina 345',
      phone: '+56 2 4567 8901',
      manager: 'Juan Pérez'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contáctanos
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Estamos aquí para ayudarte a encontrar la propiedad de tus sueños
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envíanos un mensaje
              </h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-gray-600">
                    Gracias por contactarnos. Te responderemos pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Tu nombre"
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
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asunto *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="compra">Compra de propiedad</option>
                        <option value="venta">Venta de propiedad</option>
                        <option value="arriendo">Arriendo</option>
                        <option value="tasacion">Tasación</option>
                        <option value="inversion">Asesoría de inversión</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Enviar mensaje</span>
                  </button>
                </form>
              )}
            </div>

            {/* Map and Offices */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Mapa interactivo</p>
                    <p className="text-sm">Av. Providencia 1234, Santiago</p>
                  </div>
                </div>
              </div>

              {/* Offices */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Nuestras Oficinas</h3>
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <div key={index} className="border-l-4 border-red-600 pl-4">
                      <h4 className="font-semibold text-gray-900">{office.name}</h4>
                      <p className="text-gray-600 text-sm">{office.address}</p>
                      <p className="text-gray-600 text-sm">{office.phone}</p>
                      <p className="text-gray-600 text-sm">Gerente: {office.manager}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Respuestas a las consultas más comunes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Cuánto tiempo toma vender una propiedad?</h3>
                <p className="text-gray-600">El tiempo promedio de venta varía entre 60 a 120 días, dependiendo del tipo de propiedad, ubicación y condiciones del mercado.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Ofrecen servicios de tasación?</h3>
                <p className="text-gray-600">Sí, contamos con tasadores certificados que pueden evaluar tu propiedad de manera profesional y precisa.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Cuáles son sus comisiones?</h3>
                <p className="text-gray-600">Nuestras comisiones son competitivas y varían según el tipo de servicio. Te proporcionaremos un presupuesto detallado sin compromiso.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Ayudan con el financiamiento?</h3>
                <p className="text-gray-600">Sí, tenemos convenios con las principales instituciones financieras para ayudarte a obtener el mejor crédito hipotecario.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Atienden fines de semana?</h3>
                <p className="text-gray-600">Sí, atendemos los sábados de 10:00 a 14:00 y podemos coordinar visitas los domingos con cita previa.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">¿Tienen propiedades en otras regiones?</h3>
                <p className="text-gray-600">Actualmente nos enfocamos en la Región Metropolitana, pero podemos ayudarte a contactar socios en otras regiones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}