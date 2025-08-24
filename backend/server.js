import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import './config/db.js';

import personalRoutes from './src/rutas/rutasAdminsitrador/rutaPersonal.js';
import pacienteRoutes from './src/rutas/rutasAdminsitrador/rutaPaciente.js'; 
import usuarioRoutes from './src/rutas/rutasAdminsitrador/rutaUsuarios.js';  
import inventarioRoutes from './src/rutas/rutasAdminsitrador/rutaInventario.js';
import authRoutes from './src/rutas/rutasSistem/rutaAuth.js'
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
    version: '2.0.0',
    endpoints: {
      personal: '/api/personal',
      pacientes: '/api/pacientes',
      usuarios: '/api/usuarios',
      inventario: '/api/inventario',
      test: '/api/test'
    },
    inventario_endpoints: {
      todos_productos: 'GET /api/inventario',
      con_alertas: 'GET /api/inventario?incluir_alertas=true',
      estadisticas: 'GET /api/inventario/estadisticas',
      stock_bajo: 'GET /api/inventario/stock-bajo',
      por_categoria: 'GET /api/inventario/categoria/:categoria',
      por_id: 'GET /api/inventario/:id',
      lotes_peps_ueps: 'GET /api/inventario/:id/lotes?metodo=PEPS',
      crear: 'POST /api/inventario',
      actualizar: 'PUT /api/inventario/:id',
      eliminar: 'PATCH /api/inventario/:id'
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
    inventario_features: [
      'Control de stock con alertas automáticas',
      'Gestión de lotes con fechas de vencimiento',
      'Métodos PEPS y UEPS',
      'Categorización de productos',
      'Estadísticas en tiempo real',
      'Vista normalizada con funciones SQL'
    ],
    timestamp: new Date().toISOString()
  });
});

// Rutas del CRUD
app.use('/api/personal', personalRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/auth', authRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: '❌ Ruta no encontrada',
    availableRoutes: [
      'GET /',
      'GET /api/test',
      
      // Personal
      'GET /api/personal',
      'POST /api/personal',
      'GET /api/personal/:id',
      'PUT /api/personal/:id',
      'DELETE /api/personal/:id',
      
      // Pacientes
      'GET /api/pacientes',
      'POST /api/pacientes',
      'GET /api/pacientes/:id',
      'PUT /api/pacientes/:id',
      'DELETE /api/pacientes/:id',
      
      // Usuarios
      'GET /api/usuarios',
      'POST /api/usuarios',
      'GET /api/usuarios/:id',
      'PUT /api/usuarios/:id',
      'DELETE /api/usuarios/:id',
      
      // Inventario (Nuevas funcionalidades)
      'GET /api/inventario',
      'GET /api/inventario?incluir_alertas=true',
      'GET /api/inventario/estadisticas',
      'GET /api/inventario/stock-bajo',
      'GET /api/inventario/categoria/:categoria',
      'GET /api/inventario/:id',
      'GET /api/inventario/:id/lotes?metodo=PEPS',
      'POST /api/inventario',
      'PUT /api/inventario/:id',
      'PATCH /api/inventario/:id'
    ]
  });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Backend del Puesto de Salud v2.0 corriendo en http://localhost:${PORT}`);
  console.log(`📋 API Personal disponible en http://localhost:${PORT}/api/personal`);
  console.log(`📋 API Pacientes disponible en http://localhost:${PORT}/api/pacientes`);
  console.log(`👥 API Usuarios disponible en http://localhost:${PORT}/api/usuarios`);
  console.log(`📦 API Inventario disponible en http://localhost:${PORT}/api/inventario`);
  console.log('');
  console.log('🆕 Nuevas funcionalidades de inventario:');
  console.log('   • Control de stock con alertas automáticas');
  console.log('   • Gestión de lotes con fechas de vencimiento');
  console.log('   • Métodos PEPS y UEPS');
  console.log('   • Estadísticas en tiempo real');
  console.log('   • Categorización de productos médicos');
  console.log('='.repeat(60));
});