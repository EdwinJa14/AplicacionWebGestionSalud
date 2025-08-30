import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaUserShield,
  FaPills,
  FaBars,
  FaArrowLeft,
  FaSignOutAlt
} from 'react-icons/fa';
import Logo from '../assets/Logo.png';
import styles from './estilosComponentes/siderbarEstilos';
import { useAuth } from '../context/authContext'; // Usamos el contexto para obtener el rol

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { role, logout } = useAuth(); // Obtenemos el rol y la función de logout del contexto
  const navigate = useNavigate(); // Hook para redirección programática

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = styles.menuItemHover.backgroundColor;
    e.currentTarget.style.color = styles.menuItemHover.color;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = styles.menuItem.color;
  };

  // Redirigir a una vista diferente según el rol al hacer clic en "Inicio"
  const handleHomeClick = () => {
    if (role === 'administrativo') {
      navigate('/home'); // Redirige a la vista del administrador
    } else if (role === 'medico' || role === 'enfermero') {
      navigate('/inicio'); // Redirige a la vista del usuario (perfil)
    }
  };

  return (
    <div>
      {!isOpen && (
        <button style={styles.toggleButton} onClick={toggleSidebar}>
          <FaBars style={styles.toggleIcon} />
        </button>
      )}

      <div
        style={{
          ...styles.sidebar,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div style={styles.header}>
          <img src={Logo} alt="Logo Ministerio de Salud" style={styles.logo} />
          <h2 style={styles.title}>Mi App</h2>
        </div>

        <ul style={styles.menu}>
          {/* Opción de "Inicio" con redirección condicional */}
          <li>
            <button
              style={styles.menuItem}
              onClick={handleHomeClick} // Llamamos a la función para redirigir
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <FaHome style={styles.icon} /> Inicio
            </button>
          </li>

          {/* Opciones para administradores */}
          {role === 'administrativo' && (
            <>
              <li>
                <Link to="/personal" style={styles.menuItem} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <FaUserMd style={styles.icon} /> Personal
                </Link>
              </li>
              <li>
                <Link to="/pacientes" style={styles.menuItem} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <FaUsers style={styles.icon} /> Pacientes
                </Link>
              </li>
              <li>
                <Link to="/usuarios" style={styles.menuItem} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <FaUserShield style={styles.icon} /> Usuarios
                </Link>
              </li>
              <li>
                <Link to="/inventario" style={styles.menuItem} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <FaPills style={styles.icon} /> Inventario
                </Link>
              </li>
            </>
          )}

          {/* Opciones para médicos y enfermeros */}
          {role === 'medico' || role === 'enfermero' ? (
            <>
              <li>
                <Link to="/perfil" style={styles.menuItem} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <FaUserShield style={styles.icon} /> Perfil
                </Link>
                
              </li>
              <li>
                <Link to="/paciente" style={styles.menuItem} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <FaUsers style={styles.icon} /> Pacientes
                </Link>
              </li>
              <li>
                <Link to="/inventario" style={styles.menuItem} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <FaPills style={styles.icon} /> Inventario
                </Link>
              </li>
            </>
          ) : null}

          {/* Botón de Cerrar Sesión */}
          <li>
            <button
              style={styles.menuItem}
              onClick={logout} // Llamamos a la función de logout
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <FaSignOutAlt style={styles.icon} /> Cerrar sesión
            </button>
          </li>
        </ul>

        {isOpen && (
          <button style={styles.closeButton} onClick={closeSidebar}>
            <FaArrowLeft style={styles.closeIcon} />
          </button>
        )}
      </div>
    </div>
  );
}
