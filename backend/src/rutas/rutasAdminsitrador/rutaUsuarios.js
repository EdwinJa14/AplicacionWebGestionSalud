import express from 'express';
import { body } from 'express-validator';
import { auth, requireAdmin } from '../../middlewares/auth.js';
import {
  getAllPersonal,
  getAllUsuariosConDetalles,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from '../../controlador/controladoresAdministrador/controladorUsuarios.js';

const router = express.Router();

// Middleware de autenticación y autorización
router.use(auth, requireAdmin);

// Reglas de validación
const createUsuarioRules = [
    body('personal_id').isInt({ min: 1 }).withMessage('ID de personal no válido'),
    body('nombre_usuario').trim().notEmpty().isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres').escape(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').isIn(['medico', 'enfermero', 'administrativo']).withMessage('Rol no válido'),
];

const updateUsuarioRules = [
    body('personal_id').optional().isInt({ min: 1 }).withMessage('ID de personal no válido'),
    body('nombre_usuario').optional().trim().isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres').escape(),
    body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').optional().isIn(['medico', 'enfermero', 'administrativo']).withMessage('Rol no válido'),
];


// Rutas
router.get('/personal', getAllPersonal);
router.get('/con-detalles', getAllUsuariosConDetalles);
router.get('/:id', getUsuarioById);
router.post('/', createUsuarioRules, createUsuario);
router.put('/:id', updateUsuarioRules, updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;