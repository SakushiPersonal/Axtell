import React, { useState, useMemo } from 'react';
import PropertyCard from '../components/Property/PropertyCard';
import PropertyFilters from '../components/Property/PropertyFilters';
import { Property, SearchFilters } from '../types';
import { mockProperties } from '../data/mockData';
import { Grid, List, SortAsc } from 'lucide-react';

interface PropertiesPageProps {
  onViewProperty: (property: Property) => void;
}

const PropertiesPage: React.FC<PropertiesPageProps> = ({ onViewProperty }) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'date' | 'area'>('date');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProperties = useMemo(() => {
    let filtered = mockProperties.filter(property => {
      if (filters.type && property.type !== filters.type) return false;
      if (filters.status && property.status !== filters.status) return false;
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      if (filters.bedrooms && (!property.bedrooms || property.bedrooms < filters.bedrooms)) return false;
      if (filters.bathrooms && (!property.bathrooms || property.bathrooms < filters.bathrooms)) return false;
      if (filters.minArea && property.area < filters.minArea) return false;
      if (filters.maxArea && property.area > filters.maxArea) return false;
      if (filters.city && property.location.city !== filters.city) return false;
      if (filters.neighborhood && property.location.neighborhood !== filters.neighborhood) return false;
      
      return true;
    });

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'area':
          return b.area - a.area;
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [filters, sortBy]);

  const clearFilters = () => {
    setFilters({});
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const sortOptions = [
    { value: 'date', label: 'Más Recientes' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'area', label: 'Mayor Superficie' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Propiedades Disponibles</h1>
          <p className="text-gray-600">
            Encuentra la propiedad perfecta entre nuestro catálogo de {mockProperties.length} inmuebles
          </p>
        </div>

        <PropertyFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">
              {filteredProperties.length} propiedades encontradas
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <SortAsc className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Grid className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No se encontraron propiedades</h3>
              <p>Intenta ajustar los filtros de búsqueda para ver más resultados</p>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={onViewProperty}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(property.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;