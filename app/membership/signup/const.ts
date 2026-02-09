import { SignUpFormData, StepInfo } from '@/types/signup';

/**
 * Step configuration for the 3-step signup process
 */
export const SIGNUP_STEPS: StepInfo[] = [
  {
    id: 1,
    title: 'Account Creation',
    description: 'Create your credentials',
  },
  {
    id: 2,
    title: 'Form Completion',
    description: 'Your information',
  },
  {
    id: 3,
    title: 'Submission',
    description: 'Review and submit',
  },
];

/**
 * for selection dropdown
 */
export const CANADIAN_PROVINCES: string[] = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Northwest Territories',
  'Nova Scotia',
  'Nunavut',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Yukon',
];

/**
 * Membership interest options (in order)
 */
export const MEMBERSHIP_INTERESTS: string[] = [
  'Health',
  'Education',
  'Environment',
  'Arts+Culture',
  'Housing',
  'Other',
];

/**
 * Membership type constants
 */
export const MEMBERSHIP_TYPES = {
  INDIVIDUAL: 'individual',
  ORGANIZATION: 'organization',
} as const;

export const COUNTRIES: string[] = ['Canada', 'United States'];

/**
 * Empty form data - initial state
 */
export const SIGNUP_INITIAL: SignUpFormData = {
  email: '',
  password: '',
  fullName: '',
  phoneNumber: '',
  membershipType: MEMBERSHIP_TYPES.ORGANIZATION,
  phoneType: 'cell',
  mailingAddress: '',
  city: '',
  province: '',
  country: '',
  postalCode: '',
  interests: [],
  whyrpcmember: '',
  membershipwaiver: false,
  waiverreason: '',
  organisationservices: '',
};

/**
 * Membership type options for form
 */
export const MEMBERSHIP_TYPE_OPTIONS = [
  { value: MEMBERSHIP_TYPES.INDIVIDUAL, label: 'Individual' },
  { value: MEMBERSHIP_TYPES.ORGANIZATION, label: 'Organization' },
];

/**
 * Mock data: Organization
 */
export const SIGNUP_MOCK_ORGANIZATION: SignUpFormData = {
  email: 'john.doe@example.com',
  password: 'Test1234',
  fullName: 'John Doe',
  representativeName: 'John Doe',
  representativeEmail: 'john.personal@example.com',
  phoneNumber: '6041234567',
  phoneType: 'cell',
  mailingAddress: '123 Main Street',
  city: 'Vancouver',
  province: 'British Columbia',
  country: 'Canada',
  postalCode: 'V5K 1A1',
  interests: ['Health', 'Housing'],
  whyrpcmember:
    'I want to help reduce poverty in Richmond and support community initiatives.',
  organisationservices:
    'We provide community outreach and support services in Richmond.',
};

/**
 * Mock data: individual
 */
export const SIGNUP_MOCK_INDIVIDUAL: SignUpFormData = {
  email: 'john.doe@example.com',
  password: 'Test1234',
  fullName: 'John Doe',
  phoneNumber: '6041234567',
  phoneType: 'cell',
  mailingAddress: '123 Main Street',
  city: 'Vancouver',
  province: 'British Columbia',
  country: 'Canada',
  postalCode: 'V5K 1A1',
  interests: ['Health', 'Housing'],
  whyrpcmember:
    'I want to help reduce poverty in Richmond and support community initiatives.',
  membershipwaiver: false,
};
