// Validation utility functions for profile fields

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validatePhone = (phone: string): string | null => {
  // Phone is optional - allow empty strings
  if (!phone || !phone.trim()) {
    return null;
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10) {
    return 'Phone number must be at least 10 digits';
  }
  
  if (digitsOnly.length > 15) {
    return 'Phone number must be no more than 15 digits';
  }
  
  return null;
};

export const validateUrl = (url: string): string | null => {
  // URL is optional - allow empty strings
  if (!url || !url.trim()) {
    return null;
  }
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL (e.g., https://example.com)';
  }
};

export const validateLinkedInUrl = (url: string): string | null => {
  // LinkedIn URL is optional - allow empty strings
  if (!url || !url.trim()) {
    return null;
  }
  
  const urlValidation = validateUrl(url);
  if (urlValidation) {
    return urlValidation;
  }
  
  if (!url.includes('linkedin.com')) {
    return 'Please enter a valid LinkedIn URL';
  }
  
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.trim().length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long`;
  }
  return null;
};

export const validateDateRange = (startDate: string, endDate: string): string | null => {
  if (!startDate || !endDate) {
    return null; // Allow empty dates
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    return 'Start date must be before end date';
  }
  
  return null;
};

export const validateGPA = (gpa: string): string | null => {
  if (!gpa.trim()) {
    return null; // GPA is optional
  }
  
  const gpaNumber = parseFloat(gpa);
  
  if (isNaN(gpaNumber)) {
    return 'GPA must be a valid number';
  }
  
  if (gpaNumber < 0 || gpaNumber > 4.0) {
    return 'GPA must be between 0.0 and 4.0';
  }
  
  return null;
};

export const validateSkillLevel = (level: string): string | null => {
  const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  
  if (!level.trim()) {
    return null; // Level is optional
  }
  
  if (!validLevels.includes(level)) {
    return 'Please select a valid skill level';
  }
  
  return null;
};

export const validateLanguageProficiency = (proficiency: string): string | null => {
  const validProficiencies = ['Basic', 'Conversational', 'Fluent', 'Native'];
  
  if (!proficiency.trim()) {
    return 'Language proficiency is required';
  }
  
  if (!validProficiencies.includes(proficiency)) {
    return 'Please select a valid proficiency level';
  }
  
  return null;
};

// Composite validators for complex fields
export const validatePersonalInfo = {
  firstName: (value: string) => validateRequired(value, 'First name'),
  lastName: (value: string) => validateRequired(value, 'Last name'),
  email: validateEmail,
  phone: validatePhone,
  linkedinUrl: validateLinkedInUrl,
  portfolioUrl: validateUrl
};

export const validateWorkExperience = {
  position: (value: string) => validateRequired(value, 'Position'),
  company: (value: string) => validateRequired(value, 'Company'),
  location: (value: string) => validateRequired(value, 'Location'),
  startDate: (value: string) => validateRequired(value, 'Start date'),
  description: (value: string) => {
    const required = validateRequired(value, 'Description');
    if (required) return required;
    return validateMinLength(value, 50, 'Description');
  }
};

export const validateEducation = {
  degree: (value: string) => validateRequired(value, 'Degree'),
  institution: (value: string) => validateRequired(value, 'Institution'),
  location: (value: string) => validateRequired(value, 'Location'),
  startDate: (value: string) => validateRequired(value, 'Start date'),
  gpa: validateGPA
};

export const validateSummary = {
  headline: (value: string) => {
    const required = validateRequired(value, 'Professional headline');
    if (required) return required;
    return validateMaxLength(value, 100, 'Professional headline');
  },
  description: (value: string) => {
    const required = validateRequired(value, 'Professional summary');
    if (required) return required;
    const minLength = validateMinLength(value, 100, 'Professional summary');
    if (minLength) return minLength;
    return validateMaxLength(value, 500, 'Professional summary');
  }
};