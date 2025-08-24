import api from '../api';

export const getAll = async () => {
  try {
    const response = await api.get('/personal');
    return response.data.data || [];
  } catch (error) {
    throw new Error(`Error al obtener personal: ${error.response?.data?.message || error.message}`);
  }
};

export const getById = async (id) => {
  try {
    const response = await api.get(`/personal/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al obtener personal: ${error.response?.data?.message || error.message}`);
  }
};

export const create = async (personalData) => {
  try {
    const response = await api.post('/personal', personalData);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al crear personal: ${error.response?.data?.message || error.message}`);
  }
};

export const update = async (id, personalData) => {
  try {
    const response = await api.put(`/personal/${id}`, personalData);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al actualizar personal: ${error.response?.data?.message || error.message}`);
  }
};

export const remove = async (id) => {
  try {
    await api.delete(`/personal/${id}`);
  } catch (error) {
    throw new Error(`Error al eliminar personal: ${error.response?.data?.message || error.message}`);
  }
};