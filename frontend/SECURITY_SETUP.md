# Security Setup Guide

This guide explains the security improvements implemented in the Buffr application and how to configure them properly.

## 🔒 Security Features Implemented

### 1. Environment Variables

- Firebase configuration moved to environment variables
- Sensitive data no longer hardcoded in source code
- Environment validation on startup

### 2. Input Validation & Sanitization

- Comprehensive email validation
- Password strength requirements
- Amount validation with limits
- XSS prevention through HTML entity encoding
- Input sanitization to remove malicious content

### 3. Rate Limiting

- Login attempt limiting (configurable)
- Protection against brute force attacks
- Automatic reset on successful authentication

### 4. Session Management

- Configurable session timeout
- Automatic session expiry
- Session timeout warnings
- CSRF token protection

### 5. Protected Routes

- Authentication required for sensitive pages
- Automatic redirect to login
- Loading states during authentication checks

## 🚀 Setup Instructions

### 1. Environment Configuration

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Security Settings
   VITE_MAX_LOGIN_ATTEMPTS=5
   VITE_SESSION_TIMEOUT=3600000
   ```

### 2. Firebase Configuration

1. Go to your Firebase Console
2. Select your project
3. Go to Project Settings
4. Copy the configuration values to your `.env` file

### 3. Security Settings

- `VITE_MAX_LOGIN_ATTEMPTS`: Maximum failed login attempts before temporary lockout (default: 5)
- `VITE_SESSION_TIMEOUT`: Session timeout in milliseconds (default: 1 hour)

## 🔧 Security Best Practices

### For Developers

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **Use strong passwords** - The app enforces minimum 8 characters with letters and numbers
3. **Validate all inputs** - Use the validation utilities provided
4. **Handle errors gracefully** - Don't expose sensitive information in error messages

### For Production

1. **Use HTTPS** - Always serve the application over HTTPS
2. **Set up Firebase Security Rules** - Configure proper Firestore security rules
3. **Enable Firebase Authentication** - Use Firebase's built-in security features
4. **Monitor for suspicious activity** - Set up logging and monitoring
5. **Regular security updates** - Keep dependencies updated

## 🛡️ Security Features in Detail

### Input Validation

The application includes comprehensive validation for:

- **Emails**: Proper email format validation
- **Passwords**: Minimum 8 characters, must contain letters and numbers
- **Amounts**: Positive numbers with up to 2 decimal places, maximum limit of 1,000,000
- **Recipient validation**: Cannot send to self, recipient must exist

### Rate Limiting

- Tracks login attempts by email address
- 15-minute window for attempt counting
- Automatic reset on successful login
- Configurable maximum attempts

### Session Management

- Automatic session timeout after inactivity
- Warning notifications before session expiry
- CSRF token validation for sensitive operations
- Secure session storage

### XSS Prevention

- HTML entity encoding for user inputs
- Input sanitization to remove HTML tags
- Content Security Policy ready

## 🚨 Security Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Firebase security rules set up
- [ ] HTTPS enabled
- [ ] Error logging configured
- [ ] Monitoring set up
- [ ] Dependencies updated
- [ ] Security headers configured
- [ ] Rate limiting tested
- [ ] Session timeout tested
- [ ] Input validation tested

## 🔍 Testing Security Features

### Test Rate Limiting

1. Try to log in with wrong credentials multiple times
2. Verify that the account gets temporarily locked
3. Verify that successful login resets the counter

### Test Session Timeout

1. Log in to the application
2. Leave the application idle for the session timeout period
3. Verify that the session expires and user is logged out

### Test Input Validation

1. Try to submit forms with invalid data
2. Verify that validation errors are shown
3. Verify that malicious inputs are sanitized

### Test Protected Routes

1. Try to access protected routes without authentication
2. Verify that you are redirected to the login page
3. Verify that you can access protected routes after authentication

## 📞 Security Support

If you encounter security issues or have questions:

1. Check the Firebase Console for authentication logs
2. Review the browser console for error messages
3. Verify environment variable configuration
4. Test with the security checklist above

## 🔄 Updates

This security setup will be updated as new security features are added. Always check for the latest security recommendations and best practices.
