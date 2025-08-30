import { Routes, Route } from 'react-router-dom';
import Layout from '../componentes/Layaout.jsx';

import ProtectedRoute from '../componentes/ProtectedRoute.jsx';

import Perfil from '../vistas/vistaUsuarios/Perfil.jsx';
import Inicio from '../vistas/vistaUsuarios/incioUsuario.jsx';

import VistaPacientes from '../vistas/vistaAdministrador/Pacientes/vistaPacientes.jsx';
import VistaInventario from '../vistas/vistaAdministrador/Inventario/vistaInventario.jsx';
import VistaAgregarPaciente from '../vistas/vistaAdministrador/Pacientes/vistaAgregarPaciente.jsx';

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        
        <Route path="perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
         <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
         <Route path="/paciente" element={<ProtectedRoute><VistaPacientes /></ProtectedRoute>} />

      </Route>
      
    </Routes>
  );
}