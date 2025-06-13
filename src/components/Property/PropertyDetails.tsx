import React, { useState } from 'react';
import { Property } from '../../types';
import { 
  MapPin, Bed, Bath, Square, ArrowLeft, Heart, Share2, 
  Phone, Mail, Calendar, Camera, CheckCircle, MessageCircle
} from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
  onBack: () => void;
  onScheduleVisit?: (property: Property) => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ 
  property, 
  onBack, 
  onScheduleVisit 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      casa: 'Casa',
      apartamento: 'Apartamento',
      terreno: 'Terreno',
      comercial: 'Comercial',
      oficina: 'Oficina'
    };
    return types[type] || type;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleWhatsAppContact = () => {
    const phone = property.agent.phone.replace(/\D/g, ''); // Remove non-digits
    const message = encodeURIComponent(`Hola! Me interesa la propiedad: ${property.title}`);
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a propiedades
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Main Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-6">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  >
                    <ArrowLeft className="h-5 w-5 transform rotate-180" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    <Camera className="h-4 w-4 text-white" />
                    <span className="text-white text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex space-x-2 mb-6 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{property.location.address}, {property.location.neighborhood}, {property.location.city}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Share2 className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{getTypeLabel(property.type)}</div>
                  <div className="text-sm text-gray-600">Tipo</div>
                </div>
                {property.bedrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 flex items-center justify-center">
                      <Bed className="h-6 w-6 mr-1" />
                      {property.bedrooms}
                    </div>
                    <div className="text-sm text-gray-600">Dormitorios</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 flex items-center justify-center">
                      <Bath className="h-6 w-6 mr-1" />
                      {property.bathrooms}
                    </div>
                    <div className="text-sm text-gray-600">Baños</div>
                  </div>
                )}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 flex items-center justify-center">
                    <Square className="h-6 w-6 mr-1" />
                    {property.area}
                  </div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {property.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price and Contact */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {formatPrice(property.price)}
                </div>
                {property.status === 'alquiler' && (
                  <div className="text-gray-600">por mes</div>
                )}
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'venta' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status === 'venta' ? 'En Venta' : 'En Alquiler'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agente a Cargo</h3>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-semibold text-lg">
                      {property.agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="font-medium text-gray-900">{property.agent.name}</div>
                </div>
                
                <div className="space-y-3">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar
                  </a>
                  <button
                    onClick={handleWhatsAppContact}
                    className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </button>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center justify-center w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </a>
                  {onScheduleVisit && (
                    <button 
                      onClick={() => onScheduleVisit(property)}
                      className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Visita
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h3>
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Mapa interactivo</p>
                  <p className="text-sm">Integración con Google Maps</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <strong>Dirección:</strong> {property.location.address}<br />
                <strong>Barrio:</strong> {property.location.neighborhood}<br />
                <strong>Ciudad:</strong> {property.location.city}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;