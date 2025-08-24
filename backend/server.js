import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import './config/db.js';
import logger from './config/logger.js';

import personalRoutes from './src/rutas/rutasAdminsitrador/rutaPersonal.js';
import pacienteRoutes from './src/rutas/rutasAdminsitrador/rutaPaciente.js';
import usuarioRoutes from './src/rutas/rutasAdminsitrador/rutaUsuarios.js';
import inventarioRoutes from './src/rutas/rutasAdminsitrador/rutaInventario.js';
import authRoutes from './src/rutas/rutasSistem/rutaAuth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// === Middlewares de Seguridad ===

app.use(helmet());

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo después de 15 minutos',
});
app.use('/api/', apiLimiter);

const whitelist = ['http://localhost:3000', 'http://localhost:5173', 'http://tu-dominio-de-frontend.com'];
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

app.use(express.json());


// === Rutas de la Aplicación ===

app.use('/api/auth', authRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/inventario', inventarioRoutes);


// === Manejo de Errores y Rutas no Encontradas ===

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '❌ Ruta no encontrada',
  });
});

app.use((error, req, res, next) => {
  logger.error(`Error no manejado: ${error.message}`, { stack: error.stack });
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
});


// === Iniciar Servidor ===
app.listen(PORT, () => {
  logger.info(`🚀 Backend del Puesto de Salud v2.0 corriendo en http://localhost:${PORT}`);
  logger.info(`🔒 Seguridad activada: Helmet, CORS, Rate Limiting`);
});