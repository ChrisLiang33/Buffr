import { logger } from './logger.js';

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
];

const optionalEnvVars = [
  'REDIS_URL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'PAYMENT_GATEWAY_API_KEY',
  'PAYMENT_GATEWAY_SECRET',
  'CORS_ORIGIN',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS',
  'BCRYPT_ROUNDS',
  'LOG_LEVEL',
  'LOG_FILE_PATH',
  'MAX_FILE_SIZE',
  'UPLOAD_PATH',
  'MIN_TRANSACTION_AMOUNT',
  'MAX_TRANSACTION_AMOUNT',
  'DAILY_TRANSACTION_LIMIT',
  'MONTHLY_TRANSACTION_LIMIT',
  'LOAN_INTEREST_RATE',
  'LOAN_MAX_AMOUNT',
  'LOAN_MIN_AMOUNT',
];

export const validateEnv = () => {
  const missingVars = [];
  const invalidVars = [];

  // Check required environment variables
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Validate specific environment variables
  if (process.env.PORT && isNaN(process.env.PORT)) {
    invalidVars.push('PORT (must be a number)');
  }

  if (process.env.NODE_ENV && !['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    invalidVars.push('NODE_ENV (must be development, production, or test)');
  }

  if (process.env.JWT_EXPIRES_IN && !/^\d+[dhms]$/.test(process.env.JWT_EXPIRES_IN)) {
    invalidVars.push('JWT_EXPIRES_IN (must be in format: 1d, 7h, 30m, etc.)');
  }

  if (process.env.BCRYPT_ROUNDS && (isNaN(process.env.BCRYPT_ROUNDS) || process.env.BCRYPT_ROUNDS < 10)) {
    invalidVars.push('BCRYPT_ROUNDS (must be a number >= 10)');
  }

  if (process.env.RATE_LIMIT_WINDOW_MS && isNaN(process.env.RATE_LIMIT_WINDOW_MS)) {
    invalidVars.push('RATE_LIMIT_WINDOW_MS (must be a number)');
  }

  if (process.env.RATE_LIMIT_MAX_REQUESTS && isNaN(process.env.RATE_LIMIT_MAX_REQUESTS)) {
    invalidVars.push('RATE_LIMIT_MAX_REQUESTS (must be a number)');
  }

  if (process.env.MAX_FILE_SIZE && isNaN(process.env.MAX_FILE_SIZE)) {
    invalidVars.push('MAX_FILE_SIZE (must be a number)');
  }

  // Check business logic variables
  const businessVars = [
    'MIN_TRANSACTION_AMOUNT',
    'MAX_TRANSACTION_AMOUNT',
    'DAILY_TRANSACTION_LIMIT',
    'MONTHLY_TRANSACTION_LIMIT',
    'LOAN_INTEREST_RATE',
    'LOAN_MAX_AMOUNT',
    'LOAN_MIN_AMOUNT',
  ];

  businessVars.forEach((varName) => {
    if (process.env[varName] && isNaN(process.env[varName])) {
      invalidVars.push(`${varName} (must be a number)`);
    }
  });

  // Log warnings for missing optional variables
  const missingOptional = [];
  optionalEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingOptional.push(varName);
    }
  });

  // Report issues
  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  if (invalidVars.length > 0) {
    logger.error(`Invalid environment variables: ${invalidVars.join(', ')}`);
    throw new Error(`Invalid environment variables: ${invalidVars.join(', ')}`);
  }

  if (missingOptional.length > 0) {
    logger.warn(`Missing optional environment variables: ${missingOptional.join(', ')}`);
  }

  logger.info('Environment validation passed');
};

// Validate specific configuration
export const validateConfig = () => {
  const config = {
    server: {
      port: parseInt(process.env.PORT) || 3001,
      nodeEnv: process.env.NODE_ENV || 'development',
      apiVersion: process.env.API_VERSION || 'v1',
    },
    database: {
      mongodbUri: process.env.MONGODB_URI,
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },
    email: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.EMAIL_FROM || 'noreply@buffr.com',
    },
    sms: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
    payment: {
      apiKey: process.env.PAYMENT_GATEWAY_API_KEY,
      secret: process.env.PAYMENT_GATEWAY_SECRET,
    },
    security: {
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
      rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
      rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      filePath: process.env.LOG_FILE_PATH || 'logs/app.log',
    },
    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
      uploadPath: process.env.UPLOAD_PATH || 'uploads/',
    },
    business: {
      minTransactionAmount: parseFloat(process.env.MIN_TRANSACTION_AMOUNT) || 1,
      maxTransactionAmount: parseFloat(process.env.MAX_TRANSACTION_AMOUNT) || 1000000,
      dailyTransactionLimit: parseFloat(process.env.DAILY_TRANSACTION_LIMIT) || 50000,
      monthlyTransactionLimit: parseFloat(process.env.MONTHLY_TRANSACTION_LIMIT) || 500000,
      loanInterestRate: parseFloat(process.env.LOAN_INTEREST_RATE) || 12.5,
      loanMaxAmount: parseFloat(process.env.LOAN_MAX_AMOUNT) || 200000,
      loanMinAmount: parseFloat(process.env.LOAN_MIN_AMOUNT) || 1000,
    },
  };

  return config;
}; 