import React, { useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions, DialogTitle,
  TextField, Button, Grid, MenuItem, Box, Typography,
  IconButton, InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
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
} from '../../estilosComponentes/estilosModales/estilosModalEditarPersona';

// Cargos por defecto en caso de que no se pasen como prop
const cargosDefault = ['Médico General', 'Enfermera Jefe', 'Administradora', 'Enfermero', 'Auxiliar', 'Otro'];

export default function ModalEditarPersonal({ 
  open, 
  onClose, 
  persona, 
  onGuardar, 
  cargos = cargosDefault, // Usar cargos por defecto si no se pasan
  guardando 
}) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombres: '',
      apellidos: '',
      cargo: 'Médico General',
      dpi: '',
      telefono: '',
    }
  });

  useEffect(() => {
    if (persona) {
      reset({
        nombres: persona.nombres || '',
        apellidos: persona.apellidos || '',
        cargo: persona.cargo || '',
        dpi: persona.dpi || '',
        telefono: persona.telefono || '',
      });
    }
  }, [persona, reset]);

  const onSubmit = (data) => {
    onGuardar({ ...persona, ...data });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: dialogPaperSx }}>
      <DialogTitle sx={dialogTitleSx}>
        <Box sx={dialogHeaderLeftBoxSx}>
          <EditIcon sx={{ color: '#3498db', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={dialogHeaderTitleSx}>
              Editar Información del Personal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              Actualice los datos del personal según sea necesario
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

            {/* DPI */}
            <Grid item xs={12} sm={6}>
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
                    fullWidth
                    size="medium"
                    error={!!errors.dpi}
                    helperText={errors.dpi?.message}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon color="action" /></InputAdornment>
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

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

            {/* Cargo - Toma todo el ancho disponible */}
            <Grid item xs={12}>
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
                    sx={inputSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={iconWrapperSx}>
                          <WorkOutlineIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {cargos.map(cargo => (
                      <MenuItem key={cargo} value={cargo}>{cargo}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={dialogActionsSx}>
          <Button onClick={onClose} variant="outlined" sx={cancelButtonSx}>
            Cancelar
          </Button>

          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<SaveIcon />} 
            disabled={guardando} 
            sx={saveButtonSx}
          >
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}