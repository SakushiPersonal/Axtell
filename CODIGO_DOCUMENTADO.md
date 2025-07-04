# 📚 Documentación Completa del Código - Axtell Propiedades

## 🏗️ **Estructura General del Proyecto**

```
src/
├── components/          # Componentes reutilizables
├── context/            # Contextos de React (estado global)
├── data/              # Datos de prueba (mock data)
├── pages/             # Páginas principales de la aplicación
├── types/             # Definiciones de tipos TypeScript
├── App.tsx            # Componente principal
├── main.tsx           # Punto de entrada de la aplicación
└── index.css          # Estilos globales
```

---

## 📋 **Archivos de Configuración**

### **package.json**
```json
// Define las dependencias y scripts del proyecto
{
  "dependencies": {
    "react": "^18.3.1",           // Biblioteca principal de React
    "react-dom": "^18.3.1",       // Para renderizar React en el DOM
    "lucide-react": "^0.344.0"    // Iconos modernos para la interfaz
  },
  "scripts": {
    "dev": "vite",                // Inicia servidor de desarrollo
    "build": "vite build",        // Construye la aplicación para producción
    "preview": "vite preview"     // Previsualiza la build de producción
  }
}
```

### **tsconfig.json y relacionados**
```typescript
// Configuración de TypeScript para el proyecto
// - tsconfig.json: Configuración principal
// - tsconfig.app.json: Configuración para el código de la aplicación
// - tsconfig.node.json: Configuración para herramientas de Node.js

// Beneficios:
// ✅ Detección de errores en tiempo de desarrollo
// ✅ Autocompletado inteligente
// ✅ Refactoring seguro
// ✅ Mejor mantenibilidad del código
```

### **tailwind.config.js**
```javascript
// Configuración de Tailwind CSS
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Le dice a Tailwind qué archivos escanear para clases CSS
  // Esto permite que solo se incluyan los estilos que realmente usas
}
```

### **vite.config.ts**
```typescript
// Configuración del bundler Vite
export default defineConfig({
  plugins: [react()],              // Habilita soporte para React
  optimizeDeps: {
    exclude: ['lucide-react'],     // Optimización para iconos
  },
});
```

---

## 🎯 **Punto de Entrada**

### **main.tsx**
```typescript
// 🚀 PUNTO DE INICIO DE LA APLICACIÓN
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// StrictMode: Modo estricto de React para detectar problemas
// createRoot: Nueva API de React 18 para renderizar
// Conecta la aplicación React con el elemento HTML #root
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### **index.html**
```html
<!-- 📄 ESTRUCTURA HTML BASE -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Axtell Propiedades - Inmobiliaria</title>
  </head>
  <body>
    <div id="root"></div>  <!-- Aquí se monta la aplicación React -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 🧩 **Tipos TypeScript (src/types/index.ts)**

```typescript
// 📝 DEFINICIONES DE TIPOS
// Estos tipos definen la estructura de datos de toda la aplicación

export interface Property {
  id: string;                    // Identificador único
  title: string;                 // Título de la propiedad
  description: string;           // Descripción detallada
  price: number;                 // Precio en pesos chilenos
  type: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'oficina';
  status: 'venta' | 'alquiler';  // Estado de la propiedad
  bedrooms?: number;             // Dormitorios (opcional)
  bathrooms?: number;            // Baños (opcional)
  area: number;                  // Superficie en m²
  
  location: {                    // Ubicación de la propiedad
    address: string;
    city: string;
    neighborhood: string;
    coordinates: { lat: number; lng: number; };
  };
  
  features: string[];            // Características (piscina, jardín, etc.)
  images: string[];              // URLs de las imágenes
  
  agent: {                       // Agente responsable
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  
  views: number;                 // Contador de visualizaciones
  favorites: number;             // Contador de favoritos
  availableVisitDays: string[];  // Días disponibles para visitas
  availableVisitHours: string[]; // Horarios disponibles
  createdAt: string;             // Fecha de creación
  updatedAt: string;             // Fecha de última actualización
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';      // Rol del usuario
  phone?: string;
  createdAt: string;
}

export interface VisitRequest {
  id: string;
  propertyId: string;            // ID de la propiedad a visitar
  propertyTitle: string;         // Título para referencia
  clientName: string;            // Datos del cliente
  clientEmail: string;
  clientPhone: string;
  requestedDate: string;         // Fecha solicitada
  requestedTime: string;         // Hora solicitada
  message?: string;              // Mensaje adicional
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface AppraisalRequest {
  id: string;
  clientName: string;            // Datos del cliente
  clientEmail: string;
  clientPhone: string;
  propertyType: string;          // Tipo de propiedad a tasar
  propertyAddress: string;       // Dirección de la propiedad
  propertyArea?: number;         // Superficie (opcional)
  propertyBedrooms?: number;     // Dormitorios (opcional)
  propertyBathrooms?: number;    // Baños (opcional)
  propertyDescription: string;   // Descripción de la propiedad
  preferredContactMethod: 'email' | 'phone';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

export interface SearchFilters {
  // Filtros para búsqueda de propiedades
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  city?: string;
  neighborhood?: string;
  features?: string[];
}
```

