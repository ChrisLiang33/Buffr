import mongoose from 'mongoose';
import { logger, transactionLogger } from '../utils/logger.js';

const transactionSchema = new mongoose.Schema({
  // Transaction Identification
  transactionId: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  referenceNumber: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  externalReference: {
    type: String,
    sparse: true,
    index: true,
  },

  // Transaction Details
  type: {
    type: String,
    enum: [
      'transfer', 'deposit', 'withdrawal', 'payment', 'refund', 
      'loan_disbursement', 'loan_repayment', 'fee', 'bonus', 
      'mobile_recharge', 'bill_payment', 'qr_payment'
    ],
    required: true,
  },
  category: {
    type: String,
    enum: [
      'personal', 'business', 'utilities', 'entertainment', 'food', 
      'transport', 'health', 'education', 'shopping', 'travel', 
      'investment', 'loan', 'other'
    ],
    required: true,
  },
  subcategory: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be greater than 0'],
  },
  currency: {
    type: String,
    default: 'NAD',
    enum: ['NAD', 'USD', 'EUR', 'ZAR'],
  },
  exchangeRate: {
    type: Number,
    default: 1,
  },
  originalAmount: {
    type: Number,
    required: true,
  },
  originalCurrency: {
    type: String,
    default: 'NAD',
  },

  // Parties Involved
  sender: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    name: String,
    phoneNumber: String,
    email: String,
  },
  recipient: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    email: String,
    bankAccount: {
      bankName: String,
      accountNumber: String,
      accountType: String,
      swiftCode: String,
      iban: String,
    },
  },

  // Transaction Status & Flow
  status: {
    type: String,
    enum: [
      'pending', 'processing', 'completed', 'failed', 'cancelled', 
      'reversed', 'disputed', 'refunded', 'expired'
    ],
    default: 'pending',
    index: true,
  },
  statusHistory: [{
    status: {
      type: String,
      enum: [
        'pending', 'processing', 'completed', 'failed', 'cancelled', 
        'reversed', 'disputed', 'refunded', 'expired'
      ],
    },
    timestamp: { type: Date, default: Date.now },
    reason: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metadata: mongoose.Schema.Types.Mixed,
  }],
  processingTime: {
    type: Number, // in milliseconds
  },
  completedAt: Date,
  failedAt: Date,
  failureReason: String,

  // Fees & Charges
  fees: {
    transactionFee: {
      type: Number,
      default: 0,
    },
    processingFee: {
      type: Number,
      default: 0,
    },
    currencyConversionFee: {
      type: Number,
      default: 0,
    },
    totalFees: {
      type: Number,
      default: 0,
    },
  },
  netAmount: {
    type: Number,
    required: true,
  },

  // Security & Compliance
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  riskFactors: [{
    factor: String,
    score: Number,
    description: String,
  }],
  complianceFlags: [{
    flag: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    description: String,
    resolved: { type: Boolean, default: false },
    resolvedAt: Date,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  amlCheck: {
    performed: { type: Boolean, default: false },
    result: {
      type: String,
      enum: ['passed', 'failed', 'pending', 'manual_review'],
    },
    performedAt: Date,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String,
  },
  kycVerified: {
    sender: { type: Boolean, default: false },
    recipient: { type: Boolean, default: false },
  },

  // Payment Method & Channel
  paymentMethod: {
    type: String,
    enum: [
      'wallet', 'bank_transfer', 'card', 'mobile_money', 'qr_code', 
      'cash_deposit', 'loan', 'direct_debit'
    ],
    required: true,
  },
  channel: {
    type: String,
    enum: ['web', 'mobile_app', 'sms', 'ussd', 'api', 'atm', 'branch'],
    required: true,
  },
  deviceInfo: {
    deviceType: String,
    deviceId: String,
    appVersion: String,
    osVersion: String,
    ipAddress: String,
    userAgent: String,
    location: {
      country: String,
      city: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
  },

  // Related Transactions
  parentTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  },
  relatedTransactions: [{
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    relationship: {
      type: String,
      enum: ['refund', 'reversal', 'split', 'consolidation', 'fee'],
    },
  }],

  // Metadata & Tags
  tags: [String],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  notes: {
    internal: String,
    customer: String,
  },

  // Audit & Logging
  auditTrail: [{
    action: String,
    description: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    performedAt: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    changes: mongoose.Schema.Types.Mixed,
  }],
  logs: [{
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'debug'],
    },
    message: String,
    timestamp: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed,
  }],

  // Timestamps
  scheduledAt: Date,
  processedAt: Date,
  settledAt: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for performance
