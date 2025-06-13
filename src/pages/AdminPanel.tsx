import React, { useState } from 'react';
import { 
  BarChart3, Home, Users, Eye, Plus, Edit, Trash2, 
  Search, Filter, Calendar, TrendingUp, MapPin, Clock, CheckCircle, X
} from 'lucide-react';
import { Property, Analytics, VisitRequest, AppraisalRequest, User } from '../types';
import PropertyForm from '../components/Admin/PropertyForm';
import UserForm from '../components/Admin/UserForm';

interface AdminPanelProps {
  properties: Property[];
  users: User[];
  visitRequests: VisitRequest[];
  appraisalRequests: AppraisalRequest[];
  onSaveProperty: (property: Partial<Property>) => void;
  onDeleteProperty: (propertyId: string) => void;
  onSaveUser: (user: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateVisitStatus: (visitId: string, status: VisitRequest['status']) => void;
  onUpdateAppraisalStatus: (appraisalId: string, status: AppraisalRequest['status']) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  properties,
  users,
  visitRequests,
  appraisalRequests,
  onSaveProperty,
  onDeleteProperty,
  onSaveUser,
  onDeleteUser,
  onUpdateVisitStatus,
  onUpdateAppraisalStatus
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'visits' | 'appraisals' | 'analytics' | 'users'>('dashboard');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();
  const [editingUser, setEditingUser] = useState<User | undefined>();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'properties', label: 'Propiedades', icon: Home },
    { id: 'visits', label: 'Visitas', icon: Calendar },
    { id: 'appraisals', label: 'Tasaciones', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: Eye },
    { id: 'users', label: 'Usuarios', icon: Users }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSaveProperty = (propertyData: Partial<Property>) => {
    onSaveProperty(propertyData);
    setShowPropertyForm(false);
    setEditingProperty(undefined);
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      onDeleteProperty(propertyId);
    }
  };

  const handleSaveUser = (userData: Partial<User>) => {
    onSaveUser(userData);
    setShowUserForm(false);
    setEditingUser(undefined);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      onDeleteUser(userId);
    }
  };

  // Calculate real analytics
  const totalViews = properties.reduce((sum, property) => sum + property.views, 0);
  const totalFavorites = properties.reduce((sum, property) => sum + property.favorites, 0);
  
  const neighborhoodStats = properties.reduce((acc, property) => {
    const neighborhood = property.location.neighborhood;
    if (!acc[neighborhood]) {
      acc[neighborhood] = { views: 0, count: 0 };
    }
    acc[neighborhood].views += property.views;
    acc[neighborhood].count += 1;
    return acc;
  }, {} as Record<string, { views: number; count: number }>);

  const popularNeighborhoods = Object.entries(neighborhoodStats)
    .map(([name, stats]) => ({ name, views: stats.views, searches: stats.count * 10 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const propertyTypeStats = properties.reduce((acc, property) => {
    const type = property.type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += 1;
    return acc;
  }, {} as Record<string, number>);

  const propertyTypes = Object.entries(propertyTypeStats).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    percentage: (count / properties.length) * 100
  }));

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Propiedades</p>
              <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
            </div>
            <Home className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Activas en el sistema</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visitas Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{visitRequests.filter(v => v.status === 'pending').length}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Requieren atención</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasaciones Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{appraisalRequests.filter(a => a.status === 'pending').length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Nuevas solicitudes</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Visualizaciones</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
            </div>
            <Eye className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Vistas acumuladas</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitas Recientes</h3>
          <div className="space-y-4">
            {visitRequests.slice(0, 5).map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{visit.clientName}</p>
                  <p className="text-sm text-gray-600">{visit.propertyTitle}</p>
                  <p className="text-xs text-gray-500">{visit.requestedDate} - {visit.requestedTime}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  visit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  visit.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {visit.status === 'pending' ? 'Pendiente' : 
                   visit.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Solicitudes de Tasación</h3>
          <div className="space-y-4">
            {appraisalRequests.slice(0, 5).map((appraisal) => (
              <div key={appraisal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{appraisal.clientName}</p>
                  <p className="text-sm text-gray-600">{appraisal.propertyType} - {appraisal.propertyAddress}</p>
                  <p className="text-xs text-gray-500">{appraisal.createdAt}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  appraisal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  appraisal.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {appraisal.status === 'pending' ? 'Pendiente' : 
                   appraisal.status === 'in-progress' ? 'En Proceso' : 'Completada'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PropertiesContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestión de Propiedades</h3>
        <button 
          onClick={() => setShowPropertyForm(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Propiedad
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propiedad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo/Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vistas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="h-12 w-12 rounded-lg object-cover" 
                        src={property.images[0]} 
                        alt={property.title}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {property.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.area}m² • {property.bedrooms && `${property.bedrooms} hab`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{property.type}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      property.status === 'venta' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(property.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.location.neighborhood}</div>
                    <div className="text-sm text-gray-500">{property.location.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-gray-400 mr-1" />
                      {property.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditingProperty(property);
                          setShowPropertyForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const VisitsContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Gestión de Visitas</h3>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propiedad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visitRequests.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{visit.clientName}</div>
                      <div className="text-sm text-gray-500">{visit.clientEmail}</div>
                      <div className="text-sm text-gray-500">{visit.clientPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{visit.propertyTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{visit.requestedDate}</div>
                    <div className="text-sm text-gray-500">{visit.requestedTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      visit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      visit.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {visit.status === 'pending' ? 'Pendiente' : 
                       visit.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {visit.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => onUpdateVisitStatus(visit.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => onUpdateVisitStatus(visit.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AppraisalsContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Gestión de Tasaciones</h3>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propiedad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto Preferido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appraisalRequests.map((appraisal) => (
                <tr key={appraisal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{appraisal.clientName}</div>
                      <div className="text-sm text-gray-500">{appraisal.clientEmail}</div>
                      <div className="text-sm text-gray-500">{appraisal.clientPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 capitalize">{appraisal.propertyType}</div>
                      <div className="text-sm text-gray-500">{appraisal.propertyAddress}</div>
                      {appraisal.propertyArea && (
                        <div className="text-sm text-gray-500">{appraisal.propertyArea}m²</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{appraisal.preferredContactMethod}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appraisal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appraisal.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {appraisal.status === 'pending' ? 'Pendiente' : 
                       appraisal.status === 'in-progress' ? 'En Proceso' : 'Completada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {appraisal.status === 'pending' && (
                        <button 
                          onClick={() => onUpdateAppraisalStatus(appraisal.id, 'in-progress')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Iniciar
                        </button>
                      )}
                      {appraisal.status === 'in-progress' && (
                        <button 
                          onClick={() => onUpdateAppraisalStatus(appraisal.id, 'completed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Completar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AnalyticsContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Analytics y Reportes</h3>
      
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Estadísticas Generales</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Vistas:</span>
              <span className="font-semibold">{totalViews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Favoritos:</span>
              <span className="font-semibold">{totalFavorites}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Promedio Vistas/Propiedad:</span>
              <span className="font-semibold">{Math.round(totalViews / properties.length)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Estado de Visitas</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Pendientes:</span>
              <span className="font-semibold text-yellow-600">{visitRequests.filter(v => v.status === 'pending').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confirmadas:</span>
              <span className="font-semibold text-green-600">{visitRequests.filter(v => v.status === 'confirmed').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Canceladas:</span>
              <span className="font-semibold text-red-600">{visitRequests.filter(v => v.status === 'cancelled').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Estado de Tasaciones</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Pendientes:</span>
              <span className="font-semibold text-yellow-600">{appraisalRequests.filter(a => a.status === 'pending').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">En Proceso:</span>
              <span className="font-semibold text-blue-600">{appraisalRequests.filter(a => a.status === 'in-progress').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completadas:</span>
              <span className="font-semibold text-green-600">{appraisalRequests.filter(a => a.status === 'completed').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Property Types Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Distribución por Tipo de Propiedad</h4>
        <div className="space-y-4">
          {propertyTypes.map((type, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900">{type.type}</div>
                <div className="text-sm text-gray-500">({type.count} propiedades)</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{type.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Neighborhoods */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Barrios Más Populares</h4>
        <div className="space-y-4">
          {popularNeighborhoods.map((neighborhood, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{neighborhood.name}</div>
                  <div className="text-xs text-gray-500">{neighborhood.searches} búsquedas estimadas</div>
                </div>
              </div>
              <div className="text-sm font-medium text-red-600">{neighborhood.views} vistas</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const UsersContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
        <button 
          onClick={() => setShowUserForm(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-red-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditingUser(user);
                          setShowUserForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'properties':
        return <PropertiesContent />;
      case 'visits':
        return <VisitsContent />;
      case 'appraisals':
        return <AppraisalsContent />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'users':
        return <UsersContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona propiedades, usuarios y visualiza estadísticas</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {renderContent()}

        {/* Property Form Modal */}
        {showPropertyForm && (
          <PropertyForm
            property={editingProperty}
            onSave={handleSaveProperty}
            onCancel={() => {
              setShowPropertyForm(false);
              setEditingProperty(undefined);
            }}
          />
        )}

        {/* User Form Modal */}
        {showUserForm && (
          <UserForm
            user={editingUser}
            onSave={handleSaveUser}
            onCancel={() => {
              setShowUserForm(false);
              setEditingUser(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;