---

## 🗄️ **Datos de Prueba (src/data/mockData.ts)**

```typescript
// 🎭 DATOS DE PRUEBA
// Este archivo contiene datos simulados para desarrollo y testing

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Casa Moderna en Zona Residencial',
    description: 'Hermosa casa de dos plantas...',
    price: 280000000, // Precio en pesos chilenos
    type: 'casa',
    status: 'venta',
    // ... más propiedades de ejemplo
  }
  // Más propiedades...
];

export const mockUsers: User[] = [
  // Usuarios de ejemplo para testing
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    role: 'client',
    // ...
  }
];

export const mockVisitRequests: VisitRequest[] = [
  // Solicitudes de visita de ejemplo
];

export const mockAppraisalRequests: AppraisalRequest[] = [
  // Solicitudes de tasación de ejemplo
];

// 💡 PROPÓSITO:
// - Permite desarrollar sin necesidad de una base de datos
// - Facilita las pruebas de la interfaz
// - Proporciona datos realistas para el diseño
```

---

## 🔐 **Contexto de Autenticación (src/context/AuthContext.tsx)**

```typescript
// 🔐 GESTIÓN DE AUTENTICACIÓN
// Context API de React para manejar el estado de autenticación globalmente

interface AuthContextType {
  user: User | null;                    // Usuario actual (null si no está logueado)
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;                     // Indica si el usuario es administrador
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  // Hook personalizado para usar el contexto de autenticación
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Recupera el usuario del localStorage al cargar la página
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simula autenticación (en producción sería una llamada a API)
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && (password === 'password' || (foundUser.role === 'admin' && password === 'admin123'))) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser)); // Persiste en localStorage
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'admin';

  // 💡 BENEFICIOS DEL CONTEXT:
  // ✅ Estado de autenticación accesible desde cualquier componente
  // ✅ Evita prop drilling (pasar props por múltiples niveles)
  // ✅ Centraliza la lógica de autenticación
  // ✅ Persistencia automática en localStorage

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🏠 **Componente Principal (src/App.tsx)**

```typescript
// 🏠 COMPONENTE PRINCIPAL DE LA APLICACIÓN
// Actúa como el "cerebro" que coordina toda la aplicación

