import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './componentes/Layaout.jsx';
import PanelPrincipal from './vistas/panelPrincipal.jsx';
import Home from './vistas/Home.jsx';
import VistaPersonal from './vistas/vistaAdministrador/vistaPersonal.jsx';
import VistaPacientes from './vistas/vistaAdministrador/vistaPacientes.jsx';
import VistaUsuarios from './vistas/vistaAdministrador/vistaUsuarios.jsx';
import VistaInventario from './vistas/vistaAdministrador/vistaInventario.jsx';


import VistaAgregarPaciente from './vistas/vistaAdministrador/vistaAgregarPaciente.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PanelPrincipal />} />

      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/personal" element={<VistaPersonal />} />
        <Route path="/pacientes" element={<VistaPacientes />} />
        <Route path="/usuarios" element={<VistaUsuarios />} />
        <Route path="/inventario" element={<VistaInventario />} />

        <Route path="/pacientes/agregar" element={<VistaAgregarPaciente />} />
      </Route>
    </Routes>
  );
}

export default App;
