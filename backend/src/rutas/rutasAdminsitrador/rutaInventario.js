import express from 'express';
import { body } from 'express-validator';
import { auth, requireAdmin } from '../../middlewares/auth.js';
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosPorCategoria,
  getStockBajo,
  getEstadisticas
} from '../../controlador/controladoresAdministrador/controladorInventario.js';

const router = express.Router();

// Middleware de autenticación y autorización
router.use(auth, requireAdmin);

// Reglas de validación
const productoValidationRules = [
    body('codigo_item').trim().notEmpty().withMessage('El código es obligatorio').escape(),
    body('nombre_item').trim().notEmpty().withMessage('El nombre es obligatorio').escape(),
    body('descripcion').optional({ checkFalsy: true }).trim().escape(),
    body('categoria').isIn(['Medicamento', 'Material_Medico', 'Insumo', 'Equipo']).withMessage('Categoría no válida'),
    body('unidad_medida').trim().notEmpty().withMessage('La unidad de medida es obligatoria').escape(),
    body('cantidad_actual').optional().isInt({ min: 0 }).withMessage('La cantidad debe ser un número positivo'),
    body('stock_minimo').optional().isInt({ min: 0 }).withMessage('El stock mínimo debe ser un número positivo'),
];

// Rutas
router.get('/', getAllProductos);
router.get('/estadisticas', getEstadisticas);
router.get('/stock-bajo', getStockBajo);
router.get('/categoria/:categoria', getProductosPorCategoria);
router.get('/:id', getProductoById);
router.post('/', productoValidationRules, createProducto);
router.put('/:id', productoValidationRules, updateProducto);
router.patch('/:id', deleteProducto);

export default router;