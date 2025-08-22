import React, { useEffect } from 'react';
import {
    Dialog, DialogContent, DialogActions, DialogTitle,
    TextField, Button, Grid, Box, Typography,
    IconButton, InputAdornment, MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

// --- ICONOS ---
import CloseIcon from '@mui/icons-material/Close';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import NumbersIcon from '@mui/icons-material/Numbers';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CodeIcon from '@mui/icons-material/Code';
import StraightenIcon from '@mui/icons-material/Straighten';

// --- ESTILOS IMPORTADOS DEL EJEMPLO ---
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
        const datosActualizados = {
            ...producto,
            codigo_item: data.codigo_item.trim(),
            nombre_item: data.nombre_item.trim(),
            descripcion: data.descripcion?.trim() || null,
            categoria: data.categoria,
            unidad_medida: data.unidad_medida,
            cantidad_actual: Number(data.cantidad_actual),
            stock_minimo: Number(data.stock_minimo),
        };
        onGuardar(datosActualizados);
        onClose();
    };

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

    return (
        <Dialog open={visible} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: dialogPaperSx }}>
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
                    <Typography variant="subtitle2" sx={{ ...sectionTitleSx, color: '#27ae60' }}>
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
                                        placeholder="Ej: MED-001"
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
                                        placeholder="Ej: Paracetamol 500mg"
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
                                        label="Descripción (Opcional)"
                                        placeholder="Detalles adicionales del producto..."
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="medium"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ alignItems: 'flex-start', mt: 1 }}><DescriptionOutlinedIcon color="action" /></InputAdornment>
                                        }}
                                        sx={inputSx}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Categoría y Unidad de Medida (Layout dual) */}
                        <Grid container item xs={12} spacing={0}>
                            <Grid item xs={12} sm={6} sx={dualFieldGeneroGridSx}>
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
                                            size="medium"
                                            error={!!errors.categoria}
                                            helperText={errors.categoria?.message}
                                            sx={{ ...inputSx, width: '116%', minWidth: 220 }}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={iconWrapperSx}>
                                                        <CategoryIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
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

                            <Grid item xs={12} sm={6} sx={dualFieldTipoPacienteGridSx}>
                                <Controller
                                    name="unidad_medida"
                                    control={control}
                                    rules={{ required: 'La unidad de medida es requerida' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Unidad de Medida"
                                            select
                                            fullWidth
                                            size="medium"
                                            error={!!errors.unidad_medida}
                                            helperText={errors.unidad_medida?.message}
                                            sx={{ ...inputSx, width: '116%', minWidth: 220 }}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={iconWrapperSx}>
                                                        <StraightenIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
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
                        </Grid>
                    </Grid>

                    <Typography variant="subtitle2" sx={{ ...sectionTitleSx, mt: 4, color: '#27ae60' }}>
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
                                        placeholder="0"
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
                                    min: { value: 0, message: 'El stock no puede ser negativo' },
                                    pattern: { value: /^[0-9]+$/, message: 'Debe ser un número entero' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Stock Mínimo"
                                        type="number"
                                        placeholder="10"
                                        fullWidth
                                        size="medium"
                                        error={!!errors.stock_minimo}
                                        helperText={errors.stock_minimo?.message || 'Cantidad para alertas de stock'}
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

                    {/* Información adicional del sistema */}
                    {producto && (
                        <Box sx={{
                            p: 2,
                            bgcolor: '#f8f9fa',
                            borderRadius: 2,
                            border: '1px solid #e1e8ed',
                            mt: 3
                        }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#495057', display: 'flex', alignItems: 'center', gap: 1 }}>
                                📋 Información del Sistema
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>ID:</strong> {producto.id} • <strong>Estado:</strong> {producto.estado_stock || 'N/A'}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={dialogActionsSx}>
                    <Button onClick={onClose} variant="outlined" sx={cancelButtonSx}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{
                            ...saveButtonSx,
                            backgroundColor: '#27ae60',
                            '&:hover': {
                                backgroundColor: '#229954',
                                boxShadow: '0 6px 16px rgba(39, 174, 96, 0.4)',
                            },
                        }}
                    >
                        Guardar Cambios
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}