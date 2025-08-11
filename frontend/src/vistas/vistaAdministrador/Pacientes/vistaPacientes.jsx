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

import * as pacienteService from '../../../../servicios/serviciosAdmin/serviciosPacientes.js';
import ModalEditarPaciente from '../../../componentes/componentesAdmin/modales/modalEditarPacientes.jsx';

import VistaAgregarPaciente from '../Pacientes/vistaAgregarPaciente.jsx';

// Función para calcular edad
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

// Función para obtener color del chip según el tipo
const obtenerColorTipo = (tipo) => {
  switch (tipo) {
    case 'General': return 'primary';
    case 'Cronico': return 'warning';
    case 'Crónico': return 'warning'; // Agregado para manejar acentos
    case 'Prenatal': return 'success';
    default: return 'default';
  }
};

// Función para obtener color del chip según el género
const obtenerColorGenero = (genero) => {
  switch (genero) {
    case 'Masculino': return 'info';
    case 'Femenino': return 'secondary';
    case 'Otro': return 'default';
    default: return 'default';
  }
};

export default function VistaPacientes() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [pacienteAEditar, setPacienteAEditar] = useState(null);

  // Estado para notificaciones
  const [notificacion, setNotificacion] = useState({ 
    open: false, 
    mensaje: '', 
    tipo: 'success' 
  });

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await pacienteService.getAll();
      setPacientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Error al cargar la información: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalEditar = (paciente) => {
    setPacienteAEditar(paciente);
    setMostrarModalEditar(true);
  };

  const guardarEdicionPaciente = async (datosEditados) => {
    try {
      await pacienteService.update(datosEditados.id, datosEditados);
      setMostrarModalEditar(false);
      await cargarPacientes();
      mostrarNotificacion('Paciente actualizado exitosamente', 'success');
    } catch (error) {
      mostrarNotificacion('Error al actualizar paciente: ' + error.message, 'error');
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de que desea marcar como inactivo a ${nombre}? Esta acción no eliminará el registro permanentemente.`)) {
      try {
        await pacienteService.remove(id);
        await cargarPacientes();
        mostrarNotificacion(`${nombre} ha sido marcado como inactivo`, 'info');
      } catch (error) {
        mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
      }
    }
  };

  // Función para manejar cuando se agrega un paciente
  const handlePacienteAgregado = async () => {
    await cargarPacientes();
    mostrarNotificacion('¡Paciente registrado exitosamente!', 'success');
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
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      p: { xs: 2, md: 4 }
    }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: '#2c3e50',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <PeopleIcon sx={{ fontSize: 40, color: '#3498db' }} />
          Módulo de Pacientes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualice y gestione todos los pacientes registrados en el sistema
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <button color="inherit" size="small" onClick={cargarPacientes} style={{background:'none', border:'none', cursor:'pointer'}}>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>
            Cargando información de pacientes...
          </Typography>
        </Box>
      )}

      {/* Modal Editar */}
      <ModalEditarPaciente
        visible={mostrarModalEditar}
        paciente={pacienteAEditar}
        onClose={() => setMostrarModalEditar(false)}
        onGuardar={guardarEdicionPaciente}
      />

      {/* VistaAgregarPaciente - con callback para actualizar lista */}
      {!cargando && !error && (
        <Box sx={{ mb: 2 }}>
          <VistaAgregarPaciente onPacienteAgregado={handlePacienteAgregado} />
        </Box>
      )}

      {/* Tabla de Pacientes */}
      {!cargando && !error && (
        <Card 
          elevation={2}
          sx={{ 
            borderRadius: 3,
            border: '1px solid #e1e8ed',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon color="primary" />
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    Pacientes Registrados
                  </Typography>
                </Box>
                <Chip 
                  label={`${pacientes.length} registros`} 
                  color="primary" 
                  variant="outlined"
                  size="small"
                />
              </Box>
            }
            sx={{ 
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e1e8ed',
              py: 2
            }}
          />
          <CardContent sx={{ p: 0 }}>
            {pacientes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <PeopleIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay pacientes registrados
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Comience agregando su primer paciente al sistema
                </Typography>
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: '500px' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>Nombres</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>Apellidos</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>DPI</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>F. Nacimiento</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>Edad</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>Género</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>Tipo Paciente</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>Dirección</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>Teléfono</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pacientes.map((p) => (
                      <TableRow 
                        key={p.id}
                        sx={{ 
                          '&:hover': { backgroundColor: '#f8f9fa' },
                          '&:nth-of-type(even)': { backgroundColor: '#fafbfc' }
                        }}
                      >
                        <TableCell sx={{ py: 1 }}>
                          <Chip 
                            label={p.id} 
                            size="small" 
                            variant="outlined"
                            color="default"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {p.nombres}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {p.apellidos}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" fontFamily="monospace">
                            {p.dpi || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2">
                            {new Date(p.fecha_nacimiento).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {calcularEdad(p.fecha_nacimiento)} años
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip 
                            label={p.genero} 
                            size="small"
                            color={obtenerColorGenero(p.genero)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip 
                            label={p.tipo_paciente} 
                            size="small"
                            color={obtenerColorTipo(p.tipo_paciente)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 150, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}
                          >
                            {p.direccion || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" fontFamily="monospace">
                            {p.telefono || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Editar paciente">
                              <IconButton
                                size="small"
                                onClick={() => abrirModalEditar(p)}
                                sx={{
                                  backgroundColor: '#fff3cd',
                                  color: '#856404',
                                  '&:hover': { backgroundColor: '#ffeaa7' },
                                  minWidth: 32,
                                  height: 32
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Inactivar paciente">
                              <IconButton
                                size="small"
                                onClick={() => handleEliminar(p.id, `${p.nombres} ${p.apellidos}`)}
                                sx={{
                                  backgroundColor: '#f8d7da',
                                  color: '#721c24',
                                  '&:hover': { backgroundColor: '#f5c6cb' },
                                  minWidth: 32,
                                  height: 32
                                }}
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
        sx={{ zIndex: 9999 }}
      >
        <Alert 
          onClose={cerrarNotificacion} 
          severity={notificacion.tipo} 
          sx={{ 
            width: '100%',
            fontSize: '0.95rem',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}