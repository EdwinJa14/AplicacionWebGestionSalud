// controladorUsuarios.js
import * as UsuarioModel from '../../modelo/modelosAdministrador/modeloUsuarios.js';

// Obtener todos los usuarios
export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.getAll();
    res.status(200).json({
      success: true,
      message: 'Usuarios obtenidos exitosamente.',
      data: usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.getById(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Usuario encontrado exitosamente.',
      data: usuario
    });
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  try {
    const { personal_id, nombre_usuario, password_hash, rol } = req.body;

    if (!personal_id || !nombre_usuario || !password_hash || !rol) {
      return res.status(400).json({
        success: false,
        message: 'Los campos personal_id, nombre_usuario, password_hash y rol son obligatorios.'
      });
    }

    const nuevoUsuario = await UsuarioModel.create({ personal_id, nombre_usuario, password_hash, rol });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente.',
      data: nuevoUsuario
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { personal_id, nombre_usuario, password_hash, rol } = req.body;

    const usuarioActualizado = await UsuarioModel.update(id, { personal_id, nombre_usuario, password_hash, rol });

    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado para actualizar.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente.',
      data: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Eliminar usuario (cambiar estado)
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioEliminado = await UsuarioModel.remove(id);

    if (!usuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado para eliminar.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario marcado como inactivo exitosamente.',
      data: usuarioEliminado
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};
