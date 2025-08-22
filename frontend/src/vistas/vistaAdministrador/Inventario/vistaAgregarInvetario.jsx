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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

// --- ICONOS ---
import InventoryIcon from '@mui/icons-material/Inventory';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CategoryIcon from '@mui/icons-material/Category';
import NumbersIcon from '@mui/icons-material/Numbers';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import StraightenIcon from '@mui/icons-material/Straighten';

// --- SERVICIOS Y ESTILOS ---
import * as inventarioService from '../../../../servicios/serviciosAdmin/servicioInventario.js';
import estilosVistaAgregarInventario from '../../estilosVistas/estilosInventario/estilosAgregarInventario';

// --- DATOS DE CONFIGURACIÓN ---
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
        <Card elevation={2} sx={estilosVistaAgregarInventario.card}>
            <CardHeader
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InventoryIcon color="success" />
                        <Typography variant="h6" fontWeight={600}>
                            Agregar Nuevo Producto al Inventario
                        </Typography>
                    </Box>
                }
                sx={estilosVistaAgregarInventario.cardHeader}
            />
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        {/* --- PRIMERA FILA: 4 campos iguales --- */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Controller
                                name="codigo_item"
                                control={control}
                                rules={{ required: 'El código del item es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Código del Item"
                                        placeholder="Ej: MED-001"
                                        fullWidth
                                        error={!!errors.codigo_item}
                                        helperText={errors.codigo_item?.message}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><CodeIcon color="action" /></InputAdornment>,
                                        }}
                                        sx={estilosVistaAgregarInventario.textField}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Controller
                                name="nombre_item"
                                control={control}
                                rules={{ required: 'El nombre del item es requerido' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nombre del Item"
                                        placeholder="Ej: Paracetamol 500mg"
                                        fullWidth
                                        error={!!errors.nombre_item}
                                        helperText={errors.nombre_item?.message}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Inventory2Icon color="action" /></InputAdornment>,
                                        }}
                                        sx={estilosVistaAgregarInventario.textField}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Controller
                                name="categoria"
                                control={control}
                                rules={{ required: 'La categoría es requerida' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Categoría"
                                        select
                                        fullWidth
                                        error={!!errors.categoria}
                                        helperText={errors.categoria?.message}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><CategoryIcon color="action" /></InputAdornment>,
                                        }}
                                        sx={estilosVistaAgregarInventario.textField}
                                    >
                                        {categorias.map((cat) => (
                                            <MenuItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Controller
                                name="unidad_medida"
                                control={control}
                                rules={{ required: 'La unidad es requerida' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Unidad de Medida"
                                        select
                                        fullWidth
                                        error={!!errors.unidad_medida}
                                        helperText={errors.unidad_medida?.message}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><StraightenIcon color="action" /></InputAdornment>,
                                        }}
                                        sx={estilosVistaAgregarInventario.textField}
                                    >
                                        {unidadesMedida.map((unidad) => (
                                            <MenuItem key={unidad} value={unidad}>
                                                {unidad}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* --- SEGUNDA FILA: 3 campos iguales --- */}
                        <Grid item xs={12} sm={4} md={4}>
                            <Controller
                                name="cantidad_actual"
                                control={control}
                                rules={{
                                    required: 'La cantidad es requerida',
                                    min: { value: 0, message: 'No puede ser negativa' },
                                    pattern: { value: /^[0-9]+$/, message: 'Debe ser un número' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Cantidad Inicial"
                                        type="number"
                                        placeholder="0"
                                        fullWidth
                                        error={!!errors.cantidad_actual}
                                        helperText={errors.cantidad_actual?.message}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><NumbersIcon color="action" /></InputAdornment>,
                                            inputProps: { min: 0, step: 1 },
                                        }}
                                        sx={estilosVistaAgregarInventario.textField}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Controller
                                name="stock_minimo"
                                control={control}
                                rules={{
                                    required: 'El stock mínimo es requerido',
                                    min: { value: 0, message: 'No puede ser negativa' },
                                    pattern: { value: /^[0-9]+$/, message: 'Debe ser un número' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Stock Mínimo"
                                        type="number"
                                        placeholder="10"
                                        fullWidth
                                        error={!!errors.stock_minimo}
                                        helperText={errors.stock_minimo?.message || 'Cantidad para alertas'}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><NumbersIcon color="action" /></InputAdornment>,
                                            inputProps: { min: 0, step: 1 },
                                        }}
                                        sx={estilosVistaAgregarInventario.textField}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Controller
                                name="descripcion"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Descripción (Opcional)"
                                        placeholder="Detalles adicionales..."
                                        fullWidth
                                        multiline
                                        rows={1}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><DescriptionOutlinedIcon color="action" /></InputAdornment>,
                                        }}
                                        sx={estilosVistaAgregarInventario.textField}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{
                        p: 2,
                        bgcolor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e1e8ed',
                        my: 4
                    }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#495057', display: 'flex', alignItems: 'center', gap: 1 }}>
                            📝 Información Importante
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div">
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '4px' }}>El <b>código del item</b> debe ser único en el sistema.</li>
                                <li style={{ marginBottom: '4px' }}>El <b>stock mínimo</b> se usa para generar alertas automáticas.</li>
                                <li>La <b>descripción</b> es opcional pero recomendada para mejor identificación.</li>
                            </ul>
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ClearIcon />}
                            onClick={limpiarFormulario}
                            sx={estilosVistaAgregarInventario.button}
                        >
                            Limpiar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={guardando}
                            sx={estilosVistaAgregarInventario.buttonSubmit}
                        >
                            {guardando ? 'Guardando...' : 'Agregar Producto'}
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );
}