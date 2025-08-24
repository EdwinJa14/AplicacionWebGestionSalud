import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import * as AuthModel from '../../modelo/modelosSistem/modeloAuth.js';
import logger from '../../../config/logger.js';

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: 'Datos de entrada inválidos'
      });
    }

    const { nombre_usuario, password } = req.body;

    logger.info(`Intento de login para usuario: ${nombre_usuario}`);

    const usuario = await AuthModel.findUserByUsername(nombre_usuario);

    if (!usuario) {
      logger.warn(`Usuario no encontrado: ${nombre_usuario}`);
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    if (!usuario.estado) {
      logger.warn(`Intento de login de usuario inactivo: ${nombre_usuario}`);
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacta al administrador.',
      });
    }

    const esPasswordCorrecto = await bcrypt.compare(password, usuario.password_hash);
    if (!esPasswordCorrecto) {
      logger.warn(`Contraseña incorrecta para usuario: ${nombre_usuario}`);
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    try {
      await AuthModel.updateLastLogin(usuario.id);
    } catch (error) {
      logger.error(`Error al actualizar último login para usuario ${usuario.id}: ${error.message}`);
    }

    const payload = {
      usuario: {
        id: usuario.id,
        personal_id: usuario.personal_id,
        rol: usuario.rol,
        nombre_usuario: usuario.nombre_usuario,
      },
    };

    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET no está configurado. No se puede generar token.');
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor.',
      });
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h',
      issuer: 'puesto-salud-chinaca',
      audience: 'puesto-salud-usuarios'
    });

    logger.info(`Login exitoso para usuario: ${nombre_usuario} con rol: ${usuario.rol}`);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol,
        personal_id: usuario.personal_id,
      },
    });

  } catch (error) {
    logger.error(`Error en el controlador de login: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor. Intenta nuevamente.',
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await AuthModel.findUserById(decoded.usuario.id);

    if (!usuario || !usuario.estado) {
      logger.warn(`Verificación de token fallida para usuario ID ${decoded.usuario.id} (no encontrado o inactivo)`);
      return res.status(401).json({
        success: false,
        message: 'Token inválido o usuario inactivo',
      });
    }

    res.json({
      success: true,
      usuario: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol,
        personal_id: usuario.personal_id,
      },
    });
  } catch (error) {
    logger.error(`Error al verificar token: ${error.message}`);
    res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
};

export const logout = async (req, res) => {
  logger.info(`Usuario ID ${req.usuario.id} cerró sesión.`);
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente',
  });
};