import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Billing from './pages/Billing';
import Admin from './pages/Admin';

const App = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if we are on Landing or Auth page
  const isAuthOrLanding = location.pathname === '/' || location.pathname === '/auth';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render standalone layout for landing & authentication
  if (isAuthOrLanding) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Render full dashboard layout with Sidebar and Header
  return (
    <div className="flex h-screen overflow-hidden bg-darkBg text-gray-100">
      
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Studio Console Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <Header onMenuClick={toggleSidebar} />

        {/* Dynamic Route Screen Frame */}
        <main className="flex-1 overflow-y-auto bg-dark-radial flex flex-col">
          <Routes>
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gallery" 
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/billing" 
              element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

      </div>
    </div>
  );
};

export default App;
