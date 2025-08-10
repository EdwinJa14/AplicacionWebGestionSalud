import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

import * as pacienteService from '../../../servicios/serviciosAdmin/serviciosPacientes';

const generos = ['Masculino', 'Femenino', 'Otro'];
const tiposPaciente = ['General', 'Cronico', 'Prenatal'];

export default function VistaAgregarPaciente({ onPacienteAgregado }) {
  const [guardando, setGuardando] = useState(false);

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

  const onSubmit = async (data) => {
    try {
      setGuardando(true);
      await pacienteService.create(data);
      reset();
      // Notificar al componente padre para que recargue la lista y muestre el mensaje
      if (onPacienteAgregado) {
        onPacienteAgregado();
      }
    } catch (error) {
      // En caso de error, podrías manejar esto también en el componente padre
      console.error('Error al guardar paciente:', error);
      alert('Error al guardar paciente: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const limpiarFormulario = () => {
    reset();
  };

  return (
    <>
      <Card 
        elevation={2}
        sx={{ 
          borderRadius: 3,
          border: '1px solid #e1e8ed',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          mb: 0
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAddIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Registrar Nuevo Paciente
              </Typography>
            </Box>
          }
          sx={{ 
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #e1e8ed',
            py: 2
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Información Personal */}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                mb: 2,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: 1,
              }}
            >
              Información Personal
            </Typography>

            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="nombres"
                  control={control}
                  rules={{ required: 'Los nombres son requeridos' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombres"
                      placeholder="Ejemplo: Juan Carlos"
                      size="medium"
                      fullWidth
                      error={!!errors.nombres}
                      helperText={errors.nombres?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { 
                          height: 56,
                          fontSize: '1rem'
                        },
                      }}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="apellidos"
                  control={control}
                  rules={{ required: 'Los apellidos son requeridos' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Apellidos"
                      placeholder="Ejemplo: Pérez Gómez"
                      size="medium"
                      fullWidth
                      error={!!errors.apellidos}
                      helperText={errors.apellidos?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { 
                          height: 56,
                          fontSize: '1rem'
                        },
                      }}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="documento_identificacion"
                  control={control}
                  rules={{ required: 'El DPI es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="DPI / Documento"
                      placeholder="Ejemplo: 1234 56789 0123"
                      size="medium"
                      fullWidth
                      error={!!errors.documento_identificacion}
                      helperText={errors.documento_identificacion?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { 
                          height: 56,
                          fontSize: '1rem'
                        },
                      }}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="fecha_nacimiento"
                  control={control}
                  rules={{ required: 'La fecha de nacimiento es requerida' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fecha de Nacimiento"
                      type="date"
                      size="medium"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.fecha_nacimiento}
                      helperText={errors.fecha_nacimiento?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CakeOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { 
                          height: 56,
                          fontSize: '1rem'
                        },
                      }}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="genero"
                  control={control}
                  rules={{ required: 'El género es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Género"
                      select
                      size="medium"
                      fullWidth
                      error={!!errors.genero}
                      helperText={errors.genero?.message}
                      InputProps={{
                        sx: { 
                          height: 56,
                          fontSize: '1rem'
                        },
                      }}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.875rem',
                        }
                      }}
                    >
                      {generos.map((g) => (
                        <MenuItem key={g} value={g} sx={{ fontSize: '1rem' }}>
                          {g}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>

            {/* Datos Adicionales */}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                mb: 2,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: 1,
              }}
            >
              Datos Adicionales y de Contacto
            </Typography>

            <Grid container spacing={4} sx={{ mb: 4 }}>
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
                      size="medium"
                      fullWidth
                      error={!!errors.tipo_paciente}
                      helperText={errors.tipo_paciente?.message}
                      InputProps={{
                        sx: { 
                          height: 56,
                          fontSize: '1rem'
                        },
                      }}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.875rem',
                        }
                      }}
                    >
                      {tiposPaciente.map((tp) => (
                        <MenuItem key={tp} value={tp} sx={{ fontSize: '1rem' }}>
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
                      placeholder="Ejemplo: +502 1234 5678"
                      size="medium"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { 
                          height: 56,
                          fontSize: '1rem'
                        },
                      }}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.875rem',
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
                      placeholder="Ejemplo: Calle 123, Zona 1, Ciudad"
                      size="medium"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { 
                          height: 56,
                          fontSize: '1rem'
                        },
                      }}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Botones */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={limpiarFormulario}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 6,
                  py: 1.5,
                  fontSize: '1rem',
                  minHeight: 48,
                  minWidth: 140,
                  color: '#1976d2',
                  borderColor: '#1976d2',
                  '&:hover': {
                    borderColor: '#145a86',
                    backgroundColor: 'rgba(21, 101, 192, 0.08)',
                  },
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
                  px: 6,
                  py: 1.5,
                  fontSize: '1rem',
                  minHeight: 48,
                  minWidth: 180,
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                }}
              >
                {guardando ? 'Guardando...' : 'Guardar Paciente'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
}