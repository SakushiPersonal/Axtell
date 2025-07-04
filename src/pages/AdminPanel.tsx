import React, { useState } from 'react';
import { 
  BarChart3, Home, Users, Eye, Plus, Edit, Trash2, 
  Search, Filter, Calendar, TrendingUp, MapPin, Clock, CheckCircle, X, LogOut, UserCheck,
  Shield, UserCog, Briefcase
} from 'lucide-react';
import { Property, VisitRequest, AppraisalRequest, Client } from '../types';
import PropertyForm from '../components/Admin/PropertyForm';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';

interface AdminPanelProps {
  properties: Property[];
  clients: Client[];
  visitRequests: VisitRequest[];
  appraisalRequests: AppraisalRequest[];
  onSaveProperty: (property: Partial<Property>) => void;
  onDeleteProperty: (propertyId: string) => void;
  onDeleteClient: (clientId: string) => void;
  onUpdateVisitStatus: (visitId: string, status: VisitRequest['status']) => void;
  onUpdateAppraisalStatus: (appraisalId: string, status: AppraisalRequest['status']) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  properties,
  clients,
  visitRequests,
  appraisalRequests,
  onSaveProperty,
  onDeleteProperty,
  onDeleteClient,
  onUpdateVisitStatus,
  onUpdateAppraisalStatus
}) => {
  const { userProfile, signOut, hasPermission } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'visits' | 'appraisals' | 'analytics' | 'users' | 'clients'>('dashboard');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();

  // Configurar tabs basado en permisos del usuario
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3, permission: null },
      { id: 'properties', label: 'Propiedades', icon: Home, permission: 'properties' as const },
      { id: 'visits', label: 'Visitas', icon: Calendar, permission: 'visits' as const },
      { id: 'appraisals', label: 'Tasaciones', icon: TrendingUp, permission: 'appraisals' as const },
      { id: 'clients', label: 'Clientes', icon: UserCheck, permission: 'clients' as const },
      { id: 'users', label: 'Usuarios', icon: Users, permission: 'users' as const },
      { id: 'analytics', label: 'Analytics', icon: Eye, permission: 'analytics' as const }
    ];

    return allTabs.filter(tab => 
      tab.permission === null || hasPermission(tab.permission)
    );
  };

  const availableTabs = getAvailableTabs();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
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

  const handleDeleteClient = (clientId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      onDeleteClient(clientId);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return <Shield className="h-4 w-4" />;
      case 'captador':
        return <Briefcase className="h-4 w-4" />;
      case 'vendedor':
        return <UserCog className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'super_admin':
        return 'Super Administrador';
      case 'captador':
        return 'Captador';
      case 'vendedor':
        return 'Vendedor';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'captador':
        return 'bg-blue-100 text-blue-800';
      case 'vendedor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate real analytics
  const totalViews = properties.reduce((sum, property) => sum + property.views, 0);
  
  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
        <div className="flex items-center">
          {getRoleIcon(userProfile?.role || '')}
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Bienvenido, {userProfile?.full_name}
            </h2>
            <p className="text-gray-600">
              Rol: {getRoleLabel(userProfile?.role || '')} | 
              Acceso: {userProfile?.role === 'admin' || userProfile?.role === 'super_admin' ? 'Completo' :
                      userProfile?.role === 'captador' ? 'Propiedades y Tasaciones' :
                      userProfile?.role === 'vendedor' ? 'Clientes y Visitas' : 'Limitado'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hasPermission('properties') && (
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
        )}
        
        {hasPermission('clients') && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Registrados</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Base de datos de clientes</p>
          </div>
        )}
        
        {hasPermission('visits') && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitas Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{visitRequests.filter(v => v.status === 'pending').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Requieren atención</p>
          </div>
        )}
        
        {hasPermission('analytics') && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visualizaciones</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Vistas acumuladas</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasPermission('clients') && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes Recientes</h3>
            <div className="space-y-4">
              {clients.slice(0, 5).map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    <p className="text-xs text-gray-500">Interés: {client.propertyType}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    client.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    client.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    client.status === 'interested' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status === 'new' ? 'Nuevo' : 
                     client.status === 'contacted' ? 'Contactado' :
                     client.status === 'interested' ? 'Interesado' : 'Cerrado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasPermission('visits') && (
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
        )}
      </div>
    </div>
  );

  const ClientsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestión de Clientes</h3>
        <div className="text-sm text-gray-600">
          Total: {clients.length} clientes registrados
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intereses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presupuesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 capitalize">{client.propertyType}</div>
                      <div className="text-sm text-gray-500">{client.city}</div>
                      {client.interests && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">{client.interests}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.budget ? formatPrice(client.budget) : 'No especificado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      client.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      client.status === 'interested' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status === 'new' ? 'Nuevo' : 
                       client.status === 'contacted' ? 'Contactado' :
                       client.status === 'interested' ? 'Interesado' : 'Cerrado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(client.createdAt).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
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

  const PropertiesContent = () => {
    const canEdit = userProfile?.role === 'admin' || userProfile?.role === 'super_admin' || userProfile?.role === 'captador';
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Propiedades</h3>
          {canEdit && (
            <button 
              onClick={() => setShowPropertyForm(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Propiedad
            </button>
          )}
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
                  {canEdit && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
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
                    {canEdit && (
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
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'properties':
        return hasPermission('properties') ? <PropertiesContent /> : <div>Sin permisos</div>;
      case 'visits':
        return hasPermission('visits') ? <VisitsContent /> : <div>Sin permisos</div>;
      case 'appraisals':
        return hasPermission('appraisals') ? <AppraisalsContent /> : <div>Sin permisos</div>;
      case 'clients':
        return hasPermission('clients') ? <ClientsContent /> : <div>Sin permisos</div>;
      case 'users':
        return hasPermission('users') ? <div>Gestión de usuarios (próximamente)</div> : <div>Sin permisos</div>;
      case 'analytics':
        return hasPermission('analytics') ? <div>Analytics (próximamente)</div> : <div>Sin permisos</div>;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-red-600 p-2 rounded-lg mr-3 transform rotate-45">
                <div className="w-6 h-6 bg-red-600"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-wider">AXTELL</span>
                <span className="text-xs text-gray-600 tracking-widest">ADMIN PANEL</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userProfile?.role || '')}`}>
                  {getRoleIcon(userProfile?.role || '')}
                  <span className="ml-1">{getRoleLabel(userProfile?.role || '')}</span>
                </span>
                <span className="text-sm text-gray-600">{userProfile?.full_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {availableTabs.map((tab) => {
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
        {showPropertyForm && hasPermission('properties') && (
          <PropertyForm
            property={editingProperty}
            onSave={handleSaveProperty}
            onCancel={() => {
              setShowPropertyForm(false);
              setEditingProperty(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;