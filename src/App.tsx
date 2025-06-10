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
import { Property } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedProperty(null);
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentPage('property-details');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onViewProperty={handleViewProperty}
            onSearchProperties={() => setCurrentPage('properties')}
          />
        );
      case 'properties':
        return <PropertiesPage onViewProperty={handleViewProperty} />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case 'admin':
        return <AdminPanel />;
      case 'property-details':
        return selectedProperty ? (
          <PropertyDetails 
            property={selectedProperty} 
            onBack={() => setCurrentPage('properties')}
          />
        ) : (
          <PropertiesPage onViewProperty={handleViewProperty} />
        );
      default:
        return (
          <HomePage 
            onViewProperty={handleViewProperty}
            onSearchProperties={() => setCurrentPage('properties')}
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
      </div>
    </AuthProvider>
  );
}

export default App;