import { ValidationErrors } from '@/types/signup';

/**
 * Regex patterns for validation
 */
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, // 8+ chars, 1 upper, 1 lower, 1 number
  phone: /^\d{10}$/, // 10 digits
  postalCode: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, // Canadian: A1A 1A1 or A1A1A1
};

/**
 * Validation functions for individual fields
 */

// TODO: Add validateEmail() when building Step 1
// TODO: Add validatePassword() when building Step 1
// TODO: Add validatePasswordMatch() when building Step 1
// TODO: Add validatePhone() when building Step 2
// TODO: Add validatePostalCode() when building Step 2
// TODO: Add validateRequired() when needed

/**
 * Step validation functions
 */

// TODO: Add validateStep1() when building account creation
// TODO: Add validateStep2() when building contact/address form
// TODO: Add validateStep3() when building interests form

/**
 * Utility function to check if errors object has any errors
 */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}
