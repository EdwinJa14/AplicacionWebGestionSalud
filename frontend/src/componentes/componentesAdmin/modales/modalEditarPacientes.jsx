import React, { useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions, DialogTitle,
  TextField, Button, Grid, MenuItem, Box, Typography,
  IconButton, InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import {
  inputSx,
  iconWrapperSx,
  dialogPaperSx,
  dialogTitleSx,
  dialogHeaderLeftBoxSx,
  dialogHeaderTitleSx,
  sectionTitleSx,
  dualFieldGeneroGridSx,
  dualFieldTipoPacienteGridSx,
  dialogActionsSx,
  cancelButtonSx,
  saveButtonSx,
} from '../../estilosComponentes/estilosModales/estilosModalEditarPaciente';

const generos = ['Masculino', 'Femenino', 'Otro'];
const tiposPaciente = ['General', 'Cronico', 'Prenatal'];

export default function ModalEditarPaciente({ visible, paciente, onClose, onGuardar }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombres: '',
      apellidos: '',
      dpi: '', // CAMBIADO: de documento_identificacion a dpi
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
        dpi: paciente.dpi || '', // CAMBIADO: de documento_identificacion a dpi
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
    <Dialog open={visible} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: dialogPaperSx }}>
      <DialogTitle sx={dialogTitleSx}>
        <Box sx={dialogHeaderLeftBoxSx}>
          <EditIcon sx={{ color: '#3498db', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={dialogHeaderTitleSx}>
              Editar Información del Paciente
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              Actualice los datos del paciente según sea necesario
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ pt: 3, px: 4, pb: 2 }}>
          <Typography variant="subtitle2" sx={sectionTitleSx}>
            Información Personal
          </Typography>

          <Grid container spacing={3}>
            {/* Nombres */}
            <Grid item xs={12} sm={6}>
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
                      startAdornment: <InputAdornment position="start"><PersonOutlineIcon color="action" /></InputAdornment>
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            {/* Apellidos */}
            <Grid item xs={12} sm={6}>
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
                      startAdornment: <InputAdornment position="start"><PersonOutlineIcon color="action" /></InputAdornment>
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            {/* Documento - CAMPO CORREGIDO */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="dpi" // CAMBIADO: de documento_identificacion a dpi
                control={control}
                rules={{ required: 'El DPI es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="DPI / Documento"
                    fullWidth
                    size="medium"
                    error={!!errors.dpi} // CAMBIADO: de documento_identificacion a dpi
                    helperText={errors.dpi?.message} // CAMBIADO: de documento_identificacion a dpi
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon color="action" /></InputAdornment>
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            {/* Fecha de Nacimiento */}
            <Grid item xs={12} sm={6}>
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
                      )
                    }}
                    sx={{ ...inputSx, width: '120%', minWidth: '200px' }}
                  />
                )}
              />
            </Grid>

            {/* Género y Tipo Paciente */}
            <Grid container item xs={12} spacing={0}>
              <Grid item xs={12} sm={6} sx={dualFieldGeneroGridSx}>
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
                      sx={{ ...inputSx, width: '116%', minWidth: 220 }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={iconWrapperSx}>
                            {/* Espacio reservado */}
                          </InputAdornment>
                        ),
                      }}
                    >
                      {generos.map(g => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={dualFieldTipoPacienteGridSx}>
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
                      sx={{ ...inputSx, width: '116%', minWidth: 220 }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={iconWrapperSx}>
                            {/* Espacio reservado */}
                          </InputAdornment>
                        ),
                      }}
                    >
                      {tiposPaciente.map(tp => (
                        <MenuItem key={tp} value={tp}>{tp}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ ...sectionTitleSx, mt: 4 }}>
            Datos de Contacto
          </Typography>

          <Grid container spacing={3}>
            {/* Teléfono */}
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
                      startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon color="action" /></InputAdornment>
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            {/* Dirección */}
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
                      startAdornment: <InputAdornment position="start"><HomeOutlinedIcon color="action" /></InputAdornment>
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={dialogActionsSx}>
          <Button onClick={onClose} variant="outlined" sx={cancelButtonSx}>
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