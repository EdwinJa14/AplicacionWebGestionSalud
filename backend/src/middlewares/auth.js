// backend/src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import * as AuthModel from '../modelo/modelosSistem/modeloAuth.js';  // Corregida ruta relativa

export const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No hay token, autorización denegada'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await AuthModel.findUserById(decoded.usuario.id);

    if (!usuario || !usuario.estado) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - usuario no encontrado o inactivo'
      });
    }

    req.usuario = decoded.usuario;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error del servidor en autenticación'
    });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const userRole = req.usuario.rol;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

export const requireAdmin = requireRole('administrativo');
export const requireMedicalStaff = requireRole(['medico', 'enfermero']);
export const requireDoctor = requireRole('medico');
export const requireNurse = requireRole('enfermero');
