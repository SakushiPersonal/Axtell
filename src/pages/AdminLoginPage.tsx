import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Login error:', error);
        if (error.message && error.message.includes('Invalid login credentials')) {
          setError('Credenciales inválidas. Verifica tu email y contraseña.');
        } else if (error.message && error.message.includes('Email not confirmed')) {
          setError('Email no confirmado. Revisa tu bandeja de entrada.');
        } else {
          setError('Error al iniciar sesión: ' + (error.message || 'Error desconocido'));
        }
      } else {
        console.log('Login successful');
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error inesperado al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to home button */}
        <div className="flex justify-start">
          <button
            onClick={goToHome}
            className="flex items-center text-red-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al sitio web
          </button>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-lg">
              <Shield className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Panel de Administración</h2>
          <p className="mt-2 text-red-200">
            Acceso exclusivo para personal autorizado de Axtell Propiedades
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="tu@axtellpropiedades.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Mantener sesión iniciada
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-red-600 hover:text-red-500">
                  ¿Problemas de acceso?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Acceder al Panel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t pt-6">
            <div className="text-sm text-gray-600">
              <p className="mb-2"><strong>Roles disponibles:</strong></p>
              <p><strong>Administrador:</strong> Acceso completo al sistema</p>
              <p><strong>Captador:</strong> Gestión de propiedades y tasaciones</p>
              <p><strong>Vendedor:</strong> Gestión de clientes y visitas</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-red-200 text-sm">
            Este panel es de acceso restringido. Solo personal autorizado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;