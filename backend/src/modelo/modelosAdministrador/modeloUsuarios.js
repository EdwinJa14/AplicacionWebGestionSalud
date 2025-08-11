// modeloUsuarios.js

import pool from '../../../config/db.js';
import bcrypt from 'bcrypt';

// Obtener todo el personal (para selección)
export const getAllPersonal = async () => {
  const query = `
    SELECT 
      p.id, 
      p.nombres, 
      p.apellidos, 
      p.cargo, 
      p.dpi, 
      p.telefono,
      CASE 
        WHEN u.personal_id IS NOT NULL THEN true 
        ELSE false 
      END as tiene_usuario
    FROM personal p
    LEFT JOIN usuarios u ON p.id = u.personal_id AND u.estado = true
    WHERE p.estado = true
    ORDER BY p.apellidos, p.nombres
  `;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener personal:', error);
    throw error;
  }
};

// Obtener todos los usuarios con detalles del personal
export const getAllUsuariosConDetalles = async () => {
  const query = `
    SELECT 
      u.id AS usuario_id,
      u.nombre_usuario,
      u.rol,
      u.estado AS estado_usuario,
      u.fecha_ingreso AS fecha_creacion,
      u.fecha_ultimo_login,
      p.id AS personal_id,
      p.nombres,
      p.apellidos,
      p.cargo,
      p.dpi
    FROM usuarios u
    JOIN personal p ON u.personal_id = p.id
    WHERE u.estado = true
    ORDER BY u.fecha_ingreso DESC
  `;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener usuarios con detalles:', error);
    throw error;
  }
};

// Obtener todos los usuarios (función original mantenida)
export const getAll = async () => {
  const query = `
    SELECT id, personal_id, nombre_usuario, password_hash, rol, estado, fecha_ingreso
    FROM usuarios
    WHERE estado = true
    ORDER BY id ASC
  `;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Obtener un usuario por ID
export const getById = async (id) => {
  const query = `
    SELECT id, personal_id, nombre_usuario, password_hash, rol, estado
    FROM usuarios
    WHERE id = $1 AND estado = true
  `;
  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
};

// Verificar si un personal ya tiene usuario
export const verificarPersonalTieneUsuario = async (personal_id) => {
  const query = `
    SELECT id FROM usuarios 
    WHERE personal_id = $1 AND estado = true
  `;
  try {
    const { rows } = await pool.query(query, [personal_id]);
    return rows.length > 0;
  } catch (error) {
    console.error('Error al verificar si personal tiene usuario:', error);
    throw error;
  }
};

// Verificar si nombre de usuario ya existe
export const verificarNombreUsuarioExiste = async (nombre_usuario, excluir_id = null) => {
  let query = `
    SELECT id FROM usuarios 
    WHERE nombre_usuario = $1 AND estado = true
  `;
  let params = [nombre_usuario];
  
  if (excluir_id) {
    query += ` AND id != $2`;
    params.push(excluir_id);
  }
  
  try {
    const { rows } = await pool.query(query, params);
    return rows.length > 0;
  } catch (error) {
    console.error('Error al verificar nombre de usuario:', error);
    throw error;
  }
};

// Crear un nuevo usuario
export const create = async (usuarioData, usuario_ingreso = 1) => {
  const { personal_id, nombre_usuario, password, rol } = usuarioData;
  
  // Hash de la contraseña
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);
  
  const query = `
    INSERT INTO usuarios (personal_id, nombre_usuario, password_hash, rol, usuario_ingreso, fecha_ingreso)
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
    RETURNING id, personal_id, nombre_usuario, rol, estado, fecha_ingreso
  `;
  
  try {
    const { rows } = await pool.query(query, [personal_id, nombre_usuario, password_hash, rol, usuario_ingreso]);
    return rows[0];
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

// Actualizar usuario
export const update = async (id, usuarioData, usuario_modifica = 1) => {
  const { personal_id, nombre_usuario, password, rol } = usuarioData;
  
  let password_hash = null;
  if (password) {
    const saltRounds = 10;
    password_hash = await bcrypt.hash(password, saltRounds);
  }
  
  const query = `
    UPDATE usuarios
    SET personal_id = COALESCE($1, personal_id), 
        nombre_usuario = COALESCE($2, nombre_usuario),
        password_hash = COALESCE($3, password_hash),
        rol = COALESCE($4, rol),
        usuario_modifica = $5,
        fecha_modifica = CURRENT_TIMESTAMP
    WHERE id = $6 AND estado = true
    RETURNING id, personal_id, nombre_usuario, rol, estado, fecha_modifica
  `;
  
  try {
    const { rows } = await pool.query(query, [personal_id, nombre_usuario, password_hash, rol, usuario_modifica, id]);
    return rows[0];
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Eliminar (inactivar) usuario
export const remove = async (id, usuario_modifica = 1) => {
  const query = `
    UPDATE usuarios 
    SET estado = false,
        usuario_modifica = $1,
        fecha_modifica = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, personal_id, nombre_usuario, rol, estado
  `;
  
  try {
    const { rows } = await pool.query(query, [usuario_modifica, id]);
    return rows[0];
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};