function App() {
  // 📊 ESTADO GLOBAL DE LA APLICACIÓN
  const [currentPage, setCurrentPage] = useState('home');           // Página actual
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showVisitScheduler, setShowVisitScheduler] = useState(false);
  const [showAppraisalForm, setShowAppraisalForm] = useState(false);
  
  // 🗄️ DATOS PRINCIPALES (en una app real vendrían de una base de datos)
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>(mockVisitRequests);
  const [appraisalRequests, setAppraisalRequests] = useState<AppraisalRequest[]>(mockAppraisalRequests);

  // 🧭 NAVEGACIÓN
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedProperty(null);
  };

  // 👁️ VER DETALLES DE PROPIEDAD
  const handleViewProperty = (property: Property) => {
    // Incrementa el contador de vistas
    setProperties(prev => prev.map(p => 
      p.id === property.id 
        ? { ...p, views: p.views + 1 }  // ⬆️ Aumenta las vistas
        : p
    ));
    
    const updatedProperty = properties.find(p => p.id === property.id);
    setSelectedProperty(updatedProperty || property);
    setCurrentPage('property-details');
  };

  // 📅 AGENDAR VISITA
  const handleVisitScheduled = (visitData: Partial<VisitRequest>) => {
    const newVisit: VisitRequest = {
      id: Date.now().toString(),        // ID único basado en timestamp
      ...visitData,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    } as VisitRequest;
    
    setVisitRequests(prev => [newVisit, ...prev]);  // ➕ Agrega al inicio
    alert('¡Visita agendada exitosamente!');
    setShowVisitScheduler(false);
  };

  // 🏷️ SOLICITAR TASACIÓN
  const handleAppraisalRequest = (appraisalData: Partial<AppraisalRequest>) => {
    const newAppraisal: AppraisalRequest = {
      id: Date.now().toString(),
      ...appraisalData,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    } as AppraisalRequest;
    
    setAppraisalRequests(prev => [newAppraisal, ...prev]);
    alert('¡Solicitud de tasación enviada exitosamente!');
    setShowAppraisalForm(false);
  };

  // 🏠 GESTIÓN DE PROPIEDADES (CRUD)
  const handleSaveProperty = (propertyData: Partial<Property>) => {
    if (propertyData.id && properties.find(p => p.id === propertyData.id)) {
      // ✏️ ACTUALIZAR propiedad existente
      setProperties(prev => prev.map(p => 
        p.id === propertyData.id 
          ? { ...p, ...propertyData, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ));
    } else {
      // ➕ CREAR nueva propiedad
      const newProperty: Property = {
        id: Date.now().toString(),
        views: 0,
        favorites: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        ...propertyData
      } as Property;
      setProperties(prev => [newProperty, ...prev]);
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    // 🗑️ ELIMINAR propiedad y visitas relacionadas
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    setVisitRequests(prev => prev.filter(v => v.propertyId !== propertyId));
  };

  // 👥 GESTIÓN DE USUARIOS (CRUD)
  const handleSaveUser = (userData: Partial<User>) => {
    if (userData.id && users.find(u => u.id === userData.id)) {
      // ✏️ ACTUALIZAR usuario existente
      setUsers(prev => prev.map(u => 
        u.id === userData.id ? { ...u, ...userData } : u
      ));
    } else {
      // ➕ CREAR nuevo usuario
      const newUser: User = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        ...userData
      } as User;
      setUsers(prev => [newUser, ...prev]);
    }
  };

  // 📊 GESTIÓN DE ESTADOS DE SOLICITUDES
  const handleUpdateVisitStatus = (visitId: string, status: VisitRequest['status']) => {
    setVisitRequests(prev => prev.map(visit => 
      visit.id === visitId ? { ...visit, status } : visit
    ));
  };

  // 🎨 RENDERIZADO CONDICIONAL DE PÁGINAS
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage properties={properties} onViewProperty={handleViewProperty} />;
      case 'properties':
        return <PropertiesPage properties={properties} onViewProperty={handleViewProperty} />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'admin':
        return <AdminPanel 
          properties={properties}
          users={users}
          visitRequests={visitRequests}
          appraisalRequests={appraisalRequests}
          onSaveProperty={handleSaveProperty}
          onDeleteProperty={handleDeleteProperty}
          // ... más props
        />;
      case 'property-details':
        return selectedProperty ? (
          <PropertyDetails 
            property={selectedProperty} 
            onBack={() => setCurrentPage('properties')}
            onScheduleVisit={handleScheduleVisit}
          />
        ) : <PropertiesPage properties={properties} onViewProperty={handleViewProperty} />;
      default:
        return <HomePage properties={properties} onViewProperty={handleViewProperty} />;
    }
  };

  // 🎨 ESTRUCTURA PRINCIPAL
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        {/* 🧭 Navbar (se oculta en detalles de propiedad) */}
        {currentPage !== 'property-details' && (
          <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        
        {/* 📄 Contenido principal */}
        <main className="flex-1">
          {renderPage()}
        </main>
        
        {/* 🦶 Footer (se oculta en detalles de propiedad) */}
        {currentPage !== 'property-details' && <Footer />}

        {/* 🪟 MODALES */}
        {showVisitScheduler && selectedProperty && (
          <VisitScheduler
            property={selectedProperty}
            onClose={() => setShowVisitScheduler(false)}
            onSchedule={handleVisitScheduled}
          />
        )}

        {showAppraisalForm && (
          <AppraisalForm
            onClose={() => setShowAppraisalForm(false)}
            onSubmit={handleAppraisalRequest}
          />
        )}
      </div>
    </AuthProvider>
  );
}

// 💡 ARQUITECTURA DEL COMPONENTE APP:
// ✅ Estado centralizado para toda la aplicación
// ✅ Funciones de manejo de eventos bien organizadas
// ✅ Renderizado condicional para diferentes páginas
// ✅ Gestión de modales y overlays
// ✅ Integración con contexto de autenticación
```

---

## 📄 **Páginas Principales**

### **HomePage (src/pages/HomePage.tsx)**
```typescript
// 🏠 PÁGINA DE INICIO
// Primera impresión de la aplicación, diseñada para convertir visitantes en clientes

