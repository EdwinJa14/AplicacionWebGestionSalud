import { Routes, Route } from 'react-router-dom';
import Layout from '../componentes/Layaout.jsx';

import ProtectedRoute from '../componentes/ProtectedRoute.jsx';

import Perfil from '../vistas/vistaUsuarios/Perfil.jsx';

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}