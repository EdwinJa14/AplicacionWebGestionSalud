import pool from '../../../config/db.js';

// Obtener todos los pacientes (sin el campo edad)
export const getAll = async () => {
  const query = `
    SELECT 
      id, 
      nombres, 
      apellidos, 
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      documento_identificacion,
      estado,
      usuario_ingreso,
      fecha_ingreso,
      usuario_modifica,
      fecha_modifica
    FROM pacientes 
    ORDER BY fecha_ingreso DESC`;
    
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener todos los pacientes:', error);
    throw error;
  }
};

// Obtener paciente por ID (sin edad)
export const getById = async (id) => {
  const query = `
    SELECT 
      id, 
      nombres, 
      apellidos, 
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      documento_identificacion,
      estado,
      usuario_ingreso,
      fecha_ingreso,
      usuario_modifica,
      fecha_modifica
    FROM pacientes 
    WHERE id = $1`;
    
  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error(`Error al obtener paciente con id ${id}:`, error);
    throw error;
  }
};

// Crear nuevo paciente (sin edad)
export const create = async (pacienteData) => {
  const { nombres, apellidos, fecha_nacimiento, genero, direccion, telefono, tipo_paciente, documento_identificacion, estado } = pacienteData;

  const query = `
    INSERT INTO pacientes (
      nombres, 
      apellidos, 
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      documento_identificacion,
      estado, 
      usuario_ingreso, 
      fecha_ingreso
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, CURRENT_TIMESTAMP)
    RETURNING 
      id, 
      nombres, 
      apellidos, 
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      documento_identificacion,
      estado,
      usuario_ingreso,
      fecha_ingreso,
      usuario_modifica,
      fecha_modifica`;

  const values = [
    nombres, 
    apellidos, 
    fecha_nacimiento, 
    genero || 'Masculino',
    direccion, 
    telefono, 
    tipo_paciente || 'General', 
    documento_identificacion,
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

// Actualizar paciente (sin edad)
export const update = async (id, pacienteData) => {
  const { nombres, apellidos, fecha_nacimiento, genero, direccion, telefono, tipo_paciente, documento_identificacion, estado } = pacienteData;

  const query = `
    UPDATE pacientes 
    SET 
      nombres = COALESCE($1, nombres),
      apellidos = COALESCE($2, apellidos),
      fecha_nacimiento = COALESCE($3, fecha_nacimiento),
      genero = COALESCE($4, genero),
      direccion = COALESCE($5, direccion),
      telefono = COALESCE($6, telefono),
      tipo_paciente = COALESCE($7, tipo_paciente),
      documento_identificacion = COALESCE($8, documento_identificacion),
      estado = COALESCE($9, estado),
      usuario_modifica = 1,
      fecha_modifica = CURRENT_TIMESTAMP
    WHERE id = $10
    RETURNING 
      id, 
      nombres, 
      apellidos, 
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      documento_identificacion,
      estado,
      usuario_ingreso,
      fecha_ingreso,
      usuario_modifica,
      fecha_modifica`;

  const values = [
    nombres, 
    apellidos, 
    fecha_nacimiento, 
    genero, 
    direccion, 
    telefono, 
    tipo_paciente,
    documento_identificacion,
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

// Marcar como inactivo (sin edad)
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
      fecha_nacimiento, 
      genero, 
      direccion, 
      telefono, 
      tipo_paciente, 
      documento_identificacion,
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
