import api from '../api'; 

export const login = async (loginData) => {
  try {
    console.log('Enviando datos de login:', { nombre_usuario: loginData.nombre_usuario });
 
    const response = await api.post('/auth/login', loginData);
    const data = response.data;

    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      localStorage.setItem('rol', data.usuario.rol);
    }

    console.log('Login exitoso:', data);
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Error de autenticación: ${errorMessage}`);
  }
};

// --- El resto de las funciones permanecen igual ---
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('rol');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUsuario = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

export const getRol = () => {
  return localStorage.getItem('rol');
};

export const hasRole = (rol) => {
  const userRole = getRol();
  return userRole === rol;
};

export const isAdmin = () => {
  return hasRole('administrativo');
};

export const isMedicalStaff = () => {
  const rol = getRol();
  return rol === 'medico' || rol === 'enfermero';
};