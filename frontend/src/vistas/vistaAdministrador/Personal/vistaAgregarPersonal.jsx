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
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

import * as personalService from '../../../../servicios/serviciosAdmin/servicioPersonal.js';
import estilosVistaAgregarPersonal from '../../estilosVistas/estilosPesonal/estilosAgregarPersonal';

// Datos de configuración
const cargos = ['Doctor', 'Enfermero', 'Administrador', 'Recepcionista', 'Técnico', 'Otro'];
const estados = ['Activo', 'Inactivo'];

export default function VistaAgregarPersonal({ onPersonalAgregado }) {
  const [guardando, setGuardando] = useState(false);

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

  const onSubmit = async (data) => {
    try {
      setGuardando(true);
      const dataToSend = { ...data, estado: data.estado === 'Activo' };
      await personalService.create(dataToSend);
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

            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="estado"
                control={control}
                rules={{ required: 'El estado es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estado"
                    select
                    size="medium"
                    fullWidth
                    error={!!errors.estado}
                    helperText={errors.estado?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: estilosVistaAgregarPersonal.inputProps,
                    }}
                    sx={estilosVistaAgregarPersonal.textField}
                  >
                    {estados.map((estado) => (
                      <MenuItem key={estado} value={estado} sx={{ fontSize: '1rem' }}>
                        {estado}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          {/* Datos de Contacto */}
          <Typography variant="subtitle2" sx={estilosVistaAgregarPersonal.formTitle}>
            Datos de Contacto
          </Typography>

          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    placeholder="Ejemplo: juan.perez@email.com"
                    size="medium"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon color="action" />
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
