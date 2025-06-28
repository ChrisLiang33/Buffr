import jwt from 'jsonwebtoken';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { AppError } from './errorHandler.js';
import { logger, securityLogger } from '../utils/logger.js';
import { getCache, setCache } from '../config/database.js';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// Verify JWT token
export const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};

// Verify Firebase token
export const verifyFirebaseToken = async (idToken) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    securityLogger.error('Firebase token verification failed:', error);
    throw new AppError('Invalid Firebase token', 401);
  }
};

// Main authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    let token;
    let user;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Access denied. No token provided.', 401));
    }

    // Check cache first
    const cachedUser = await getCache(`user:${token}`);
    if (cachedUser) {
      req.user = cachedUser;
      return next();
    }

    // Verify token
    const decoded = await verifyToken(token);

    // Get user from database
    const { User } = await import('../models/User.js');
    user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Account is deactivated', 401));
    }

    // Cache user for 15 minutes
    await setCache(`user:${token}`, user, 900);

    req.user = user;
    next();
  } catch (error) {
    securityLogger.error('Authentication failed:', error);
    return next(new AppError('Authentication failed', 401));
  }
};

// Firebase authentication middleware
export const authenticateFirebase = async (req, res, next) => {
  try {
    let idToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      idToken = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.firebaseToken) {
      idToken = req.cookies.firebaseToken;
    }

    if (!idToken) {
      return next(new AppError('Access denied. No Firebase token provided.', 401));
    }

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(idToken);

    // Get or create user from database
    const { User } = await import('../models/User.js');
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      // Create new user from Firebase data
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        firstName: decodedToken.name?.split(' ')[0] || '',
        lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
        phoneNumber: decodedToken.phone_number || '',
        emailVerified: decodedToken.email_verified || false,
        profilePicture: decodedToken.picture || '',
        isActive: true,
        role: 'user',
      });

      logger.info(`New user created from Firebase: ${user.email}`);
    }

    req.user = user;
    next();
  } catch (error) {
    securityLogger.error('Firebase authentication failed:', error);
    return next(new AppError('Firebase authentication failed', 401));
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      securityLogger.warn(`Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`);
      return next(new AppError('Access denied. Insufficient permissions.', 403));
    }

    next();
  };
};

// Account ownership verification
export const verifyOwnership = (modelName) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const { [modelName]: Model } = await import(`../models/${modelName}.js`);
      
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return next(new AppError('Resource not found', 404));
      }

      // Check if user owns the resource or is admin
      if (resource.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        securityLogger.warn(`Unauthorized access attempt to ${modelName} ${resourceId} by user ${req.user.id}`);
        return next(new AppError('Access denied. You can only access your own resources.', 403));
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Rate limiting for sensitive operations
export const sensitiveOperationLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = `${req.ip}:${req.user?.id || 'anonymous'}`;
    const now = Date.now();
    const userAttempts = attempts.get(key) || [];

    // Remove old attempts
    const recentAttempts = userAttempts.filter(timestamp => now - timestamp < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      securityLogger.warn(`Rate limit exceeded for sensitive operation by ${key}`);
      return next(new AppError('Too many attempts. Please try again later.', 429));
    }

    recentAttempts.push(now);
    attempts.set(key, recentAttempts);

    next();
  };
};

// Session validation
export const validateSession = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError('Session not found', 401));
    }

    // Check if user's session is still valid
    const sessionKey = `session:${req.user.id}`;
    const session = await getCache(sessionKey);

    if (!session) {
      return next(new AppError('Session expired', 401));
    }

    // Update session timestamp
    await setCache(sessionKey, { ...session, lastActivity: Date.now() }, 3600);

    next();
  } catch (error) {
    next(error);
  }
};

// Two-factor authentication middleware
export const require2FA = async (req, res, next) => {
  try {
    if (!req.user.twoFactorEnabled) {
      return next(new AppError('Two-factor authentication is required for this operation', 403));
    }

    const { twoFactorCode } = req.body;
    if (!twoFactorCode) {
      return next(new AppError('Two-factor authentication code is required', 400));
    }

    // Verify 2FA code (implement your 2FA verification logic here)
    const isValid = await verify2FACode(req.user.id, twoFactorCode);
    
    if (!isValid) {
      securityLogger.warn(`Invalid 2FA code attempt by user ${req.user.id}`);
      return next(new AppError('Invalid two-factor authentication code', 401));
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Mock 2FA verification (replace with actual implementation)
const verify2FACode = async (userId, code) => {
  // Implement your 2FA verification logic here
  // This could involve TOTP, SMS codes, etc.
  return code === '123456'; // Mock verification
};

// Audit logging middleware
export const auditLog = (action) => {
  return (req, res, next) => {
    const auditData = {
      userId: req.user?.id,
      action,
      resource: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
      requestBody: req.body,
      params: req.params,
      query: req.query,
    };

    // Log audit event
    logger.info('Audit event', auditData);

    // Store in audit collection
    // You can implement this to store in a separate audit collection
    next();
  };
}; 