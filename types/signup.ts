/**
 * Main form data structure for the signup process
 * Contains all fields collected across the multi-step form
 */
export type SignUpFormData = {
  // page 1: Account Info
  signupEmail: string;
  password: string;
  confirmPassword: string;
  membershipType?: MembershipType;

  // page 2: Contact + Address Info
  fullName: string;
  contactEmail: string;
  phoneNumber: string;
  phoneType: 'home' | 'cell';
  mailingAddress: string;
  city: string;
  province: string;
  postalCode: string;

  // page 3: Membership Interests
  interests: string[];
  reasonForJoining: string;
};

/**
 * Validation errors object
 * SignUpFormData field names: error messages
 */
export type ValidationErrors = {
  [key: string]: string | undefined;
};

/**
 * Step configuration for multi-step form
 * Used by ProgressIndicator and step navigation
 */
export type StepInfo = {
  id: number;
  title: string;
  description: string;
};

export type MembershipType = 'individual' | 'organization';
