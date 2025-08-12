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

import InventoryIcon from '@mui/icons-material/Inventory';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CategoryIcon from '@mui/icons-material/Category';
import NumbersIcon from '@mui/icons-material/Numbers';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

import * as inventarioService from '../../../../servicios/serviciosAdmin/servicioInventario.js';

const categorias = [
  { value: 'Medicamento', label: 'Medicamento' },
  { value: 'Material_Medico', label: 'Material Médico' },
  { value: 'Insumo', label: 'Insumo' },
  { value: 'Equipo', label: 'Equipo' },
];

const unidadesMedida = [
  'Unidad', 'Caja', 'Frasco', 'Ampolla', 'Tableta', 'Cápsula',
  'ml', 'L', 'mg', 'g', 'kg', 'Sobre', 'Tubo', 'Rollo'
];

export default function VistaAgregarInventario({ onProductoAgregado }) {
  const [guardando, setGuardando] = useState(false);

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      codigo_item: '',
      nombre_item: '',
      descripcion: '',
      categoria: 'Medicamento',
      unidad_medida: 'Unidad',
      cantidad_actual: '',
      stock_minimo: '10',
    }
  });

  const onSubmit = async (data) => {
    try {
      setGuardando(true);
      
      // Convertir números y limpiar datos
      const datosInventario = {
        codigo_item: data.codigo_item.trim(),
        nombre_item: data.nombre_item.trim(),
        descripcion: data.descripcion?.trim() || null,
        categoria: data.categoria,
        unidad_medida: data.unidad_medida,
        cantidad_actual: Number(data.cantidad_actual),
        stock_minimo: Number(data.stock_minimo),
      };

      await inventarioService.create(datosInventario);
      reset();
      
      // Notificar al componente padre para que recargue la lista y muestre el mensaje
      if (onProductoAgregado) {
        onProductoAgregado();
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar producto: ' + error.message);
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
              <InventoryIcon color="success" />
              <Typography variant="h6" fontWeight={600}>
                Agregar Nuevo Producto al Inventario
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
            {/* Información Básica del Producto */}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: '#27ae60',
                mb: 2,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: 1,
              }}
            >
              Información Básica del Producto
            </Typography>

            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="codigo_item"
                  control={control}
                  rules={{ required: 'El código del item es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Código del Item"
                      placeholder="Ejemplo: MED-001, INS-025"
                      size="medium"
                      fullWidth
                      error={!!errors.codigo_item}
                      helperText={errors.codigo_item?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CodeIcon color="action" />
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
                  name="nombre_item"
                  control={control}
                  rules={{ required: 'El nombre del item es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre del Item"
                      placeholder="Ejemplo: Paracetamol 500mg"
                      size="medium"
                      fullWidth
                      error={!!errors.nombre_item}
                      helperText={errors.nombre_item?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Inventory2Icon color="action" />
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
                  name="categoria"
                  control={control}
                  rules={{ required: 'La categoría es requerida' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Categoría"
                      select
                      size="medium"
                      fullWidth
                      error={!!errors.categoria}
                      helperText={errors.categoria?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryIcon color="action" />
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
                    >
                      {categorias.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value} sx={{ fontSize: '1rem' }}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="descripcion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descripción"
                      placeholder="Descripción detallada del producto (opcional)"
                      size="medium"
                      fullWidth
                      multiline
                      rows={3}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { 
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

            {/* Control de Stock */}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: '#27ae60',
                mb: 2,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: 1,
              }}
            >
              Control de Stock y Unidades
            </Typography>

            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="unidad_medida"
                  control={control}
                  rules={{ required: 'La unidad de medida es requerida' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Unidad de Medida"
                      select
                      size="medium"
                      fullWidth
                      error={!!errors.unidad_medida}
                      helperText={errors.unidad_medida?.message}
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
                      {unidadesMedida.map((unidad) => (
                        <MenuItem key={unidad} value={unidad} sx={{ fontSize: '1rem' }}>
                          {unidad}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="cantidad_actual"
                  control={control}
                  rules={{
                    required: 'La cantidad inicial es requerida',
                    min: { value: 0, message: 'La cantidad no puede ser negativa' },
                    pattern: { value: /^[0-9]+$/, message: 'Debe ser un número entero' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cantidad Inicial"
                      type="number"
                      placeholder="0"
                      size="medium"
                      fullWidth
                      error={!!errors.cantidad_actual}
                      helperText={errors.cantidad_actual?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NumbersIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { 
                          height: 56,
                          fontSize: '1rem'
                        },
                        inputProps: { min: 0, step: 1 },
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

              <Grid item xs={12} sm={6} md={3}>
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
                      placeholder="10"
                      size="medium"
                      fullWidth
                      error={!!errors.stock_minimo}
                      helperText={errors.stock_minimo?.message || 'Cantidad mínima para alertas'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NumbersIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { 
                          height: 56,
                          fontSize: '1rem'
                        },
                        inputProps: { min: 0, step: 1 },
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

            {/* Información Adicional */}
            <Box sx={{ 
              p: 3, 
              bgcolor: '#f8f9fa', 
              borderRadius: 2, 
              border: '1px solid #e1e8ed',
              mb: 4 
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#495057' }}>
                📝 Información Importante
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • El código del item debe ser único en el sistema
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • El stock mínimo se usa para generar alertas automáticas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • La descripción es opcional pero recomendada para mejor identificación
              </Typography>
            </Box>

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
                  color: '#27ae60',
                  borderColor: '#27ae60',
                  '&:hover': {
                    borderColor: '#1e8449',
                    backgroundColor: 'rgba(39, 174, 96, 0.08)',
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
                  backgroundColor: '#27ae60',
                  boxShadow: '0 4px 12px rgba(39, 174, 96, 0.4)',
                  '&:hover': {
                    backgroundColor: '#1e8449',
                  },
                  '&:disabled': {
                    backgroundColor: '#95a5a6',
                  },
                }}
              >
                {guardando ? 'Guardando...' : 'Agregar Producto'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
}