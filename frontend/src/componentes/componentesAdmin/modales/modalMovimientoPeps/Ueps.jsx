import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InfoIcon from '@mui/icons-material/Info';

// Simulación de servicio para obtener movimientos
// En producción, esto vendría de tu API
const obtenerMovimientosProducto = async (productoId) => {
  // Simulamos una llamada API
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Datos de ejemplo
  return [
    {
      id: 1,
      fecha: '2024-01-15',
      tipo: 'entrada',
      cantidad: 100,
      precio_unitario: 15.50,
      lote: 'LOTE001',
      fecha_vencimiento: '2025-06-15',
      proveedor: 'Distribuidora Médica SA',
      documento: 'FAC-001234',
      observaciones: 'Compra inicial'
    },
    {
      id: 2,
      fecha: '2024-01-20',
      tipo: 'salida',
      cantidad: 25,
      precio_unitario: 15.50, // El precio de salida se basa en el costo del lote
      lote: 'LOTE001',
      fecha_vencimiento: '2025-06-15',
      paciente: 'Juan Pérez',
      documento: 'REC-001',
      observaciones: 'Dispensación a paciente'
    },
    {
      id: 3,
      fecha: '2024-02-10',
      tipo: 'entrada',
      cantidad: 50,
      precio_unitario: 16.20,
      lote: 'LOTE002',
      fecha_vencimiento: '2025-08-20',
      proveedor: 'Farmacéutica Central',
      documento: 'FAC-002345',
      observaciones: 'Reposición de stock'
    },
    {
      id: 4,
      fecha: '2024-02-15',
      tipo: 'salida',
      cantidad: 30,
      precio_unitario: 15.50, // El precio de salida se basa en el costo del lote
      lote: 'LOTE001',
      fecha_vencimiento: '2025-06-15',
      paciente: 'María García',
      documento: 'REC-002',
      observaciones: 'Tratamiento ambulatorio'
    }
  ];
};

// Función para calcular PEPS
const calcularPEPS = (movimientos) => {
  const entradas = movimientos.filter(m => m.tipo === 'entrada').sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const salidas = movimientos.filter(m => m.tipo === 'salida').sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  let stock = [];
  
  // Procesar entradas para crear el stock inicial
  entradas.forEach(entrada => {
    stock.push({
      ...entrada,
      cantidadDisponible: entrada.cantidad
    });
  });

  // Procesar salidas con PEPS
  salidas.forEach(salida => {
    let cantidadASalir = salida.cantidad;
    for (let i = 0; i < stock.length && cantidadASalir > 0; i++) {
      if (stock[i].cantidadDisponible > 0) {
        const cantidadUsada = Math.min(stock[i].cantidadDisponible, cantidadASalir);
        stock[i].cantidadDisponible -= cantidadUsada;
        cantidadASalir -= cantidadUsada;
      }
    }
  });

  const stockActual = stock.filter(item => item.cantidadDisponible > 0);
  const valorTotal = stockActual.reduce((sum, item) => sum + item.cantidadDisponible * item.precio_unitario, 0);
  const cantidadTotal = stockActual.reduce((sum, item) => sum + item.cantidadDisponible, 0);
  const costoPromedio = cantidadTotal > 0 ? valorTotal / cantidadTotal : 0;

  return { stockActual, valorTotal, cantidadTotal, costoPromedio };
};

