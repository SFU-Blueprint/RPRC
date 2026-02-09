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
 * Membership interest options
 */
export const MEMBERSHIP_INTERESTS: string[] = [
  'Health',
  'Education',
  'Arts+Culture',
  'Housing',
  'Environment',
  'Other',
];

/**
 * Mock data
 */
export const SIGNUP_MOCK: SignUpFormData = {
  email: 'john.doe@example.com',
  password: 'Test1234',
  confirmPassword: 'Test1234',
  fullName: 'John Doe',
  phoneNumber: '6041234567',
  phoneType: 'cell',
  mailingAddress: '123 Main Street',
  city: 'Vancouver',
  province: 'British Columbia',
  postalCode: 'V5K 1A1',
  interests: ['Health', 'Housing'],
  whyJoin:
    'I want to help reduce poverty in Richmond and support community initiatives.',
};

/**
 * Empty form data - initial state
 */
export const SIGNUP_INITIAL: SignUpFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phoneNumber: '',
  phoneType: 'cell',
  mailingAddress: '',
  city: '',
  province: '',
  postalCode: '',
  interests: [],
  whyJoin: '',
};
