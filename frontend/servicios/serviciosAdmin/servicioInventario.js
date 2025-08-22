const API_URL = 'http://localhost:5000/api/inventario';

/**
 * Obtiene todos los productos en inventario
 * @param {boolean} incluirAlertas - Si incluir información de alertas
 * @returns {Promise<Array>}
 */
export const getAll = async (incluirAlertas = false) => {
  try {
    const url = incluirAlertas ? `${API_URL}?incluir_alertas=true` : API_URL;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los productos');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en servicio getAll inventario:', error);
    throw error;
  }
};

/**
 * Obtiene todos los productos ordenados por método PEPS o UEPS
 * @param {string} metodo - Método de ordenamiento (PEPS o UEPS)
 * @param {boolean} incluirAlertas - Si incluir información de alertas
 * @returns {Promise<Array>}
 */
export const getAllByMetodo = async (metodo = 'PEPS', incluirAlertas = false) => {
  try {
    const params = new URLSearchParams();
    params.append('metodo', metodo);
    if (incluirAlertas) {
      params.append('incluir_alertas', 'true');
    }
    
    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los productos');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en servicio getAllByMetodo inventario:', error);
    throw error;
  }
};

/**
 * Obtiene un producto por su ID con información de lotes
 * @param {number|string} id - ID del producto
 * @param {string} metodo - Método de ordenamiento (PEPS o UEPS)
 * @returns {Promise<object>}
 */
export const getById = async (id, metodo = 'PEPS') => {
  try {
    const response = await fetch(`${API_URL}/${id}?metodo=${metodo}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener el producto');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error en servicio getById inventario con id ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene productos por categoría
 * @param {string} categoria - Categoría del producto
 * @returns {Promise<Array>}
 */
export const getByCategoria = async (categoria) => {
  try {
    const response = await fetch(`${API_URL}/categoria/${categoria}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener productos por categoría');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error en servicio getByCategoria inventario:`, error);
    throw error;
  }
};

/**
 * Obtiene productos con stock bajo
 * @returns {Promise<Array>}
 */
export const getStockBajo = async () => {
  try {
    const response = await fetch(`${API_URL}/stock-bajo`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener productos con stock bajo');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en servicio getStockBajo inventario:', error);
    throw error;
  }
};

/**
 * Obtiene lotes por método PEPS o UEPS
 * @param {number|string} id - ID del producto
 * @param {string} metodo - PEPS o UEPS
 * @returns {Promise<Array>}
 */
export const getLotes = async (id, metodo = 'PEPS') => {
  try {
    const response = await fetch(`${API_URL}/${id}/lotes?metodo=${metodo}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener lotes');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error en servicio getLotes inventario:`, error);
    throw error;
  }
};

/**
 * Obtiene estadísticas del inventario
 * @returns {Promise<object>}
 */
export const getEstadisticas = async () => {
  try {
    const response = await fetch(`${API_URL}/estadisticas`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener estadísticas');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en servicio getEstadisticas inventario:', error);
    throw error;
  }
};

/**
 * Crea un nuevo producto en inventario
 * @param {object} productoData - Datos del producto a crear
 * @returns {Promise<object>}
 */
export const create = async (productoData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el producto');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en servicio create inventario:', error);
    throw error;
  }
};

/**
 * Actualiza un producto por su ID
 * @param {number|string} id - ID del producto
 * @param {object} productoData - Datos actualizados del producto
 * @returns {Promise<object>}
 */
export const update = async (id, productoData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el producto');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error en servicio update inventario con id ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina (marca como inactivo) un producto por su ID
 * @param {number|string} id - ID del producto a eliminar
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar el producto');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en servicio remove inventario con id ${id}:`, error);
    throw error;
  }
};