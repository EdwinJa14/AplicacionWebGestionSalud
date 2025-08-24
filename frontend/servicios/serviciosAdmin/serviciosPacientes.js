import api from '../api';

export const getAll = async () => {
  try {
    const response = await api.get('/pacientes');
    return response.data.data || [];
  } catch (error) {
    throw new Error(`Error al obtener pacientes: ${error.response?.data?.message || error.message}`);
  }
};

export const create = async (pacienteData) => {
  try {
    const response = await api.post('/pacientes', pacienteData);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al crear paciente: ${error.response?.data?.message || error.message}`);
  }
};

export const update = async (id, pacienteData) => {
  try {
    const response = await api.put(`/pacientes/${id}`, pacienteData);
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al actualizar paciente: ${error.response?.data?.message || error.message}`);
  }
};

export const remove = async (id) => {
  try {
    const response = await api.patch(`/pacientes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar paciente: ${error.response?.data?.message || error.message}`);
  }
};