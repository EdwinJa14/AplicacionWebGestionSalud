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
  Button,
} from '@mui/material';

// Iconos
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BadgeIcon from '@mui/icons-material/Badge';

import * as usuarioService from '../../../../servicios/serviciosAdmin/serviciosUsuarios.js';
import ModalEditarUsuario from '../../../componentes/componentesAdmin/modales/modalEditarUsuarios.jsx';
import ModalCrearUsuario from '../../../componentes/componentesAdmin/modales/modalCrearUsuario.jsx';
import { estilosVistaUsuarios } from '../../estilosVistas/estilosUsuario/estiloUsuario.js';

// Función para obtener color del chip según el rol
const obtenerColorRol = (rol) => {
  switch (rol.toLowerCase()) {
    case 'admin': 
    case 'administrativo': return 'error';
    case 'medico': return 'primary';
    case 'enfermero': return 'success';
    default: return 'info';
  }
};

export default function VistaUsuarios() {
  const navigate = useNavigate();
  
  // Estados para personal
  const [personal, setPersonal] = useState([]);
  const [personalSeleccionado, setPersonalSeleccionado] = useState(null);
  
  // Estados para usuarios registrados
  const [usuarios, setUsuarios] = useState([]);
  
  // Estados de carga y errores
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados para modales
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  // Estado para notificaciones
  const [notificacion, setNotificacion] = useState({ 
    open: false, 
    mensaje: '', 
    tipo: 'success' 
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Cargar personal y usuarios en paralelo
      const [personalData, usuariosData] = await Promise.all([
        usuarioService.getAllPersonal(),
        usuarioService.getAllUsuariosConDetalles()
      ]);
      
      setPersonal(Array.isArray(personalData) ? personalData : []);
      setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
    } catch (err) {
      setError(`Error al cargar la información: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  const seleccionarPersonal = (persona) => {
    if (persona.tiene_usuario) {
      mostrarNotificacion('Este personal ya tiene un usuario asignado', 'warning');
      return;
    }
    setPersonalSeleccionado(persona);
  };

  const abrirModalCrearUsuario = () => {
    if (!personalSeleccionado) {
      mostrarNotificacion('Por favor seleccione un personal primero', 'warning');
      return;
    }
    setMostrarModalCrear(true);
  };

  const handleCrearUsuario = async (datosUsuario) => {
    try {
      await usuarioService.create(datosUsuario);
      setMostrarModalCrear(false);
      setPersonalSeleccionado(null);
      await cargarDatos();
      mostrarNotificacion('Usuario creado exitosamente', 'success');
    } catch (error) {
      mostrarNotificacion('Error al crear usuario: ' + error.message, 'error');
    }
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioAEditar(usuario);
    setMostrarModalEditar(true);
  };

  const guardarEdicionUsuario = async (datosEditados) => {
    try {
      await usuarioService.update(datosEditados.usuario_id, datosEditados);
      setMostrarModalEditar(false);
      await cargarDatos();
      mostrarNotificacion('Usuario actualizado exitosamente', 'success');
    } catch (error) {
      mostrarNotificacion('Error al actualizar usuario: ' + error.message, 'error');
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de que desea desactivar al usuario ${nombre}? Esta acción se puede revertir después.`)) {
      try {
        await usuarioService.remove(id);
        await cargarDatos();
        mostrarNotificacion(`Usuario ${nombre} ha sido desactivado`, 'info');
      } catch (error) {
        mostrarNotificacion('Error al desactivar usuario: ' + error.message, 'error');
      }
    }
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
              onClick={cargarDatos} 
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
            Cargando información...
          </Typography>
        </Box>
      )}

      {/* Modales */}
      <ModalCrearUsuario
        visible={mostrarModalCrear}
        personalSeleccionado={personalSeleccionado}
        onClose={() => {
          setMostrarModalCrear(false);
          setPersonalSeleccionado(null);
        }}
        onCrear={handleCrearUsuario}
      />

      <ModalEditarUsuario
        visible={mostrarModalEditar}
        usuario={usuarioAEditar}
        onClose={() => setMostrarModalEditar(false)}
        onGuardar={guardarEdicionUsuario}
      />

      {!cargando && !error && (
        <>
          {/* Tabla de Personal */}
          <Card elevation={2} sx={{...estilosVistaUsuarios.card, mb: 3}}>
            <CardHeader
              title={
                <Box sx={estilosVistaUsuarios.cardHeaderTitle}>
                  <Box sx={estilosVistaUsuarios.cardHeaderLeft}>
                    <BadgeIcon color="primary" />
                    <Typography variant="h6" component="h2" fontWeight={600}>
                      Personal
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip 
                      label={`${personal.length} registros`} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                    />
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={abrirModalCrearUsuario}
                      disabled={!personalSeleccionado}
                      sx={{
                        backgroundColor: personalSeleccionado ? '#2e7d32' : undefined,
                        '&:hover': {
                          backgroundColor: personalSeleccionado ? '#1b5e20' : undefined,
                        }
                      }}
                    >
                      Crear Usuario
                    </Button>
                  </Box>
                </Box>
              }
              sx={estilosVistaUsuarios.cardHeader}
            />
            <CardContent sx={{ p: 0 }}>
              <TableContainer sx={estilosVistaUsuarios.tableContainer}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>ID</TableCell>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>Nombres</TableCell>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>Apellidos</TableCell>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>Cargo</TableCell>
                      <TableCell sx={estilosVistaUsuarios.tableCell}>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {personal.map((persona) => (
                      <TableRow 
                        key={persona.id}
                        selected={personalSeleccionado?.id === persona.id}
                        onClick={() => seleccionarPersonal(persona)}
                        sx={{
                          ...estilosVistaUsuarios.tableRowHover,
                          cursor: 'pointer',
                          backgroundColor: personalSeleccionado?.id === persona.id 
                            ? 'rgba(25, 118, 210, 0.08)' 
                            : undefined,
                          '&:hover': {
                            backgroundColor: persona.tiene_usuario 
                              ? 'rgba(0, 0, 0, 0.04)' 
                              : 'rgba(25, 118, 210, 0.04)',
                          }
                        }}
                      >
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Chip 
                            label={persona.id} 
                            size="small" 
                            variant="outlined"
                            color="default"
                          />
                        </TableCell>
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Typography variant="body2" fontWeight={600}>
                            {persona.nombres}
                          </Typography>
                        </TableCell>
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Typography variant="body2">
                            {persona.apellidos}
                          </Typography>
                        </TableCell>
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Chip 
                            label={persona.cargo} 
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                          <Chip 
                            label={persona.tiene_usuario ? 'Con Usuario' : 'Sin Usuario'} 
                            size="small"
                            color={persona.tiene_usuario ? 'success' : 'default'}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Tabla de Usuarios Registrados */}
          <Card elevation={2} sx={estilosVistaUsuarios.card}>
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
                    Seleccione personal de la tabla superior y haga clic en "Crear Usuario"
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
                          key={usuario.usuario_id}
                          sx={estilosVistaUsuarios.tableRowHover}
                        >
                          <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                            <Chip 
                              label={usuario.usuario_id} 
                              size="small" 
                              variant="outlined"
                              color="default"
                            />
                          </TableCell>
                          <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {usuario.nombre_usuario}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {usuario.nombres} {usuario.apellidos}
                              </Typography>
                            </Box>
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
                                new Date(usuario.fecha_creacion).toLocaleDateString('es-ES') : 
                                'N/A'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell sx={estilosVistaUsuarios.tableBodyCell}>
                            <Chip 
                              label={usuario.estado_usuario ? 'Activo' : 'Inactivo'} 
                              size="small"
                              color={usuario.estado_usuario ? 'success' : 'default'}
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
                              <Tooltip title="Desactivar usuario">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEliminar(usuario.usuario_id, usuario.nombre_usuario)}
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
        </>
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