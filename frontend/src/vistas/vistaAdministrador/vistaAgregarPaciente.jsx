import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
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
  InputAdornment,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

// Iconos
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import PeopleIcon from '@mui/icons-material/People';

import * as pacienteService from '../../../servicios/serviciosAdmin/serviciosPacientes';

// Datos de configuración
const generos = ['Masculino', 'Femenino', 'Otro'];
const tiposPaciente = ['General', 'Cronico', 'Prenatal'];

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

export default function VistaAgregarPaciente() {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [alerta, setAlerta] = useState({ open: false, mensaje: '', tipo: 'success' });

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombres: '',
      apellidos: '',
      documento_identificacion: '',
      fecha_nacimiento: '',
      genero: 'Masculino',
      tipo_paciente: 'Cronico',
      direccion: '',
      telefono: '',
    }
  });

  const cargarPacientes = async () => {
    try {
      setCargando(true);
      const data = await pacienteService.getAll();
      setPacientes(Array.isArray(data) ? data : []);
    } catch (error) {
      mostrarAlerta('Error al cargar pacientes: ' + error.message, 'error');
    } finally {
      setCargando(false);
    }
  };

  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setAlerta({ open: true, mensaje, tipo });
  };

  const cerrarAlerta = () => {
    setAlerta({ ...alerta, open: false });
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const onSubmit = async (data) => {
    try {
      setGuardando(true);
      await pacienteService.create(data);
      reset();
      cargarPacientes();
      mostrarAlerta('¡Paciente registrado exitosamente!', 'success');
    } catch (error) {
      mostrarAlerta('Error al guardar paciente: ' + error.message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  const limpiarFormulario = () => {
    reset();
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
          <PersonAddIcon sx={{ fontSize: 40, color: '#3498db' }} />
          Gestión de Pacientes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Registre y administre la información de los pacientes del centro médico
        </Typography>
      </Box>

      {/* Formulario de Registro - Una sola tarjeta ancha */}
      <Card 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          border: '1px solid #e1e8ed',
          mb: 4
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAddIcon color="primary" />
              <Typography variant="h6" component="h2" fontWeight={600}>
                Registrar Nuevo Paciente
              </Typography>
            </Box>
          }
          sx={{ 
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e1e8ed'
          }}
        />
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Información Personal */}
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: '#3498db',
                mb: 3,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: 1
              }}
            >
              Información Personal
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Primera fila: Nombres, Apellidos, DPI, Fecha de Nacimiento, Género */}
              <Grid item xs={12} sm={6} md={2.4}>
                <Controller
                  name="nombres"
                  control={control}
                  rules={{ required: 'Los nombres son requeridos' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombres"
                      fullWidth
                      size="medium"
                      error={!!errors.nombres}
                      helperText={errors.nombres?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Controller
                  name="apellidos"
                  control={control}
                  rules={{ required: 'Los apellidos son requeridos' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Apellidos"
                      fullWidth
                      size="medium"
                      error={!!errors.apellidos}
                      helperText={errors.apellidos?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Controller
                  name="documento_identificacion"
                  control={control}
                  rules={{ required: 'El DPI es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="DPI / Documento"
                      fullWidth
                      size="medium"
                      error={!!errors.documento_identificacion}
                      helperText={errors.documento_identificacion?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Controller
                  name="fecha_nacimiento"
                  control={control}
                  rules={{ required: 'La fecha de nacimiento es requerida' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fecha de Nacimiento"
                      type="date"
                      fullWidth
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.fecha_nacimiento}
                      helperText={errors.fecha_nacimiento?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CakeOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <Controller
                  name="genero"
                  control={control}
                  rules={{ required: 'El género es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Género"
                      select
                      fullWidth
                      size="medium"
                      error={!!errors.genero}
                      helperText={errors.genero?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      {generos.map((g) => (
                        <MenuItem key={g} value={g}>
                          {g}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>

            {/* Datos Adicionales y de Contacto */}
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: '#3498db',
                mb: 3,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: 1
              }}
            >
              Datos Adicionales y de Contacto
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Segunda fila: Tipo de Paciente, Teléfono, Dirección */}
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="tipo_paciente"
                  control={control}
                  rules={{ required: 'El tipo de paciente es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tipo de Paciente"
                      select
                      fullWidth
                      size="medium"
                      error={!!errors.tipo_paciente}
                      helperText={errors.tipo_paciente?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      {tiposPaciente.map((tp) => (
                        <MenuItem key={tp} value={tp}>
                          {tp}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="telefono"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Teléfono"
                      fullWidth
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="direccion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Dirección"
                      fullWidth
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Botones */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={limpiarFormulario}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3
                }}
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={guardando}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)'
                }}
              >
                {guardando ? 'Guardando...' : 'Guardar Paciente'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Pacientes */}
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
          <TableContainer sx={{ maxHeight: '500px' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 80 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 150 }}>Nombres</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 150 }}>Apellidos</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 100 }}>Género</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 150 }}>DPI / Documento</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 150 }}>Fecha de Nacimiento</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 120 }}>Teléfono</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 200 }}>Dirección</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 140 }}>Tipo de Paciente</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cargando ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Cargando pacientes...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : pacientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No hay pacientes registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pacientes.map((p) => (
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
                        <Typography variant="body2">
                          {p.genero}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {p.documento_identificacion || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {p.fecha_nacimiento ? new Date(p.fecha_nacimiento).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {p.telefono || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.direccion || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={p.tipo_paciente} 
                          size="small"
                          color={obtenerColorTipo(p.tipo_paciente)}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Snackbar para alertas */}
      <Snackbar
        open={alerta.open}
        autoHideDuration={6000}
        onClose={cerrarAlerta}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={cerrarAlerta} 
          severity={alerta.tipo} 
          sx={{ width: '100%' }}
        >
          {alerta.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}