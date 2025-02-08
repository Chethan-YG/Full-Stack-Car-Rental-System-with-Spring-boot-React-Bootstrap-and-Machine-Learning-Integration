import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuthenticated, requiredRole, userRole }) => {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/home" />;
  }
  return element;
};

export default ProtectedRoute;