transactionSchema.index({ sender: { userId: 1 }, createdAt: -1 });
transactionSchema.index({ recipient: { userId: 1 }, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1, createdAt: -1 });
transactionSchema.index({ amount: 1, createdAt: -1 });
transactionSchema.index({ 'sender.phoneNumber': 1, createdAt: -1 });
transactionSchema.index({ 'recipient.phoneNumber': 1, createdAt: -1 });
transactionSchema.index({ referenceNumber: 1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ riskScore: 1, createdAt: -1 });

// Virtual fields
transactionSchema.virtual('isHighRisk').get(function() {
  return this.riskScore >= 70;
});

transactionSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

transactionSchema.virtual('isPending').get(function() {
  return ['pending', 'processing'].includes(this.status);
});

transactionSchema.virtual('isFailed').get(function() {
  return ['failed', 'cancelled', 'expired'].includes(this.status);
});

transactionSchema.virtual('canBeReversed').get(function() {
  return this.status === 'completed' && this.type !== 'fee';
});

transactionSchema.virtual('totalAmount').get(function() {
  return this.amount + this.fees.totalFees;
});

// Pre-save middleware
transactionSchema.pre('save', function(next) {
  // Generate transaction ID if not exists
  if (!this.transactionId) {
    this.transactionId = generateTransactionId();
  }

  // Generate reference number if not exists
  if (!this.referenceNumber) {
    this.referenceNumber = generateReferenceNumber();
  }

  // Calculate net amount
  if (this.amount && this.fees) {
    this.netAmount = this.amount - this.fees.totalFees;
  }

  // Update status history
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      reason: this.failureReason || 'Status updated',
    });
  }

  next();
});

// Post-save middleware for logging
transactionSchema.post('save', function(doc) {
  transactionLogger.info(`Transaction ${doc.transactionId} ${doc.status}`, {
    transactionId: doc.transactionId,
    type: doc.type,
    amount: doc.amount,
    status: doc.status,
    sender: doc.sender?.userId,
    recipient: doc.recipient?.userId,
  });
});

// Instance methods
transactionSchema.methods.updateStatus = function(newStatus, reason = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    reason,
    updatedBy,
  });

  if (newStatus === 'completed') {
    this.completedAt = new Date();
    this.processingTime = this.completedAt - this.createdAt;
  } else if (newStatus === 'failed') {
    this.failedAt = new Date();
    this.failureReason = reason;
  }

  return this.save();
};

transactionSchema.methods.addLog = function(level, message, metadata = {}) {
  this.logs.push({
    level,
    message,
    timestamp: new Date(),
    metadata,
  });
  return this.save();
};

transactionSchema.methods.addAuditTrail = function(action, description, performedBy, changes = {}) {
  this.auditTrail.push({
    action,
    description,
    performedBy,
    performedAt: new Date(),
    changes,
  });
  return this.save();
};

transactionSchema.methods.addComplianceFlag = function(flag, severity, description) {
  this.complianceFlags.push({
    flag,
    severity,
    description,
  });
  return this.save();
};

transactionSchema.methods.resolveComplianceFlag = function(flag, resolvedBy) {
  const flagToResolve = this.complianceFlags.find(f => f.flag === flag && !f.resolved);
  if (flagToResolve) {
    flagToResolve.resolved = true;
    flagToResolve.resolvedAt = new Date();
    flagToResolve.resolvedBy = resolvedBy;
  }
  return this.save();
};

// Static methods
transactionSchema.statics.findByTransactionId = function(transactionId) {
  return this.findOne({ transactionId });
};

transactionSchema.statics.findByReferenceNumber = function(referenceNumber) {
  return this.findOne({ referenceNumber });
};

transactionSchema.statics.findUserTransactions = function(userId, options = {}) {
  const query = {
    $or: [
      { 'sender.userId': userId },
      { 'recipient.userId': userId },
    ],
  };

  if (options.status) {
    query.status = options.status;
  }

  if (options.type) {
    query.type = options.type;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50)
    .skip(options.skip || 0);
};

transactionSchema.statics.getTransactionStats = function(userId, period = 'month') {
  const dateFilter = {};
  const now = new Date();

  switch (period) {
    case 'day':
      dateFilter.$gte = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      dateFilter.$gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      dateFilter.$gte = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      dateFilter.$gte = new Date(now.getFullYear(), 0, 1);
      break;
  }

  return this.aggregate([
    {
      $match: {
        $or: [
          { 'sender.userId': mongoose.Types.ObjectId(userId) },
          { 'recipient.userId': mongoose.Types.ObjectId(userId) },
        ],
        createdAt: dateFilter,
        status: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalFees: { $sum: '$fees.totalFees' },
        averageAmount: { $avg: '$amount' },
      },
    },
  ]);
};

// Helper functions
function generateTransactionId() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp}${random}`;
}

function generateReferenceNumber() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `REF${timestamp}${random}`;
}

// Export the model
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction; 