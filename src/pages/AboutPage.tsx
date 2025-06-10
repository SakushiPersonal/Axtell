import React from 'react';
import { Award, Users, TrendingUp, MapPin, Phone, Mail, Clock, Star } from 'lucide-react';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'María González',
      role: 'Directora General',
      experience: '15 años',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialties: ['Propiedades de lujo', 'Inversiones comerciales']
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Gerente de Ventas',
      experience: '12 años',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialties: ['Casas familiares', 'Terrenos']
    },
    {
      name: 'Ana López',
      role: 'Especialista en Alquileres',
      experience: '8 años',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialties: ['Departamentos', 'Oficinas']
    }
  ];

  const achievements = [
    { icon: Award, title: 'Empresa del Año', description: 'Reconocimiento de la Cámara Inmobiliaria 2023' },
    { icon: Star, title: '98% Satisfacción', description: 'Según encuestas a nuestros clientes' },
    { icon: TrendingUp, title: 'Líder en Ventas', description: 'Mayor volumen de operaciones en la zona' },
    { icon: Users, title: '1,200+ Clientes', description: 'Familias que confían en nosotros' }
  ];

  const values = [
    {
      title: 'Transparencia',
      description: 'Operamos con total honestidad y claridad en cada transacción.',
      icon: '🔍'
    },
    {
      title: 'Excelencia',
      description: 'Buscamos la perfección en cada detalle del servicio.',
      icon: '⭐'
    },
    {
      title: 'Compromiso',
      description: 'Nos comprometemos con el éxito de nuestros clientes.',
      icon: '🤝'
    },
    {
      title: 'Innovación',
      description: 'Utilizamos la mejor tecnología para mejorar la experiencia.',
      icon: '🚀'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Acerca de Axtell Propiedades</h1>
            <p className="text-xl md:text-2xl text-red-200 max-w-3xl mx-auto">
              Más de 15 años construyendo sueños y conectando familias con sus hogares ideales
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Axtell Propiedades nació en 2009 con una visión clara: revolucionar el mercado inmobiliario 
                  mediante un servicio personalizado y de excelencia. Fundada por María González, 
                  nuestra empresa comenzó como una pequeña oficina en el centro de la ciudad.
                </p>
                <p>
                  A lo largo de los años, hemos crecido significativamente, expandiendo nuestro equipo 
                  y territorio de operación. Hoy somos una de las inmobiliarias más respetadas de la región, 
                  con más de 1,200 familias que han confiado en nosotros para encontrar su hogar ideal.
                </p>
                <p>
                  Nuestro éxito se basa en tres pilares fundamentales: conocimiento profundo del mercado, 
                  tecnología de vanguardia y, sobre todo, un compromiso inquebrantable con la satisfacción 
                  de nuestros clientes.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Oficina Axtell Propiedades"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-red-600 text-white p-6 rounded-lg">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-red-200">Años de Experiencia</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Logros</h2>
            <p className="text-xl text-gray-600">Reconocimientos que reflejan nuestro compromiso con la excelencia</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-gray-600">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
            <p className="text-xl text-gray-600">Profesionales experimentados comprometidos con tu éxito</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.experience} de experiencia</p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Especialidades:</p>
                    {member.specialties.map((specialty, idx) => (
                      <span key={idx} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <p className="text-xl text-gray-600">Los principios que guían cada una de nuestras acciones</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visítanos</h2>
            <p className="text-xl text-gray-600">Estamos aquí para ayudarte</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-red-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Oficina Principal</h3>
                  <p className="text-gray-600">
                    Av. Corrientes 1234, Piso 5<br />
                    Buenos Aires, Argentina<br />
                    C1043AAZ
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-red-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Horarios de Atención</h3>
                  <p className="text-gray-600">
                    Lunes a Viernes: 9:00 - 18:00<br />
                    Sábados: 9:00 - 14:00<br />
                    Domingos: Cerrado
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-red-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Teléfono</h3>
                  <p className="text-gray-600">+54 11 1234-5678</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-red-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">info@axtellpropiedades.com</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Mapa de Ubicación</p>
                <p>Integración con Google Maps</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;