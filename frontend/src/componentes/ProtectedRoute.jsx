// frontend/src/componentes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import * as AuthService from '../../servicios/servicioSistem/serviciosAuth.js';

/**
 * Componente para proteger rutas basado en autenticación y roles
 */
const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = null }) => {
  const location = useLocation();
  
  // Verificar si el usuario está autenticado
  if (!AuthService.isAuthenticated()) {
    // Redirigir al login y guardar la ubicación intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especifica un rol requerido o roles permitidos, verificar
  if (requiredRole || allowedRoles) {
    const userRole = AuthService.getRol();
    
    // Verificar rol único requerido
    if (requiredRole && !AuthService.hasRole(requiredRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Verificar múltiples roles permitidos
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si pasa todas las verificaciones, renderizar el componente
  return children;
};

export default ProtectedRoute;

// Componentes específicos para diferentes roles
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="administrativo">
    {children}
  </ProtectedRoute>
);

export const MedicalStaffRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['medico', 'enfermero']}>
    {children}
  </ProtectedRoute>
);

export const DoctorRoute = ({ children }) => (
  <ProtectedRoute requiredRole="medico">
    {children}
  </ProtectedRoute>
);

export const NurseRoute = ({ children }) => (
  <ProtectedRoute requiredRole="enfermero">
    {children}
  </ProtectedRoute>
);