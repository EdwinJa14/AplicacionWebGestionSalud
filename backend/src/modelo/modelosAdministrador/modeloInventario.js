import pool from '../../../config/db.js';

// Obtener todos los productos del inventario usando la vista
export const getAll = async () => {
  const query = `
    SELECT
      id,
      codigo_item,
      nombre_item,
      descripcion,
      categoria,
      unidad_medida,
      cantidad_actual,
      stock_minimo,
      estado_stock
    FROM vista_inventario
    ORDER BY nombre_item`;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    throw error;
  }
};

// Obtener productos con alertas de stock
export const getAllWithAlerts = async () => {
  const query = `
    SELECT
      i.id,
      i.codigo_item,
      i.nombre_item,
      i.descripcion,
      i.categoria,
      i.unidad_medida,
      i.cantidad_actual,
      i.stock_minimo,
      i.estado_stock,
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM alertas_inventario ai 
          WHERE ai.inventario_id = i.id AND ai.activa = true
        ) THEN true
        ELSE false
      END as tiene_alertas,
      (
        SELECT json_agg(
          json_build_object(
            'tipo', ai.tipo_alerta,
            'mensaje', ai.mensaje,
            'fecha_creacion', ai.fecha_creacion
          )
        )
        FROM alertas_inventario ai
        WHERE ai.inventario_id = i.id AND ai.activa = true
      ) as alertas
    FROM vista_inventario i
    ORDER BY 
      CASE WHEN i.estado_stock = 'Agotado' THEN 1
           WHEN i.estado_stock = 'Stock Bajo' THEN 2
           ELSE 3 END,
      i.nombre_item`;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener inventario con alertas:', error);
    throw error;
  }
};

// Obtener producto por ID con información de lotes
export const getById = async (id) => {
  const query = `
    SELECT
      id,
      codigo_item,
      nombre_item,
      descripcion,
      categoria,
      unidad_medida,
      cantidad_actual,
      stock_minimo,
      estado,
      usuario_ingreso,
      fecha_ingreso,
      usuario_modifica,
      fecha_modifica
    FROM inventario
    WHERE id = $1 AND estado = true`;
  
  try {
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    
    const producto = rows[0];
    
    // Obtener información de lotes usando la función
    const lotesQuery = `SELECT * FROM fn_stock_lote($1) ORDER BY fecha_vencimiento ASC`;
    const { rows: lotes } = await pool.query(lotesQuery, [id]);
    
    producto.lotes = lotes;
    producto.estado_stock = await getEstadoStock(producto.cantidad_actual, producto.stock_minimo);
    
    return producto;
  } catch (error) {
    console.error(`Error al obtener producto con id ${id}:`, error);
    throw error;
  }
};

// Obtener lotes por método PEPS o UEPS
export const getLotesByMetodo = async (inventario_id, metodo = 'PEPS') => {
  const ordenQuery = metodo === 'PEPS' 
    ? 'ORDER BY fecha_vencimiento ASC' 
    : 'ORDER BY fecha_vencimiento DESC';
    
  const query = `SELECT * FROM fn_stock_lote($1) ${ordenQuery}`;
  
  try {
    const { rows } = await pool.query(query, [inventario_id]);
    return rows;
  } catch (error) {
    console.error(`Error al obtener lotes por método ${metodo}:`, error);
    throw error;
  }
};

