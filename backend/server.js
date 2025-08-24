import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import './config/db.js';

import personalRoutes from './src/rutas/rutasAdminsitrador/rutaPersonal.js';
import pacienteRoutes from './src/rutas/rutasAdminsitrador/rutaPaciente.js';
import usuarioRoutes from './src/rutas/rutasAdminsitrador/rutaUsuarios.js';
import inventarioRoutes from './src/rutas/rutasAdminsitrador/rutaInventario.js';
import authRoutes from './src/rutas/rutasSistem/rutaAuth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// === Middlewares de Seguridad ===

// 1. Helmet para establecer cabeceras HTTP seguras
app.use(helmet());

// 2. Rate Limiter para prevenir ataques de fuerza bruta
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 peticiones por ventana de tiempo
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo después de 15 minutos',
});
app.use('/api/', apiLimiter); // Aplicar solo a las rutas de la API

// 3. CORS configurado para ser más restrictivo en producción
const whitelist = ['http://localhost:3000', 'http://localhost:5173', 'http://tu-dominio-de-frontend.com']; // Añade la URL de tu frontend de producción
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
};
app.use(cors(corsOptions));

// Middlewares estándar
app.use(express.json());


// === Rutas de la Aplicación ===

// Rutas públicas (si las hubiera, irían antes de la autenticación general)
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/personal', personalRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/inventario', inventarioRoutes);


// === Manejo de Errores y Rutas no Encontradas ===

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '❌ Ruta no encontrada',
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


// === Iniciar Servidor ===
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Backend del Puesto de Salud v2.0 corriendo en http://localhost:${PORT}`);
  console.log(`🔒 Seguridad activada: Helmet, CORS, Rate Limiting`);
  console.log('='.repeat(60));
});