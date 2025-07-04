import React, { useState } from 'react';
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onToggleFavorite?: (propertyId: string) => void;
  isFavorite?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    return status === 'venta' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
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

  const handleCardClick = () => {
    onViewDetails(property);
  };

  // Mostrar solo las primeras 10 características
  const displayFeatures = property.features.slice(0, 10);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 transform ${
        isHovered ? 'shadow-xl -translate-y-2 scale-105' : 'hover:shadow-lg hover:-translate-y-1'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {property.status === 'venta' ? 'En Venta' : 'En Alquiler'}
          </span>
          <span className="px-2 py-1 bg-gray-900 bg-opacity-75 text-white rounded-full text-xs font-medium">
            {getTypeLabel(property.type)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-4 transition-all duration-300 ${isHovered ? 'pb-6' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">{property.title}</h3>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold text-red-600">
              {formatPrice(property.price)}
            </div>
            {property.status === 'alquiler' && (
              <div className="text-sm text-gray-500">/mes</div>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{property.location.neighborhood}, {property.location.city}</span>
        </div>

        <div className="flex items-center space-x-4 text-gray-600 mb-4">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.area}m²</span>
          </div>
        </div>

        {/* Características expandibles en hover */}
        <div className={`transition-all duration-300 overflow-hidden ${
          isHovered ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
        }`}>
          {displayFeatures.length > 0 && (
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Características:</h4>
              <div className="grid grid-cols-1 gap-1">
                {displayFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 flex-shrink-0"></div>
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
                {property.features.length > 10 && (
                  <div className="text-xs text-gray-500 italic mt-1">
                    +{property.features.length - 10} características más...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Visualizaciones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Eye className="h-4 w-4 mr-1" />
            <span>{property.views} visualizaciones</span>
          </div>
          <div className={`text-sm font-medium text-red-600 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            Click para ver detalles →
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;