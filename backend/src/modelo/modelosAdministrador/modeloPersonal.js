import pool from '../../../config/db.js';

// Obtener todo el personal
export const getAll = async () => {
  const query = `
    SELECT 
      id, 
      nombres, 
      apellidos, 
      cargo, 
      dpi,
      telefono, 
      estado,
      usuario_ingreso,
      fecha_ingreso, 
      usuario_modifica,
      fecha_modifica
    FROM personal 
    WHERE estado = true
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
    SELECT 
      id, 
      nombres, 
      apellidos, 
      cargo, 
      dpi,
      telefono, 
      estado,
      usuario_ingreso,
      fecha_ingreso, 
      usuario_modifica,
      fecha_modifica
    FROM personal 
    WHERE id = $1 AND estado = true`;
  
  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error(`Error al obtener personal con id ${id}:`, error);
    throw error;
  }
};

// Crear nuevo personal
export const create = async (personalData) => {
  const { nombres, apellidos, cargo, dpi, telefono, estado } = personalData;

  const query = `
    INSERT INTO personal (
      nombres, 
      apellidos, 
      cargo, 
      dpi,
      telefono, 
      estado, 
      usuario_ingreso, 
      fecha_ingreso
    )
    VALUES ($1, $2, $3, $4, $5, $6, 1, CURRENT_TIMESTAMP)
    RETURNING 
      id, 
      nombres, 
      apellidos, 
      cargo, 
      dpi,
      telefono, 
      estado,
      usuario_ingreso,
      fecha_ingreso, 
      usuario_modifica,
      fecha_modifica`;

  const values = [
    nombres, 
    apellidos, 
    cargo, 
    dpi, // Campo obligatorio
    telefono, 
    estado !== undefined ? estado : true
  ];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error al crear personal:', error);
    throw error;
  }
};

// Actualizar personal
export const update = async (id, personalData) => {
  const { nombres, apellidos, cargo, dpi, telefono, estado } = personalData;

  const query = `
    UPDATE personal 
    SET 
      nombres = COALESCE($1, nombres),
      apellidos = COALESCE($2, apellidos),
      cargo = COALESCE($3, cargo),
      dpi = COALESCE($4, dpi),
      telefono = COALESCE($5, telefono),
      estado = COALESCE($6, estado),
      usuario_modifica = 1,
      fecha_modifica = CURRENT_TIMESTAMP
    WHERE id = $7 AND estado = true
    RETURNING 
      id, 
      nombres, 
      apellidos, 
      cargo, 
      dpi,
      telefono, 
      estado,
      usuario_ingreso,
      fecha_ingreso, 
      usuario_modifica,
      fecha_modifica`;

  const values = [
    nombres, 
    apellidos, 
    cargo, 
    dpi,
    telefono, 
    estado, 
    id
  ];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(`Error al actualizar personal con id ${id}:`, error);
    throw error;
  }
};

// Marcar como inactivo (soft delete)
export const remove = async (id) => {
  try {
    // Primero verificar si el personal está referenciado en otras tablas
    const checkQuery = `
      SELECT COUNT(*) as count 
      FROM usuarios 
      WHERE personal_id = $1 AND estado = true`; // CORREGIDO: era 'id' ahora es 'personal_id'
    
    const checkResult = await pool.query(checkQuery, [id]);
    const referenciaCount = parseInt(checkResult.rows[0].count);
    
    if (referenciaCount > 0) {
      throw new Error(`No se puede inactivar este personal porque está asociado a ${referenciaCount} usuario(s) activo(s). Primero inactive los usuarios asociados.`);
    }
    
    // Si no hay referencias activas, proceder con soft delete
    const updateQuery = `
      UPDATE personal 
      SET 
        estado = false,
        usuario_modifica = 1,
        fecha_modifica = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING 
        id, 
        nombres, 
        apellidos, 
        cargo, 
        dpi,
        telefono, 
        estado,
        usuario_ingreso,
        fecha_ingreso, 
        usuario_modifica,
        fecha_modifica`;
        
    const { rows } = await pool.query(updateQuery, [id]);
    return rows[0];
    
  } catch (error) {
    console.error(`Error al marcar como inactivo personal con id ${id}:`, error);
    throw error;
  }
};

// Verificar si DPI ya existe
export const existsByDpi = async (dpi, excludeId = null) => {
  let query = `SELECT id FROM personal WHERE dpi = $1`;
  const values = [dpi];
  
  if (excludeId) {
    query += ` AND id != $2`;
    values.push(excludeId);
  }
  
  try {
    const { rows } = await pool.query(query, values);
    return rows.length > 0;
  } catch (error) {
    console.error('Error al verificar DPI existente:', error);
    throw error;
  }
};