import { ValidationRule, ValidationResult } from "@/types";

// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic phone validation - can be customized for specific regions
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const validateAmount = (
  amount: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    errors.push("Amount must be a valid number");
  } else if (numAmount <= 0) {
    errors.push("Amount must be greater than 0");
  } else if (numAmount > 1000000) {
    errors.push("Amount cannot exceed 1,000,000");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (
  value: string,
  minLength: number
): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (
  value: string,
  maxLength: number
): boolean => {
  return value.length <= maxLength;
};

export const validatePattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

// Generic validation function
export const validateField = (
  value: string,
  rules: ValidationRule[]
): ValidationResult => {
  const errors: string[] = [];

  for (const rule of rules) {
    if (rule.required && !validateRequired(value)) {
      errors.push("This field is required");
      continue;
    }

    if (rule.minLength && !validateMinLength(value, rule.minLength)) {
      errors.push(`Minimum length is ${rule.minLength} characters`);
    }

    if (rule.maxLength && !validateMaxLength(value, rule.maxLength)) {
      errors.push(`Maximum length is ${rule.maxLength} characters`);
    }

    if (rule.pattern && !validatePattern(value, rule.pattern)) {
      errors.push("Invalid format");
    }

    if (rule.custom) {
      const customResult = rule.custom(value);
      if (typeof customResult === "string") {
        errors.push(customResult);
      } else if (!customResult) {
        errors.push("Invalid value");
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Form validation
export const validateForm = (
  formData: Record<string, string>,
  validationSchema: Record<string, ValidationRule[]>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    const value = formData[fieldName] || "";
    results[fieldName] = validateField(value, rules);
  }

  return results;
};

// Specific validation schemas
export const loginValidationSchema = {
  email: [
    { required: true },
    {
      custom: (value: string) => validateEmail(value) || "Invalid email format",
    },
  ],
  password: [{ required: true }, { minLength: 8 }],
};

export const signUpValidationSchema = {
  email: [
    { required: true },
    {
      custom: (value: string) => validateEmail(value) || "Invalid email format",
    },
  ],
  password: [
    { required: true },
    { minLength: 8 },
    {
      custom: (value: string) => {
        const result = validatePassword(value);
        return result.isValid || result.errors[0];
      },
    },
  ],
  confirmPassword: [
    { required: true },
    {
      custom: (value: string, formData?: Record<string, string>) => {
        if (formData && value !== formData.password) {
          return "Passwords do not match";
        }
        return true;
      },
    },
  ],
  firstName: [{ required: true }, { minLength: 2 }, { maxLength: 50 }],
  lastName: [{ required: true }, { minLength: 2 }, { maxLength: 50 }],
  phoneNumber: [
    { required: true },
    {
      custom: (value: string) =>
        validatePhoneNumber(value) || "Invalid phone number",
    },
  ],
};

export const transferValidationSchema = {
  recipientEmail: [
    { required: true },
    {
      custom: (value: string) => validateEmail(value) || "Invalid email format",
    },
  ],
  amount: [
    { required: true },
    {
      custom: (value: string) => {
        const result = validateAmount(value);
        return result.isValid || result.errors[0];
      },
    },
  ],
  description: [{ required: true }, { minLength: 5 }, { maxLength: 200 }],
};

export const loanApplicationValidationSchema = {
  amount: [
    { required: true },
    {
      custom: (value: string) => {
        const result = validateAmount(value);
        return result.isValid || result.errors[0];
      },
    },
  ],
  purpose: [{ required: true }, { minLength: 10 }, { maxLength: 500 }],
  monthlyIncome: [
    { required: true },
    {
      custom: (value: string) => {
        const result = validateAmount(value);
        return result.isValid || result.errors[0];
      },
    },
  ],
};

// Utility functions
export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatPhoneNumber = (phone: string): string => {
  // Basic phone formatting - can be enhanced for specific regions
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

export const generateReference = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `REF-${timestamp}-${random}`.toUpperCase();
};
