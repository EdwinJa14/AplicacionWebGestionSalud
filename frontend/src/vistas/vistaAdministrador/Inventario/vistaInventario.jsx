import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Chip,
    CircularProgress,
    Alert,
    AlertTitle,
    IconButton,
    Tooltip,
    Snackbar,
    Button,
    Collapse,
    Divider,
    Fade,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';

import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SwapVertIcon from '@mui/icons-material/SwapVert';

import * as inventarioService from '../../../../servicios/serviciosAdmin/servicioInventario.js';
import ModalEditarInventario from '../../../componentes/componentesAdmin/modales/modalEditarInventario.jsx';
import VistaAgregarInventario from './vistaAgregarInvetario.jsx';

export default function VistaInventario() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [productoAEditar, setProductoAEditar] = useState(null);

    const [metodoInventario, setMetodoInventario] = useState('PEPS');

    const [notificacion, setNotificacion] = useState({
        open: false,
        mensaje: '',
        tipo: 'success',
    });

    useEffect(() => {
        cargarProductos();
    }, [metodoInventario]);

    const cargarProductos = async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await inventarioService.getAllByMetodo(metodoInventario);
            setProductos(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(`Error al cargar productos: ${err.message}`);
        } finally {
            setTimeout(() => setCargando(false), 500);
        }
    };

    const abrirModalEditar = (producto) => {
        setProductoAEditar(producto);
        setMostrarModalEditar(true);
    };

    const guardarEdicionProducto = async (datosEditados) => {
        try {
            await inventarioService.update(datosEditados.id, datosEditados);
            setMostrarModalEditar(false);
            await cargarProductos();
            mostrarNotificacion('Producto actualizado exitosamente', 'success');
        } catch (error) {
            mostrarNotificacion('Error al actualizar producto: ' + error.message, 'error');
        }
    };

    const handleEliminar = async (id, nombre) => {
        if (window.confirm(`¿Seguro que desea marcar como inactivo el producto ${nombre}?`)) {
            try {
                await inventarioService.remove(id);
                await cargarProductos();
                mostrarNotificacion(`${nombre} ha sido marcado como inactivo`, 'info');
            } catch (error) {
                mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
            }
        }
    };

    const handleProductoAgregado = async () => {
        await cargarProductos();
        mostrarNotificacion('Producto agregado exitosamente al inventario', 'success');
    };

    const mostrarNotificacion = (mensaje, tipo = 'success') => {
        setNotificacion({ open: true, mensaje, tipo });
    };

    const cerrarNotificacion = () => {
        setNotificacion({ ...notificacion, open: false });
    };

    const handleCambioMetodoInventario = (evento, nuevoMetodo) => {
        if (nuevoMetodo !== null) {
            setMetodoInventario(nuevoMetodo);
            mostrarNotificacion(`Inventario cambiado a método ${nuevoMetodo}`, 'info');
        }
    };

    const getEstadoStockColor = (estadoStock) => {
        switch (estadoStock) {
            case 'Stock Normal':
                return 'success';
            case 'Stock Bajo':
                return 'warning';
            case 'Agotado':
                return 'error';
            default:
                return 'default';
        }
    };

    const getCategoriaColor = (categoria) => {
        switch (categoria) {
            case 'Medicamento':
                return 'primary';
            case 'Material_Medico':
                return 'secondary';
            case 'Insumo':
                return 'info';
            case 'Equipo':
                return 'success';
            default:
                return 'default';
        }
    };

    // Renderizado condicional: si está cargando, muestra el spinner en el centro de la pantalla
    if (cargando) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#f5f7fa'
                }}
            >
                <CircularProgress size={60} sx={{ color: '#27ae60' }} />
                <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                    Cargando inventario...
                </Typography>
            </Box>
        );
    }

    // Si ya no está cargando, muestra la interfaz principal
    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa', p: { xs: 2, md: 4 } }}>
            {/* Header Principal sin el botón de agregar */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            color: '#2c3e50',
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <InventoryIcon sx={{ fontSize: 40, color: '#27ae60' }} />
                        Módulo de Inventario
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Gestione todos los productos del inventario médico
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={cargarProductos}
                        disabled={cargando}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            py: 1.5,
                        }}
                    >
                        Actualizar
                    </Button>
                </Box>
            </Box>

            {/* Mensaje de Error */}
            {error && (
                <Fade in={!!error}>
                    <Alert
                        severity="error"
                        sx={{ mb: 3, borderRadius: 2 }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={cargarProductos}
                                variant="outlined"
                            >
                                Reintentar
                            </Button>
                        }
                    >
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                </Fade>
            )}

            {/* Formulario de Agregar Producto, siempre visible */}
            <Collapse in={true} timeout={500}>
                <Box sx={{ mb: 4 }}>
                    <VistaAgregarInventario onProductoAgregado={handleProductoAgregado} />
                    <Divider sx={{ mt: 4, mb: 2 }} />
                </Box>
            </Collapse>

            {/* Modal de Edición */}
            <ModalEditarInventario
                visible={mostrarModalEditar}
                producto={productoAEditar}
                onClose={() => setMostrarModalEditar(false)}
                onGuardar={guardarEdicionProducto}
            />

            {/* Estado Vacío */}
            {!error && productos.length === 0 && (
                <Fade in={!error && productos.length === 0}>
                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid #e1e8ed',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            textAlign: 'center',
                            py: 8,
                        }}
                    >
                        <CardContent>
                            <InventoryIcon sx={{ fontSize: 80, color: '#bdc3c7', mb: 3 }} />
                            <Typography variant="h5" color="text.secondary" gutterBottom fontWeight={600}>
                                No hay productos en inventario
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                                El inventario está vacío. Comience agregando productos al sistema usando el formulario de arriba.
                            </Typography>
                        </CardContent>
                    </Card>
                </Fade>
            )}

            {/* Selector de Método de Inventario y Tabla de Productos */}
            {!error && productos.length > 0 && (
                <Fade in={!error && productos.length > 0}>
                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid #e1e8ed',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                    >
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <InventoryIcon color="success" />
                                        <Typography variant="h6" component="h2" fontWeight={600}>
                                            Productos en Inventario
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Chip
                                            label={`${productos.length} productos`}
                                            color="success"
                                            variant="outlined"
                                            size="small"
                                        />
                                        {productos.filter(p => p.estado_stock === 'Stock Bajo').length > 0 && (
                                            <Chip
                                                label={`${productos.filter(p => p.estado_stock === 'Stock Bajo').length} con stock bajo`}
                                                color="warning"
                                                size="small"
                                            />
                                        )}
                                        {productos.filter(p => p.estado_stock === 'Agotado').length > 0 && (
                                            <Chip
                                                label={`${productos.filter(p => p.estado_stock === 'Agotado').length} agotados`}
                                                color="error"
                                                size="small"
                                            />
                                        )}
                                    </Box>
                                </Box>
                            }
                            sx={{
                                backgroundColor: '#f8f9fa',
                                borderBottom: '1px solid #e1e8ed',
                                py: 2,
                            }}
                        />

                        <Box sx={{
                            p: 3,
                            backgroundColor: '#fafbfc',
                            borderBottom: '1px solid #e1e8ed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <SwapVertIcon sx={{ color: '#27ae60' }} />
                                <Typography variant="subtitle1" fontWeight={600} color="#2c3e50">
                                    Método de Inventario:
                                </Typography>
                                <ToggleButtonGroup
                                    value={metodoInventario}
                                    exclusive
                                    onChange={handleCambioMetodoInventario}
                                    aria-label="método de inventario"
                                    size="small"
                                    sx={{
                                        '& .MuiToggleButton-root': {
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1,
                                            border: '2px solid #27ae60',
                                            color: '#27ae60',
                                            '&.Mui-selected': {
                                                backgroundColor: '#27ae60',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#1e8449',
                                                },
                                            },
                                            '&:hover': {
                                                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                                            },
                                        },
                                    }}
                                >
                                    <ToggleButton value="PEPS" aria-label="PEPS">
                                        <TrendingUpIcon sx={{ mr: 1, fontSize: 20 }} />
                                        PEPS (Primero en Entrar, Primero en Salir)
                                    </ToggleButton>
                                    <ToggleButton value="UEPS" aria-label="UEPS">
                                        <TrendingDownIcon sx={{ mr: 1, fontSize: 20 }} />
                                        UEPS (Último en Entrar, Primero en Salir)
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Método actual:
                                </Typography>
                                <Chip
                                    label={metodoInventario}
                                    color={metodoInventario === 'PEPS' ? 'primary' : 'secondary'}
                                    size="small"
                                    variant="filled"
                                />
                            </Box>
                        </Box>

                        <CardContent sx={{ p: 0 }}>
                            <TableContainer sx={{ maxHeight: '600px' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>
                                                Código
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>
                                                Nombre
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>
                                                Categoría
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>
                                                Cantidad
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>
                                                Unidad
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>
                                                Stock Mínimo
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>
                                                Estado Stock
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>
                                                Método
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa', fontSize: '0.875rem', py: 1.5 }}>
                                                Acciones
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productos.map((producto, index) => (
                                            <TableRow
                                                key={producto.id}
                                                sx={{
                                                    '&:hover': { backgroundColor: '#f8f9fa' },
                                                    '&:nth-of-type(even)': { backgroundColor: '#fafbfc' },
                                                    ...(producto.estado_stock === 'Agotado' && {
                                                        backgroundColor: '#ffebee',
                                                        '&:hover': { backgroundColor: '#ffcdd2' },
                                                    }),
                                                    ...(producto.estado_stock === 'Stock Bajo' && {
                                                        backgroundColor: '#fff3e0',
                                                        '&:hover': { backgroundColor: '#ffe0b2' },
                                                    }),
                                                    animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s both`,
                                                    '@keyframes fadeIn': {
                                                        '0%': { opacity: 0, transform: 'translateY(10px)' },
                                                        '100%': { opacity: 1, transform: 'translateY(0)' },
                                                    },
                                                }}
                                            >
                                                <TableCell sx={{ py: 1 }}>
                                                    <Typography variant="body2" fontFamily="monospace" fontWeight={500}>
                                                        {producto.codigo_item}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 1 }}>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {producto.nombre_item}
                                                    </Typography>
                                                    {producto.descripcion && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{ display: 'block', mt: 0.5 }}
                                                        >
                                                            {producto.descripcion.length > 50
                                                                ? `${producto.descripcion.substring(0, 50)}...`
                                                                : producto.descripcion
                                                            }
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ py: 1 }}>
                                                    <Chip
                                                        label={producto.categoria.replace('_', ' ')}
                                                        size="small"
                                                        color={getCategoriaColor(producto.categoria)}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ py: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={600}
                                                            sx={{
                                                                color: producto.estado_stock === 'Agotado' ? '#f44336' :
                                                                    producto.estado_stock === 'Stock Bajo' ? '#ff9800' : 'inherit'
                                                            }}
                                                        >
                                                            {producto.cantidad_actual}
                                                        </Typography>
                                                        {producto.estado_stock === 'Agotado' && (
                                                            <WarningIcon sx={{ fontSize: 16, color: '#f44336' }} />
                                                        )}
                                                        {producto.estado_stock === 'Stock Bajo' && (
                                                            <WarningIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ py: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {producto.unidad_medida}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {producto.stock_minimo}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 1 }}>
                                                    <Chip
                                                        label={producto.estado_stock}
                                                        size="small"
                                                        color={getEstadoStockColor(producto.estado_stock)}
                                                        variant={producto.estado_stock === 'Stock Normal' ? 'outlined' : 'filled'}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ py: 1 }}>
                                                    <Chip
                                                        label={metodoInventario}
                                                        size="small"
                                                        color={metodoInventario === 'PEPS' ? 'primary' : 'secondary'}
                                                        variant="outlined"
                                                        icon={metodoInventario === 'PEPS' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ py: 1 }}>
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <Tooltip title="Editar producto" arrow>
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => abrirModalEditar(producto)}
                                                                sx={{
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                                    },
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Marcar como inactivo" arrow>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleEliminar(producto.id, producto.nombre_item)}
                                                                sx={{
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Fade>
            )}

            <Snackbar
                open={notificacion.open}
                autoHideDuration={4000}
                onClose={cerrarNotificacion}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={cerrarNotificacion}
                    severity={notificacion.tipo}
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                >
                    {notificacion.mensaje}
                </Alert>
            </Snackbar>
        </Box>
    );
}