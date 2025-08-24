import express from 'express';
import { body } from 'express-validator';
import { auth, requireAdmin } from '../../middlewares/auth.js';
import {
  getAllPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente
} from '../../controlador/controladoresAdministrador/controladorPacientes.js';

const router = express.Router();

// Middleware de autenticación y autorización
router.use(auth, requireAdmin);

// Reglas de validación
const pacienteValidationRules = [
    body('nombres').trim().notEmpty().withMessage('El nombre es obligatorio').escape(),
    body('apellidos').trim().notEmpty().withMessage('El apellido es obligatorio').escape(),
    body('dpi').isLength({ min: 13, max: 13 }).withMessage('El DPI debe tener 13 dígitos').isNumeric(),
    body('fecha_nacimiento').isISO8601().toDate().withMessage('La fecha de nacimiento es inválida'),
    body('genero').isIn(['Masculino', 'Femenino', 'Otro']).withMessage('Género no válido'),
    body('direccion').optional({ checkFalsy: true }).trim().escape(),
    body('telefono').optional({ checkFalsy: true }).trim().escape(),
    body('tipo_paciente').isIn(['General', 'Cronico', 'Prenatal']).withMessage('Tipo de paciente no válido'),
];

// Rutas
router.get('/', getAllPacientes);
router.get('/:id', getPacienteById);
router.post('/', pacienteValidationRules, createPaciente);
router.put('/:id', pacienteValidationRules, updatePaciente);
router.patch('/:id', deletePaciente);

export default router;