// frontend/src/servicios/servicioAuth.js
const API_URL = 'http://localhost:5000/api/auth';

export const login = async (loginData) => {
  try {
    console.log('Enviando datos de login:', { nombre_usuario: loginData.nombre_usuario });
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        const errorMessages = data.errors.map(error => error.msg).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      localStorage.setItem('rol', data.usuario.rol);
    }

    console.log('Login exitoso:', data);
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw new Error(`Error de autenticación: ${error.message}`);
  }
};

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
