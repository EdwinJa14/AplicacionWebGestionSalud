import { validationResult } from 'express-validator';
import * as UsuarioModel from '../../modelo/modelosAdministrador/modeloUsuarios.js';
import logger from '../../../config/logger.js';

export const getAllPersonal = async (req, res) => {
  try {
    const personal = await UsuarioModel.getAllPersonal();
    res.status(200).json({
      success: true,
      message: 'Personal obtenido exitosamente.',
      data: personal
    });
  } catch (error) {
    logger.error(`Error al obtener personal para usuarios: ${error.message}`);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const getAllUsuariosConDetalles = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.getAllUsuariosConDetalles();
    res.status(200).json({
      success: true,
      message: 'Usuarios con detalles obtenidos exitosamente.',
      data: usuarios
    });
  } catch (error) {
    logger.error(`Error al obtener usuarios con detalles: ${error.message}`);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.getById(id);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }
    res.status(200).json({ success: true, message: 'Usuario encontrado exitosamente.', data: usuario });
  } catch (error) {
    logger.error(`Error al obtener usuario por ID (${req.params.id}): ${error.message}`);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const createUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { personal_id, nombre_usuario, password, rol } = req.body;

    const tieneUsuario = await UsuarioModel.verificarPersonalTieneUsuario(personal_id);
    if (tieneUsuario) {
      return res.status(400).json({ success: false, message: 'Este personal ya tiene un usuario asignado.' });
    }

    const usuarioExiste = await UsuarioModel.verificarNombreUsuarioExiste(nombre_usuario);
    if (usuarioExiste) {
      return res.status(400).json({ success: false, message: 'El nombre de usuario ya existe. Por favor, elija otro.' });
    }

    const nuevoUsuario = await UsuarioModel.create({ personal_id, nombre_usuario, password, rol }, 1);
    logger.info(`Usuario creado para personal ID ${personal_id} con nombre ${nombre_usuario}.`);
    res.status(201).json({ success: true, message: 'Usuario creado exitosamente.', data: nuevoUsuario });
  } catch (error) {
    logger.error(`Error al crear usuario: ${error.message}`, { body: req.body });
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const updateUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { nombre_usuario } = req.body;

    if (nombre_usuario) {
      const usuarioExiste = await UsuarioModel.verificarNombreUsuarioExiste(nombre_usuario, id);
      if (usuarioExiste) {
        return res.status(400).json({ success: false, message: 'El nombre de usuario ya existe. Por favor, elija otro.' });
      }
    }

    const usuarioActualizado = await UsuarioModel.update(id, req.body, 1);
    if (!usuarioActualizado) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado para actualizar.' });
    }
    logger.info(`Usuario ID ${id} actualizado.`);
    res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente.', data: usuarioActualizado });
  } catch (error) {
    logger.error(`Error al actualizar usuario ID ${req.params.id}: ${error.message}`, { body: req.body });
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await UsuarioModel.remove(id, 1);
    if (!usuarioEliminado) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado para eliminar.' });
    }
    logger.info(`Usuario ID ${id} desactivado.`);
    res.status(200).json({ success: true, message: 'Usuario desactivado exitosamente.', data: usuarioEliminado });
  } catch (error) {
    logger.error(`Error al eliminar usuario ID ${req.params.id}: ${error.message}`);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};