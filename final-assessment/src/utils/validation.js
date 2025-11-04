// src/utils/validation.js

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: '' };
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return { 
      isValid: false, 
      error: 'Password must contain uppercase, lowercase, and number' 
    };
  }
  
  return { isValid: true, error: '' };
};

export const validateName = (name) => {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  return { isValid: true, error: '' };
};

export const validateBookingDates = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return { isValid: false, error: 'Both dates are required' };
  }
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (checkInDate < today) {
    return { isValid: false, error: 'Check-in date cannot be in the past' };
  }
  
  if (checkOutDate <= checkInDate) {
    return { isValid: false, error: 'Check-out must be after check-in' };
  }
  
  return { isValid: true, error: '' };
};

export const validateRooms = (rooms) => {
  if (!rooms || rooms < 1) {
    return { isValid: false, error: 'Select at least one room' };
  }
  
  if (rooms > 10) {
    return { isValid: false, error: 'Maximum 10 rooms allowed' };
  }
  
  return { isValid: true, error: '' };
};

export const validateReview = (rating, comment) => {
  if (!rating || rating < 1 || rating > 5) {
    return { isValid: false, error: 'Please provide a rating' };
  }
  
  if (!comment || comment.trim().length < 10) {
    return { isValid: false, error: 'Review must be at least 10 characters' };
  }
  
  if (comment.trim().length > 500) {
    return { isValid: false, error: 'Review must be less than 500 characters' };
  }
  
  return { isValid: true, error: '' };
};
