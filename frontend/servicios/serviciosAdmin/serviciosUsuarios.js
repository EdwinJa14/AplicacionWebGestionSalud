import api from '../api';

export const getAllPersonal = async () => {
  try {
    const response = await api.get('/usuarios/personal');
    return response.data.data || [];
  } catch (error) {
    throw new Error(`Error al obtener personal: ${error.response?.data?.message || error.message}`);
  }
};

export const getAllUsuariosConDetalles = async () => {
  try {
    const response = await api.get('/usuarios/con-detalles');
    return response.data.data || [];
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error.response?.data?.message || error.message}`);
  }
};

export const getById = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al obtener usuario: ${error.response?.data?.message || error.message}`);
  }
};

export const create = async (usuarioData) => {
  try {
    const response = await api.post('/usuarios', usuarioData);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.response?.data?.message || error.message}`);
  }
};

export const update = async (id, usuarioData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al actualizar usuario: ${error.response?.data?.message || error.message}`);
  }
};

export const remove = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar usuario: ${error.response?.data?.message || error.message}`);
  }
};