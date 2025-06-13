import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import PropertyDetails from './components/Property/PropertyDetails';
import VisitScheduler from './components/Calendar/VisitScheduler';
import AppraisalForm from './components/Forms/AppraisalForm';
import { Property, VisitRequest, AppraisalRequest, User } from './types';
import { mockProperties, mockUsers, mockVisitRequests, mockAppraisalRequests } from './data/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showVisitScheduler, setShowVisitScheduler] = useState(false);
  const [showAppraisalForm, setShowAppraisalForm] = useState(false);
  
  // Global state for real data management
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>(mockVisitRequests);
  const [appraisalRequests, setAppraisalRequests] = useState<AppraisalRequest[]>(mockAppraisalRequests);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedProperty(null);
  };

  const handleViewProperty = (property: Property) => {
    // Increment view count
    setProperties(prev => prev.map(p => 
      p.id === property.id 
        ? { ...p, views: p.views + 1 }
        : p
    ));
    
    const updatedProperty = properties.find(p => p.id === property.id);
    setSelectedProperty(updatedProperty || property);
    setCurrentPage('property-details');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('home');
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

  // User management functions
  const handleSaveUser = (userData: Partial<User>) => {
    if (userData.id && users.find(u => u.id === userData.id)) {
      // Update existing user
      setUsers(prev => prev.map(u => 
        u.id === userData.id ? { ...u, ...userData } : u
      ));
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        ...userData
      } as User;
      setUsers(prev => [newUser, ...prev]);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            properties={properties}
            onViewProperty={handleViewProperty}
            onSearchProperties={() => setCurrentPage('properties')}
            onRequestAppraisal={() => setShowAppraisalForm(true)}
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
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'admin':
        return (
          <AdminPanel 
            properties={properties}
            users={users}
            visitRequests={visitRequests}
            appraisalRequests={appraisalRequests}
            onSaveProperty={handleSaveProperty}
            onDeleteProperty={handleDeleteProperty}
            onSaveUser={handleSaveUser}
            onDeleteUser={handleDeleteUser}
            onUpdateVisitStatus={handleUpdateVisitStatus}
            onUpdateAppraisalStatus={handleUpdateAppraisalStatus}
          />
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
          />
        );
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        {currentPage !== 'property-details' && (
          <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        
        <main className="flex-1">
          {renderPage()}
        </main>
        
        {currentPage !== 'property-details' && <Footer />}

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
      </div>
    </AuthProvider>
  );
}

export default App;