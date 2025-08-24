import { Routes, Route } from 'react-router-dom';
import Layout from '../componentes/Layaout.jsx';

import Perfil from '../vistas/vistaUsuarios/Perfil.jsx';

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
