import express from 'express';
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosPorCategoria,
  getStockBajo,
  getLotesByMetodo,
  getEstadisticas
} from '../../controlador/controladoresAdministrador/controladorInventario.js';

const router = express.Router();

// Obtener todos los productos (con opción de incluir alertas)
// GET /api/inventario?incluir_alertas=true
router.get('/', getAllProductos);

// Obtener estadísticas del inventario
// GET /api/inventario/estadisticas
router.get('/estadisticas', getEstadisticas);

// Obtener productos con stock bajo
// GET /api/inventario/stock-bajo
router.get('/stock-bajo', getStockBajo);

// Obtener productos por categoría
// GET /api/inventario/categoria/Medicamento
router.get('/categoria/:categoria', getProductosPorCategoria);

// Obtener producto por ID (con información de lotes)
// GET /api/inventario/1?metodo=PEPS
router.get('/:id', getProductoById);

// Obtener lotes por método PEPS/UEPS
// GET /api/inventario/1/lotes?metodo=PEPS
router.get('/:id/lotes', getLotesByMetodo);

// Crear nuevo producto
// POST /api/inventario
router.post('/', createProducto);

// Actualizar producto
// PUT /api/inventario/1
router.put('/:id', updateProducto);

// Eliminar (inactivar) producto
// PATCH /api/inventario/1
router.patch('/:id', deleteProducto);

export default router;