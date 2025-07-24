import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function Dashboard() {
  const { 
    properties, 
    clients, 
    visits, 
    analytics
  } = useData();

  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Calcular métricas básicas
  const basicMetrics = useMemo(() => {
    const totalProperties = properties.length;
    const totalClients = clients.length;
    const totalVisits = visits.length;
    const pendingVisits = visits.filter(v => v.status === 'pending').length;
    
    // Calcular visitas de este mes
    const thisMonth = new Date();
    const thisMonthVisits = visits.filter(v => {
      const visitDate = new Date(v.createdAt);
      return visitDate.getMonth() === thisMonth.getMonth() && 
             visitDate.getFullYear() === thisMonth.getFullYear();
    }).length;
    
    // Calcular tasa de conversión
    const completedVisits = visits.filter(v => v.status === 'completed').length;
    const conversionRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;

    return {
      totalProperties,
      totalClients,
      totalVisits,
      pendingVisits,
      thisMonthVisits,
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  }, [properties, clients, visits]);

  // Calcular datos para gráfico de visitas por día (últimos 7 días)
  const visitChartData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayVisits = visits.filter(v => v.createdAt.startsWith(dateStr)).length;
      
      days.push({
        date: dateStr,
        visits: dayVisits,
        label: date.toLocaleDateString('es-CL', { weekday: 'short' })
      });
    }
    
    return days;
  }, [visits]);

  const stats = [
    {
      title: 'Total Propiedades',
      value: basicMetrics.totalProperties,
      icon: Home,
      color: 'bg-blue-500',
      change: '+12% vs mes anterior'
    },
    {
      title: 'Total Clientes',
      value: basicMetrics.totalClients,
      icon: Users,
      color: 'bg-green-500',
      change: '+8% vs mes anterior'
    },
    {
      title: 'Visitas Programadas',
      value: basicMetrics.totalVisits,
      icon: Calendar,
      color: 'bg-purple-500',
      change: `${basicMetrics.thisMonthVisits} este mes`
    },
    {
      title: 'Tasa de Conversión',
      value: `${basicMetrics.conversionRate}%`,
      icon: TrendingUp,
      color: 'bg-red-500',
      change: basicMetrics.pendingVisits > 0 ? `${basicMetrics.pendingVisits} pendientes` : 'Sin pendientes'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Visitas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Visitas por Día</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {/* Gráfico simplificado con barras */}
            <div className="h-64 flex items-end space-x-1">
              {visitChartData.map((day, index) => {
                const maxVisits = Math.max(...visitChartData.map(d => d.visits));
                const height = maxVisits > 0 ? (day.visits / maxVisits) * 100 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-red-500 rounded-t transition-all duration-300 hover:bg-red-600 min-h-[4px]"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${new Date(day.date).toLocaleDateString()}: ${day.visits} visitas`}
                    />
                    <span className="text-xs text-gray-500 mt-2">{day.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Propiedades Recientes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Propiedades Recientes</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {properties.slice(0, 5).length > 0 ? (
              properties.slice(0, 5).map((property) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Home className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{property.title}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{property.location}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(property.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        minimumFractionDigits: 0,
                      }).format(property.price)}
                    </p>
                    <p className="text-xs text-gray-500">{property.type === 'sale' ? 'Venta' : 'Arriendo'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No hay propiedades aún</p>
                <p className="text-sm">Las propiedades aparecerán cuando se agreguen al sistema</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      {analytics?.recentActivity && analytics.recentActivity.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {analytics.recentActivity.slice(0, 8).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}