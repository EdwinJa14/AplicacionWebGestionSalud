import React, { useEffect } from 'react';
import { useAuth } from '../src/context/authContext.jsx';
import PanelPrincipal from './vistas/panelPrincipal.jsx';
import AdminRoutes from '../src/vistas/AdimRoutes.jsx';
import UserRoutes from '../src/vistas/UserRoutes.jsx';

function App() {
  const { role, isLoading } = useAuth(); 
  if (isLoading) {
    return <div>Cargando...</div>;  
  }

  if (!role) {
    return <PanelPrincipal />;
  }

  return role === 'administrativo' ? <AdminRoutes /> : <UserRoutes />;
}

export default App;
