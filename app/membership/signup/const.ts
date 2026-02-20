import { SignUpFormData, StepInfo } from '@/types/signup';
import { ApplicationType } from '@/lib/constants/enums';

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
 * Countries for membership application
 */
export const COUNTRIES: string[] = ['Canada', 'United States'];

/**
 * Membership type constants
 * Re-export from centralized enums for backwards compatibility
 */
export const MEMBERSHIP_TYPES = {
  INDIVIDUAL: ApplicationType.INDIVIDUAL,
  ORGANIZATION: ApplicationType.ORGANIZATION,
} as const;

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
