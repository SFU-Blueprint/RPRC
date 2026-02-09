/**
 * Main form data structure for the signup process
 * Contains all fields collected across the multi-step form
 */
export type SignUpFormData = {
  // Step 1: Account Info
  email: string;
  password: string;
  membershipType?: MembershipType;

  // Step 2.1: Contact + Address Info
  fullName: string; // "Name" for Individual, "Organization Name" for Organization
  phoneNumber: string;
  phoneType: 'home' | 'cell';
  mailingAddress: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;

  // Step 2.2: Membership Interests
  interests: string[]; // Multiple selection
  whyrpcmember: string;

  // Step 2.3: Individual-specific fields
  membershipwaiver?: boolean;
  waiverreason?: string;

  // Step 2.4: Organization-specific fields
  organisationservices?: string;
  representativeName?: string;
  representativeEmail?: string; //  optional alternative email
};

/**
 * Validation errors object
 * Maps SignUpFormData field names to error messages
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
