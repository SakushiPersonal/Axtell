import React from 'react';
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-red-600 p-2 rounded-lg mr-3 transform rotate-45">
                <div className="w-6 h-6 bg-red-600"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wider">AXTELL</span>
                <span className="text-xs text-gray-300 tracking-widest">PROPIEDADES</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Más de 15 años de experiencia en el mercado inmobiliario. 
              Te ayudamos a encontrar la propiedad de tus sueños con el mejor servicio y asesoramiento personalizado.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-red-400" />
                <span className="text-gray-400">+54 11 1234-5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-red-400" />
                <span className="text-gray-400">info@axtellpropiedades.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 text-red-400 mt-1" />
                <span className="text-gray-400">
                  Av. Corrientes 1234<br />
                  Buenos Aires, Argentina
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Propiedades en Venta
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Propiedades en Alquiler
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Tasaciones
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Asesoramiento Legal
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Financiación
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Axtell Propiedades. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;