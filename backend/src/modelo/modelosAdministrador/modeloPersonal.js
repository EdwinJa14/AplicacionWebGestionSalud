import pool from '../../../config/db.js';

// Obtener todo el personal
export const getAll = async () => {
  const query = `
    SELECT id, nombres, apellidos, cargo, telefono, email, estado, 
           fecha_ingreso, fecha_modifica, usuario_ingreso, usuario_modifica
    FROM personal 
    ORDER BY fecha_ingreso DESC`;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener todo el personal:', error);
    throw error;
  }
};

// Obtener personal por ID
export const getById = async (id) => {
  const query = `
    SELECT id, nombres, apellidos, cargo, telefono, email, estado,
           fecha_ingreso, fecha_modifica, usuario_ingreso, usuario_modifica
    FROM personal 
    WHERE id = $1`;
  
  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error(`Error al obtener personal con id ${id}:`, error);
    throw error;
  }
};

// Crear nuevo personal
export const create = async ({ nombres, apellidos, cargo, telefono, email, estado }) => {
  const query = `
    INSERT INTO personal (nombres, apellidos, cargo, telefono, email, estado, fecha_ingreso, fecha_modifica)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id, nombres, apellidos, cargo, telefono, email, estado, fecha_ingreso, fecha_modifica`;
  
  // Convertir estado a boolean: true para activo, false para inactivo
  const estadoBoolean = estado === 'activo' || estado === true || estado === 'true' ? true : false;
  const values = [nombres, apellidos, cargo, telefono, email, estadoBoolean];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error al crear personal:', error);
    throw error;
  }
};

// Actualizar personal
export const update = async (id, { nombres, apellidos, cargo, telefono, email, estado }) => {
  const query = `
    UPDATE personal 
    SET 
      nombres = COALESCE($1, nombres),
      apellidos = COALESCE($2, apellidos),
      cargo = COALESCE($3, cargo),
      telefono = COALESCE($4, telefono),
      email = COALESCE($5, email),
      estado = COALESCE($6, estado),
      fecha_modifica = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING id, nombres, apellidos, cargo, telefono, email, estado, fecha_ingreso, fecha_modifica`;
  
  // Convertir estado a boolean si se proporciona
  let estadoBoolean = estado;
  if (estado !== undefined && estado !== null) {
    estadoBoolean = estado === 'activo' || estado === true || estado === 'true' ? true : false;
  }
  
  const values = [nombres, apellidos, cargo, telefono, email, estadoBoolean, id];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(`Error al actualizar personal con id ${id}:`, error);
    throw error;
  }
};

// Eliminar personal
export const remove = async (id) => {
  try {
    // Primero verificar si el personal está referenciado en otras tablas
    const checkQuery = `
      SELECT COUNT(*) as count 
      FROM usuarios 
      WHERE id= $1`;
    
    const checkResult = await pool.query(checkQuery, [id]);
    const referenciaCount = parseInt(checkResult.rows[0].count);
    
    if (referenciaCount > 0) {
      throw new Error(`No se puede eliminar este personal porque está asociado a ${referenciaCount} usuario(s). Primero elimine o reasigne los usuarios asociados.`);
    }
    
    // Si no hay referencias, proceder con la eliminación
    const deleteQuery = 'DELETE FROM personal WHERE id = $1 RETURNING id';
    const { rows } = await pool.query(deleteQuery, [id]);
    return rows[0];
    
  } catch (error) {
    console.error(`Error al eliminar personal con id ${id}:`, error);
    throw error;
  }
};