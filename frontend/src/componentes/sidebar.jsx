import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaUserShield,
  FaPills,
  FaBars,
  FaArrowLeft
} from 'react-icons/fa';
import Logo from '../assets/Logo.png';
import styles from './estilosComponentes/siderbarEstilos';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

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
          <li>
            <Link to="/home" style={styles.menuItem} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <FaHome style={styles.icon} /> Inicio
            </Link>
          </li>
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
