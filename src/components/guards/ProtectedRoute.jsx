import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    alert('Please login to access this page');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;