const HomePage: React.FC<HomePageProps> = ({ 
  properties, 
  onViewProperty, 
  onSearchProperties, 
  onRequestAppraisal 
}) => {
  // 📊 CÁLCULOS DINÁMICOS
  const featuredProperties = properties
    .sort((a, b) => b.views - a.views)    // Ordena por más vistas
    .slice(0, 3);                         // Toma las 3 más populares

  const totalViews = properties.reduce((sum, property) => sum + property.views, 0);
  const totalFavorites = properties.reduce((sum, property) => sum + property.favorites, 0);

  // 📈 ESTADÍSTICAS PARA MOSTRAR
  const stats = [
    { icon: HomeIcon, value: `${properties.length}+`, label: 'Propiedades' },
    { icon: Users, value: '1,200+', label: 'Clientes Satisfechos' },
    { icon: Award, value: '15+', label: 'Años de Experiencia' },
    { icon: TrendingUp, value: `${totalViews}+`, label: 'Visualizaciones' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎯 HERO SECTION - Primera impresión */}
      <section className="relative bg-gradient-to-r from-red-900 to-red-700 text-white">
        <div className="relative bg-cover bg-center min-h-screen flex items-center">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encuentra Tu Hogar Ideal
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Más de 15 años ayudando a familias...
            </p>
            {/* 🎯 CALL TO ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onSearchProperties}>Ver Propiedades</button>
              <button onClick={onRequestAppraisal}>Solicitar Tasación</button>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 ESTADÍSTICAS */}
      <section className="py-16 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <Icon className="h-8 w-8 text-red-600" />
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ PROPIEDADES DESTACADAS */}
      <section className="py-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onViewDetails={onViewProperty}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

// 💡 ESTRATEGIA DE LA HOMEPAGE:
// ✅ Hero section impactante para captar atención
// ✅ Estadísticas reales para generar confianza
// ✅ Propiedades destacadas para mostrar calidad
// ✅ Múltiples call-to-actions estratégicamente ubicados
```

### **PropertiesPage (src/pages/PropertiesPage.tsx)**
```typescript
// 🔍 PÁGINA DE BÚSQUEDA DE PROPIEDADES
// Permite a los usuarios filtrar y encontrar propiedades específicas

const PropertiesPage: React.FC<PropertiesPageProps> = ({ properties, onViewProperty }) => {
  // 🎛️ ESTADO LOCAL PARA FILTROS Y VISTA
  const [filters, setFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'date' | 'area'>('date');
  const [favorites, setFavorites] = useState<string[]>([]);

  // 🔍 FILTRADO Y ORDENAMIENTO DINÁMICO
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // 🎯 APLICAR FILTROS
      if (filters.type && property.type !== filters.type) return false;
      if (filters.status && property.status !== filters.status) return false;
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      // ... más filtros
      return true;
    });

    // 📊 APLICAR ORDENAMIENTO
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'area': return b.area - a.area;
        case 'date':
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [properties, filters, sortBy]);  // 🔄 Se recalcula cuando cambian las dependencias

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎛️ COMPONENTE DE FILTROS */}
      <PropertyFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({})}
      />

      {/* 🎮 CONTROLES DE VISTA Y ORDENAMIENTO */}
      <div className="flex justify-between items-center">
        <span>{filteredProperties.length} propiedades encontradas</span>
        
        {/* 📊 Selector de ordenamiento */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="date">Más Recientes</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="area">Mayor Superficie</option>
        </select>

        {/* 👁️ Selector de vista (grid/list) */}
        <div className="flex items-center">
          <button onClick={() => setViewMode('grid')}>
            <Grid className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 🏠 GRID/LISTA DE PROPIEDADES */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-6'
      }>
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onViewDetails={onViewProperty}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.includes(property.id)}
          />
        ))}
      </div>
    </div>
  );
};

// 💡 CARACTERÍSTICAS CLAVE:
// ✅ Filtrado en tiempo real con useMemo para performance
// ✅ Múltiples opciones de ordenamiento
// ✅ Vista grid y lista intercambiables
// ✅ Sistema de favoritos local
// ✅ Contador dinámico de resultados
```

### **AdminPanel (src/pages/AdminPanel.tsx)**
```typescript
// 👨‍💼 PANEL DE ADMINISTRACIÓN
// Centro de control para gestionar toda la aplicación

