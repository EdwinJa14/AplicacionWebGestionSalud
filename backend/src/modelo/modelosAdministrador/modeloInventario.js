import pool from '../../../config/db.js';

// Función para verificar qué tablas existen en la base de datos
export const verificarTablas = async () => {
  try {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name`;
    
    const { rows } = await pool.query(query);
    console.log('Tablas existentes en la base de datos:', rows.map(r => r.table_name));
    return rows.map(r => r.table_name);
  } catch (error) {
    console.error('Error al verificar tablas:', error);
    throw error;
  }
};

// Obtener todos los productos del inventario
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
      CASE 
        WHEN cantidad_actual = 0 THEN 'Agotado'
        WHEN cantidad_actual <= stock_minimo THEN 'Stock Bajo'
        ELSE 'Stock Normal'
      END as estado_stock,
      estado,
      fecha_ingreso,
      fecha_modifica
    FROM inventario
    WHERE estado = true
    ORDER BY nombre_item`;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    throw error;
  }
};

// Obtener todos los productos ordenados por método PEPS o UEPS (versión simplificada)
export const getAllByMetodo = async (metodo = 'PEPS') => {
  // Como no tenemos información de lotes por el momento, ordenaremos por fecha de ingreso
  // PEPS: Los más antiguos primero (fecha_ingreso ASC)
  // UEPS: Los más nuevos primero (fecha_ingreso DESC)
  const ordenQuery = metodo === 'PEPS' 
    ? `ORDER BY 
        CASE 
          WHEN i.cantidad_actual = 0 THEN 1
          WHEN i.cantidad_actual <= i.stock_minimo THEN 2
          ELSE 3 
        END,
        i.fecha_ingreso ASC,
        i.nombre_item`
    : `ORDER BY 
        CASE 
          WHEN i.cantidad_actual = 0 THEN 1
          WHEN i.cantidad_actual <= i.stock_minimo THEN 2
          ELSE 3 
        END,
        i.fecha_ingreso DESC,
        i.nombre_item`;

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
      CASE 
        WHEN i.cantidad_actual = 0 THEN 'Agotado'
        WHEN i.cantidad_actual <= i.stock_minimo THEN 'Stock Bajo'
        ELSE 'Stock Normal'
      END as estado_stock,
      i.fecha_ingreso,
      i.fecha_modifica
    FROM inventario i
    WHERE i.estado = true
    ${ordenQuery}`;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error(`Error al obtener inventario por método ${metodo}:`, error);
    throw error;
  }
};

// Obtener productos con alertas (verificando si la tabla alertas_inventario existe)
export const getAllWithAlerts = async () => {
  try {
    // Primero verificar si existe la tabla alertas_inventario
    const tablaExiste = await verificarTablaAlertasInventario();
    
    let query;
    if (tablaExiste) {
      query = `
        SELECT
          i.id,
          i.codigo_item,
          i.nombre_item,
          i.descripcion,
          i.categoria,
          i.unidad_medida,
          i.cantidad_actual,
          i.stock_minimo,
          CASE 
            WHEN i.cantidad_actual = 0 THEN 'Agotado'
            WHEN i.cantidad_actual <= i.stock_minimo THEN 'Stock Bajo'
            ELSE 'Stock Normal'
          END as estado_stock,
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM alertas_inventario ai 
              WHERE ai.inventario_id = i.id AND ai.activa = true AND ai.estado = true
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
            WHERE ai.inventario_id = i.id AND ai.activa = true AND ai.estado = true
          ) as alertas
        FROM inventario i
        WHERE i.estado = true
        ORDER BY 
          CASE 
            WHEN i.cantidad_actual = 0 THEN 1
            WHEN i.cantidad_actual <= i.stock_minimo THEN 2
            ELSE 3 
          END,
          i.nombre_item`;
    } else {
      // Si no existe la tabla de alertas, devolver sin alertas
      query = `
        SELECT
          i.id,
          i.codigo_item,
          i.nombre_item,
          i.descripcion,
          i.categoria,
          i.unidad_medida,
          i.cantidad_actual,
          i.stock_minimo,
          CASE 
            WHEN i.cantidad_actual = 0 THEN 'Agotado'
            WHEN i.cantidad_actual <= i.stock_minimo THEN 'Stock Bajo'
            ELSE 'Stock Normal'
          END as estado_stock,
          false as tiene_alertas,
          null as alertas
        FROM inventario i
        WHERE i.estado = true
        ORDER BY 
          CASE 
            WHEN i.cantidad_actual = 0 THEN 1
            WHEN i.cantidad_actual <= i.stock_minimo THEN 2
            ELSE 3 
          END,
          i.nombre_item`;
    }
    
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener inventario con alertas:', error);
    throw error;
  }
};

// Obtener productos con alertas ordenados por método PEPS o UEPS
export const getAllWithAlertsByMetodo = async (metodo = 'PEPS') => {
  try {
    const tablaExiste = await verificarTablaAlertasInventario();
    
    const ordenQuery = metodo === 'PEPS' 
      ? `ORDER BY 
          CASE 
            WHEN i.cantidad_actual = 0 THEN 1
            WHEN i.cantidad_actual <= i.stock_minimo THEN 2
            ELSE 3 
          END,
          i.fecha_ingreso ASC,
          i.nombre_item`
      : `ORDER BY 
          CASE 
            WHEN i.cantidad_actual = 0 THEN 1
            WHEN i.cantidad_actual <= i.stock_minimo THEN 2
            ELSE 3 
          END,
          i.fecha_ingreso DESC,
          i.nombre_item`;

    let query;
    if (tablaExiste) {
      query = `
        SELECT
          i.id,
          i.codigo_item,
          i.nombre_item,
          i.descripcion,
          i.categoria,
          i.unidad_medida,
          i.cantidad_actual,
          i.stock_minimo,
          CASE 
            WHEN i.cantidad_actual = 0 THEN 'Agotado'
            WHEN i.cantidad_actual <= i.stock_minimo THEN 'Stock Bajo'
            ELSE 'Stock Normal'
          END as estado_stock,
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM alertas_inventario ai 
              WHERE ai.inventario_id = i.id AND ai.activa = true AND ai.estado = true
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
            WHERE ai.inventario_id = i.id AND ai.activa = true AND ai.estado = true
          ) as alertas
        FROM inventario i
        WHERE i.estado = true
        ${ordenQuery}`;
    } else {
      query = `
        SELECT
          i.id,
          i.codigo_item,
          i.nombre_item,
          i.descripcion,
          i.categoria,
          i.unidad_medida,
          i.cantidad_actual,
          i.stock_minimo,
          CASE 
            WHEN i.cantidad_actual = 0 THEN 'Agotado'
            WHEN i.cantidad_actual <= i.stock_minimo THEN 'Stock Bajo'
            ELSE 'Stock Normal'
          END as estado_stock,
          false as tiene_alertas,
          null as alertas
        FROM inventario i
        WHERE i.estado = true
        ${ordenQuery}`;
    }
    
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error(`Error al obtener inventario con alertas por método ${metodo}:`, error);
    throw error;
  }
};

// Función auxiliar para verificar si existe la tabla alertas_inventario
const verificarTablaAlertasInventario = async () => {
  try {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'alertas_inventario'
      )`;
    
    const { rows } = await pool.query(query);
    return rows[0].exists;
  } catch (error) {
    console.error('Error al verificar tabla alertas_inventario:', error);
    return false;
  }
};

