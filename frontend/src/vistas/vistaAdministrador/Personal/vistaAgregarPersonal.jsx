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

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

import * as personalService from '../../../../servicios/serviciosAdmin/servicioPersonal.js';
import estilosVistaAgregarPersonal from '../../estilosVistas/estiloVistaAdministrador/estilosPesonal/estilosAgregarPersonal.js';

// Datos de configuración
const cargos = ['Médico General', 'Enfermera Jefe', 'Administradora', 'Enfermero', 'Auxiliar', 'Otro'];

export default function VistaAgregarPersonal({ onPersonalAgregado }) {
  const [guardando, setGuardando] = useState(false);

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombres: '',
      apellidos: '',
      cargo: 'Médico General',
      dpi: '',
      telefono: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      setGuardando(true);
      // Enviar solo los datos necesarios, estado será true por defecto en backend
      await personalService.create(data);
      reset();
      if (onPersonalAgregado) {
        onPersonalAgregado();
      }
    } catch (error) {
      console.error('Error al guardar personal:', error);
      alert('Error al guardar personal: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const limpiarFormulario = () => {
    reset();
  };

  return (
    <Card elevation={2} sx={estilosVistaAgregarPersonal.card}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupAddIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Registrar Nuevo Personal
            </Typography>
          </Box>
        }
        sx={estilosVistaAgregarPersonal.cardHeader}
      />
      <CardContent sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Información Personal */}
          <Typography variant="subtitle2" sx={estilosVistaAgregarPersonal.formTitle}>
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
                      sx: estilosVistaAgregarPersonal.inputProps,
                    }}
                    sx={estilosVistaAgregarPersonal.textField}
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
                      sx: estilosVistaAgregarPersonal.inputProps,
                    }}
                    sx={estilosVistaAgregarPersonal.textField}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="cargo"
                control={control}
                rules={{ required: 'El cargo es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cargo"
                    select
                    size="medium"
                    fullWidth
                    error={!!errors.cargo}
                    helperText={errors.cargo?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkOutlineIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: estilosVistaAgregarPersonal.inputProps,
                    }}
                    sx={estilosVistaAgregarPersonal.textField}
                  >
                    {cargos.map((cargo) => (
                      <MenuItem key={cargo} value={cargo} sx={{ fontSize: '1rem' }}>
                        {cargo}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          {/* Información de Identificación y Contacto */}
          <Typography variant="subtitle2" sx={estilosVistaAgregarPersonal.formTitle}>
            Identificación y Contacto
          </Typography>

          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="dpi"
                control={control}
                rules={{
                  required: 'El DPI es requerido',
                  pattern: {
                    value: /^\d{13}$/,
                    message: 'El DPI debe tener 13 dígitos',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="DPI"
                    placeholder="Ejemplo: 1234567890101"
                    size="medium"
                    fullWidth
                    error={!!errors.dpi}
                    helperText={errors.dpi?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: estilosVistaAgregarPersonal.inputProps,
                    }}
                    sx={estilosVistaAgregarPersonal.textField}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
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
                      sx: estilosVistaAgregarPersonal.inputProps,
                    }}
                    sx={estilosVistaAgregarPersonal.textField}
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
              sx={estilosVistaAgregarPersonal.button}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={guardando}
              sx={estilosVistaAgregarPersonal.buttonSubmit}
            >
              {guardando ? 'Guardando...' : 'Guardar Personal'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}