import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import './config/db.js';

import personalRoutes from './src/rutas/rutasAdminsitrador/rutaPersonal.js';
import pacienteRoutes from './src/rutas/rutasAdminsitrador/rutaPaciente.js'; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ API del Puesto de Salud funcionando',
    version: '1.0.0',
    endpoints: {
      personal: '/api/personal',
      pacientes: '/api/pacientes',  // Agregamos la ruta de pacientes
      test: '/api/test'
    },
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ API Test endpoint funcionando',
    status: 'OK',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

// Rutas del CRUD
app.use('/api/personal', personalRoutes);
app.use('/api/pacientes', pacienteRoutes); // Esta ruta ya está agregada

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: '❌ Ruta no encontrada',
    availableRoutes: [
      'GET /',
      'GET /api/test',
      'GET /api/personal',
      'POST /api/personal',
      'GET /api/personal/:id',
      'PUT /api/personal/:id',
      'DELETE /api/personal/:id',
      'GET /api/pacientes',       
      'POST /api/pacientes',
      'GET /api/pacientes/:id',
      'PUT /api/pacientes/:id',
      'DELETE /api/pacientes/:id'
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Backend del Puesto de Salud corriendo en http://localhost:${PORT}`);
  console.log(`📋 API Personal disponible en http://localhost:${PORT}/api/personal`);
  console.log(`📋 API Pacientes disponible en http://localhost:${PORT}/api/pacientes`);  // También mostrar la ruta de pacientes
  console.log('='.repeat(50));
});
