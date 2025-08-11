// serviciosUsuarios.js
const API_URL = 'http://localhost:5000/api/usuarios';

/**
 * Obtiene todo el personal para selección.
 * @returns {Promise<Array>} Lista de personal
 */
export const getAllPersonal = async () => {
  try {
    const response = await fetch(`${API_URL}/personal`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener el personal');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en servicio getAllPersonal:', error);
    throw error;
  }
};

/**
 * Obtiene todos los usuarios con detalles del personal.
 * @returns {Promise<Array>} Lista de usuarios con detalles
 */
export const getAllUsuariosConDetalles = async () => {
  try {
    const response = await fetch(`${API_URL}/con-detalles`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los usuarios con detalles');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en servicio getAllUsuariosConDetalles:', error);
    throw error;
  }
};

/**
 * Obtiene todos los usuarios (función original mantenida).
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getAll = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los usuarios');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en servicio getAll usuarios:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por ID.
 * @param {number} id - ID del usuario
 * @returns {Promise<object>} Datos del usuario
 */
export const getById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener el usuario');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error en servicio getById usuario con id ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario.
 * @param {object} usuarioData - Los datos del usuario a crear
 * @returns {Promise<object>} Datos del usuario creado
 */
export const create = async (usuarioData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el usuario');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en servicio create usuario:', error);
    throw error;
  }
};

/**
 * Actualiza un usuario por su ID.
 * @param {number} id - ID del usuario a actualizar
 * @param {object} usuarioData - Datos actualizados del usuario
 * @returns {Promise<object>} Datos del usuario actualizado
 */
export const update = async (id, usuarioData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el usuario');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error en servicio update usuario con id ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina (marca como inactivo) un usuario por su ID.
 * @param {number} id - ID del usuario a eliminar
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar el usuario');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en servicio remove usuario con id ${id}:`, error);
    throw error;
  }
};