import { Routes, Route } from 'react-router-dom';
import Layout from '../componentes/Layaout.jsx';

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
      
          <Route path="/home" element={<Home />} />
        <Route path="personal" element={<VistaPersonal />} />
        <Route path="pacientes" element={<VistaPacientes />} />
        <Route path="usuarios" element={<VistaUsuarios />} />
        <Route path="inventario" element={<VistaInventario />} />
        <Route path="pacientes/agregar" element={<VistaAgregarPaciente />} />
      </Route>
    </Routes>
  );
}
