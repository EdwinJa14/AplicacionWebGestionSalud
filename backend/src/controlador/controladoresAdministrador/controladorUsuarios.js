// controladorUsuarios.js
import * as UsuarioModel from '../../modelo/modelosAdministrador/modeloUsuarios.js';

// Obtener todo el personal para selección
export const getAllPersonal = async (req, res) => {
  try {
    const personal = await UsuarioModel.getAllPersonal();
    res.status(200).json({
      success: true,
      message: 'Personal obtenido exitosamente.',
      data: personal
    });
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Obtener todos los usuarios con detalles
export const getAllUsuariosConDetalles = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.getAllUsuariosConDetalles();
    res.status(200).json({
      success: true,
      message: 'Usuarios con detalles obtenidos exitosamente.',
      data: usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios con detalles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Obtener todos los usuarios (función original mantenida)
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
    const { personal_id, nombre_usuario, password, rol } = req.body;

    // Validaciones básicas
    if (!personal_id || !nombre_usuario || !password || !rol) {
      return res.status(400).json({
        success: false,
        message: 'Los campos personal_id, nombre_usuario, password y rol son obligatorios.'
      });
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres.'
      });
    }

    // Validar roles permitidos
    const rolesPermitidos = ['medico', 'enfermero', 'administrativo', 'admin'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol no válido. Los roles permitidos son: ' + rolesPermitidos.join(', ')
      });
    }

    // Verificar si el personal ya tiene usuario
    const tieneUsuario = await UsuarioModel.verificarPersonalTieneUsuario(personal_id);
    if (tieneUsuario) {
      return res.status(400).json({
        success: false,
        message: 'Este personal ya tiene un usuario asignado.'
      });
    }

    // Verificar si el nombre de usuario ya existe
    const usuarioExiste = await UsuarioModel.verificarNombreUsuarioExiste(nombre_usuario);
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya existe. Por favor, elija otro.'
      });
    }

    // Crear usuario (se podría obtener usuario_ingreso del token JWT en el futuro)
    const nuevoUsuario = await UsuarioModel.create({ 
      personal_id, 
      nombre_usuario, 
      password, 
      rol 
    }, 1); // Por ahora usuario_ingreso = 1

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente.',
      data: nuevoUsuario
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    // Manejar errores específicos de base de datos
    if (error.code === '23505') { // Violación de restricción única
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya existe o hay un conflicto de datos únicos.'
      });
    }
    
    if (error.code === '23503') { // Violación de clave foránea
      return res.status(400).json({
        success: false,
        message: 'El personal especificado no existe.'
      });
    }

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
    const { personal_id, nombre_usuario, password, rol } = req.body;

    // Validar roles si se proporciona
    if (rol) {
      const rolesPermitidos = ['medico', 'enfermero', 'administrativo', 'admin'];
      if (!rolesPermitidos.includes(rol)) {
        return res.status(400).json({
          success: false,
          message: 'Rol no válido. Los roles permitidos son: ' + rolesPermitidos.join(', ')
        });
      }
    }

    // Validar longitud de contraseña si se proporciona
    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres.'
      });
    }

    // Verificar si el nombre de usuario ya existe (excluyendo el usuario actual)
    if (nombre_usuario) {
      const usuarioExiste = await UsuarioModel.verificarNombreUsuarioExiste(nombre_usuario, id);
      if (usuarioExiste) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de usuario ya existe. Por favor, elija otro.'
        });
      }
    }

    // Verificar si el personal ya tiene usuario (excluyendo el usuario actual)
    if (personal_id) {
      const tieneUsuario = await UsuarioModel.verificarPersonalTieneUsuario(personal_id);
      const usuarioActual = await UsuarioModel.getById(id);
      
      if (tieneUsuario && usuarioActual.personal_id !== parseInt(personal_id)) {
        return res.status(400).json({
          success: false,
          message: 'Este personal ya tiene un usuario asignado.'
        });
      }
    }

    const usuarioActualizado = await UsuarioModel.update(id, { 
      personal_id, 
      nombre_usuario, 
      password, 
      rol 
    }, 1); // Por ahora usuario_modifica = 1

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
    
    // Manejar errores específicos de base de datos
    if (error.code === '23505') { // Violación de restricción única
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya existe.'
      });
    }
    
    if (error.code === '23503') { // Violación de clave foránea
      return res.status(400).json({
        success: false,
        message: 'El personal especificado no existe.'
      });
    }

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

    const usuarioEliminado = await UsuarioModel.remove(id, 1); // Por ahora usuario_modifica = 1

    if (!usuarioEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado para eliminar.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario desactivado exitosamente.',
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