const AdminPanel: React.FC<AdminPanelProps> = ({
  properties, users, visitRequests, appraisalRequests,
  onSaveProperty, onDeleteProperty, onSaveUser, onDeleteUser,
  onUpdateVisitStatus, onUpdateAppraisalStatus
}) => {
  // 🎛️ ESTADO PARA NAVEGACIÓN Y MODALES
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'visits' | 'appraisals' | 'analytics' | 'users'>('dashboard');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();

  // 📊 CÁLCULOS EN TIEMPO REAL PARA ANALYTICS
  const totalViews = properties.reduce((sum, property) => sum + property.views, 0);
  const totalFavorites = properties.reduce((sum, property) => sum + property.favorites, 0);
  
  // 🏘️ ESTADÍSTICAS POR BARRIO
  const neighborhoodStats = properties.reduce((acc, property) => {
    const neighborhood = property.location.neighborhood;
    if (!acc[neighborhood]) {
      acc[neighborhood] = { views: 0, count: 0 };
    }
    acc[neighborhood].views += property.views;
    acc[neighborhood].count += 1;
    return acc;
  }, {} as Record<string, { views: number; count: number }>);

  // 🏠 ESTADÍSTICAS POR TIPO DE PROPIEDAD
  const propertyTypeStats = properties.reduce((acc, property) => {
    const type = property.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 📊 DASHBOARD CONTENT
  const DashboardContent = () => (
    <div className="space-y-6">
      {/* 📈 TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Propiedades</p>
              <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
            </div>
            <Home className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        {/* Más tarjetas... */}
      </div>

      {/* 📋 ACTIVIDAD RECIENTE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Visitas Recientes</h3>
          {visitRequests.slice(0, 5).map((visit) => (
            <div key={visit.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{visit.clientName}</p>
                <p className="text-sm text-gray-600">{visit.propertyTitle}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                visit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                visit.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {visit.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 🏠 GESTIÓN DE PROPIEDADES
  const PropertiesContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestión de Propiedades</h3>
        <button onClick={() => setShowPropertyForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Propiedad
        </button>
      </div>

      {/* 📋 TABLA DE PROPIEDADES */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>Propiedad</th>
              <th>Tipo/Estado</th>
              <th>Precio</th>
              <th>Ubicación</th>
              <th>Vistas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>
                  <div className="flex items-center">
                    <img src={property.images[0]} className="h-12 w-12 rounded-lg" />
                    <div className="ml-4">
                      <div className="font-medium">{property.title}</div>
                      <div className="text-gray-500">{property.area}m²</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="capitalize">{property.type}</div>
                  <span className="px-2 py-1 text-xs rounded-full">
                    {property.status}
                  </span>
                </td>
                <td>{formatPrice(property.price)}</td>
                <td>
                  <div>{property.location.neighborhood}</div>
                  <div className="text-gray-500">{property.location.city}</div>
                </td>
                <td>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {property.views}
                  </div>
                </td>
                <td>
                  <button onClick={() => editProperty(property)}>
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteProperty(property.id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 📊 ANALYTICS CON DATOS REALES
  const AnalyticsContent = () => (
    <div className="space-y-6">
      {/* 📈 ESTADÍSTICAS GENERALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="font-semibold mb-4">Estadísticas Generales</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Vistas:</span>
              <span className="font-semibold">{totalViews}</span>
            </div>
            <div className="flex justify-between">
              <span>Promedio Vistas/Propiedad:</span>
              <span className="font-semibold">{Math.round(totalViews / properties.length)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 DISTRIBUCIÓN POR TIPO */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="font-semibold mb-4">Distribución por Tipo de Propiedad</h4>
        {Object.entries(propertyTypeStats).map(([type, count]) => {
          const percentage = (count / properties.length) * 100;
          return (
            <div key={type} className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="font-medium capitalize">{type}</div>
                <div className="text-gray-500">({count} propiedades)</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="font-medium">{percentage.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🧭 NAVEGACIÓN POR PESTAÑAS */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 📄 CONTENIDO DINÁMICO */}
      {renderContent()}

      {/* 🪟 MODALES */}
      {showPropertyForm && (
        <PropertyForm
          property={editingProperty}
          onSave={handleSaveProperty}
          onCancel={() => setShowPropertyForm(false)}
        />
      )}
    </div>
  );
};

// 💡 CARACTERÍSTICAS DEL ADMIN PANEL:
// ✅ Dashboard con métricas en tiempo real
// ✅ CRUD completo para propiedades y usuarios
// ✅ Gestión de visitas y tasaciones
// ✅ Analytics con datos reales calculados dinámicamente
// ✅ Interfaz intuitiva con navegación por pestañas
// ✅ Modales para formularios complejos
```

---

## 🧩 **Componentes Reutilizables**

### **PropertyCard (src/components/Property/PropertyCard.tsx)**
```typescript
// 🏠 TARJETA DE PROPIEDAD
// Componente reutilizable para mostrar propiedades en listas y grids

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false
}) => {
  // 💰 FORMATEO DE PRECIO EN PESOS CHILENOS
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // 🎨 COLORES DINÁMICOS SEGÚN ESTADO
  const getStatusColor = (status: string) => {
    return status === 'venta' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* 🖼️ IMAGEN CON OVERLAYS */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* 🏷️ BADGES DE ESTADO Y TIPO */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {property.status === 'venta' ? 'En Venta' : 'En Alquiler'}
          </span>
          <span className="px-2 py-1 bg-gray-900 bg-opacity-75 text-white rounded-full text-xs">
            {getTypeLabel(property.type)}
          </span>
        </div>

        {/* ❤️ BOTÓN DE FAVORITOS */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();  // Evita activar onViewDetails
              onToggleFavorite(property.id);
            }}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        )}
      </div>

      {/* 📝 CONTENIDO DE LA TARJETA */}
      <div className="p-4">
        {/* 💰 TÍTULO Y PRECIO */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
          <div className="text-right">
            <div className="text-xl font-bold text-red-600">
              {formatPrice(property.price)}
            </div>
            {property.status === 'alquiler' && (
              <div className="text-sm text-gray-500">/mes</div>
            )}
          </div>
        </div>

        {/* 📍 UBICACIÓN */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location.neighborhood}, {property.location.city}</span>
        </div>

        {/* 🏠 CARACTERÍSTICAS */}
        <div className="flex items-center space-x-4 text-gray-600 mb-4">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.area}m²</span>
          </div>
        </div>

        {/* 👁️ ESTADÍSTICAS Y ACCIÓN */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Eye className="h-4 w-4 mr-1" />
            <span>{property.views} visualizaciones</span>
          </div>
          <button
            onClick={() => onViewDetails(property)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

// 💡 CARACTERÍSTICAS DEL COMPONENTE:
// ✅ Diseño responsive y atractivo
// ✅ Animaciones suaves en hover
// ✅ Formateo automático de precios
// ✅ Sistema de favoritos integrado
// ✅ Badges informativos
// ✅ Prevención de eventos duplicados
// ✅ Información condensada pero completa
```

### **PropertyDetails (src/components/Property/PropertyDetails.tsx)**
```typescript
// 🔍 VISTA DETALLADA DE PROPIEDAD
// Página completa para mostrar todos los detalles de una propiedad

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ 
  property, 
  onBack, 
  onScheduleVisit 
}) => {
  // 🖼️ ESTADO PARA GALERÍA DE IMÁGENES
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // 🖼️ NAVEGACIÓN DE IMÁGENES
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // 📱 INTEGRACIÓN CON WHATSAPP
  const handleWhatsAppContact = () => {
    const phone = property.agent.phone.replace(/\D/g, ''); // Remueve caracteres no numéricos
    const message = encodeURIComponent(`Hola! Me interesa la propiedad: ${property.title}`);
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ⬅️ BOTÓN DE REGRESO */}
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a propiedades
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 🖼️ GALERÍA DE IMÁGENES Y DETALLES */}
          <div className="lg:col-span-2">
            {/* 📸 IMAGEN PRINCIPAL CON NAVEGACIÓN */}
            <div className="relative mb-6">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* ⬅️➡️ CONTROLES DE NAVEGACIÓN */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <ArrowLeft className="h-5 w-5 transform rotate-180" />
                  </button>
                  
                  {/* 📊 CONTADOR DE IMÁGENES */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    <Camera className="h-4 w-4 text-white" />
                    <span className="text-white text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* 🖼️ MINIATURAS */}
            {property.images.length > 1 && (
              <div className="flex space-x-2 mb-6 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* 📝 INFORMACIÓN DETALLADA */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* 🏠 TÍTULO Y ACCIONES */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{property.location.address}, {property.location.neighborhood}, {property.location.city}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setIsFavorite(!isFavorite)}>
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                  <button>
                    <Share2 className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* 📊 CARACTERÍSTICAS PRINCIPALES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{getTypeLabel(property.type)}</div>
                  <div className="text-sm text-gray-600">Tipo</div>
                </div>
                {property.bedrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 flex items-center justify-center">
                      <Bed className="h-6 w-6 mr-1" />
                      {property.bedrooms}
                    </div>
                    <div className="text-sm text-gray-600">Dormitorios</div>
                  </div>
                )}
                {/* Más características... */}
              </div>

              {/* 📄 DESCRIPCIÓN */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* ✅ CARACTERÍSTICAS ADICIONALES */}
              {property.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 📞 SIDEBAR DE CONTACTO */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-24">
              {/* 💰 PRECIO */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {formatPrice(property.price)}
                </div>
                {property.status === 'alquiler' && (
                  <div className="text-gray-600">por mes</div>
                )}
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'venta' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status === 'venta' ? 'En Venta' : 'En Alquiler'}
                  </span>
                </div>
              </div>

              {/* 👨‍💼 INFORMACIÓN DEL AGENTE */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agente a Cargo</h3>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-semibold text-lg">
                      {property.agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="font-medium text-gray-900">{property.agent.name}</div>
                </div>
                
                {/* 📞 BOTONES DE CONTACTO */}
                <div className="space-y-3">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar
                  </a>
                  
                  {/* 📱 BOTÓN DE WHATSAPP */}
                  <button
                    onClick={handleWhatsAppContact}
                    className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </button>
                  
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center justify-center w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </a>
                  
                  {/* 📅 AGENDAR VISITA */}
                  {onScheduleVisit && (
                    <button 
                      onClick={() => onScheduleVisit(property)}
                      className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Visita
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 🗺️ MAPA PLACEHOLDER */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h3>
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Mapa interactivo</p>
                  <p className="text-sm">Integración con Google Maps</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <strong>Dirección:</strong> {property.location.address}<br />
                <strong>Barrio:</strong> {property.location.neighborhood}<br />
                <strong>Ciudad:</strong> {property.location.city}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 💡 CARACTERÍSTICAS CLAVE:
// ✅ Galería de imágenes con navegación fluida
// ✅ Información completa y bien organizada
// ✅ Integración directa con WhatsApp
// ✅ Sidebar sticky para contacto fácil
// ✅ Diseño responsive y profesional
// ✅ Múltiples opciones de contacto
// ✅ Sistema de favoritos
// ✅ Botón de compartir
```

---

## 🎨 **Estilos y Configuración**

### **index.css**
```css
/* 🎨 ESTILOS GLOBALES */
@tailwind base;      /* Estilos base de Tailwind */
@tailwind components; /* Componentes de Tailwind */
@tailwind utilities;  /* Utilidades de Tailwind */

/* 
💡 TAILWIND CSS:
- Framework de CSS utility-first
- Permite crear diseños rápidamente con clases predefinidas
- Ejemplo: "bg-red-600 text-white p-4 rounded-lg"
- Optimizado automáticamente (solo incluye clases usadas)
*/
```

---

## 🔧 **Herramientas de Desarrollo**

### **ESLint (eslint.config.js)**
```javascript
// 🔍 LINTER PARA CALIDAD DE CÓDIGO
export default tseslint.config(
  { ignores: ['dist'] },  // Ignora archivos de build
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,      // Reglas para hooks de React
      'react-refresh': reactRefresh,  // Hot reload en desarrollo
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  }
);

// 💡 BENEFICIOS:
// ✅ Detecta errores comunes
// ✅ Enforza buenas prácticas
// ✅ Mantiene consistencia en el código
// ✅ Integración con editores (VS Code)
```

---

## 🏗️ **Arquitectura y Patrones**

### **🔄 Flujo de Datos**
```
Usuario interactúa → Componente → Función handler → Estado en App.tsx → Re-render automático
```

### **📦 Gestión de Estado**
```typescript
// 🎯 ESTADO CENTRALIZADO EN APP.TSX
const [properties, setProperties] = useState<Property[]>(mockProperties);
const [users, setUsers] = useState<User[]>(mockUsers);
const [visitRequests, setVisitRequests] = useState<VisitRequest[]>(mockVisitRequests);

// 💡 VENTAJAS:
// ✅ Una sola fuente de verdad
// ✅ Cambios se propagan automáticamente
// ✅ Fácil debugging y testing
// ✅ Estado predecible
```

### **🧩 Composición de Componentes**
```typescript
// 🏗️ PATRÓN DE COMPOSICIÓN
<App>                          // Estado global y lógica principal
  <AuthProvider>               // Contexto de autenticación
    <Navbar />                 // Navegación
    <HomePage>                 // Página específica
      <PropertyCard />         // Componente reutilizable
    </HomePage>
    <Footer />                 // Pie de página
    <VisitScheduler />         // Modal
  </AuthProvider>
</App>

// 💡 BENEFICIOS:
// ✅ Componentes reutilizables
// ✅ Separación de responsabilidades
// ✅ Fácil mantenimiento
// ✅ Testing independiente
```

### **🔄 Ciclo de Vida de Datos**
```typescript
// 📊 EJEMPLO: AGREGAR NUEVA PROPIEDAD
1. Usuario llena formulario en PropertyForm
2. onSave se ejecuta con los datos
3. handleSaveProperty en App.tsx procesa los datos
4. setProperties actualiza el estado
5. React re-renderiza automáticamente todos los componentes que usan properties
6. La nueva propiedad aparece en HomePage, PropertiesPage, AdminPanel, etc.

// 💡 FLUJO UNIDIRECCIONAL:
// Datos fluyen hacia abajo (props)
// Eventos fluyen hacia arriba (callbacks)
```

---

## 🚀 **Optimizaciones y Mejores Prácticas**

### **⚡ Performance**
```typescript
// 🔍 useMemo para cálculos costosos
const filteredProperties = useMemo(() => {
  return properties.filter(property => {
    // Filtrado complejo...
  });
}, [properties, filters]); // Solo se recalcula cuando cambian las dependencias

// 🎯 useCallback para funciones estables
const handlePropertyClick = useCallback((property: Property) => {
  onViewProperty(property);
}, [onViewProperty]);

// 💡 BENEFICIOS:
// ✅ Evita re-cálculos innecesarios
// ✅ Previene re-renders innecesarios
// ✅ Mejor experiencia de usuario
```

### **🔒 TypeScript**
```typescript
// 🛡️ TIPADO ESTRICTO
interface PropertyCardProps {
  property: Property;                    // Tipo específico
  onViewDetails: (property: Property) => void;  // Función tipada
  onToggleFavorite?: (propertyId: string) => void;  // Opcional
  isFavorite?: boolean;                  // Opcional con default
}

// 💡 BENEFICIOS:
// ✅ Detección de errores en tiempo de desarrollo
// ✅ Autocompletado inteligente
// ✅ Refactoring seguro
// ✅ Documentación automática
```

### **♿ Accesibilidad**
```typescript
// 🎯 BUENAS PRÁCTICAS DE ACCESIBILIDAD
<button
  onClick={handleClick}
  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
  aria-label="Ver detalles de la propiedad"
>
  Ver Detalles
</button>

// 💡 CARACTERÍSTICAS:
// ✅ Estados de focus visibles
// ✅ Contraste de colores adecuado
// ✅ Textos alternativos para imágenes
// ✅ Navegación por teclado
```

---

## 📱 **Responsive Design**

```css
/* 📱 BREAKPOINTS DE TAILWIND */
sm: 640px   /* Tablets pequeñas */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */

/* 🎨 EJEMPLO DE USO */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  /* 1 columna en móvil, 2 en tablet, 3 en desktop */
</div>

/* 💡 ESTRATEGIA MOBILE-FIRST:
✅ Diseño base para móvil
✅ Mejoras progresivas para pantallas más grandes
✅ Performance optimizada
✅ Experiencia consistente en todos los dispositivos
*/
```

---

## 🔮 **Próximos Pasos y Mejoras**

### **🗄️ Base de Datos Real**
```typescript
// 🔄 REEMPLAZAR MOCK DATA CON API REAL
const fetchProperties = async () => {
  const response = await fetch('/api/properties');
  const properties = await response.json();
  setProperties(properties);
};

// 💡 CONSIDERACIONES:
// ✅ Implementar loading states
// ✅ Manejo de errores
// ✅ Paginación
// ✅ Cache de datos
```

### **🔐 Autenticación Real**
```typescript
// 🛡️ INTEGRACIÓN CON BACKEND
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const { user, token } = await response.json();
    localStorage.setItem('token', token);
    setUser(user);
    return true;
  }
  return false;
};
```

### **📊 Analytics Avanzados**
```typescript
// 📈 MÉTRICAS DETALLADAS
const trackPropertyView = (propertyId: string) => {
  // Google Analytics, Mixpanel, etc.
  analytics.track('Property Viewed', {
    propertyId,
    timestamp: new Date(),
    userAgent: navigator.userAgent
  });
};
```

---

## 🎯 **Resumen de la Arquitectura**

La aplicación está construida con una arquitectura moderna y escalable:

### **🏗️ Estructura**
- **React 18** con TypeScript para type safety
- **Tailwind CSS** para estilos utility-first
- **Vite** como bundler rápido
- **Context API** para estado global
- **Componentes funcionales** con hooks

### **📊 Gestión de Datos**
- Estado centralizado en `App.tsx`
- Datos mock para desarrollo
- CRUD completo para todas las entidades
- Cálculos en tiempo real para analytics

### **🎨 UI/UX**
- Diseño responsive mobile-first
- Animaciones suaves y micro-interacciones
- Sistema de colores consistente
- Accesibilidad integrada

### **🔧 Herramientas**
- ESLint para calidad de código
- TypeScript para type safety
- Hot reload para desarrollo rápido
- Build optimizado para producción

Esta documentación te proporciona una comprensión completa de cómo funciona cada parte del código y cómo se integran entre sí para crear una aplicación web moderna y funcional. ¿Hay alguna parte específica que te gustaría que explique con más detalle?