// Crear nuevo producto
export const create = async (productoData) => {
  const { 
    codigo_item, 
    nombre_item, 
    descripcion, 
    categoria, 
    unidad_medida, 
    cantidad_actual = 0,
    stock_minimo = 10 
  } = productoData;

  const query = `
    INSERT INTO inventario (
      codigo_item,
      nombre_item,
      descripcion,
      categoria,
      unidad_medida,
      cantidad_actual,
      stock_minimo,
      estado,
      usuario_ingreso,
      fecha_ingreso
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, true, 1, CURRENT_TIMESTAMP)
    RETURNING *`;

  const values = [
    codigo_item,
    nombre_item,
    descripcion || null,
    categoria,
    unidad_medida,
    cantidad_actual,
    stock_minimo
  ];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

// Actualizar producto
export const update = async (id, productoData) => {
  const { 
    codigo_item, 
    nombre_item, 
    descripcion, 
    categoria, 
    unidad_medida, 
    cantidad_actual,
    stock_minimo,
    estado 
  } = productoData;

  const query = `
    UPDATE inventario
    SET
      codigo_item = COALESCE($1, codigo_item),
      nombre_item = COALESCE($2, nombre_item),
      descripcion = COALESCE($3, descripcion),
      categoria = COALESCE($4, categoria),
      unidad_medida = COALESCE($5, unidad_medida),
      cantidad_actual = COALESCE($6, cantidad_actual),
      stock_minimo = COALESCE($7, stock_minimo),
      estado = COALESCE($8, estado),
      usuario_modifica = 1,
      fecha_modifica = CURRENT_TIMESTAMP
    WHERE id = $9 AND estado = true
    RETURNING *`;

  const values = [
    codigo_item,
    nombre_item,
    descripcion,
    categoria,
    unidad_medida,
    cantidad_actual,
    stock_minimo,
    estado,
    id
  ];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(`Error al actualizar producto con id ${id}:`, error);
    throw error;
  }
};

// Marcar producto como inactivo (eliminar lógico)
export const remove = async (id) => {
  const query = `
    UPDATE inventario
    SET
      estado = false,
      usuario_modifica = 1,
      fecha_modifica = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *`;

  try {
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error(`Error al eliminar producto con id ${id}:`, error);
    throw error;
  }
};

// Obtener productos por categoría
export const getByCategoria = async (categoria) => {
  const query = `
    SELECT * FROM vista_inventario 
    WHERE categoria = $1 
    ORDER BY nombre_item`;
  
  try {
    const { rows } = await pool.query(query, [categoria]);
    return rows;
  } catch (error) {
    console.error(`Error al obtener productos de categoría ${categoria}:`, error);
    throw error;
  }
};

// Obtener productos con stock bajo
export const getStockBajo = async () => {
  const query = `
    SELECT * FROM vista_inventario 
    WHERE estado_stock IN ('Stock Bajo', 'Agotado')
    ORDER BY 
      CASE WHEN estado_stock = 'Agotado' THEN 1 ELSE 2 END,
      nombre_item`;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    throw error;
  }
};

// Función auxiliar para obtener estado del stock
const getEstadoStock = async (cantidad_actual, stock_minimo) => {
  const query = `SELECT fn_estado_stock($1, $2) as estado`;
  try {
    const { rows } = await pool.query(query, [cantidad_actual, stock_minimo]);
    return rows[0].estado;
  } catch (error) {
    console.error('Error al obtener estado del stock:', error);
    return 'Error';
  }
};

// Obtener estadísticas del inventario
export const getEstadisticas = async () => {
  const query = `
    SELECT 
      COUNT(*) as total_productos,
      COUNT(CASE WHEN estado_stock = 'Stock Normal' THEN 1 END) as stock_normal,
      COUNT(CASE WHEN estado_stock = 'Stock Bajo' THEN 1 END) as stock_bajo,
      COUNT(CASE WHEN estado_stock = 'Agotado' THEN 1 END) as agotado,
      COUNT(CASE WHEN categoria = 'Medicamento' THEN 1 END) as medicamentos,
      COUNT(CASE WHEN categoria = 'Material_Medico' THEN 1 END) as material_medico,
      COUNT(CASE WHEN categoria = 'Insumo' THEN 1 END) as insumos,
      COUNT(CASE WHEN categoria = 'Equipo' THEN 1 END) as equipos
    FROM vista_inventario`;
  
  try {
    const { rows } = await pool.query(query);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener estadísticas del inventario:', error);
    throw error;
  }
};