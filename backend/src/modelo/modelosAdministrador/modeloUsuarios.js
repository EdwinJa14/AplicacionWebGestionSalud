// modeloUsuarios.js

import pool from '../../../config/db.js';

// Obtener todos los usuarios
export const getAll = async () => {
  const query = `
    SELECT id, personal_id, nombre_usuario, password_hash, rol
    FROM usuarios
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
    SELECT id, personal_id, nombre_usuario, password_hash, rol
    FROM usuarios
    WHERE id = $1
  `;
  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
};

// Crear un nuevo usuario
export const create = async (usuarioData) => {
  const { personal_id, nombre_usuario, password_hash, rol } = usuarioData;
  
  const query = `
    INSERT INTO usuarios (personal_id, nombre_usuario, password_hash, rol)
    VALUES ($1, $2, $3, $4)
    RETURNING id, personal_id, nombre_usuario, password_hash, rol
  `;
  
  try {
    const { rows } = await pool.query(query, [personal_id, nombre_usuario, password_hash, rol]);
    return rows[0];
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

// Actualizar usuario
export const update = async (id, usuarioData) => {
  const { personal_id, nombre_usuario, password_hash, rol } = usuarioData;
  
  const query = `
    UPDATE usuarios
    SET personal_id = COALESCE($1, personal_id), 
        nombre_usuario = COALESCE($2, nombre_usuario),
        password_hash = COALESCE($3, password_hash),
        rol = COALESCE($4, rol)
    WHERE id = $5
    RETURNING id, personal_id, nombre_usuario, password_hash, rol
  `;
  
  try {
    const { rows } = await pool.query(query, [personal_id, nombre_usuario, password_hash, rol, id]);
    return rows[0];
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Eliminar (inactivar) usuario
export const remove = async (id) => {
  const query = `
    UPDATE usuarios 
    SET rol = 'inactivo'  -- Se puede usar un valor adecuado según la lógica de tu aplicación
    WHERE id = $1
    RETURNING id, personal_id, nombre_usuario, rol
  `;
  
  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};
