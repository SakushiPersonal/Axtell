import React from 'react';
import { Search, TrendingUp, Award, Users, MapPin, Home as HomeIcon } from 'lucide-react';
import PropertyCard from '../components/Property/PropertyCard';
import { mockProperties } from '../data/mockData';
import { Property } from '../types';

interface HomePageProps {
  onViewProperty: (property: Property) => void;
  onSearchProperties: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onViewProperty, onSearchProperties }) => {
  const featuredProperties = mockProperties.slice(0, 3);

  const stats = [
    { icon: HomeIcon, value: '500+', label: 'Propiedades' },
    { icon: Users, value: '1,200+', label: 'Clientes Satisfechos' },
    { icon: Award, value: '15+', label: 'Años de Experiencia' },
    { icon: TrendingUp, value: '98%', label: 'Éxito en Ventas' }
  ];

  const features = [
    {
      icon: Search,
      title: 'Búsqueda Avanzada',
      description: 'Encuentra la propiedad perfecta con nuestros filtros inteligentes y búsqueda personalizada.'
    },
    {
      icon: MapPin,
      title: 'Ubicaciones Premium',
      description: 'Propiedades en las mejores zonas de la ciudad con acceso a todos los servicios.'
    },
    {
      icon: Award,
      title: 'Asesoramiento Experto',
      description: 'Nuestro equipo te acompaña en cada paso del proceso de compra o alquiler.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 to-red-700 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div
          className="relative bg-cover bg-center min-h-screen flex items-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1600)'
          }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encuentra Tu Hogar Ideal
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Más de 15 años ayudando a familias a encontrar la propiedad perfecta. 
              Descubre nuestro catálogo exclusivo de inmuebles en las mejores ubicaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onSearchProperties}
                className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
              >
                Ver Propiedades
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-red-900 transition-colors text-lg font-semibold">
                Solicitar Tasación
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegirnos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos líderes en el mercado inmobiliario con un compromiso absoluto hacia la excelencia y la satisfacción del cliente.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                    <Icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Propiedades Destacadas
            </h2>
            <p className="text-xl text-gray-600">
              Descubre nuestras propiedades más exclusivas y populares
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={onViewProperty}
              />
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={onSearchProperties}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
            >
              Ver Todas las Propiedades
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para Encontrar Tu Nuevo Hogar?
          </h2>
          <p className="text-xl mb-8 text-red-200">
            Nuestro equipo de expertos está aquí para ayudarte en cada paso del camino
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-red-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Contactar Ahora
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-red-900 transition-colors font-semibold">
              Solicitar Llamada
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;