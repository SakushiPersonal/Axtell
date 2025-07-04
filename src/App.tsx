import React, { useState } from 'react';
import { SupabaseAuthProvider } from './context/SupabaseAuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import AboutPage from './pages/AboutPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanel from './pages/AdminPanel';
import PropertyDetails from './components/Property/PropertyDetails';
import VisitScheduler from './components/Calendar/VisitScheduler';
import AppraisalForm from './components/Forms/AppraisalForm';
import ClientRegistrationForm from './components/Forms/ClientRegistrationForm';
import { Property, VisitRequest, AppraisalRequest, Client } from './types';
import { mockProperties, mockClients, mockVisitRequests, mockAppraisalRequests } from './data/mockData';
import { useSupabaseAuth } from './context/SupabaseAuthContext';

function AppContent() {
  const { user, userProfile, loading } = useSupabaseAuth();
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/admin') return 'admin-login';
    return 'home';
  });
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showVisitScheduler, setShowVisitScheduler] = useState(false);
  const [showAppraisalForm, setShowAppraisalForm] = useState(false);
  const [showClientRegistration, setShowClientRegistration] = useState(false);
  
  // Global state for real data management (temporal hasta migrar completamente a Supabase)
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>(mockVisitRequests);
  const [appraisalRequests, setAppraisalRequests] = useState<AppraisalRequest[]>(mockAppraisalRequests);

  // Handle URL changes
  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentPage('admin-login');
      } else if (path === '/') {
        setCurrentPage('home');
      } else if (path === '/properties') {
        setCurrentPage('properties');
      } else if (path === '/about') {
        setCurrentPage('about');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update current page when auth state changes
  React.useEffect(() => {
    if (!loading) {
      const path = window.location.pathname;
      if (user && userProfile && (userProfile.role === 'admin' || userProfile.role === 'super_admin' || userProfile.role === 'captador' || userProfile.role === 'vendedor')) {
        if (path === '/admin' && currentPage === 'admin-login') {
          setCurrentPage('admin');
        }
      } else if (!user && path === '/admin') {
        setCurrentPage('admin');
        setCurrentPage('admin-login');
      } else if (path === '/' && currentPage !== 'home') {
        setCurrentPage('home');
      }
    }
  }, [user, userProfile, loading]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedProperty(null);
    
    // Update URL
    if (page === 'home') {
      window.history.pushState({}, '', '/');
    } else if (page === 'properties') {
      window.history.pushState({}, '', '/properties');
    } else if (page === 'about') {
      window.history.pushState({}, '', '/about');
    } else if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    }
  };

  const handleViewProperty = (property: Property) => {
    // Increment view count
    setProperties(prev => prev.map(p => 
      p.id === property.id 
        ? { ...p, views: p.views + 1 }
        : p
    ));
    
    const updatedProperty = properties.find(p => p.id === property.id);
    if (updatedProperty) {
      setSelectedProperty({ ...updatedProperty, views: updatedProperty.views + 1 });
    } else {
      setSelectedProperty({ ...property, views: property.views + 1 });
    }
    setCurrentPage('property-details');
  };

  const handleLoginSuccess = () => {
    console.log('Login success handler called');
    setCurrentPage('admin');
  };

  const handleScheduleVisit = (property: Property) => {
    setSelectedProperty(property);
    setShowVisitScheduler(true);
  };

  const handleVisitScheduled = (visitData: Partial<VisitRequest>) => {
    const newVisit: VisitRequest = {
      id: Date.now().toString(),
      ...visitData,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    } as VisitRequest;
    
    setVisitRequests(prev => [newVisit, ...prev]);
    alert('¡Visita agendada exitosamente! Te contactaremos pronto para confirmar.');
    setShowVisitScheduler(false);
  };

  const handleAppraisalRequest = (appraisalData: Partial<AppraisalRequest>) => {
    const newAppraisal: AppraisalRequest = {
      id: Date.now().toString(),
      ...appraisalData,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    } as AppraisalRequest;
    
    setAppraisalRequests(prev => [newAppraisal, ...prev]);
    alert('¡Solicitud de tasación enviada exitosamente! Te contactaremos en las próximas 24 horas.');
    setShowAppraisalForm(false);
  };

  const handleClientRegistration = (clientData: Partial<Client>) => {
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      createdAt: new Date().toISOString().split('T')[0]
    } as Client;
    
    setClients(prev => [newClient, ...prev]);
    alert('¡Registro exitoso! Nos pondremos en contacto contigo pronto.');
    setShowClientRegistration(false);
  };

  // Property management functions
  const handleSaveProperty = (propertyData: Partial<Property>) => {
    if (propertyData.id && properties.find(p => p.id === propertyData.id)) {
      // Update existing property
      setProperties(prev => prev.map(p => 
        p.id === propertyData.id 
          ? { ...p, ...propertyData, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ));
    } else {
      // Create new property
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
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    // Also remove related visit requests
    setVisitRequests(prev => prev.filter(v => v.propertyId !== propertyId));
  };

  // Client management functions
  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  // Visit and appraisal management
  const handleUpdateVisitStatus = (visitId: string, status: VisitRequest['status']) => {
    setVisitRequests(prev => prev.map(visit => 
      visit.id === visitId ? { ...visit, status } : visit
    ));
  };

  const handleUpdateAppraisalStatus = (appraisalId: string, status: AppraisalRequest['status']) => {
    setAppraisalRequests(prev => prev.map(appraisal => 
      appraisal.id === appraisalId ? { ...appraisal, status } : appraisal
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            properties={properties}
            onViewProperty={handleViewProperty}
            onSearchProperties={() => setCurrentPage('properties')}
            onRequestAppraisal={() => setShowAppraisalForm(true)}
            onRegisterClient={() => setShowClientRegistration(true)}
          />
        );
      case 'properties':
        return (
          <PropertiesPage 
            properties={properties}
            onViewProperty={handleViewProperty} 
          />
        );
      case 'about':
        return <AboutPage />;
      case 'admin-login':
        return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'admin':
        return user && userProfile && (userProfile.role === 'admin' || userProfile.role === 'super_admin' || userProfile.role === 'captador' || userProfile.role === 'vendedor') ? (
          <AdminPanel 
            properties={properties}
            clients={clients}
            visitRequests={visitRequests}
            appraisalRequests={appraisalRequests}
            onSaveProperty={handleSaveProperty}
            onDeleteProperty={handleDeleteProperty}
            onDeleteClient={handleDeleteClient}
            onUpdateVisitStatus={handleUpdateVisitStatus}
            onUpdateAppraisalStatus={handleUpdateAppraisalStatus}
          />
        ) : (
          <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
        );
      case 'property-details':
        return selectedProperty ? (
          <PropertyDetails 
            property={selectedProperty} 
            onBack={() => setCurrentPage('properties')}
            onScheduleVisit={handleScheduleVisit}
          />
        ) : (
          <PropertiesPage 
            properties={properties}
            onViewProperty={handleViewProperty} 
          />
        );
      default:
        return (
          <HomePage 
            properties={properties}
            onViewProperty={handleViewProperty}
            onSearchProperties={() => setCurrentPage('properties')}
            onRequestAppraisal={() => setShowAppraisalForm(true)}
            onRegisterClient={() => setShowClientRegistration(true)}
          />
        );
    }
  };

  // Don't show navbar and footer for admin pages
  const isAdminPage = currentPage === 'admin' || currentPage === 'admin-login';
  const isPropertyDetails = currentPage === 'property-details';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && !isPropertyDetails && (
        <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
      )}
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      {!isAdminPage && !isPropertyDetails && <Footer />}

      {/* Modals */}
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

      {showClientRegistration && (
        <ClientRegistrationForm
          onClose={() => setShowClientRegistration(false)}
          onSubmit={handleClientRegistration}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <SupabaseAuthProvider>
      <AppContent />
    </SupabaseAuthProvider>
  );
}

export default App;