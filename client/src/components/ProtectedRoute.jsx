import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center flex-col gap-4">
        {/* Futuristic Glass Loader */}
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-neonPurple border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1 left-1 w-14 h-14 border-4 border-b-neonCyan border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
        </div>
        <p className="text-gray-400 font-sans tracking-widest text-sm animate-pulse">AETHERART LOADING...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
