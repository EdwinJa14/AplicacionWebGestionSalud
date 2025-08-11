import pool from '../../../config/db.js';

// Obtener todos los pacientes
export const getAll = async () => {
  const query = `
    SELECT 
      id, 
      nombres, 
      apellidos, 
      dpi,
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      estado,
      usuario_ingreso,
      fecha_ingreso,
      usuario_modifica,
      fecha_modifica
    FROM pacientes 
    WHERE estado = true
    ORDER BY fecha_ingreso DESC`;
    
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener todos los pacientes:', error);
    throw error;
  }
};

// Obtener paciente por ID
export const getById = async (id) => {
  const query = `
    SELECT 
      id, 
      nombres, 
      apellidos, 
      dpi,
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      estado,
      usuario_ingreso,
      fecha_ingreso,
      usuario_modifica,
      fecha_modifica
    FROM pacientes 
    WHERE id = $1 AND estado = true`;
    
  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error(`Error al obtener paciente con id ${id}:`, error);
    throw error;
  }
};

// Crear nuevo paciente
export const create = async (pacienteData) => {
  const { nombres, apellidos, dpi, fecha_nacimiento, genero, direccion, telefono, tipo_paciente, estado } = pacienteData;

  const query = `
    INSERT INTO pacientes (
      nombres, 
      apellidos, 
      dpi,
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      estado, 
      usuario_ingreso, 
      fecha_ingreso
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, CURRENT_TIMESTAMP)
    RETURNING 
      id, 
      nombres, 
      apellidos, 
      dpi,
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      estado,
      usuario_ingreso,
      fecha_ingreso,
      usuario_modifica,
      fecha_modifica`;

  const values = [
    nombres, 
    apellidos, 
    dpi, // Campo obligatorio
    fecha_nacimiento, 
    genero || 'Masculino',
    direccion, 
    telefono, 
    tipo_paciente || 'General', 
    estado !== undefined ? estado : true
  ];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error al crear paciente:', error);
    throw error;
  }
};

// Actualizar paciente
export const update = async (id, pacienteData) => {
  const { nombres, apellidos, dpi, fecha_nacimiento, genero, direccion, telefono, tipo_paciente, estado } = pacienteData;

  const query = `
    UPDATE pacientes 
    SET 
      nombres = COALESCE($1, nombres),
      apellidos = COALESCE($2, apellidos),
      dpi = COALESCE($3, dpi),
      fecha_nacimiento = COALESCE($4, fecha_nacimiento),
      genero = COALESCE($5, genero),
      direccion = COALESCE($6, direccion),
      telefono = COALESCE($7, telefono),
      tipo_paciente = COALESCE($8, tipo_paciente),
      estado = COALESCE($9, estado),
      usuario_modifica = 1,
      fecha_modifica = CURRENT_TIMESTAMP
    WHERE id = $10 AND estado = true
    RETURNING 
      id, 
      nombres, 
      apellidos, 
      dpi,
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      estado,
      usuario_ingreso,
      fecha_ingreso,
      usuario_modifica,
      fecha_modifica`;

  const values = [
    nombres, 
    apellidos, 
    dpi,
    fecha_nacimiento, 
    genero, 
    direccion, 
    telefono, 
    tipo_paciente,
    estado, 
    id
  ];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(`Error al actualizar paciente con id ${id}:`, error);
    throw error;
  }
};

// Marcar como inactivo
export const remove = async (id) => {
  const query = `
    UPDATE pacientes 
    SET 
      estado = false,
      usuario_modifica = 1,
      fecha_modifica = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING 
      id, 
      nombres, 
      apellidos, 
      dpi,
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      estado,
      usuario_ingreso,
      fecha_ingreso,
      usuario_modifica,
      fecha_modifica`;

  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error(`Error al marcar como inactivo paciente con id ${id}:`, error);
    throw error;
  }
};

// Verificar si DPI ya existe
export const existsByDpi = async (dpi, excludeId = null) => {
  let query = `SELECT id FROM pacientes WHERE dpi = $1`;
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