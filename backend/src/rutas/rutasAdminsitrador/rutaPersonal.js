import express from 'express';
import { 
  getAllPersonal, 
  getPersonalById, 
  createPersonal,
  updatePersonal, // <-- Importar
  deletePersonal  // <-- Importar
} from '../../controlador/controladoresAdministrador/controladorPersonal.js';

const router = express.Router();

router.get('/', getAllPersonal);
router.get('/:id', getPersonalById);
router.post('/', createPersonal);

// PUT /api/personal/:id -> Actualiza un registro
router.put('/:id', updatePersonal);

// DELETE /api/personal/:id -> Elimina un registro
router.delete('/:id', deletePersonal);

export default router;