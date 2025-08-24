import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogActions, DialogTitle,
  TextField, Button, Grid, MenuItem, Box, Typography,
  IconButton, InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import EditIcon from '@mui/icons-material/Edit';
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

export default function ModalEditarUsuario({ visible, usuario, onClose, onGuardar }) {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre_usuario: '',
      contrasena: '',
      rol: '',
    }
  });

  useEffect(() => {
    if (usuario) {
      reset({
        nombre_usuario: usuario.nombre_usuario || '',
        contrasena: '', // Siempre vacío por seguridad
        rol: usuario.rol || '',
      });
    }
  }, [usuario, reset]);

  const onSubmit = (data) => {
    // Solo incluir contraseña si se ingresó una nueva
    const datosActualizados = { ...usuario, ...data };
    if (!data.contrasena || data.contrasena.trim() === '') {
      delete datosActualizados.contrasena;
    }
    
    onGuardar(datosActualizados);
    onClose();
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const handleClose = () => {
    reset();
    setMostrarContrasena(false);
    onClose();
  };

  return (
    <Dialog open={visible} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: dialogPaperSx }}>
      <DialogTitle sx={dialogTitleSx}>
        <Box sx={dialogHeaderLeftBoxSx}>
          <EditIcon sx={{ color: '#3498db', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={dialogHeaderTitleSx}>
              Editar Información del Usuario
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              Actualice los datos del usuario según sea necesario
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ pt: 3, px: 4, pb: 2 }}>
          <Typography variant="subtitle2" sx={sectionTitleSx}>
            Información del Usuario
          </Typography>

          <Grid container spacing={3}>
            {/* Nombre de Usuario */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="nombre_usuario"
                control={control}
                rules={{ 
                  required: 'El nombre de usuario es requerido',
                  minLength: {
                    value: 3,
                    message: 'El nombre de usuario debe tener al menos 3 caracteres'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre de Usuario"
                    fullWidth
                    size="medium"
                    error={!!errors.nombre_usuario}
                    helperText={errors.nombre_usuario?.message}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PersonOutlineIcon color="action" /></InputAdornment>
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            {/* Rol */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="rol"
                control={control}
                rules={{ required: 'El rol es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rol"
                    select
                    fullWidth
                    size="medium"
                    error={!!errors.rol}
                    helperText={errors.rol?.message}
                    sx={{ ...inputSx }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={iconWrapperSx}>
                          <AdminPanelSettingsOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {roles.map(rol => (
  <MenuItem key={rol.value} value={rol.value}>{rol.label}</MenuItem>
))}

                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ ...sectionTitleSx, mt: 4 }}>
            Credenciales de Acceso
          </Typography>

          <Grid container spacing={3}>
            {/* Nueva Contraseña */}
            <Grid item xs={12}>
              <Controller
                name="contrasena"
                control={control}
                rules={{
                  validate: (value) => {
                    if (value && value.length > 0 && value.length < 6) {
                      return 'La contraseña debe tener al menos 6 caracteres';
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nueva Contraseña (opcional)"
                    type={mostrarContrasena ? 'text' : 'password'}
                    fullWidth
                    size="medium"
                    error={!!errors.contrasena}
                    helperText={errors.contrasena?.message || 'Deje vacío si no desea cambiar la contraseña'}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={toggleMostrarContrasena}
                            edge="end"
                          >
                            {mostrarContrasena ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={dialogActionsSx}>
          <Button onClick={handleClose} variant="outlined" sx={cancelButtonSx}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" startIcon={<SaveIcon />} sx={saveButtonSx}>
            Guardar Cambios
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
