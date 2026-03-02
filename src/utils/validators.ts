const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export const isValidEmail = (email: string): boolean =>
  EMAIL_REGEX.test(email.trim());

export const isValidIndianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-+()]/g, '');
  // Allow with or without +91 / 91 prefix
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return INDIAN_PHONE_REGEX.test(cleaned.slice(2));
  }
  return INDIAN_PHONE_REGEX.test(cleaned);
};

export const isValidName = (name: string): boolean =>
  name.trim().length >= 2;

export const isValidPassword = (password: string): boolean =>
  password.length >= 6;

export const isValidDateOfBirth = (dob: string): boolean => {
  const date = new Date(dob);
  if (isNaN(date.getTime())) return false;
  // Must be in the past and person should be at least 10 years old
  const now = new Date();
  const minAge = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
  return date <= minAge;
};
