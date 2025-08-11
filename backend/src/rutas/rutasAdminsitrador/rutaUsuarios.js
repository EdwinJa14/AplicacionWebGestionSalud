// rutaUsuarios.js
import express from 'express';
import { 
  getAllPersonal,
  getAllUsuariosConDetalles,
  getAllUsuarios, 
  getUsuarioById, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario 
} from '../../controlador/controladoresAdministrador/controladorUsuarios.js';

const router = express.Router();

// NUEVAS RUTAS PARA LA VISTA DE USUARIOS

// Obtener todo el personal para selección
router.get('/personal', getAllPersonal);

// Obtener todos los usuarios con detalles del personal
router.get('/con-detalles', getAllUsuariosConDetalles);

// RUTAS EXISTENTES

// Obtener todos los usuarios (básico)
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