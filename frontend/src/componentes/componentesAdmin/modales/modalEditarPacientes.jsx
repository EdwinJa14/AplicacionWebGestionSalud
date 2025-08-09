import React, { useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions, DialogTitle,
  TextField, Button, Grid, MenuItem, Box, Typography,
  IconButton, InputAdornment, Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

// Importa los iconos
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

// Listas de opciones
const generos = ['Masculino', 'Femenino', 'Otro'];
const tiposPaciente = [
  'General', 
  'Cronico', 
  'Prenatal'
];

export default function ModalEditarPaciente({ visible, paciente, onClose, onGuardar }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombres: '',
      apellidos: '',
      documento_identificacion: '',
      fecha_nacimiento: '',
      genero: '',
      tipo_paciente: '',
      direccion: '',
      telefono: '',
    }
  });

  useEffect(() => {
    if (paciente) {
      reset({
        nombres: paciente.nombres || '',
        apellidos: paciente.apellidos || '',
        documento_identificacion: paciente.documento_identificacion || '',
        fecha_nacimiento: paciente.fecha_nacimiento?.split('T')[0] || '',
        genero: paciente.genero || '',
        tipo_paciente: paciente.tipo_paciente || '',
        direccion: paciente.direccion || '',
        telefono: paciente.telefono || '',
      });
    }
  }, [paciente, reset]);

  const onSubmit = (data) => {
    onGuardar({ ...paciente, ...data });
    onClose();
  };

  return (
    <Dialog
      open={visible}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          backgroundColor: '#ffffff',
          margin: 2,
          border: '1px solid #e1e8ed',
        },
      }}
    >
      {/* Header mejorado */}
      <DialogTitle sx={{ 
        p: 0, 
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e1e8ed'
      }}>
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between" 
          sx={{ px: 4, py: 3 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EditIcon sx={{ color: '#3498db', fontSize: 28 }} />
            <Box>
              <Typography variant="h5" component="div" sx={{ 
                fontWeight: 700,
                color: '#2c3e50',
                fontSize: '1.5rem'
              }}>
                Editar Información del Paciente
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Actualice los datos del paciente según sea necesario
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={onClose} 
            size="medium" 
            sx={{ 
              color: '#666',
              backgroundColor: '#f0f0f0',
              '&:hover': { 
                backgroundColor: '#e0e0e0',
                color: '#333'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ 
          p: 0, 
          backgroundColor: '#ffffff',
          minHeight: '500px'
        }}>
          <Box sx={{ p: 4 }}>
            
            {/* Sección Información Personal */}
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
              {/* Primera fila: Nombres, Apellidos, DPI */}
              <Grid item xs={12} sm={6} md={4}>
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

              <Grid item xs={12} sm={6} md={4}>
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

              <Grid item xs={12} sm={6} md={4}>
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

              {/* Segunda fila: Fecha de Nacimiento y Género */}
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
            </Grid>

            {/* Sección Datos de Contacto */}
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

            <Grid container spacing={3}>
              {/* Tercera fila: Teléfono y Dirección */}
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

              <Grid item xs={12} sm={6}>
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
          </Box>
        </DialogContent>

        {/* Footer mejorado */}
        <DialogActions sx={{ 
          p: 4, 
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e1e8ed',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5
            }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<SaveIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(52, 152, 219, 0.4)'
              }
            }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}