// Función para calcular UEPS
const calcularUEPS = (movimientos) => {
  const entradas = movimientos.filter(m => m.tipo === 'entrada').sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const salidas = movimientos.filter(m => m.tipo === 'salida').sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  let stock = [];
  
  // Procesar entradas
  entradas.forEach(entrada => {
    stock.push({
      ...entrada,
      cantidadDisponible: entrada.cantidad
    });
  });

  // Procesar salidas con UEPS
  salidas.forEach(salida => {
    let cantidadASalir = salida.cantidad;
    // Recorrer el stock desde el final (más reciente)
    for (let i = stock.length - 1; i >= 0 && cantidadASalir > 0; i--) {
      if (stock[i].cantidadDisponible > 0) {
        const cantidadUsada = Math.min(stock[i].cantidadDisponible, cantidadASalir);
        stock[i].cantidadDisponible -= cantidadUsada;
        cantidadASalir -= cantidadUsada;
      }
    }
  });

  const stockActual = stock.filter(item => item.cantidadDisponible > 0);
  const valorTotal = stockActual.reduce((sum, item) => sum + item.cantidadDisponible * item.precio_unitario, 0);
  const cantidadTotal = stockActual.reduce((sum, item) => sum + item.cantidadDisponible, 0);
  const costoPromedio = cantidadTotal > 0 ? valorTotal / cantidadTotal : 0;

  return { stockActual, valorTotal, cantidadTotal, costoPromedio };
};


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`movimientos-tabpanel-${index}`}
      aria-labelledby={`movimientos-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ModalMovimientosInventario({ visible, producto, onClose }) {
  const [tabValue, setTabValue] = useState(0);
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [datosPEPS, setDatosPEPS] = useState(null);
  const [datosUEPS, setDatosUEPS] = useState(null);

  useEffect(() => {
    if (visible && producto) {
      cargarMovimientos();
    }
  }, [visible, producto]);

  const cargarMovimientos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const movimientosData = await obtenerMovimientosProducto(producto.id);
      setMovimientos(movimientosData);
      
      // Calcular PEPS y UEPS con los mismos datos base
      setDatosPEPS(calcularPEPS(JSON.parse(JSON.stringify(movimientosData))));
      setDatosUEPS(calcularUEPS(JSON.parse(JSON.stringify(movimientosData))));

    } catch (err) {
      setError('Error al cargar los movimientos del producto');
    } finally {
      setCargando(false);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(precio);
  };

  if (!visible) return null;

  return (
    <Dialog
      open={visible}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #e1e8ed',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InventoryIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Movimientos de Inventario - PEPS/UEPS
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {producto?.nombre_item} ({producto?.codigo_item})
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {cargando && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>
              Cargando movimientos...
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {!cargando && !error && (
          <>
            {/* Información del Producto */}
            <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderBottom: '1px solid #e1e8ed' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Stock Actual del Sistema
                      </Typography>
                      <Typography variant="h4" color="primary" fontWeight={600}>
                        {producto?.cantidad_actual}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {producto?.unidad_medida}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total de Movimientos
                      </Typography>
                      <Typography variant="h4" color="success.main" fontWeight={600}>
                        {movimientos.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {movimientos.filter(m => m.tipo === 'entrada').length} entradas, {movimientos.filter(m => m.tipo === 'salida').length} salidas
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Categoría
                      </Typography>
                      <Chip 
                        label={producto?.categoria?.replace('_', ' ') || 'N/A'} 
                        color="primary" 
                        variant="outlined"
                        size="large"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Stock mínimo: {producto?.stock_minimo}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Tabs para PEPS, UEPS e Historial */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleChangeTab} variant="fullWidth">
                <Tab 
                  icon={<TrendingUpIcon />} 
                  label="PEPS (Primero en Entrar, Primero en Salir)" 
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
                <Tab 
                  icon={<TrendingDownIcon />} 
                  label="UEPS (Último en Entrar, Primero en Salir)" 
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
                <Tab 
                  icon={<InfoIcon />} 
                  label="Historial de Movimientos" 
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
              </Tabs>
            </Box>

            {/* Panel PEPS */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon color="success" />
                  Método PEPS (First In, First Out)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Los productos que ingresan primero son los primeros en salir del inventario. Ideal para productos perecederos.
                </Typography>

                {/* Resumen PEPS */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Cantidad Total</Typography>
                        <Typography variant="h5" color="primary">{datosPEPS?.cantidadTotal || 0}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Valor Total</Typography>
                        <Typography variant="h5" color="success.main">{formatearPrecio(datosPEPS?.valorTotal || 0)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Costo Promedio</Typography>
                        <Typography variant="h5" color="info.main">{formatearPrecio(datosPEPS?.costoPromedio || 0)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Lotes Activos</Typography>
                        <Typography variant="h5" color="warning.main">{datosPEPS?.stockActual?.length || 0}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Tabla de Stock Actual PEPS */}
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Stock Actual por Lotes (PEPS)
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Lote</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha Entrada</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Cantidad Disponible</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Precio Unitario</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Valor Total</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Vencimiento</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datosPEPS?.stockActual?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell><Chip label={item.lote} size="small" color="success" variant="outlined" /></TableCell>
                          <TableCell>{formatearFecha(item.fecha)}</TableCell>
                          <TableCell><Typography fontWeight={600}>{item.cantidadDisponible}</Typography></TableCell>
                          <TableCell>{formatearPrecio(item.precio_unitario)}</TableCell>
                          <TableCell><Typography fontWeight={600} color="success.main">{formatearPrecio(item.cantidadDisponible * item.precio_unitario)}</Typography></TableCell>
                          <TableCell>
                            <Typography variant="body2" color={new Date(item.fecha_vencimiento) < new Date() ? 'error' : 'text.secondary'}>
                              {formatearFecha(item.fecha_vencimiento)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>

            {/* Panel UEPS */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingDownIcon color="warning" />
                  Método UEPS (Last In, First Out)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Los productos que ingresan más recientemente son los primeros en salir. A menudo resulta en un mayor costo de venta.
                </Typography>
                
                {/* Resumen UEPS */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Cantidad Total</Typography>
                        <Typography variant="h5" color="primary">{datosUEPS?.cantidadTotal || 0}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Valor Total</Typography>
                        <Typography variant="h5" color="success.main">{formatearPrecio(datosUEPS?.valorTotal || 0)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Costo Promedio</Typography>
                        <Typography variant="h5" color="info.main">{formatearPrecio(datosUEPS?.costoPromedio || 0)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">Lotes Activos</Typography>
                        <Typography variant="h5" color="warning.main">{datosUEPS?.stockActual?.length || 0}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Tabla de Stock Actual UEPS */}
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Stock Actual por Lotes (UEPS)
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Lote</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha Entrada</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Cantidad Disponible</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Precio Unitario</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Valor Total</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Vencimiento</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datosUEPS?.stockActual?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell><Chip label={item.lote} size="small" color="warning" variant="outlined" /></TableCell>
                          <TableCell>{formatearFecha(item.fecha)}</TableCell>
                          <TableCell><Typography fontWeight={600}>{item.cantidadDisponible}</Typography></TableCell>
                          <TableCell>{formatearPrecio(item.precio_unitario)}</TableCell>
                          <TableCell><Typography fontWeight={600} color="success.main">{formatearPrecio(item.cantidadDisponible * item.precio_unitario)}</Typography></TableCell>
                          <TableCell>
                            <Typography variant="body2" color={new Date(item.fecha_vencimiento) < new Date() ? 'error' : 'text.secondary'}>
                              {formatearFecha(item.fecha_vencimiento)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>

            {/* Panel Historial de Movimientos */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon color="info" />
                  Historial Completo de Movimientos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Registro cronológico de todas las entradas y salidas del producto.
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Precio Unit.</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Valor Total</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Lote</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Vencimiento</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Documento</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Observaciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {movimientos
                        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                        .map((movimiento) => (
                          <TableRow 
                            key={movimiento.id}
                            sx={{
                              '&:hover': { backgroundColor: '#f0f0f0' },
                              backgroundColor: movimiento.tipo === 'entrada' ? '#e8f5e9' : '#fffde7'
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarTodayIcon fontSize="small" color="action" />
                                <Typography variant="body2">{formatearFecha(movimiento.fecha)}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={movimiento.tipo.toUpperCase()}
                                color={movimiento.tipo === 'entrada' ? 'success' : 'warning'}
                                size="small"
                                icon={movimiento.tipo === 'entrada' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={600}>
                                {movimiento.tipo === 'entrada' ? '+' : '-'}{movimiento.cantidad}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AttachMoneyIcon fontSize="small" color="action" />
                                {formatearPrecio(movimiento.precio_unitario)}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography 
                                fontWeight={600}
                                color={movimiento.tipo === 'entrada' ? 'success.main' : 'warning.dark'}
                              >
                                {formatearPrecio(movimiento.cantidad * movimiento.precio_unitario)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={movimiento.lote} 
                                size="small" 
                                variant="outlined"
                                color="primary"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography 
                                variant="body2"
                                color={
                                  new Date(movimiento.fecha_vencimiento) < new Date() 
                                    ? 'error' 
                                    : new Date(movimiento.fecha_vencimiento) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                                      ? 'warning.dark'
                                      : 'text.secondary'
                                }
                              >
                                {formatearFecha(movimiento.fecha_vencimiento)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">{movimiento.documento}</Typography>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={movimiento.observaciones} arrow>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    maxWidth: 200,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {movimiento.observaciones}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: '#f8f9fa', borderTop: '1px solid #e1e8ed' }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Cerrar
        </Button>
        <Button 
          variant="contained"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            backgroundColor: '#27ae60',
            '&:hover': { backgroundColor: '#1e8449' }
          }}
          onClick={() => {
            // Lógica para exportar reportes
            console.log('Exportar reporte PEPS/UEPS');
          }}
        >
          Exportar Reporte
        </Button>
      </DialogActions>
    </Dialog>
  );
}