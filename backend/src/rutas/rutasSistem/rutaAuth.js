import express from 'express';
import { body } from 'express-validator';
import { login, verifyToken, logout } from '../../controlador/controladoresSistem/controladorAuth.js';
import { auth } from '../../middlewares/auth.js';

const router = express.Router();

router.post(
  '/login',
  [
    body('nombre_usuario')
      .trim()
      .notEmpty()
      .withMessage('El nombre de usuario es obligatorio')
      .isLength({ min: 3, max: 50 })
      .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
      .matches(/^[a-zA-Z0-9_.-]+$/)
      .withMessage('El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos'),
    
    body('password')
      .notEmpty()
      .withMessage('La contraseña es obligatoria')
      .isLength({ min: 1, max: 255 })
      .withMessage('La contraseña es inválida'),
  ],
  login
);

router.get('/verify', auth, verifyToken);

router.post('/logout', auth, logout);

export default router;