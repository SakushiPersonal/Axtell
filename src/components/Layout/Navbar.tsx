import React, { useState } from 'react';
import { Home, Search, Info, User } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'properties', label: 'Propiedades', icon: Search },
    { id: 'about', label: 'Acerca de', icon: Info },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onPageChange('home')}>
            <div className="bg-red-600 p-2 rounded-lg mr-3 transform rotate-45">
              <div className="w-6 h-6 bg-red-600"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 tracking-wider">AXTELL</span>
              <span className="text-xs text-gray-600 tracking-widest">PROPIEDADES</span>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Contact Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center text-sm text-gray-600">
              <span className="mr-4">📞 +56 9 1234 5678</span>
              <span>✉️ info@axtellpropiedades.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;