/**
 * Email validation
 * Checks if email format is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Password validation
 * Checks if password meets strength requirements
 */
export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  
  // Check for at least one letter and one number (stronger validation)
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one letter and one number' 
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Confirm password validation
 * Checks if passwords match
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || !confirmPassword.trim()) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Name validation
 * Checks if name is valid
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Phone number validation (optional field)
 */
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return { isValid: true, error: '' }; // Optional field
  }
  
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  if (phone.replace(/\D/g, '').length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Date validation for booking
 */
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (!(date instanceof Date) || isNaN(date)) {
    return { isValid: false, error: `Invalid ${fieldName.toLowerCase()}` };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Check-in and Check-out date validation
 */
export const validateBookingDates = (checkIn, checkOut) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Validate check-in
  if (!checkIn || !(checkIn instanceof Date)) {
    return { isValid: false, error: 'Check-in date is required' };
  }
  
  if (checkIn < today) {
    return { isValid: false, error: 'Check-in date cannot be in the past' };
  }
  
  // Validate check-out
  if (!checkOut || !(checkOut instanceof Date)) {
    return { isValid: false, error: 'Check-out date is required' };
  }
  
  if (checkOut <= checkIn) {
    return { isValid: false, error: 'Check-out must be after check-in date' };
  }
  
  // Check maximum stay (e.g., 30 days)
  const daysDiff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  if (daysDiff > 30) {
    return { isValid: false, error: 'Maximum stay is 30 days' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Number validation
 */
export const validateNumber = (value, fieldName, min = 1, max = 100) => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const num = parseInt(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  
  if (num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (num > max) {
    return { isValid: false, error: `${fieldName} cannot exceed ${max}` };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Review text validation
 */
export const validateReviewText = (text) => {
  if (!text || !text.trim()) {
    return { isValid: false, error: 'Review text is required' };
  }
  
  if (text.trim().length < 10) {
    return { isValid: false, error: 'Review must be at least 10 characters' };
  }
  
  if (text.trim().length > 500) {
    return { isValid: false, error: 'Review must be less than 500 characters' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Rating validation
 */
export const validateRating = (rating) => {
  if (rating === null || rating === undefined) {
    return { isValid: false, error: 'Rating is required' };
  }
  
  if (rating < 1 || rating > 5) {
    return { isValid: false, error: 'Rating must be between 1 and 5' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Form validation helper
 * Validates multiple fields at once
 */
export const validateForm = (fields) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    const result = field.validator(field.value);
    
    if (!result.isValid) {
      errors[key] = result.error;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};