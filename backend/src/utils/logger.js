import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define format for file logs (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format,
  }),
  
  // Error log file
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Combined log file
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan
export const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Custom logger methods for different contexts
export const createLogger = (context) => {
  return {
    info: (message, meta = {}) => {
      logger.info(`[${context}] ${message}`, meta);
    },
    error: (message, error = null, meta = {}) => {
      const errorMessage = error ? ` - ${error.message || error}` : '';
      logger.error(`[${context}] ${message}${errorMessage}`, {
        ...meta,
        stack: error?.stack,
      });
    },
    warn: (message, meta = {}) => {
      logger.warn(`[${context}] ${message}`, meta);
    },
    debug: (message, meta = {}) => {
      logger.debug(`[${context}] ${message}`, meta);
    },
    http: (message, meta = {}) => {
      logger.http(`[${context}] ${message}`, meta);
    },
  };
};

// Transaction logger
export const transactionLogger = createLogger('TRANSACTION');

// Security logger
export const securityLogger = createLogger('SECURITY');

// API logger
export const apiLogger = createLogger('API');

// Database logger
export const dbLogger = createLogger('DATABASE');

// Payment logger
export const paymentLogger = createLogger('PAYMENT');

// Loan logger
export const loanLogger = createLogger('LOAN');

// Audit logger for compliance
export const auditLogger = createLogger('AUDIT');

// Performance logger
export const performanceLogger = createLogger('PERFORMANCE');

// Export default logger
export default logger; 