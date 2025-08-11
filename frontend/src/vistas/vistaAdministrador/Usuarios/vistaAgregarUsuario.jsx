import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  IconButton,
  Alert,
  AlertTitle,
} from '@mui/material';

// Iconos
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';

import * as usuarioService from '../../../../servicios/serviciosAdmin/serviciosUsuarios.js';
import estilosVistaAgregarUsuario from '../../estilosVistas/estilosUsuario/estiloAgregarUsuario.js';

const VistaAgregarUsuario = ({ onUsuarioAgregado }) => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasena: '',
    confirmar_contrasena: '',
    rol: '',
    activo: true,
  });

  const [errors, setErrors] = useState({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const roles = [
    'Administrador',
    'Doctor',
    'Enfermero',
    'Recepcionista'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico del campo al cambiar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrors = {};

    // Validar nombre de usuario
    if (!formData.nombre_usuario.trim()) {
      nuevosErrors.nombre_usuario = 'El nombre de usuario es obligatorio';
    } else if (formData.nombre_usuario.length < 3) {
      nuevosErrors.nombre_usuario = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    // Validar contraseña
    if (!formData.contrasena) {
      nuevosErrors.contrasena = 'La contraseña es obligatoria';
    } else if (formData.contrasena.length < 6) {
      nuevosErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmar_contrasena) {
      nuevosErrors.confirmar_contrasena = 'Debe confirmar la contraseña';
    } else if (formData.contrasena !== formData.confirmar_contrasena) {
      nuevosErrors.confirmar_contrasena = 'Las contraseñas no coinciden';
    }

    // Validar rol
    if (!formData.rol) {
      nuevosErrors.rol = 'Debe seleccionar un rol';
    }

    setErrors(nuevosErrors);
    return Object.keys(nuevosErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      const datosUsuario = {
        nombre_usuario: formData.nombre_usuario.trim(),
        contrasena: formData.contrasena,
        rol: formData.rol,
        activo: formData.activo,
      };

      await usuarioService.create(datosUsuario);
      
      // Limpiar formulario
      setFormData({
        nombre_usuario: '',
        contrasena: '',
        confirmar_contrasena: '',
        rol: '',
        activo: true,
      });
      setErrors({});

      // Notificar al componente padre
      if (onUsuarioAgregado) {
        onUsuarioAgregado();
      }

    } catch (err) {
      setError(`Error al registrar usuario: ${err.message}`);
    } finally {
      setEnviando(false);
    }
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const toggleMostrarConfirmarContrasena = () => {
    setMostrarConfirmarContrasena(!mostrarConfirmarContrasena);
  };

  return (
    <Card elevation={2} sx={estilosVistaAgregarUsuario.card}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon color="primary" />
            <Typography variant="h6" component="h2" fontWeight={600}>
              Agregar Nuevo Usuario
            </Typography>
          </Box>
        }
        sx={estilosVistaAgregarUsuario.cardHeader}
      />
      <CardContent>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Información del Usuario */}
            <Grid item xs={12}>
              <Typography 
                variant="subtitle2" 
                sx={estilosVistaAgregarUsuario.formTitle}
              >
                Información del Usuario
              </Typography>
            </Grid>

            {/* Nombre de Usuario */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="nombre_usuario"
                label="Nombre de Usuario *"
                value={formData.nombre_usuario}
                onChange={handleChange}
                error={!!errors.nombre_usuario}
                helperText={errors.nombre_usuario}
                sx={estilosVistaAgregarUsuario.textField}
                InputProps={{
                  sx: estilosVistaAgregarUsuario.inputProps,
                }}
                placeholder="Ingrese el nombre de usuario"
              />
            </Grid>

            {/* Rol */}
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                error={!!errors.rol}
                sx={estilosVistaAgregarUsuario.textField}
              >
                <InputLabel id="rol-label">Rol *</InputLabel>
                <Select
                  labelId="rol-label"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  label="Rol *"
                  sx={estilosVistaAgregarUsuario.inputProps}
                >
                  {roles.map((rol) => (
                    <MenuItem key={rol} value={rol}>
                      {rol}
                    </MenuItem>
                  ))}
                </Select>
                {errors.rol && (
                  <FormHelperText>{errors.rol}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Contraseña */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="contrasena"
                label="Contraseña *"
                type={mostrarContrasena ? 'text' : 'password'}
                value={formData.contrasena}
                onChange={handleChange}
                error={!!errors.contrasena}
                helperText={errors.contrasena}
                sx={estilosVistaAgregarUsuario.textField}
                InputProps={{
                  sx: estilosVistaAgregarUsuario.inputProps,
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
                placeholder="Ingrese la contraseña"
              />
            </Grid>

            {/* Confirmar Contraseña */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="confirmar_contrasena"
                label="Confirmar Contraseña *"
                type={mostrarConfirmarContrasena ? 'text' : 'password'}
                value={formData.confirmar_contrasena}
                onChange={handleChange}
                error={!!errors.confirmar_contrasena}
                helperText={errors.confirmar_contrasena}
                sx={estilosVistaAgregarUsuario.textField}
                InputProps={{
                  sx: estilosVistaAgregarUsuario.inputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleMostrarConfirmarContrasena}
                        edge="end"
                      >
                        {mostrarConfirmarContrasena ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Confirme la contraseña"
              />
            </Grid>

            {/* Botones */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFormData({
                      nombre_usuario: '',
                      contrasena: '',
                      confirmar_contrasena: '',
                      rol: '',
                      activo: true,
                    });
                    setErrors({});
                    setError(null);
                  }}
                  sx={estilosVistaAgregarUsuario.button}
                  disabled={enviando}
                >
                  Limpiar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={estilosVistaAgregarUsuario.buttonSubmit}
                  disabled={enviando}
                >
                  {enviando ? 'Guardando...' : 'Guardar Usuario'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default VistaAgregarUsuario;