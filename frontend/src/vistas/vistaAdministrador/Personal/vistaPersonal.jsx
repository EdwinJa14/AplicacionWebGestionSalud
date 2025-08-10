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
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import estilosPersonal from '../../estilosVistas/estilosPesonal/estilosPersonal.js'; 

import * as personalService from '../../../../servicios/serviciosAdmin/servicioPersonal.js';
import ModalEditarPersonal from '../../../componentes/componentesAdmin/modales/modalEditarPersonal.jsx';

import VistaAgregarPersonal from '../Personal/vistaAgregarPersonal.jsx';

// Datos de configuración
const cargos = ['Doctor', 'Enfermero', 'Administrador', 'Recepcionista', 'Técnico', 'Otro'];
const estados = ['Activo', 'Inactivo'];

// Función para obtener color del chip según el estado
const obtenerColorEstado = (estado) => {
  return estado ? 'success' : 'error';
};

// Función para obtener color del chip según el cargo
const obtenerColorCargo = (cargo) => {
  switch (cargo) {
    case 'Doctor': return 'primary';
    case 'Enfermero': return 'secondary';
    case 'Administrador': return 'warning';
    case 'Recepcionista': return 'info';
    case 'Técnico': return 'success';
    default: return 'default';
  }
};

export default function VistaPersonal() {
  const navigate = useNavigate();
  const [personal, setPersonal] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [personalAEditar, setPersonalAEditar] = useState(null);

  // Estado para notificaciones
  const [notificacion, setNotificacion] = useState({ 
    open: false, 
    mensaje: '', 
    tipo: 'success' 
  });

  useEffect(() => {
    cargarPersonal();
  }, []);

  const cargarPersonal = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await personalService.getAll();
      setPersonal(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Error al cargar la información: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalEditar = (persona) => {
    setPersonalAEditar(persona);
    setMostrarModalEditar(true);
  };

  const guardarEdicionPersonal = async (datosEditados) => {
    try {
      const dataToSend = { ...datosEditados, estado: datosEditados.estado === 'Activo' };
      await personalService.update(datosEditados.id, dataToSend);
      setMostrarModalEditar(false);
      await cargarPersonal();
      mostrarNotificacion('Personal actualizado exitosamente', 'success');
    } catch (error) {
      mostrarNotificacion('Error al actualizar personal: ' + error.message, 'error');
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de que desea eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
      try {
        await personalService.remove(id);
        await cargarPersonal();
        mostrarNotificacion(`${nombre} ha sido eliminado`, 'info');
      } catch (error) {
        mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
      }
    }
  };

  // Función para manejar cuando se agrega personal
  const handlePersonalAgregado = async () => {
    await cargarPersonal();
    mostrarNotificacion('¡Personal registrado exitosamente!', 'success');
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
    <Box sx={estilosPersonal.box}>
      {/* Header */}
      <Box sx={estilosPersonal.header}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={estilosPersonal.title}
        >
          <GroupIcon sx={estilosPersonal.icon} />
          Módulo de Personal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={estilosPersonal.subtitle}>
          Visualice y gestione todo el personal registrado en el sistema
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={estilosPersonal.alert}
          action={
            <button color="inherit" size="small" onClick={cargarPersonal} style={estilosPersonal.reintentarButton}>
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
        <Box sx={estilosPersonal.loadingContainer}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={estilosPersonal.loadingText}>
            Cargando información de personal...
          </Typography>
        </Box>
      )}

      {/* Modal Editar */}
      <ModalEditarPersonal
        open={mostrarModalEditar}
        persona={personalAEditar}
        onClose={() => setMostrarModalEditar(false)}
        onGuardar={guardarEdicionPersonal}
        cargos={cargos}
        estados={estados}
        guardando={false}
      />

      {/* VistaAgregarPersonal - con callback para actualizar lista */}
      {!cargando && !error && (
        <Box sx={estilosPersonal.agregarPersonalContainer}>
          <VistaAgregarPersonal onPersonalAgregado={handlePersonalAgregado} />
        </Box>
      )}

      {/* Tabla de Personal */}
      {!cargando && !error && (
        <Card elevation={2} sx={estilosPersonal.card}>
          <CardHeader
            title={
              <Box sx={estilosPersonal.cardHeader}>
                <Box sx={estilosPersonal.cardHeaderTitle}>
                  <GroupIcon color="primary" />
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    Personal Registrado
                  </Typography>
                </Box>
                <Chip 
                  label={`${personal.length} registros`} 
                  color="primary" 
                  variant="outlined"
                  size="small"
                />
              </Box>
            }
            sx={estilosPersonal.cardHeaderContent}
          />
          <CardContent sx={estilosPersonal.cardContent}>
            {personal.length === 0 ? (
              <Box sx={estilosPersonal.emptyContainer}>
                <GroupIcon sx={estilosPersonal.emptyIcon} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay personal registrado
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={estilosPersonal.emptyText}>
                  Comience agregando el primer miembro del personal al sistema
                </Typography>
              </Box>
            ) : (
              <TableContainer sx={estilosPersonal.tableContainer}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={estilosPersonal.tableCellHeader}>ID</TableCell>
                      <TableCell sx={estilosPersonal.tableCellHeader}>Nombres</TableCell>
                      <TableCell sx={estilosPersonal.tableCellHeader}>Apellidos</TableCell>
                      <TableCell sx={estilosPersonal.tableCellHeader}>Cargo</TableCell>
                      <TableCell sx={estilosPersonal.tableCellHeader}>Email</TableCell>
                      <TableCell sx={estilosPersonal.tableCellHeader}>Teléfono</TableCell>
                      <TableCell sx={estilosPersonal.tableCellHeader}>Estado</TableCell>
                      <TableCell sx={estilosPersonal.tableCellHeader}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {personal.map((p) => (
                      <TableRow 
                        key={p.id}
                        sx={estilosPersonal.tableRow}
                      >
                        <TableCell sx={estilosPersonal.tableCell}>
                          <Chip 
                            label={p.id} 
                            size="small" 
                            variant="outlined"
                            color="default"
                          />
                        </TableCell>
                        <TableCell sx={estilosPersonal.tableCell}>
                          <Typography variant="body2" fontWeight={600}>
                            {p.nombres}
                          </Typography>
                        </TableCell>
                        <TableCell sx={estilosPersonal.tableCell}>
                          <Typography variant="body2" fontWeight={600}>
                            {p.apellidos}
                          </Typography>
                        </TableCell>
                        <TableCell sx={estilosPersonal.tableCell}>
                          <Chip 
                            label={p.cargo} 
                            size="small"
                            color={obtenerColorCargo(p.cargo)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={estilosPersonal.tableCell}>
                          <Typography variant="body2" fontFamily="monospace">
                            {p.email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={estilosPersonal.tableCell}>
                          <Typography variant="body2" fontFamily="monospace">
                            {p.telefono || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={estilosPersonal.tableCell}>
                          <Chip 
                            label={p.estado ? 'Activo' : 'Inactivo'} 
                            size="small"
                            color={obtenerColorEstado(p.estado)}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell sx={estilosPersonal.tableCell}>
                          <Box sx={estilosPersonal.actionsContainer}>
                            <Tooltip title="Editar personal">
                              <IconButton
                                size="small"
                                onClick={() => abrirModalEditar(p)}
                                sx={estilosPersonal.editButton}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar personal">
                              <IconButton
                                size="small"
                                onClick={() => handleEliminar(p.id, `${p.nombres} ${p.apellidos}`)}
                                sx={estilosPersonal.deleteButton}
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
        sx={estilosPersonal.snackbar}
      >
        <Alert 
          onClose={cerrarNotificacion} 
          severity={notificacion.tipo} 
          sx={estilosPersonal.alertSnackbar}
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}
