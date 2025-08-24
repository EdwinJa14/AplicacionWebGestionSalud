import pg from 'pg';
import dotenv from 'dotenv';
import logger from './logger.js'; 

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'BDTesis',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
};

logger.info('🔍 Configuración de DB cargada.');

const { Pool } = pg;
const pool = new Pool(dbConfig);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error(`❌ Error de conexión con PostgreSQL: ${err.message}`);
  } else {
    logger.info(`🐘 ✅ Conexión con PostgreSQL exitosa: ${res.rows[0].now}`);
  }
});

export default pool;