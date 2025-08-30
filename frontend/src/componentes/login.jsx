import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { styles } from './estilosComponentes/loginEstilos';
import logo from '../assets/Logo.png';
import { useAuth } from '../context/authContext';
import { login as loginService } from '../../servicios/servicioSistem/serviciosAuth.js';

export default function Login() {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser, setRole } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginService({
        nombre_usuario: nombre,
        password: contrasena,
      });

      if (response.success) {
        const usuario = response.usuario;
        setUser(usuario);
        setRole(usuario.rol);

        // Redirigir según el rol
        switch (usuario.rol) {
          case 'administrativo':
            navigate('/home');
            break;
          case 'medico':
          case 'enfermero':
            navigate('/inicio');
            break;
          default:
            alert('Rol no reconocido');
            break;
        }
      } else {
        alert('Inicio de sesión fallido');
      }
    } catch (error) {
      console.error('Error de login:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.loginCard}>
      <div style={styles.formPanel}>
        <h2 style={styles.formTitle}>Bienvenido de Nuevo</h2>
        <p style={styles.formSubtitle}>Ingresa tus credenciales para continuar</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputContainer}>
            <FaUser size={20} color="#A9A9A9" style={styles.icon} />
            <input
              type="text"
              style={styles.input}
              placeholder="Usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div style={styles.inputContainer}>
            <FaLock size={20} color="#A9A9A9" style={styles.icon} />
            <input
              type={verPassword ? 'text' : 'password'}
              style={styles.input}
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setVerPassword(!verPassword)}
              style={styles.eyeButton}
            >
              {verPassword ? <FaEye size={20} color="#A9A9A9" /> : <FaEyeSlash size={20} color="#A9A9A9" />}
            </button>
          </div>

          <button type="submit" style={styles.submitButton}>
            Ingresar
          </button>
        </form>
      </div>

      <div style={styles.welcomePanel}>
        <h1 style={styles.tituloApp}>Sistema de Gestión</h1>
        <h2 style={styles.subtituloApp}>Puesto de Salud de Chinaca</h2>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>
    </div>
  );
}
