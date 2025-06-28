// Input validation and sanitization utilities

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password validation regex (minimum 8 characters, at least one letter and one number)
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// Amount validation regex (positive numbers with up to 2 decimal places)
const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;

// XSS prevention - HTML entity encoding
export const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  // Remove any HTML tags
  const stripped = input.replace(/<[^>]*>/g, "");

  // Trim whitespace
  return stripped.trim();
};

// Validate email format
export const validateEmail = (email) => {
  if (!email) return { isValid: false, error: "Email is required" };

  const sanitizedEmail = sanitizeInput(email);

  if (!EMAIL_REGEX.test(sanitizedEmail)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true, value: sanitizedEmail };
};

// Validate password strength
export const validatePassword = (password) => {
  if (!password) return { isValid: false, error: "Password is required" };

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one letter and one number",
    };
  }

  return { isValid: true, value: password };
};

// Validate amount
export const validateAmount = (amount) => {
  if (!amount) return { isValid: false, error: "Amount is required" };

  const sanitizedAmount = sanitizeInput(amount.toString());

  if (!AMOUNT_REGEX.test(sanitizedAmount)) {
    return {
      isValid: false,
      error:
        "Please enter a valid amount (positive number with up to 2 decimal places)",
    };
  }

  const numAmount = parseFloat(sanitizedAmount);

  if (numAmount <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }

  if (numAmount > 1000000) {
    return { isValid: false, error: "Amount cannot exceed 1,000,000" };
  }

  return { isValid: true, value: numAmount };
};

// Validate recipient email
export const validateRecipientEmail = (
  email,
  currentUserEmail,
  existingEmails = []
) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) return emailValidation;

  if (emailValidation.value === currentUserEmail) {
    return { isValid: false, error: "You cannot send money to yourself" };
  }

  if (
    existingEmails.length > 0 &&
    !existingEmails.includes(emailValidation.value)
  ) {
    return { isValid: false, error: "Recipient not found in the system" };
  }

  return emailValidation;
};

// Rate limiting utility
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    // 15 minutes default
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];

    // Remove old attempts outside the time window
    const recentAttempts = userAttempts.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);

    return true;
  }

  reset(identifier) {
    this.attempts.delete(identifier);
  }

  getRemainingAttempts(identifier) {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    const recentAttempts = userAttempts.filter(
      (timestamp) => now - timestamp < this.windowMs
    );
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
}

// Session timeout utility
export class SessionManager {
  constructor(timeoutMs = 60 * 60 * 1000) {
    // 1 hour default
    this.timeoutMs = timeoutMs;
    this.lastActivity = Date.now();
    this.setupActivityListeners();
  }

  setupActivityListeners() {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, () => this.updateActivity(), true);
    });
  }

  updateActivity() {
    this.lastActivity = Date.now();
  }

  isSessionValid() {
    return Date.now() - this.lastActivity < this.timeoutMs;
  }

  getTimeUntilExpiry() {
    const timeElapsed = Date.now() - this.lastActivity;
    return Math.max(0, this.timeoutMs - timeElapsed);
  }

  reset() {
    this.lastActivity = Date.now();
  }
}

// CSRF token generation and validation
export const generateCSRFToken = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const validateCSRFToken = (token, storedToken) => {
  return token === storedToken;
};
