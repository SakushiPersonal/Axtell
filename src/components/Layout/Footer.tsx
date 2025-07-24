import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

// Ícono personalizado para X (antiguo Twitter)
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Axtell</h2>
            <p className="text-gray-300 mb-6">
              Más de 10 años de experiencia en el mercado inmobiliario chileno. 
              Tu socio de confianza para encontrar la propiedad perfecta.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <XIcon className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>Av. Providencia 1234, Santiago</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-red-500" />
                <span>+56 2 2345 6789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-red-500" />
                <span>info@axtell.cl</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Axtell. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}