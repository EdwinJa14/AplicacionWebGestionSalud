import React, { useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions, DialogTitle,
  TextField, Button, Grid, Box, Typography,
  IconButton, InputAdornment, MenuItem, FormControl,
  InputLabel, Select,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import CloseIcon from '@mui/icons-material/Close';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import NumbersIcon from '@mui/icons-material/Numbers';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CodeIcon from '@mui/icons-material/Code';

// Importar estilos (asumiendo que existen)
import {
  inputSx,
  dialogPaperSx,
  dialogTitleSx,
  dialogHeaderLeftBoxSx,
  dialogHeaderTitleSx,
  dialogActionsSx,
  cancelButtonSx,
  saveButtonSx,
  sectionTitleSx,
} from '../../estilosComponentes/estilosModales/estilosModalEditarPaciente';

export default function ModalEditarInventario({ visible, producto, onClose, onGuardar }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      codigo_item: '',
      nombre_item: '',
      descripcion: '',
      categoria: '',
      unidad_medida: '',
      cantidad_actual: '',
      stock_minimo: '',
    }
  });

  useEffect(() => {
    if (producto) {
      reset({
        codigo_item: producto.codigo_item || '',
        nombre_item: producto.nombre_item || '',
        descripcion: producto.descripcion || '',
        categoria: producto.categoria || '',
        unidad_medida: producto.unidad_medida || '',
        cantidad_actual: producto.cantidad_actual != null ? producto.cantidad_actual : '',
        stock_minimo: producto.stock_minimo != null ? producto.stock_minimo : '',
      });
    }
  }, [producto, reset]);

  const onSubmit = (data) => {
    // Convertir números y preparar datos
    const datosActualizados = {
      ...producto,
      codigo_item: data.codigo_item.trim(),
      nombre_item: data.nombre_item.trim(),
      descripcion: data.descripcion?.trim() || null,
      categoria: data.categoria,
      unidad_medida: data.unidad_medida.trim(),
      cantidad_actual: Number(data.cantidad_actual),
      stock_minimo: Number(data.stock_minimo),
    };
    
    onGuardar(datosActualizados);
  };

  // Categorías disponibles según el modelo
  const categorias = [
    { value: 'Medicamento', label: 'Medicamento' },
    { value: 'Material_Medico', label: 'Material Médico' },
    { value: 'Insumo', label: 'Insumo' },
    { value: 'Equipo', label: 'Equipo' },
  ];

  // Unidades de medida comunes
  const unidadesMedida = [
    'Unidad', 'Caja', 'Frasco', 'Ampolla', 'Tableta', 'Cápsula',
    'ml', 'L', 'mg', 'g', 'kg', 'Sobre', 'Tubo', 'Rollo'
  ];

  return (
    <Dialog open={visible} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: dialogPaperSx }}>
      <DialogTitle sx={dialogTitleSx}>
        <Box sx={dialogHeaderLeftBoxSx}>
          <EditIcon sx={{ color: '#27ae60', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={dialogHeaderTitleSx}>
              Editar Producto de Inventario
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              Actualice la información del producto en inventario
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
            Información Básica
          </Typography>

          <Grid container spacing={3}>
            {/* Código del Item */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="codigo_item"
                control={control}
                rules={{ required: 'El código del item es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Código del Item"
                    fullWidth
                    size="medium"
                    error={!!errors.codigo_item}
                    helperText={errors.codigo_item?.message}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><CodeIcon color="action" /></InputAdornment>
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            {/* Nombre del Item */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="nombre_item"
                control={control}
                rules={{ required: 'El nombre del item es requerido' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre del Item"
                    fullWidth
                    size="medium"
                    error={!!errors.nombre_item}
                    helperText={errors.nombre_item?.message}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Inventory2Icon color="action" /></InputAdornment>
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción"
                    fullWidth
                    size="medium"
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><DescriptionOutlinedIcon color="action" /></InputAdornment>
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            {/* Categoría */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="categoria"
                control={control}
                rules={{ required: 'La categoría es requerida' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.categoria}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      {...field}
                      label="Categoría"
                      size="medium"
                      sx={inputSx}
                    >
                      {categorias.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categoria && (
                      <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                        {errors.categoria.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Unidad de Medida */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="unidad_medida"
                control={control}
                rules={{ required: 'La unidad de medida es requerida' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.unidad_medida}>
                    <InputLabel>Unidad de Medida</InputLabel>
                    <Select
                      {...field}
                      label="Unidad de Medida"
                      size="medium"
                      sx={inputSx}
                    >
                      {unidadesMedida.map((unidad) => (
                        <MenuItem key={unidad} value={unidad}>
                          {unidad}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.unidad_medida && (
                      <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                        {errors.unidad_medida.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ ...sectionTitleSx, mt: 3 }}>
            Control de Stock
          </Typography>

          <Grid container spacing={3}>
            {/* Cantidad Actual */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="cantidad_actual"
                control={control}
                rules={{
                  required: 'La cantidad actual es requerida',
                  min: { value: 0, message: 'La cantidad no puede ser negativa' },
                  pattern: { value: /^[0-9]+$/, message: 'Debe ser un número entero' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cantidad Actual"
                    type="number"
                    fullWidth
                    size="medium"
                    error={!!errors.cantidad_actual}
                    helperText={errors.cantidad_actual?.message}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><NumbersIcon color="action" /></InputAdornment>,
                      inputProps: { min: 0, step: 1 },
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            {/* Stock Mínimo */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="stock_minimo"
                control={control}
                rules={{
                  required: 'El stock mínimo es requerido',
                  min: { value: 0, message: 'El stock mínimo no puede ser negativo' },
                  pattern: { value: /^[0-9]+$/, message: 'Debe ser un número entero' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Stock Mínimo"
                    type="number"
                    fullWidth
                    size="medium"
                    error={!!errors.stock_minimo}
                    helperText={errors.stock_minimo?.message || 'Cantidad mínima para alertas de stock'}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><NumbersIcon color="action" /></InputAdornment>,
                      inputProps: { min: 0, step: 1 },
                    }}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Información adicional del producto */}
          {producto && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Información del Sistema
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    ID: {producto.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Estado: {producto.estado_stock || 'Calculando...'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
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