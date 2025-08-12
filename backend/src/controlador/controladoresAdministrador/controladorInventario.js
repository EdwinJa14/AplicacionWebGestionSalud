import * as InventarioModel from '../../modelo/modelosAdministrador/modeloInventario.js';

// Obtener todos los productos
export const getAllProductos = async (req, res) => {
  try {
    const { incluir_alertas = false } = req.query;
    
    const productos = incluir_alertas === 'true' 
      ? await InventarioModel.getAllWithAlerts()
      : await InventarioModel.getAll();

    res.status(200).json({
      success: true,
      message: 'Inventario obtenido exitosamente.',
      data: productos
    });
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Obtener producto por ID con información de lotes
export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const { metodo = 'PEPS' } = req.query;
    
    const producto = await InventarioModel.getById(id);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado.'
      });
    }

    // Obtener lotes ordenados según el método especificado
    if (metodo) {
      producto.lotes = await InventarioModel.getLotesByMetodo(id, metodo.toUpperCase());
    }

    res.status(200).json({
      success: true,
      message: 'Producto encontrado exitosamente.',
      data: producto
    });
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Crear nuevo producto
export const createProducto = async (req, res) => {
  try {
    const {
      codigo_item,
      nombre_item,
      descripcion,
      categoria,
      unidad_medida,
      cantidad_actual,
      stock_minimo
    } = req.body;

    // Validaciones
    if (!codigo_item || !nombre_item || !categoria || !unidad_medida) {
      return res.status(400).json({
        success: false,
        message: 'Los campos codigo_item, nombre_item, categoria y unidad_medida son obligatorios.'
      });
    }

    // Validar categoría
    const categoriasValidas = ['Medicamento', 'Material_Medico', 'Insumo', 'Equipo'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({
        success: false,
        message: `Categoría inválida. Valores permitidos: ${categoriasValidas.join(', ')}`
      });
    }

    const nuevoProducto = await InventarioModel.create({
      codigo_item: codigo_item.trim(),
      nombre_item: nombre_item.trim(),
      descripcion: descripcion?.trim() || null,
      categoria,
      unidad_medida: unidad_medida.trim(),
      cantidad_actual: cantidad_actual || 0,
      stock_minimo: stock_minimo || 10
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente.',
      data: nuevoProducto
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    
    // Manejar error de código duplicado
    if (error.code === '23505' && error.constraint === 'inventario_codigo_item_key') {
      return res.status(400).json({
        success: false,
        message: 'El código del item ya existe. Use un código único.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Actualizar producto
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      codigo_item,
      nombre_item,
      descripcion,
      categoria,
      unidad_medida,
      cantidad_actual,
      stock_minimo,
      estado
    } = req.body;

    // Validar categoría si se proporciona
    if (categoria) {
      const categoriasValidas = ['Medicamento', 'Material_Medico', 'Insumo', 'Equipo'];
      if (!categoriasValidas.includes(categoria)) {
        return res.status(400).json({
          success: false,
          message: `Categoría inválida. Valores permitidos: ${categoriasValidas.join(', ')}`
        });
      }
    }

    const productoActualizado = await InventarioModel.update(id, {
      codigo_item: codigo_item?.trim(),
      nombre_item: nombre_item?.trim(),
      descripcion: descripcion?.trim(),
      categoria,
      unidad_medida: unidad_medida?.trim(),
      cantidad_actual,
      stock_minimo,
      estado
    });

    if (!productoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado para actualizar.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente.',
      data: productoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    
    // Manejar error de código duplicado
    if (error.code === '23505' && error.constraint === 'inventario_codigo_item_key') {
      return res.status(400).json({
        success: false,
        message: 'El código del item ya existe. Use un código único.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Eliminar (inactivar) producto
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const productoEliminado = await InventarioModel.remove(id);

    if (!productoEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado para eliminar.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto marcado como inactivo exitosamente.',
      data: productoEliminado
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Obtener productos por categoría
export const getProductosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    
    const categoriasValidas = ['Medicamento', 'Material_Medico', 'Insumo', 'Equipo'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({
        success: false,
        message: `Categoría inválida. Valores permitidos: ${categoriasValidas.join(', ')}`
      });
    }

    const productos = await InventarioModel.getByCategoria(categoria);

    res.status(200).json({
      success: true,
      message: `Productos de categoría ${categoria} obtenidos exitosamente.`,
      data: productos
    });
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
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
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};

// Obtener lotes por método PEPS/UEPS
export const getLotesByMetodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { metodo = 'PEPS' } = req.query;

    if (!['PEPS', 'UEPS'].includes(metodo.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Método inválido. Use PEPS o UEPS.'
      });
    }

    const lotes = await InventarioModel.getLotesByMetodo(id, metodo.toUpperCase());

    res.status(200).json({
      success: true,
      message: `Lotes obtenidos exitosamente usando método ${metodo.toUpperCase()}.`,
      data: lotes
    });
  } catch (error) {
    console.error('Error al obtener lotes por método:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
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
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    });
  }
};