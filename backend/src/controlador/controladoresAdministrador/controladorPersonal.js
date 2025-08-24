import { validationResult } from 'express-validator';
import * as PersonalModel from '../../modelo/modelosAdministrador/modeloPersonal.js';
import logger from '../../../config/logger.js';

// Obtener todo el personal
export const getAllPersonal = async (req, res) => {
  try {
    const personal = await PersonalModel.getAll();
    const personalFiltrado = personal.map(p => {
      const { estado, ...resto } = p;
      return resto;
    });
    res.status(200).json({
      success: true,
      message: 'Personal obtenido exitosamente.',
      data: personalFiltrado
    });
  } catch (error) {
    logger.error(`Error al obtener personal: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Obtener personal por ID
export const getPersonalById = async (req, res) => {
  try {
    const { id } = req.params;
    const personal = await PersonalModel.getById(id);
    if (!personal) {
      return res.status(404).json({
        success: false,
        message: 'Personal no encontrado.'
      });
    }
    const { estado, ...resto } = personal;
    res.status(200).json({
      success: true,
      message: 'Personal encontrado exitosamente.',
      data: resto
    });
  } catch (error) {
    logger.error(`Error al obtener personal por ID (${req.params.id}): ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Crear nuevo personal
export const createPersonal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { nombres, apellidos, cargo, dpi, telefono } = req.body;

    const dpiExiste = await PersonalModel.existsByDpi(dpi);
    if (dpiExiste) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe personal registrado con este DPI.'
      });
    }

    const nuevoPersonal = await PersonalModel.create({
      nombres, apellidos, cargo, dpi, telefono
    });

    const { estado, ...resto } = nuevoPersonal;
    logger.info(`Personal creado exitosamente con ID: ${resto.id}`);
    res.status(201).json({
      success: true,
      message: 'Personal creado exitosamente.',
      data: resto
    });
  } catch (error) {
    logger.error(`Error al crear personal: ${error.message}`, { body: req.body });
    if (error.code === '23505' && error.constraint === 'personal_dpi_key') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe personal registrado con este DPI.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Actualizar personal
export const updatePersonal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { nombres, apellidos, cargo, dpi, telefono } = req.body;

    if (dpi) {
      const dpiExiste = await PersonalModel.existsByDpi(dpi, id);
      if (dpiExiste) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro personal registrado con este DPI.'
        });
      }
    }

    const personalActualizado = await PersonalModel.update(id, {
      nombres, apellidos, cargo, dpi, telefono
    });

    if (!personalActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Personal no encontrado para actualizar.'
      });
    }

    const { estado, ...resto } = personalActualizado;
    logger.info(`Personal ID ${id} actualizado exitosamente.`);
    res.status(200).json({
      success: true,
      message: 'Personal actualizado exitosamente.',
      data: resto
    });
  } catch (error) {
    logger.error(`Error al actualizar personal ID ${req.params.id}: ${error.message}`, { body: req.body });
    if (error.code === '23505' && error.constraint === 'personal_dpi_key') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro personal registrado con este DPI.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Eliminar personal (cambio de estado)
export const deletePersonal = async (req, res) => {
  try {
    const { id } = req.params;
    const personalEliminado = await PersonalModel.remove(id);

    if (!personalEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Personal no encontrado para eliminar.'
      });
    }

    const { estado, ...resto } = personalEliminado;
    logger.info(`Personal ID ${id} marcado como inactivo.`);
    res.status(200).json({
      success: true,
      message: 'Personal marcado como inactivo exitosamente.',
      data: resto
    });
  } catch (error) {
    logger.error(`Error al eliminar personal ID ${req.params.id}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor.'
    });
  }
};