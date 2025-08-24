
import { Routes, Route } from 'react-router-dom';
import Layout from '../componentes/Layaout.jsx';

import { AdminRoute } from '../componentes/ProtectedRoute.jsx';

import Home from '../vistas/vistaAdministrador/Dashboard/Home.jsx';
import VistaPersonal from '../vistas/vistaAdministrador/Personal/vistaPersonal.jsx';
import VistaPacientes from '../vistas/vistaAdministrador/Pacientes/vistaPacientes.jsx';
import VistaUsuarios from '../vistas/vistaAdministrador/Usuarios/vistaUsuarios.jsx';
import VistaInventario from '../vistas/vistaAdministrador/Inventario/vistaInventario.jsx';
import VistaAgregarPaciente from '../vistas/vistaAdministrador/Pacientes/vistaAgregarPaciente.jsx';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 2. Envuelve cada ruta con el componente AdminRoute */}
        <Route path="/home" element={<AdminRoute><Home /></AdminRoute>} />
        <Route path="personal" element={<AdminRoute><VistaPersonal /></AdminRoute>} />
        <Route path="pacientes" element={<AdminRoute><VistaPacientes /></AdminRoute>} />
        <Route path="usuarios" element={<AdminRoute><VistaUsuarios /></AdminRoute>} />
        <Route path="inventario" element={<AdminRoute><VistaInventario /></AdminRoute>} />
        <Route path="pacientes/agregar" element={<AdminRoute><VistaAgregarPaciente /></AdminRoute>} />
      </Route>
    </Routes>
  );
}