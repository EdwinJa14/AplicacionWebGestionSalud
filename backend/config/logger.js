import winston from 'winston';

// Define los niveles de logging
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define los colores para cada nivel (opcional, para la consola)
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// Define el formato de los logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define a dónde se enviarán los logs (transports)
const transports = [
  // Siempre mostrar todos los logs en la consola
  new winston.transports.Console(),
  // Guardar logs de error en un archivo separado
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Guardar todos los logs en otro archivo
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Crea la instancia del logger
const logger = winston.createLogger({
  level: 'debug', // El nivel más bajo a registrar
  levels,
  format,
  transports,
});

export default logger;