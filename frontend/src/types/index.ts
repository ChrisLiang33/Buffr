import React from "react";

// User and Authentication Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: Address;
  kycStatus: "pending" | "verified" | "rejected";
  accountType: "personal" | "business";
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Financial Types
export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: "savings" | "checking" | "business";
  balance: number;
  currency: string;
  status: "active" | "suspended" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: "credit" | "debit" | "transfer" | "payment";
  amount: number;
  currency: string;
  description: string;
  category: TransactionCategory;
  status: "pending" | "completed" | "failed" | "cancelled";
  reference: string;
  recipientId?: string;
  recipientName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionCategory =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "entertainment"
  | "health"
  | "education"
  | "transfer"
  | "other";

export interface Loan {
  id: string;
  userId: string;
  type: LoanType;
  amount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  duration: number; // in months
  status: "pending" | "approved" | "active" | "completed" | "defaulted";
  purpose: string;
  nextPaymentDate: Date;
  appliedDate: Date;
  approvedDate?: Date;
  completedDate?: Date;
}

export interface LoanType {
  id: number;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  duration: string;
  requirements: string[];
  icon: string;
}

// UI Component Types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export interface InputProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// Authentication Context Types
export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    profile: Partial<UserProfile>
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: Address;
}

export interface TransferFormData {
  recipientEmail: string;
  amount: number;
  description: string;
  category: TransactionCategory;
}

export interface LoanApplicationData {
  loanTypeId: number;
  amount: number;
  purpose: string;
  duration: number;
  monthlyIncome: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Service Types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Utility Types
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Route Types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  protected?: boolean;
  roles?: string[];
}

// Theme Types
export interface Theme {
  mode: "light" | "dark" | "auto";
  primaryColor: string;
  secondaryColor: string;
}

// Settings Types
export interface UserSettings {
  theme: Theme;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private";
    transactionHistory: "all" | "recent" | "none";
  };
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Validation Types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Hook Types
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

export interface UseDebounceReturn<T> {
  value: T;
  debouncedValue: T;
}

// Component Props with Common Patterns
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
}

export interface ClickableProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType;
  protected?: boolean;
  roles?: string[];
}

// Dashboard Types
export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  pendingTransactions: number;
  activeLoans: number;
}

// Search Types
export interface SearchFilters {
  query: string;
  category?: TransactionCategory;
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  status?: string;
}
