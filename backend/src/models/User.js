import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        const age = Math.floor((Date.now() - value) / (365.25 * 24 * 60 * 60 * 1000));
        return age >= 18;
      },
      message: 'User must be at least 18 years old',
    },
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required'],
  },

  // Authentication & Security
  password: {
    type: String,
    required: function() { return !this.firebaseUid; }, // Required only if not Firebase user
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Don't include password in queries by default
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: Date,
  lastLogin: Date,
  lastLoginIp: String,

  // Profile & Preferences
  profilePicture: {
    type: String,
    default: '',
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Namibia',
    },
    postalCode: String,
  },
  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'af', 'de'],
    },
    currency: {
      type: String,
      default: 'NAD',
      enum: ['NAD', 'USD', 'EUR', 'ZAR'],
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      transactionAlerts: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    privacy: {
      profileVisibility: {
        type: String,
        default: 'private',
        enum: ['public', 'friends', 'private'],
      },
      showBalance: { type: Boolean, default: false },
      showTransactions: { type: Boolean, default: true },
    },
  },

  // KYC & Compliance
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending',
  },
  kycDocuments: [{
    type: {
      type: String,
      enum: ['id_card', 'passport', 'drivers_license', 'utility_bill', 'bank_statement'],
    },
    documentNumber: String,
    documentUrl: String,
    uploadedAt: { type: Date, default: Date.now },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: String,
  }],
  identityVerified: {
    type: Boolean,
    default: false,
  },
  addressVerified: {
    type: Boolean,
    default: false,
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  complianceNotes: [{
    note: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
  }],

  // Account & Financial
  role: {
    type: String,
    enum: ['user', 'admin', 'support', 'compliance'],
    default: 'user',
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'closed', 'pending_verification'],
    default: 'pending_verification',
  },
  accountType: {
    type: String,
    enum: ['personal', 'business', 'premium'],
    default: 'personal',
  },
  totalBalance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative'],
  },
  monthlyTransactionLimit: {
    type: Number,
    default: 50000,
  },
  dailyTransactionLimit: {
    type: Number,
    default: 10000,
  },
  transactionCount: {
    type: Number,
    default: 0,
  },
  totalTransactionVolume: {
    type: Number,
    default: 0,
  },

  // Business Account (if applicable)
  businessInfo: {
    businessName: String,
    businessType: {
      type: String,
      enum: ['sole_proprietorship', 'partnership', 'corporation', 'llc'],
    },
    registrationNumber: String,
    taxId: String,
    industry: String,
    website: String,
    businessAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
  },

  // Security & Audit
  securityQuestions: [{
    question: String,
    answer: {
      type: String,
      select: false,
    },
  }],
  deviceTokens: [{
    token: String,
    deviceType: String,
    lastUsed: Date,
  }],
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ip: String,
    userAgent: String,
    location: String,
    success: Boolean,
  }],
  activityLog: [{
    action: String,
    description: String,
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed,
  }],

  // Timestamps
  emailVerifiedAt: Date,
  phoneVerifiedAt: Date,
  kycVerifiedAt: Date,
  lastActivity: { type: Date, default: Date.now },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ firebaseUid: 1 });
userSchema.index({ kycStatus: 1 });
userSchema.index({ accountStatus: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastActivity: -1 });

// Virtual fields
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.virtual('isVerified').get(function() {
  return this.emailVerified && this.phoneVerified && this.kycStatus === 'verified';
});

userSchema.virtual('canTransact').get(function() {
  return this.accountStatus === 'active' && this.kycStatus === 'verified' && !this.isLocked;
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();

  try {
    // Hash password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Set passwordChangedAt
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token is created after password change
    
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre('save', function(next) {
  // Update lastActivity on any save
  this.lastActivity = new Date();
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: Date.now() }
  });
};

userSchema.methods.logActivity = function(action, description, metadata = {}) {
  this.activityLog.push({
    action,
    description,
    ip: metadata.ip || '',
    userAgent: metadata.userAgent || '',
    metadata,
  });
  
  // Keep only last 100 activities
  if (this.activityLog.length > 100) {
    this.activityLog = this.activityLog.slice(-100);
  }
  
  return this.save();
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByPhone = function(phone) {
  return this.findOne({ phoneNumber: phone });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ accountStatus: 'active' });
};

userSchema.statics.findPendingKYC = function() {
  return this.find({ kycStatus: 'pending' });
};

// Export the model
const User = mongoose.model('User', userSchema);

export default User; 