import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { WhatsAppProvider } from './contexts/WhatsAppContext';
import { ToastProvider } from './components/UI/Toast';

// Pages imports
import Layout from './components/Layout';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin imports
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProperties from './pages/admin/Properties';
import AdminClients from './pages/admin/Clients';
import AdminVisits from './pages/admin/Visits';
import AdminUsers from './pages/admin/Users';
import WhatsAppPanel from './components/admin/WhatsAppPanel';

function AppLayout() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="properties" element={<Properties />} />
        <Route path="property/:id" element={<PropertyDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="visits" element={<AdminVisits />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="whatsapp" element={<WhatsAppPanel />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <WhatsAppProvider>
            <ToastProvider>
              <AppLayout />
            </ToastProvider>
          </WhatsAppProvider>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
