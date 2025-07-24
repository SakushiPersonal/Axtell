import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  Calendar, 
  User, 
  LogOut, 
  MessageCircle 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  const navItems = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/properties', icon: Building2, label: 'Propiedades' },
    { to: '/admin/clients', icon: Users, label: 'Clientes' },
    { to: '/admin/visits', icon: Calendar, label: 'Visitas' },
    { to: '/admin/whatsapp', icon: MessageCircle, label: 'WhatsApp' },
    ...(user.role === 'admin' ? [{ to: '/admin/users', icon: User, label: 'Usuarios' }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <img 
            src="/axtell_logo.jpg" 
            alt="Axtell Propiedades" 
            className="h-10 w-auto"
          />
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-600 capitalize">{user.role}</p>
          </div>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors ${
                  isActive ? 'bg-red-50 text-red-600 border-r-2 border-red-600' : ''
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-64 p-6 border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}