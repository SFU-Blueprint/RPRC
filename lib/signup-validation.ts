import { SignUpFormData, ValidationErrors } from '@/types/signup';
import { MEMBERSHIP_TYPES } from '@/app/membership/signup/const';

/**
 * Regular expression patterns for validation
 */
export const VALIDATION_PATTERNS = {
  // Email: standard email format
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Password: minimum 6 characters, any characters allowed
  password: /^.{6,}$/,

  // Phone: exactly 10 digits (after removing non-digits)
  phone: /^\d{10}$/,

  // Postal Code: Canadian format A1A 1A1 or A1A1A1 (case insensitive)
  postalCode: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
};

/**
 * Validate email address
 */
export function validateEmail(email: string): string | undefined {
  if (!email) {
    return 'Email is required';
  }

  if (!VALIDATION_PATTERNS.email.test(email)) {
    return 'Invalid email format';
  }

  return undefined;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return undefined;
}

/**
 * Validate password confirmation matches
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return undefined;
}

/**
 * Validate membership type is selected
 */
export function validateMembershipType(
  membershipType: string | undefined,
): string | undefined {
  if (!membershipType) {
    return 'Please select a membership type';
  }

  // Use constants instead of hardcoded strings
  if (
    membershipType !== MEMBERSHIP_TYPES.INDIVIDUAL &&
    membershipType !== MEMBERSHIP_TYPES.ORGANIZATION
  ) {
    return 'Invalid membership type selected';
  }

  return undefined;
}

/**
 * Validate required field (generic)
 */
export function validateRequired(
  value: string | undefined,
  fieldName: string,
): string | undefined {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return undefined;
}

/**
 * Validate phone number (10 digits)
 */
export function validatePhone(phone: string): string | undefined {
  if (!phone) {
    return 'Phone number is required';
  }

  const cleaned = phone.replace(/\D/g, ''); // Remove non-digits

  if (!VALIDATION_PATTERNS.phone.test(cleaned)) {
    return 'Phone number must be 10 digits';
  }

  return undefined;
}

/**
 * Validate Canadian postal code
 */
export function validatePostalCode(postalCode: string): string | undefined {
  if (!postalCode) {
    return 'Postal code is required';
  }

  if (!VALIDATION_PATTERNS.postalCode.test(postalCode)) {
    return 'Invalid postal code format (e.g., V5K 1A1)';
  }

  return undefined;
}

/**
 * Validate entire Step 1 (Account Creation)
 * Returns object with error for each field (or undefined if valid)
 */
export function validateStep1(
  data: Partial<SignUpFormData>,
  confirmPassword: string,
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate email
  const emailError = validateEmail(data.email || '');
  if (emailError) {
    errors.email = emailError;
  }

  // Validate password
  const passwordError = validatePassword(data.password || '');
  if (passwordError) {
    errors.password = passwordError;
  }

  // Validate confirm password
  const confirmPasswordError = validatePasswordMatch(
    data.password || '',
    confirmPassword,
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  // Validate membership type
  const membershipTypeError = validateMembershipType(data.membershipType);
  if (membershipTypeError) {
    errors.membershipType = membershipTypeError;
  }

  return errors;
}

/**
 * Validate entire Step 2 (Contact & Address Information + Membership Interests)
 * Validates common fields, then membership-type-specific fields
 */
export function validateStep2(data: Partial<SignUpFormData>): ValidationErrors {
  const errors: ValidationErrors = {};

  // COMMON FIELDS (Both Individual & Organization)

  // Validate full name (Individual: "Name", Organization: "Organization Name")
  const fullNameError = validateRequired(
    data.fullName,
    data.membershipType === MEMBERSHIP_TYPES.ORGANIZATION
      ? 'Organization name'
      : 'Name',
  );
  if (fullNameError) {
    errors.fullName = fullNameError;
  }

  // Email is pre-filled and disabled, but validate for safety
  const emailError = validateEmail(data.email || '');
  if (emailError) {
    errors.email = emailError;
  }

  // Validate phone number
  const phoneError = validatePhone(data.phoneNumber || '');
  if (phoneError) {
    errors.phoneNumber = phoneError;
  }

  // Validate mailing address
  const addressError = validateRequired(data.mailingAddress, 'Mailing address');
  if (addressError) {
    errors.mailingAddress = addressError;
  }

  // Validate city
  const cityError = validateRequired(data.city, 'City');
  if (cityError) {
    errors.city = cityError;
  }

  // Validate province
  const provinceError = validateRequired(data.province, 'Province');
  if (provinceError) {
    errors.province = provinceError;
  }

  // Validate country
  const countryError = validateRequired(data.country, 'Country');
  if (countryError) {
    errors.country = countryError;
  }

  // Validate postal code
  const postalCodeError = validatePostalCode(data.postalCode || '');
  if (postalCodeError) {
    errors.postalCode = postalCodeError;
  }

  /* CODE FOR VALIDATING REASON FOR JOINING WAS REMOVED AS THIS FIELD IS OPTIONAL
  TO MAKE IT REQUIRED, UNCOMMENT THIS CODE.
  // Validate reason for joining (whyrpcmember)
  const whyRPRCError = validateRequired(
    data.whyrpcmember,
    'Why do you want to be an RPRC member',
  );
  if (whyRPRCError) {
    errors.whyrpcmember = whyRPRCError;
  }
  */

  // Note: Interests are optional, no validation needed
  // Note: membershipwaiver is boolean, no validation needed
  // Note: waiverreason is optional, no validation needed

  // MEMBERSHIP-TYPE-SPECIFIC FIELDS

  if (data.membershipType === MEMBERSHIP_TYPES.ORGANIZATION) {
    // Organization-specific validations

    // Validate representative name (required for organization)
    const repNameError = validateRequired(
      data.representativeName,
      'Organization representative name',
    );
    if (repNameError) {
      errors.representativeName = repNameError;
    }

    // Validate representative email (optional, but validate format if provided)
    if (data.representativeEmail && data.representativeEmail.trim() !== '') {
      const repEmailError = validateEmail(data.representativeEmail);
      if (repEmailError) {
        errors.representativeEmail = repEmailError;
      }
    }

    /* CODE TO VALIDATE ORGANIZATION SERVICES WAS REMOVED AS THIS FIELD IS OPTIONAL
    TO MAKE IT REQUIRED, UNCOMMENT THIS CODE.
    
    // Validate organization services
    const servicesError = validateRequired(
      data.organisationservices,
      'What programs or services does your organization offer',
    );
    if (servicesError) {
      errors.organisationservices = servicesError;
    }
    */
  }

  // Individual-specific fields don't need validation
  // (membershipwaiver is boolean, waiverreason is optional)

  return errors;
}

/**
 * Check if an errors object has any actual errors
 * Returns true if there are errors, false if all fields are valid
 */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}
