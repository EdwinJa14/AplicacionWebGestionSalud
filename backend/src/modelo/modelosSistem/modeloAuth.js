import pool from '../../../config/db.js';

const rolesValidos = ['administrativo', 'medico', 'enfermero'];

/**
 * Busca un usuario activo por su nombre de usuario para la autenticación,
 * solo si su rol está permitido.
 * @param {string} nombre_usuario - El nombre de usuario a buscar.
 * @returns {Promise<object|undefined>} El objeto del usuario si se encuentra, de lo contrario, undefined.
 */
export const findUserByUsername = async (nombre_usuario) => {
  const query = `
    SELECT 
      u.id, 
      u.personal_id, 
      u.nombre_usuario, 
      u.password_hash, 
      u.rol, 
      u.estado,
      u.fecha_ultimo_login,
      p.nombres,
      p.apellidos,
      p.cargo
    FROM usuarios u
    INNER JOIN personal p ON u.personal_id = p.id
    WHERE u.nombre_usuario = $1 
      AND u.estado = true 
      AND p.estado = true
      AND u.rol = ANY($2::text[])
  `;
  
  try {
    const { rows } = await pool.query(query, [nombre_usuario, rolesValidos]);
    return rows[0];
  } catch (error) {
    console.error('Error al buscar usuario por nombre de usuario:', error);
    throw new Error('Error al buscar usuario en la base de datos');
  }
};

/**
 * Busca un usuario activo por su ID,
 * solo si su rol está permitido.
 * @param {number} id - El ID del usuario a buscar.
 * @returns {Promise<object|undefined>} El objeto del usuario si se encuentra, de lo contrario, undefined.
 */
export const findUserById = async (id) => {
  const query = `
    SELECT 
      u.id, 
      u.personal_id, 
      u.nombre_usuario, 
      u.rol, 
      u.estado,
      u.fecha_ultimo_login,
      p.nombres,
      p.apellidos,
      p.cargo
    FROM usuarios u
    INNER JOIN personal p ON u.personal_id = p.id
    WHERE u.id = $1 
      AND u.estado = true 
      AND p.estado = true
      AND u.rol = ANY($2::text[])
  `;
  
  try {
    const { rows } = await pool.query(query, [id, rolesValidos]);
    return rows[0];
  } catch (error) {
    console.error('Error al buscar usuario por ID:', error);
    throw new Error('Error al buscar usuario en la base de datos');
  }
};

/**
 * Actualiza la fecha del último login del usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<void>}
 */
export const updateLastLogin = async (userId) => {
  const query = `
    UPDATE usuarios 
    SET fecha_ultimo_login = CURRENT_TIMESTAMP,
        fecha_modifica = CURRENT_TIMESTAMP,
        usuario_modifica = $1
    WHERE id = $1
  `;
  
  try {
    await pool.query(query, [userId]);
  } catch (error) {
    console.error('Error al actualizar último login:', error);
    throw new Error('Error al actualizar fecha de último login');
  }
};
