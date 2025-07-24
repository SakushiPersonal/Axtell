import React from 'react';
import { Users, Award, Target, Heart, MapPin, Phone, Mail } from 'lucide-react';

export default function About() {
  const team = [
    {
      name: 'Carlos Mendoza',
      role: 'Director General',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Más de 15 años de experiencia en el mercado inmobiliario chileno.'
    },
    {
      name: 'María González',
      role: 'Gerente de Ventas',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Especialista en propiedades residenciales de alto valor.'
    },
    {
      name: 'Juan Pérez',
      role: 'Agente Senior',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Experto en el mercado de Las Condes y Vitacura.'
    },
    {
      name: 'Ana Rodríguez',
      role: 'Asesora Legal',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Especialista en derecho inmobiliario y transacciones complejas.'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Compromiso',
      description: 'Nos comprometemos con cada cliente para encontrar la solución perfecta a sus necesidades inmobiliarias.'
    },
    {
      icon: Award,
      title: 'Excelencia',
      description: 'Mantenemos los más altos estándares de calidad en todos nuestros servicios y procesos.'
    },
    {
      icon: Target,
      title: 'Resultados',
      description: 'Nos enfocamos en obtener los mejores resultados para nuestros clientes en cada transacción.'
    },
    {
      icon: Users,
      title: 'Confianza',
      description: 'Construimos relaciones duraderas basadas en la transparencia y la confianza mutua.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sobre Axtell Propiedades
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Más de una década conectando familias con sus hogares ideales en Chile
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Fundada en 2014, Axtell Propiedades nació con la visión de revolucionar 
                  el mercado inmobiliario chileno, ofreciendo un servicio personalizado y 
                  de excelencia que supere las expectativas de nuestros clientes.
                </p>
                <p>
                  Durante más de 10 años, hemos ayudado a más de 1,000 familias a encontrar 
                  su hogar ideal, consolidándonos como una de las inmobiliarias más confiables 
                  y respetadas de Santiago y sus alrededores.
                </p>
                <p>
                  Nuestro equipo de profesionales altamente capacitados combina experiencia, 
                  conocimiento del mercado local y tecnología de vanguardia para brindar 
                  soluciones inmobiliarias integrales.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Oficina Axtell"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-lg">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm">Años de experiencia</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada una de nuestras acciones y decisiones
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Profesionales comprometidos con tu éxito inmobiliario
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-red-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nuestra Misión
              </h3>
              <p className="text-gray-700">
                Facilitar el acceso a la propiedad ideal para cada familia chilena, 
                brindando un servicio integral, transparente y personalizado que 
                supere las expectativas de nuestros clientes en cada etapa del 
                proceso inmobiliario.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nuestra Visión
              </h3>
              <p className="text-gray-700">
                Ser la inmobiliaria líder en Chile, reconocida por nuestra 
                excelencia en el servicio, innovación tecnológica y compromiso 
                con la satisfacción del cliente, contribuyendo al desarrollo 
                del mercado inmobiliario nacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para encontrar tu próximo hogar?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nuestro equipo está aquí para ayudarte en cada paso del camino
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contáctanos
            </a>
            <a
              href="/properties"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
            >
              Ver Propiedades
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}