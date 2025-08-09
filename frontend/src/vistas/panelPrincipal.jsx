import React from 'react';
import Login from '../componentes/login.jsx';
import { styles } from './estilosVistas/pantelPrincipal.js';

export default function PanelPrincipal() {
  return (
    <div style={styles.panel}>
     
      <Login />
    </div>
  );
}
