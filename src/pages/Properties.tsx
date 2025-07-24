import React, { useState, useMemo } from 'react';
import PropertyCard from '../components/PropertyCard';
import { PropertyCardSkeleton } from '../components/UI/SkeletonLoader';
import AdvancedSearchFilters, { AdvancedSearchFilters as AdvancedSearchFiltersType } from '../components/AdvancedSearchFilters';
import { useData } from '../contexts/DataContext';

export default function Properties() {
  const { properties, loadingProperties } = useData();
  const [filters, setFilters] = useState<AdvancedSearchFiltersType>({
    query: '',
    type: 'all',
    propertyType: 'all',
    minPrice: '',
    maxPrice: '',
    location: '',
    minBedrooms: '',
    maxBedrooms: '',
    minBathrooms: '',
    maxBathrooms: '',
    minArea: '',
    maxArea: '',
    features: [],
    sortBy: 'newest'
  });

  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesQuery = 
          property.title.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Type filter
      if (filters.type !== 'all' && property.type !== filters.type) {
        return false;
      }

      // Property type filter
      if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
        return false;
      }

      // Price filters
      if (filters.minPrice) {
        const minPrice = parseInt(filters.minPrice.replace(/\D/g, ''));
        if (property.price < minPrice) return false;
      }

      if (filters.maxPrice) {
        const maxPrice = parseInt(filters.maxPrice.replace(/\D/g, ''));
        if (property.price > maxPrice) return false;
      }

      // Bedrooms filters
      if (filters.minBedrooms && property.bedrooms) {
        if (property.bedrooms < parseInt(filters.minBedrooms)) return false;
      }
      if (filters.maxBedrooms && property.bedrooms) {
        if (property.bedrooms > parseInt(filters.maxBedrooms)) return false;
      }

      // Bathrooms filters
      if (filters.minBathrooms && property.bathrooms) {
        if (property.bathrooms < parseInt(filters.minBathrooms)) return false;
      }
      if (filters.maxBathrooms && property.bathrooms) {
        if (property.bathrooms > parseInt(filters.maxBathrooms)) return false;
      }

      // Area filters
      if (filters.minArea) {
        if (property.area < parseInt(filters.minArea)) return false;
      }
      if (filters.maxArea) {
        if (property.area > parseInt(filters.maxArea)) return false;
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature =>
          property.features.some(propFeature => 
            propFeature.toLowerCase().includes(feature.toLowerCase())
          )
        );
        if (!hasAllFeatures) return false;
      }

      // Location filter
      if (filters.location) {
        const location = filters.location.toLowerCase();
        if (!property.location.toLowerCase().includes(location)) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'area-asc':
          return a.area - b.area;
        case 'area-desc':
          return b.area - a.area;
        default:
          return 0;
      }
    });

    return filtered;
  }, [properties, filters]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestras Propiedades
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra la propiedad perfecta entre nuestra amplia selección
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <AdvancedSearchFilters 
            onSearch={setFilters}
          />
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loadingProperties ? (
              'Cargando propiedades...'
            ) : (
              `${filteredProperties.length} propiedad${filteredProperties.length !== 1 ? 'es' : ''} encontrada${filteredProperties.length !== 1 ? 's' : ''}`
            )}
          </p>
        </div>

        {/* Properties Grid */}
        {loadingProperties ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron propiedades
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar tus filtros de búsqueda para encontrar más resultados.
              </p>
              <button
                onClick={() => setFilters({
                  query: '',
                  type: 'all',
                  propertyType: 'all',
                  minPrice: '',
                  maxPrice: '',
                  location: '',
                  minBedrooms: '',
                  maxBedrooms: '',
                  minBathrooms: '',
                  maxBathrooms: '',
                  minArea: '',
                  maxArea: '',
                  features: [],
                  sortBy: 'newest'
                })}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}