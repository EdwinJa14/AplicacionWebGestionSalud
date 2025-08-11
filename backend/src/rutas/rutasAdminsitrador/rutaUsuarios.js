// rutaUsuarios.js
import express from 'express';
import { 
  getAllUsuarios, 
  getUsuarioById, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario 
} from '../../controlador/controladoresAdministrador/controladorUsuarios.js';

const router = express.Router();

// Obtener todos los usuarios
router.get('/', getAllUsuarios);

// Obtener un usuario por ID
router.get('/:id', getUsuarioById);

// Crear un nuevo usuario
router.post('/', createUsuario);

// Actualizar un usuario
router.put('/:id', updateUsuario);

// Eliminar un usuario (marcar como inactivo)
router.delete('/:id', deleteUsuario);

export default router;
