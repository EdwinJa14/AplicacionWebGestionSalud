import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
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
} from '@mui/material';

// Iconos
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import * as pacienteService from '../../../servicios/serviciosAdmin/serviciosPacientes.js';
import ModalEditarPaciente from '../../componentes/componentesAdmin/modales/modalEditarPacientes.jsx';

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
      cargarPacientes();
    } catch (error) {
      alert("Error al guardar cambios: " + error.message);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de que desea marcar como inactivo a ${nombre}? Esta acción no eliminará el registro permanentemente.`)) {
      try {
        await pacienteService.remove(id);
        cargarPacientes();
      } catch (error) {
        alert(`Error al eliminar: ${error.message}`);
      }
    }
  };

  const irAAgregarPaciente = () => {
    navigate('/pacientes/agregar');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      p: { xs: 2, md: 4 }
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
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

      {/* Botón Agregar y Error/Loading */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={irAAgregarPaciente}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
            fontSize: '16px'
          }}
        >
          Agregar Nuevo Paciente
        </Button>

        <Tooltip title="Actualizar lista">
          <IconButton 
            onClick={cargarPacientes} 
            sx={{ 
              backgroundColor: '#f8f9fa',
              '&:hover': { backgroundColor: '#e9ecef' }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={cargarPacientes}>
              Reintentar
            </Button>
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

      {/* Tabla de Pacientes */}
      {!cargando && !error && (
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: '1px solid #e1e8ed'
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
              borderBottom: '1px solid #e1e8ed'
            }}
          />
          <CardContent sx={{ p: 0 }}>
            {pacientes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <PeopleIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay pacientes registrados
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Comience agregando su primer paciente al sistema
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={irAAgregarPaciente}
                  sx={{ borderRadius: 2 }}
                >
                  Agregar Primer Paciente
                </Button>
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: '600px' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 80 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 150 }}>Nombres</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 150 }}>Apellidos</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 150 }}>DPI</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 130 }}>F. Nacimiento</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 80 }}>Edad</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 100 }}>Género</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 140 }}>Tipo Paciente</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 200 }}>Dirección</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 120 }}>Teléfono</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 120 }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pacientes.map((p) => (
                      <TableRow 
                        key={p.id}
                        sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
                      >
                        <TableCell>
                          <Chip 
                            label={p.id} 
                            size="small" 
                            variant="outlined"
                            color="default"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {p.nombres}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {p.apellidos}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {p.documento_identificacion || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(p.fecha_nacimiento).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {calcularEdad(p.fecha_nacimiento)} años
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={p.genero} 
                            size="small"
                            color={obtenerColorGenero(p.genero)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={p.tipo_paciente} 
                            size="small"
                            color={obtenerColorTipo(p.tipo_paciente)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 200, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}
                          >
                            {p.direccion || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {p.telefono || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Editar paciente">
                              <IconButton
                                size="small"
                                onClick={() => abrirModalEditar(p)}
                                sx={{
                                  backgroundColor: '#fff3cd',
                                  color: '#856404',
                                  '&:hover': { backgroundColor: '#ffeaa7' }
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
                                  '&:hover': { backgroundColor: '#f5c6cb' }
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
    </Box>
  );
}