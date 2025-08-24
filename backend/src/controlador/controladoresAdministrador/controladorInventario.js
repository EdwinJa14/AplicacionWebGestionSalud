import { validationResult } from 'express-validator';
import * as InventarioModel from '../../modelo/modelosAdministrador/modeloInventario.js';

// Obtener todos los productos
export const getAllProductos = async (req, res) => {
    try {
        const { incluir_alertas = false, metodo = null } = req.query;
        let productos;
        if (metodo && ['PEPS', 'UEPS'].includes(metodo.toUpperCase())) {
            productos = await InventarioModel.getAllByMetodo(metodo.toUpperCase());
        } else {
            productos = await InventarioModel.getAll();
        }
        res.status(200).json({
            success: true,
            message: `Inventario obtenido exitosamente.`,
            data: productos
        });
    } catch (error) {
        console.error('Error al obtener inventario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener producto por ID
export const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await InventarioModel.getById(id);
        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Producto encontrado exitosamente.', data: producto });
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Crear nuevo producto
export const createProducto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const nuevoProducto = await InventarioModel.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente.',
            data: nuevoProducto
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'El código del item ya existe.' });
        }
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Actualizar producto
export const updateProducto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const productoActualizado = await InventarioModel.update(id, req.body);
        if (!productoActualizado) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado para actualizar.' });
        }
        res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente.',
            data: productoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'El código del item ya existe.' });
        }
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Eliminar (inactivar) producto
export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const productoEliminado = await InventarioModel.remove(id);
        if (!productoEliminado) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado para eliminar.' });
        }
        res.status(200).json({
            success: true,
            message: 'Producto marcado como inactivo exitosamente.',
            data: productoEliminado
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener productos por categoría
export const getProductosPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const productos = await InventarioModel.getByCategoria(categoria);
        res.status(200).json({
            success: true,
            message: `Productos de categoría ${categoria} obtenidos exitosamente.`,
            data: productos
        });
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener productos con stock bajo
export const getStockBajo = async (req, res) => {
    try {
        const productos = await InventarioModel.getStockBajo();
        res.status(200).json({
            success: true,
            message: 'Productos con stock bajo obtenidos exitosamente.',
            data: productos
        });
    } catch (error) {
        console.error('Error al obtener productos con stock bajo:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Obtener estadísticas del inventario
export const getEstadisticas = async (req, res) => {
    try {
        const estadisticas = await InventarioModel.getEstadisticas();
        res.status(200).json({
            success: true,
            message: 'Estadísticas del inventario obtenidas exitosamente.',
            data: estadisticas
        });
    } catch (error) {
        console.error('Error al obtener estadísticas del inventario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};