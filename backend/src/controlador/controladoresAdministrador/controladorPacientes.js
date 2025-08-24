import { validationResult } from 'express-validator';
import * as PacienteModel from '../../modelo/modelosAdministrador/modeloPacientes.js';

// Obtener todos los pacientes
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
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Obtener un paciente por su ID
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
    console.error('Error al obtener paciente por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Crear un nuevo paciente
export const createPaciente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { nombres, apellidos, dpi, fecha_nacimiento, genero, direccion, telefono, tipo_paciente } = req.body;

    const dpiExiste = await PacienteModel.existsByDpi(dpi);
    if (dpiExiste) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un paciente registrado con este DPI.'
      });
    }

    const nuevoPaciente = await PacienteModel.create({
      nombres, apellidos, dpi, fecha_nacimiento, genero, direccion, telefono, tipo_paciente
    });

    const { estado, ...resto } = nuevoPaciente;
    res.status(201).json({
      success: true,
      message: 'Paciente creado exitosamente.',
      data: resto
    });
  } catch (error) {
    console.error('Error al crear paciente:', error);
    if (error.code === '23505' && error.constraint === 'pacientes_dpi_key') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un paciente registrado con este DPI.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Actualizar un paciente existente
export const updatePaciente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { nombres, apellidos, dpi, fecha_nacimiento, genero, direccion, telefono, tipo_paciente } = req.body;

    if (dpi) {
      const dpiExiste = await PacienteModel.existsByDpi(dpi, id);
      if (dpiExiste) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro paciente registrado con este DPI.'
        });
      }
    }

    const pacienteActualizado = await PacienteModel.update(id, {
      nombres, apellidos, dpi, fecha_nacimiento, genero, direccion, telefono, tipo_paciente
    });

    if (!pacienteActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado para actualizar.'
      });
    }

    const { estado, ...resto } = pacienteActualizado;
    res.status(200).json({
      success: true,
      message: 'Paciente actualizado exitosamente.',
      data: resto
    });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    if (error.code === '23505' && error.constraint === 'pacientes_dpi_key') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro paciente registrado con este DPI.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Eliminar un paciente (cambio de estado)
export const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const pacienteEliminado = await PacienteModel.remove(id);

    if (!pacienteEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado para eliminar.'
      });
    }

    const { estado, ...resto } = pacienteEliminado;
    res.status(200).json({
      success: true,
      message: 'Paciente marcado como inactivo exitosamente.',
      data: resto
    });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};