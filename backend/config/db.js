import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'BDTeisis',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
};

console.log('🔍 Configuración de DB:', {
  ...dbConfig, 
  password: dbConfig.password ? '***' + dbConfig.password.slice(-2) : 'NO_PASSWORD'
});

const { Pool } = pg;
const pool = new Pool(dbConfig);

// Prueba de conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error de conexión con PostgreSQL:', err.message);
  } else {
    console.log('🐘 ✅ Conexión con PostgreSQL exitosa:', res.rows[0].now);
  }
});

export default pool;