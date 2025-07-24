import React, { useState, useCallback } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Calendar, Check, MessageCircle, Info, Phone, Share } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { MediaFile } from '../types';
import MediaGallery from '../components/MediaGallery';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { properties, addVisit } = useData();
  const property = properties.find(p => p.id === id);
  
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitForm, setVisitForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });
  const [visitSubmitted, setVisitSubmitted] = useState(false);
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);

  // Reset states when location changes (when navigating away)
  React.useEffect(() => {
    setShowVisitForm(false);
    setVisitSubmitted(false);
    setIsSubmittingVisit(false);
  }, [location.pathname]);

  // If we're not on a property detail route, don't render
  if (!location.pathname.startsWith('/property/')) {
    return null;
  }

  if (!property) {
    return <Navigate to="/properties" replace />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Memoizar el handler para evitar re-renders innecesarios
  const handleVisitSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmittingVisit) return; // Prevenir múltiples envíos
    
    setIsSubmittingVisit(true);
    
    try {
      await addVisit({
        propertyId: property!.id,
        clientName: visitForm.name,
        clientEmail: visitForm.email,
        clientPhone: visitForm.phone,
        preferredDate: visitForm.date,
        preferredTime: visitForm.time,
        message: visitForm.message,
        status: 'pending'
      });
      
      setVisitSubmitted(true);
      setShowVisitForm(false);
      
      // Limpiar formulario
      setVisitForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: ''
      });
      
      console.log('✅ Visita enviada exitosamente');
    } catch (error) {
      console.error('❌ Error enviando visita:', error);
      alert('Error al enviar la solicitud de visita. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmittingVisit(false);
    }
  }, [addVisit, property, visitForm, isSubmittingVisit]);

  const handleShare = (mediaUrl?: string, mediaName?: string) => {
    const shareUrl = window.location.href;
    const shareText = `¡Mira esta propiedad! ${property!.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: property!.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard
      const fullText = `${shareText}\n${shareUrl}`;
      navigator.clipboard.writeText(fullText).then(() => {
        alert('¡Enlace copiado al portapapeles!');
      });
    }
  };

  // Combinar media nuevo y legacy images
  const allMedia: (MediaFile | { id: string; url: string; type: 'image'; name: string })[] = [
    ...(property.media || []),
    ...property.images.map((url, index) => ({
      id: `legacy-${index}`,
      url,
      type: 'image' as const,
      name: `Image ${index + 1}`
    }))
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Property Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.address}, {property.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-4">
              
              <button
                onClick={() => handleShare()}
                className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all"
                title="Compartir propiedad"
              >
                <Share className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="text-3xl font-bold text-red-600 mb-6">
            {formatPrice(property.price)}
          </div>
        </div>

        {/* Media Gallery */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <MediaGallery 
            media={allMedia}
            onShare={handleShare}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Bed className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Habitaciones</div>
                  </div>
                )}
                
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Bath className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Baños</div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Square className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-900">{property.area}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Info className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">
                    {property.propertyType === 'house' ? 'Casa' :
                     property.propertyType === 'apartment' ? 'Depto' :
                     property.propertyType === 'commercial' ? 'Comercial' : 'Terreno'}
                  </div>
                  <div className="text-sm text-gray-600">Tipo</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Características</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Visit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Agenda tu visita</h3>
              
              {visitSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">¡Solicitud enviada!</h4>
                  <p className="text-gray-600 mb-4">
                    Te contactaremos pronto para confirmar tu visita.
                  </p>
                  <button
                    onClick={() => {
                      setVisitSubmitted(false);
                      setShowVisitForm(false);
                    }}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Solicitar otra visita
                  </button>
                </div>
              ) : showVisitForm ? (
                <form onSubmit={handleVisitSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={visitForm.name}
                      onChange={(e) => setVisitForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={isSubmittingVisit}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={visitForm.email}
                      onChange={(e) => setVisitForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={isSubmittingVisit}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={visitForm.phone}
                      onChange={(e) => setVisitForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={isSubmittingVisit}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha preferida *
                      </label>
                      <input
                        type="date"
                        required
                        value={visitForm.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setVisitForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        disabled={isSubmittingVisit}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora preferida *
                      </label>
                      <select
                        required
                        value={visitForm.time}
                        onChange={(e) => setVisitForm(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        disabled={isSubmittingVisit}
                      >
                        <option value="">Seleccionar hora</option>
                        <option value="09:00">09:00</option>
                        <option value="09:30">09:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="12:00">12:00</option>
                        <option value="12:30">12:30</option>
                        <option value="14:00">14:00</option>
                        <option value="14:30">14:30</option>
                        <option value="15:00">15:00</option>
                        <option value="15:30">15:30</option>
                        <option value="16:00">16:00</option>
                        <option value="16:30">16:30</option>
                        <option value="17:00">17:00</option>
                        <option value="17:30">17:30</option>
                        <option value="18:00">18:00</option>
                        <option value="18:30">18:30</option>
                        <option value="19:00">19:00</option>
                        <option value="19:30">19:30</option>
                        <option value="20:00">20:00</option>
                        <option value="20:30">20:30</option>
                        <option value="21:00">21:00</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje adicional
                    </label>
                    <textarea
                      value={visitForm.message}
                      onChange={(e) => setVisitForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                      placeholder="¿Algo específico que te gustaría saber?"
                      disabled={isSubmittingVisit}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowVisitForm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                      disabled={isSubmittingVisit}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmittingVisit}
                    >
                      {isSubmittingVisit ? 'Enviando...' : 'Solicitar Visita'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <Calendar className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">
                      ¿Te interesa esta propiedad? Agenda una visita con nosotros.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowVisitForm(true)}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar visita
                  </button>
                  
                  <div className="flex gap-3">
                    <a
                      href="tel:+56912345678"
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Llamar
                    </a>
                    
                    <a
                      href={`https://wa.me/56912345678?text=Hola! Me interesa la propiedad: ${property.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}