import { validationResult } from 'express-validator';
import * as InventarioModel from '../../modelo/modelosAdministrador/modeloInventario.js';
import logger from '../../../config/logger.js';

export const getAllProductos = async (req, res) => {
    try {
        const { metodo = null } = req.query;
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
        logger.error(`Error al obtener inventario: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

export const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await InventarioModel.getById(id);
        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Producto encontrado exitosamente.', data: producto });
    } catch (error) {
        logger.error(`Error al obtener producto por ID (${req.params.id}): ${error.message}`);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

export const createProducto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const nuevoProducto = await InventarioModel.create(req.body);
        logger.info(`Producto de inventario creado: ${nuevoProducto.codigo_item} - ${nuevoProducto.nombre_item}`);
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente.',
            data: nuevoProducto
        });
    } catch (error) {
        logger.error(`Error al crear producto de inventario: ${error.message}`, { body: req.body });
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'El código del item ya existe.' });
        }
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

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
        logger.info(`Producto de inventario ID ${id} actualizado.`);
        res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente.',
            data: productoActualizado
        });
    } catch (error) {
        logger.error(`Error al actualizar producto de inventario ID ${req.params.id}: ${error.message}`, { body: req.body });
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'El código del item ya existe.' });
        }
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const productoEliminado = await InventarioModel.remove(id);
        if (!productoEliminado) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado para eliminar.' });
        }
        logger.info(`Producto de inventario ID ${id} marcado como inactivo.`);
        res.status(200).json({
            success: true,
            message: 'Producto marcado como inactivo exitosamente.',
            data: productoEliminado
        });
    } catch (error) {
        logger.error(`Error al eliminar producto de inventario ID ${req.params.id}: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

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
        logger.error(`Error al obtener productos por categoría (${req.params.categoria}): ${error.message}`);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

export const getStockBajo = async (req, res) => {
    try {
        const productos = await InventarioModel.getStockBajo();
        res.status(200).json({
            success: true,
            message: 'Productos con stock bajo obtenidos exitosamente.',
            data: productos
        });
    } catch (error) {
        logger.error(`Error al obtener productos con stock bajo: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

export const getEstadisticas = async (req, res) => {
    try {
        const estadisticas = await InventarioModel.getEstadisticas();
        res.status(200).json({
            success: true,
            message: 'Estadísticas del inventario obtenidas exitosamente.',
            data: estadisticas
        });
    } catch (error) {
        logger.error(`Error al obtener estadísticas del inventario: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};