import { validationResult } from 'express-validator';
import * as PacienteModel from '../../modelo/modelosAdministrador/modeloPacientes.js';
import logger from '../../../config/logger.js';

export const getAllPacientes = async (req, res) => {
  try {
    const pacientes = await PacienteModel.getAll();
    const pacientesFiltrados = pacientes.map(p => {
      const { estado, ...resto } = p;
      return resto;
    });
    res.status(200).json({
      success: true,
      message: 'Pacientes obtenidos exitosamente.',
      data: pacientesFiltrados
    });
  } catch (error) {
    logger.error(`Error al obtener pacientes: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

export const getPacienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await PacienteModel.getById(id);
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado.'
      });
    }
    const { estado, ...resto } = paciente;
    res.status(200).json({
      success: true,
      message: 'Paciente encontrado exitosamente.',
      data: resto
    });
  } catch (error) {
    logger.error(`Error al obtener paciente por ID (${req.params.id}): ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

export const createPaciente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { dpi } = req.body;

    const dpiExiste = await PacienteModel.existsByDpi(dpi);
    if (dpiExiste) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un paciente registrado con este DPI.'
      });
    }

    const nuevoPaciente = await PacienteModel.create(req.body);
    const { estado, ...resto } = nuevoPaciente;

    logger.info(`Paciente creado exitosamente con ID: ${resto.id}`);
    res.status(201).json({
      success: true,
      message: 'Paciente creado exitosamente.',
      data: resto
    });
  } catch (error) {
    logger.error(`Error al crear paciente: ${error.message}`, { body: req.body });
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Ya existe un paciente registrado con este DPI.' });
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const updatePaciente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { dpi } = req.body;

    if (dpi) {
      const dpiExiste = await PacienteModel.existsByDpi(dpi, id);
      if (dpiExiste) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro paciente registrado con este DPI.'
        });
      }
    }

    const pacienteActualizado = await PacienteModel.update(id, req.body);
    if (!pacienteActualizado) {
      return res.status(404).json({ success: false, message: 'Paciente no encontrado para actualizar.' });
    }

    const { estado, ...resto } = pacienteActualizado;
    logger.info(`Paciente ID ${id} actualizado exitosamente.`);
    res.status(200).json({
      success: true,
      message: 'Paciente actualizado exitosamente.',
      data: resto
    });
  } catch (error) {
    logger.error(`Error al actualizar paciente ID ${req.params.id}: ${error.message}`, { body: req.body });
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Ya existe otro paciente registrado con este DPI.' });
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const pacienteEliminado = await PacienteModel.remove(id);
    if (!pacienteEliminado) {
      return res.status(404).json({ success: false, message: 'Paciente no encontrado para eliminar.' });
    }

    const { estado, ...resto } = pacienteEliminado;
    logger.info(`Paciente ID ${id} marcado como inactivo.`);
    res.status(200).json({
      success: true,
      message: 'Paciente marcado como inactivo exitosamente.',
      data: resto
    });
  } catch (error) {
    logger.error(`Error al eliminar paciente ID ${req.params.id}: ${error.message}`);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};