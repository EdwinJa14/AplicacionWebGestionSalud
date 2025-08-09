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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

// Iconos
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import * as personalService from '../../../servicios/serviciosAdmin/servicioPersonal.js';

// Datos de configuración
const cargos = ['Doctor', 'Enfermero', 'Administrador', 'Recepcionista', 'Técnico', 'Otro'];
const estados = ['Activo', 'Inactivo'];

// Función para obtener color del chip según el estado
const obtenerColorEstado = (estado) => {
  return estado ? 'success' : 'error';
};

export default function VistaPersonal() {
  const [personal, setPersonal] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [alerta, setAlerta] = useState({ open: false, mensaje: '', tipo: 'success' });
  const [modalEditar, setModalEditar] = useState({ open: false, persona: null });

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombres: '',
      apellidos: '',
      cargo: 'Doctor',
      email: '',
      telefono: '',
      estado: 'Activo',
    }
  });

  const { handleSubmit: handleEditSubmit, control: editControl, reset: editReset, formState: { errors: editErrors } } = useForm({
    defaultValues: {
      nombres: '',
      apellidos: '',
      cargo: 'Doctor',
      email: '',
      telefono: '',
      estado: 'Activo',
    }
  });

  const cargarPersonal = async () => {
    try {
      setCargando(true);
      const data = await personalService.getAll();
      setPersonal(Array.isArray(data) ? data : []);
    } catch (error) {
      mostrarAlerta('Error al cargar personal: ' + error.message, 'error');
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
    cargarPersonal();
  }, []);

  const onSubmit = async (data) => {
    try {
      setGuardando(true);
      // Convertir estado a boolean
      const dataToSend = {
        ...data,
        estado: data.estado === 'Activo'
      };
      await personalService.create(dataToSend);
      reset();
      cargarPersonal();
      mostrarAlerta('¡Personal registrado exitosamente!', 'success');
    } catch (error) {
      mostrarAlerta('Error al guardar personal: ' + error.message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  const onEditSubmit = async (data) => {
    try {
      setGuardando(true);
      // Convertir estado a boolean
      const dataToSend = {
        ...data,
        estado: data.estado === 'Activo'
      };
      await personalService.update(modalEditar.persona.id, dataToSend);
      setModalEditar({ open: false, persona: null });
      cargarPersonal();
      mostrarAlerta('¡Personal actualizado exitosamente!', 'success');
    } catch (error) {
      mostrarAlerta('Error al actualizar personal: ' + error.message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (persona) => {
    editReset({
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      cargo: persona.cargo,
      email: persona.email,
      telefono: persona.telefono || '',
      estado: persona.estado ? 'Activo' : 'Inactivo',
    });
    setModalEditar({ open: true, persona });
  };

  const handleEliminar = async (persona) => {
    if (window.confirm(`¿Está seguro de que desea eliminar a ${persona.nombres} ${persona.apellidos}?`)) {
      try {
        await personalService.remove(persona.id);
        cargarPersonal();
        mostrarAlerta('Personal eliminado exitosamente', 'success');
      } catch (error) {
        mostrarAlerta('Error al eliminar personal: ' + error.message, 'error');
      }
    }
  };

  const limpiarFormulario = () => {
    reset();
  };

  const cerrarModalEditar = () => {
    setModalEditar({ open: false, persona: null });
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
          <GroupIcon sx={{ fontSize: 40, color: '#3498db' }} />
          Gestión de Personal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Registre y administre la información del personal del centro médico
        </Typography>
      </Box>

      {/* Formulario de Registro */}
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
              <GroupAddIcon color="primary" />
              <Typography variant="h6" component="h2" fontWeight={600}>
                Registrar Nuevo Personal
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
              <Grid item xs={12} sm={6} md={3}>
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

              <Grid item xs={12} sm={6} md={3}>
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

              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="cargo"
                  control={control}
                  rules={{ required: 'El cargo es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cargo"
                      select
                      fullWidth
                      size="medium"
                      error={!!errors.cargo}
                      helperText={errors.cargo?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WorkOutlineIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      {cargos.map((cargo) => (
                        <MenuItem key={cargo} value={cargo}>
                          {cargo}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="estado"
                  control={control}
                  rules={{ required: 'El estado es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Estado"
                      select
                      fullWidth
                      size="medium"
                      error={!!errors.estado}
                      helperText={errors.estado?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      {estados.map((estado) => (
                        <MenuItem key={estado} value={estado}>
                          {estado}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>

            {/* Datos de Contacto */}
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
              Datos de Contacto
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      fullWidth
                      size="medium"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon color="action" />
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

              <Grid item xs={12} sm={6}>
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
                {guardando ? 'Guardando...' : 'Guardar Personal'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Personal */}
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
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 120 }}>Cargo</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 200 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 120 }}>Teléfono</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 100 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', minWidth: 150 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cargando ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Cargando personal...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : personal.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No hay personal registrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  personal.map((p) => (
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
                          {p.cargo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {p.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {p.telefono || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={p.estado ? 'Activo' : 'Inactivo'} 
                          size="small"
                          color={obtenerColorEstado(p.estado)}
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditar(p)}
                            sx={{ 
                              color: '#f57c00',
                              '&:hover': { backgroundColor: 'rgba(245, 124, 0, 0.1)' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEliminar(p)}
                            sx={{ 
                              color: '#d32f2f',
                              '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modal de Edición */}
      <Dialog
        open={modalEditar.open}
        onClose={cerrarModalEditar}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e1e8ed'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EditIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Editar Personal
            </Typography>
          </Box>
        </DialogTitle>

        <form onSubmit={handleEditSubmit(onEditSubmit)} noValidate>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="nombres"
                  control={editControl}
                  rules={{ required: 'Los nombres son requeridos' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombres"
                      fullWidth
                      size="medium"
                      error={!!editErrors.nombres}
                      helperText={editErrors.nombres?.message}
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

              <Grid item xs={12} sm={6}>
                <Controller
                  name="apellidos"
                  control={editControl}
                  rules={{ required: 'Los apellidos son requeridos' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Apellidos"
                      fullWidth
                      size="medium"
                      error={!!editErrors.apellidos}
                      helperText={editErrors.apellidos?.message}
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

              <Grid item xs={12} sm={6}>
                <Controller
                  name="cargo"
                  control={editControl}
                  rules={{ required: 'El cargo es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cargo"
                      select
                      fullWidth
                      size="medium"
                      error={!!editErrors.cargo}
                      helperText={editErrors.cargo?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      {cargos.map((cargo) => (
                        <MenuItem key={cargo} value={cargo}>
                          {cargo}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="estado"
                  control={editControl}
                  rules={{ required: 'El estado es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Estado"
                      select
                      fullWidth
                      size="medium"
                      error={!!editErrors.estado}
                      helperText={editErrors.estado?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      {estados.map((estado) => (
                        <MenuItem key={estado} value={estado}>
                          {estado}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={editControl}
                  rules={{ 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      fullWidth
                      size="medium"
                      error={!!editErrors.email}
                      helperText={editErrors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon color="action" />
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

              <Grid item xs={12} sm={6}>
                <Controller
                  name="telefono"
                  control={editControl}
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
            </Grid>
          </DialogContent>

          <DialogActions sx={{ 
            p: 4, 
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e1e8ed',
            gap: 2
          }}>
            <Button 
              onClick={cerrarModalEditar} 
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              Cancelar
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
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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