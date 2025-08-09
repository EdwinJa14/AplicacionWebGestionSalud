import express from 'express';
import { 
  getAllPacientes, 
  getPacienteById, 
  createPaciente,
  updatePaciente,
  deletePaciente
} from '../../controlador/controladoresAdministrador/controladorPacientes.js';

const router = express.Router();

// Obtener todos los pacientes
router.get('/', getAllPacientes);

// Obtener un paciente por ID
router.get('/:id', getPacienteById);

// Crear un nuevo paciente
router.post('/', createPaciente);

// Actualizar un paciente
router.put('/:id', updatePaciente);

// Eliminar (inactivar) un paciente
router.delete('/:id', deletePaciente);

export default router;
