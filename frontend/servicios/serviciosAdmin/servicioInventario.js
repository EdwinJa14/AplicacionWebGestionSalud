import api from '../api';

export const getAll = async (incluirAlertas = false) => {
  try {
    const url = incluirAlertas ? `/inventario?incluir_alertas=true` : '/inventario';
    const response = await api.get(url);
    return response.data.data || [];
  } catch (error) {
    throw new Error(`Error al obtener inventario: ${error.response?.data?.message || error.message}`);
  }
};

export const getAllByMetodo = async (metodo = 'PEPS', incluirAlertas = false) => {
  try {
    const params = new URLSearchParams();
    params.append('metodo', metodo);
    if (incluirAlertas) {
      params.append('incluir_alertas', 'true');
    }
    const response = await api.get(`/inventario?${params.toString()}`);
    return response.data.data || [];
  } catch (error) {
    throw new Error(`Error al obtener inventario: ${error.response?.data?.message || error.message}`);
  }
};

export const getById = async (id, metodo = 'PEPS') => {
  try {
    const response = await api.get(`/inventario/${id}?metodo=${metodo}`);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al obtener producto: ${error.response?.data?.message || error.message}`);
  }
};

export const getStockBajo = async () => {
  try {
    const response = await api.get('/inventario/stock-bajo');
    return response.data.data || [];
  } catch (error) {
    throw new Error(`Error al obtener stock bajo: ${error.response?.data?.message || error.message}`);
  }
};

export const getEstadisticas = async () => {
  try {
    const response = await api.get('/inventario/estadisticas');
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al obtener estadísticas: ${error.response?.data?.message || error.message}`);
  }
};

export const create = async (productoData) => {
  try {
    const response = await api.post('/inventario', productoData);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al crear producto: ${error.response?.data?.message || error.message}`);
  }
};

export const update = async (id, productoData) => {
  try {
    const response = await api.put(`/inventario/${id}`, productoData);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al actualizar producto: ${error.response?.data?.message || error.message}`);
  }
};

export const remove = async (id) => {
  try {
    const response = await api.patch(`/inventario/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar producto: ${error.response?.data?.message || error.message}`);
  }
};