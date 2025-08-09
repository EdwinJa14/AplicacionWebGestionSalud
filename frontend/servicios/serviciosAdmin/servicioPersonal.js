const API_URL = 'http://localhost:5000/api/personal';

/**
 * Obtiene todos los registros de personal
 * @returns {Promise<Array>}
 */
export const getAll = async () => {
  try {
    console.log('Obteniendo personal desde:', API_URL);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Datos recibidos del servidor:', data);
    
    // Si el backend devuelve { success: true, data: [...] }, extraemos solo data
    return data.data || data;
  } catch (error) {
    console.error('Error en getAll:', error);
    throw new Error(`Error al obtener personal: ${error.message}`);
  }
};

/**
 * Obtiene un registro de personal por su ID
 * @param {number} id 
 * @returns {Promise<object>}
 */
export const getById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error al obtener personal con id ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo registro de personal
 * @param {object} personalData - Los datos del personal a crear
 * @returns {Promise<object>}
 */
export const create = async (personalData) => {
  try {
    console.log('Creando personal:', personalData);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personalData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Personal creado:', data);
    return data.data || data;
  } catch (error) {
    console.error('Error al crear personal:', error);
    throw new Error(`Error al crear personal: ${error.message}`);
  }
};

/**
 * Actualiza un registro de personal por su ID
 * @param {number} id 
 * @param {object} personalData 
 * @returns {Promise<object>}
 */
export const update = async (id, personalData) => {
  try {
    console.log('Actualizando personal:', id, personalData);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personalData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Personal actualizado:', data);
    return data.data || data;
  } catch (error) {
    console.error(`Error al actualizar personal con id ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un registro de personal por su ID.
 * @param {number} id - El ID del personal a eliminar.
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  try {
    console.log('Eliminando personal con id:', id);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    // Si el status es 204 (No Content), la eliminación fue exitosa
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al eliminar el registro.' }));
      throw new Error(errorData.message || 'Error al eliminar el registro.');
    }
    
    console.log('Personal eliminado exitosamente');
  } catch (error) {
    console.error(`Error al eliminar personal con id ${id}:`, error);
    throw error;
  }
};