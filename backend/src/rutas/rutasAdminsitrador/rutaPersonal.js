import express from 'express';
import { body } from 'express-validator';
import { auth, requireAdmin } from '../../middlewares/auth.js';
import {
  getAllPersonal,
  getPersonalById,
  createPersonal,
  updatePersonal,
  deletePersonal
} from '../../controlador/controladoresAdministrador/controladorPersonal.js';

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de personal
router.use(auth, requireAdmin);

// Definición de reglas de validación para no repetir código
const personalValidationRules = [
  body('nombres').trim().notEmpty().withMessage('El nombre es obligatorio.').isString().escape(),
  body('apellidos').trim().notEmpty().withMessage('El apellido es obligatorio.').isString().escape(),
  body('cargo').trim().notEmpty().withMessage('El cargo es obligatorio.'),
  body('dpi').isLength({ min: 13, max: 13 }).withMessage('El DPI debe tener 13 dígitos.').isNumeric().withMessage('El DPI solo debe contener números.'),
  body('telefono').optional({ checkFalsy: true }).trim().isString().escape()
];

// Rutas con protección y validación aplicadas
router.get('/', getAllPersonal);
router.get('/:id', getPersonalById);
router.post('/', personalValidationRules, createPersonal);
router.put('/:id', personalValidationRules, updatePersonal);
router.delete('/:id', deletePersonal);

export default router;