import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';

// Iconos
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import * as usuarioService from '../../../../servicios/serviciosAdmin/serviciosUsuarios.js';
import ModalEditarUsuario from '../../../componentes/componentesAdmin/modales/modalEditarUsuarios.jsx';
import { estilosVistaUsuarios } from '../../estilosVistas/estilosUsuario/estiloUsuario.js';

// Importar la vista agregar usuario cuando esté lista
// import VistaAgregarUsuario from './vistaAgregarUsuario.jsx';

// Función para obtener color del chip según el rol
const obtenerColorRol = (rol) => {
  switch (rol) {
    case 'Administrador': return 'error';
    case 'Doctor': return 'primary';
    case 'Enfermero': return 'success';
    case 'Recepcionista': return 'info';
    default: return 'default';
  }
};

export default function VistaUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  // Estado para notificaciones
  const [notificacion, setNotificacion] = useState({ 
    open: false, 
    mensaje: '', 
    tipo: 'success' 
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await usuarioService.getAll();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Error al cargar la información: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioAEditar(usuario);
    setMostrarModalEditar(true);
  };

  const guardarEdicionUsuario = async (datosEditados) => {
    try {
      await usuarioService.update(datosEditados.id, datosEditados);
      setMostrarModalEditar(false);
      await cargarUsuarios();
      mostrarNotificacion('Usuario actualizado exitosamente', 'success');
    } catch (error) {
      mostrarNotificacion('Error al actualizar usuario: ' + error.message, 'error');
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de que desea eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
      try {
        await usuarioService.remove(id);
        await cargarUsuarios();
        mostrarNotificacion(`${nombre} ha sido eliminado`, 'info');
      } catch (error) {
        mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
      }
    }
  };

  // Función para manejar cuando se agrega un usuario
  const handleUsuarioAgregado = async () => {
    await cargarUsuarios();
    mostrarNotificacion('¡Usuario registrado exitosamente!', 'success');
  };

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ open: true, mensaje, tipo });
  };

  // Función para cerrar notificaciones
  const cerrarNotificacion = () => {
    setNotificacion({ ...notificacion, open: false });
  };

  return (
    <Box sx={estilosVistaUsuarios.container}>
      {/* Header */}
      <Box sx={estilosVistaUsuarios.header}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={estilosVistaUsuarios.titulo}
        >
          <PeopleIcon sx={estilosVistaUsuarios.iconoTitulo} />
          Módulo de Usuarios
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualice y gestione todos los usuarios registrados en el sistema
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={estilosVistaUsuarios.alert}
          action={
            <button 
              color="inherit" 
              size="small" 
              onClick={cargarUsuarios} 
              style={{background:'none', border:'none', cursor:'pointer'}}
            >
              Reintentar
            </button>
          }
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {cargando && (
        <Box sx={estilosVistaUsuarios.loadingContainer}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={estilosVistaUsuarios.loadingText}>
            Cargando información de usuarios...
          </Typography>
        </Box>
      )}

      {/* Modal Editar */}
      <ModalEditarUsuario
        visible={mostrarModalEditar}
        usuario={usuarioAEditar}
        onClose={() => setMostrarModalEditar(false)}
        onGuardar={guardarEdicionUsuario}
      />

      {/* VistaAgregarUsuario - con callback para actualizar lista */}
      {/* Descomentar cuando esté lista la vista agregar usuario
      {!cargando && !error && (
        <Box sx={{ mb: 2 }}>
          <VistaAgregarUsuario onUsuarioAgregado={handleUsuarioAgregado} />
        </Box>
      )}
      */}

      {/* Tabla de Usuarios */}
      {!cargando && !error && (
        <Card 
          elevation={2}
          sx={estilosVistaUsuarios.card}
        >
          <CardHeader
            title={
              <Box sx={estilosVistaUsuarios.cardHeaderTitle}>
                <Box sx={estilosVistaUsuarios.cardHeaderLeft}>
                  <PeopleIcon color="primary" />
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    Usuarios Registrados
                  </Typography>
                </Box>
                <Chip 
                  label={`${usuarios.length} registros`} 
                  color="primary" 
                  variant="outlined"
                  size="small"
                />
              </Box>
            }
            sx={estilosVistaUsuarios.cardHeader}
          />
          <CardContent sx={{ p: 0 }}>
            {usuarios.length === 0 ? (
              <Box sx={estilosVistaUsuarios.emptyState}>
                <PeopleIcon sx={estilosVistaUsuarios.emptyIcon} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay usuarios registrados
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Comience agregando su primer usuario al sistema
                </Typography>
              </Box>
            ) : (
              <TableContainer sx={estilosVistaUsuarios.tableContainer}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>ID</TableCell>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>Nombre de Usuario</TableCell>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>Rol</TableCell>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>Fecha Creación</TableCell>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>Estado</TableCell>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow 
                        key={usuario.id}
                        sx={estilosVistaUsuarios.tableRowHover}
                      >
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Chip 
                            label={usuario.id} 
                            size="small" 
                            variant="outlined"
                            color="default"
                          />
                        </TableCell>
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Typography variant="body2" fontWeight={600}>
                            {usuario.nombre_usuario}
                          </Typography>
                        </TableCell>
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Chip 
                            label={usuario.rol} 
                            size="small"
                            color={obtenerColorRol(usuario.rol)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Typography variant="body2">
                            {usuario.fecha_creacion ? 
                              new Date(usuario.fecha_creacion).toLocaleDateString() : 
                              'N/A'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Chip 
                            label={usuario.activo ? 'Activo' : 'Inactivo'} 
                            size="small"
                            color={usuario.activo ? 'success' : 'default'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Box sx={estilosVistaUsuarios.accionesContainer}>
                            <Tooltip title="Editar usuario">
                              <IconButton
                                size="small"
                                onClick={() => abrirModalEditar(usuario)}
                                sx={estilosVistaUsuarios.iconButtonEditar}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar usuario">
                              <IconButton
                                size="small"
                                onClick={() => handleEliminar(usuario.id, usuario.nombre_usuario)}
                                sx={estilosVistaUsuarios.iconButtonEliminar}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={notificacion.open}
        autoHideDuration={4000}
        onClose={cerrarNotificacion}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={estilosVistaUsuarios.snackbar}
      >
        <Alert 
          onClose={cerrarNotificacion} 
          severity={notificacion.tipo} 
          sx={estilosVistaUsuarios.alertSnackbar}
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}