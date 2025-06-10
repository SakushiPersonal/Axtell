import React from 'react';
import { MapPin, Bed, Bath, Square, Heart, Eye } from 'lucide-react';
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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {property.status === 'venta' ? 'En Venta' : 'En Alquiler'}
          </span>
          <span className="px-2 py-1 bg-gray-900 bg-opacity-75 text-white rounded-full text-xs font-medium">
            {getTypeLabel(property.type)}
          </span>
        </div>
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
          <div className="text-right">
            <div className="text-xl font-bold text-red-600">
              {formatPrice(property.price)}
            </div>
            {property.status === 'alquiler' && (
              <div className="text-sm text-gray-500">/mes</div>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location.neighborhood}, {property.location.city}</span>
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

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Eye className="h-4 w-4 mr-1" />
            <span>{property.views} visualizaciones</span>
          </div>
          <button
            onClick={() => onViewDetails(property)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;