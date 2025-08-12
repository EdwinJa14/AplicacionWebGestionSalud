const API_URL = 'http://localhost:5000/api/pacientes';

/**
 * Obtiene todos los registros de pacientes
 * @returns {Promise<Array>}
 */
export const getAll = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los pacientes');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en servicio getAll pacientes:', error);
    throw error;
  }
};

/**
 * Crea un nuevo registro de paciente
 * @param {object} pacienteData - Los datos del paciente a crear
 * @returns {Promise<object>}
 */
export const create = async (pacienteData) => {
  try {
    // No enviamos estado, no se maneja en backend ni frontend
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pacienteData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el paciente');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en servicio create paciente:', error);
    throw error;
  }
};

/**
 * Actualiza un registro de paciente por su ID
 * @param {number} id 
 * @param {object} pacienteData 
 * @returns {Promise<object>}
 */
export const update = async (id, pacienteData) => {
  try {
    // No enviamos estado, ya no se usa
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pacienteData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el paciente');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error en servicio update paciente con id ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina (marca como inactivo) un registro de paciente por su ID.
 * @param {number} id - El ID del paciente a eliminar.
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar el registro.');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en servicio remove paciente con id ${id}:`, error);
    throw error;
  }
};