// Obtener producto por ID (versión simplificada sin lotes)
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
      fecha_modifica,
      CASE 
        WHEN cantidad_actual = 0 THEN 'Agotado'
        WHEN cantidad_actual <= stock_minimo THEN 'Stock Bajo'
        ELSE 'Stock Normal'
      END as estado_stock
    FROM inventario
    WHERE id = $1 AND estado = true`;
  
  try {
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    
    const producto = rows[0];
    
    // Por ahora, devolvemos un array vacío de lotes hasta que se implementen las tablas
    producto.lotes = [];
    
    return producto;
  } catch (error) {
    console.error(`Error al obtener producto con id ${id}:`, error);
    throw error;
  }
};

// Obtener lotes por método PEPS o UEPS (versión simplificada)
export const getLotesByMetodo = async (inventario_id, metodo = 'PEPS') => {
  try {
    // Por ahora retornamos array vacío hasta que se implementen las tablas de lotes
    console.log(`Solicitud de lotes para inventario ${inventario_id} con método ${metodo}`);
    return [];
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
    SELECT 
      *,
      CASE 
        WHEN cantidad_actual = 0 THEN 'Agotado'
        WHEN cantidad_actual <= stock_minimo THEN 'Stock Bajo'
        ELSE 'Stock Normal'
      END as estado_stock
    FROM inventario 
    WHERE categoria = $1 AND estado = true
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
    SELECT 
      *,
      CASE 
        WHEN cantidad_actual = 0 THEN 'Agotado'
        WHEN cantidad_actual <= stock_minimo THEN 'Stock Bajo'
        ELSE 'Stock Normal'
      END as estado_stock
    FROM inventario 
    WHERE (cantidad_actual = 0 OR cantidad_actual <= stock_minimo) 
      AND estado = true
    ORDER BY 
      CASE WHEN cantidad_actual = 0 THEN 1 ELSE 2 END,
      nombre_item`;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    throw error;
  }
};

// Obtener estadísticas del inventario
export const getEstadisticas = async () => {
  const query = `
    SELECT 
      COUNT(*) as total_productos,
      COUNT(CASE WHEN cantidad_actual > stock_minimo THEN 1 END) as stock_normal,
      COUNT(CASE WHEN cantidad_actual <= stock_minimo AND cantidad_actual > 0 THEN 1 END) as stock_bajo,
      COUNT(CASE WHEN cantidad_actual = 0 THEN 1 END) as agotado,
      COUNT(CASE WHEN categoria = 'Medicamento' THEN 1 END) as medicamentos,
      COUNT(CASE WHEN categoria = 'Material_Medico' THEN 1 END) as material_medico,
      COUNT(CASE WHEN categoria = 'Insumo' THEN 1 END) as insumos,
      COUNT(CASE WHEN categoria = 'Equipo' THEN 1 END) as equipos
    FROM inventario
    WHERE estado = true`;
  
  try {
    const { rows } = await pool.query(query);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener estadísticas del inventario:', error);
    throw error;
  }
};