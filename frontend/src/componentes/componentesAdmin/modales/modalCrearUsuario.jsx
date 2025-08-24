import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogActions, DialogTitle,
  TextField, Button, Grid, MenuItem, Box, Typography,
  IconButton, InputAdornment, Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import {
  inputSx,
  iconWrapperSx,
  dialogPaperSx,
  dialogTitleSx,
  dialogHeaderLeftBoxSx,
  dialogHeaderTitleSx,
  sectionTitleSx,
  dialogActionsSx,
  cancelButtonSx,
  saveButtonSx,
} from '../../estilosComponentes/estilosModales/estilosModalEditarUsuario.js';

const roles = [
  { value: 'administrativo', label: 'Administrativo' },
  { value: 'medico', label: 'Médico' },
  { value: 'enfermero', label: 'Enfermero' },
];


export default function ModalCrearUsuario({ visible, personalSeleccionado, onClose, onCrear }) {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre_usuario: '',
      password: '',
      rol: '',
    }
  });

  useEffect(() => {
    if (personalSeleccionado && visible) {
      // Generar sugerencia de nombre de usuario basada en nombres y apellidos
      const nombres = personalSeleccionado.nombres.toLowerCase().split(' ')[0];
      const apellidos = personalSeleccionado.apellidos.toLowerCase().split(' ')[0];
      const sugerenciaNombreUsuario = `${nombres}.${apellidos}`;
      
      reset({
        nombre_usuario: sugerenciaNombreUsuario,
        password: '',
        rol: '',
      });
    }
  }, [personalSeleccionado, visible, reset]);

  const onSubmit = (data) => {
    const datosCompletos = {
      personal_id: personalSeleccionado.id,
      nombre_usuario: data.nombre_usuario,
      password: data.password,
      rol: data.rol,
    };
    
    onCrear(datosCompletos);
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const handleClose = () => {
    reset();
    setMostrarContrasena(false);
    onClose();
  };

  if (!personalSeleccionado) return null;

  return (
    <Dialog open={visible} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: dialogPaperSx }}>
      <DialogTitle sx={dialogTitleSx}>
        <Box sx={dialogHeaderLeftBoxSx}>
          <PersonAddIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={dialogHeaderTitleSx}>
              Crear Nuevo Usuario
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              Crear cuenta de usuario para el personal seleccionado
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ pt: 3, px: 4, pb: 2 }}>
          {/* Información del Personal Seleccionado */}
          <Typography variant="subtitle2" sx={sectionTitleSx}>
            Personal Seleccionado
          </Typography>

          <Box sx={{ 
            backgroundColor: '#f5f5f5', 
            borderRadius: 2, 
            p: 3, 
            mb: 3,
            border: '1px solid #e0e0e0'
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ID Personal
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  #{personalSeleccionado.id}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Nombres
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {personalSeleccionado.nombres}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Apellidos
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {personalSeleccionado.apellidos}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cargo
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {personalSeleccionado.cargo}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Formulario de Creación de Usuario */}
          <Typography variant="subtitle2" sx={sectionTitleSx}>
            Crear Usuario
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="nombre_usuario"
                control={control}
                rules={{
                  required: "El nombre de usuario es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+$/,
                    message: "El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos"
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre de Usuario"
                    fullWidth
                    variant="outlined"
                    error={!!errors.nombre_usuario}
                    helperText={errors.nombre_usuario ? errors.nombre_usuario.message : ''}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contraseña"
                    type={mostrarContrasena ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleMostrarContrasena}>
                            {mostrarContrasena ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="rol"
                control={control}
                rules={{ required: "El rol es obligatorio" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rol"
                    select
                    fullWidth
                    variant="outlined"
                    error={!!errors.rol}
                    helperText={errors.rol ? errors.rol.message : ''}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AdminPanelSettingsOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={dialogActionsSx}>
          <Button onClick={handleClose} variant="outlined" color="secondary" sx={cancelButtonSx}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={saveButtonSx}
            startIcon={<SaveIcon />}
          >
            Crear Usuario
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
