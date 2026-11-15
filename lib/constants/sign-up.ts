import {
  MEMBERSHIP_INTERESTS,
  PHONE_TYPES,
  type Interest,
  type PhoneType,
} from '@/lib/schema';
import type { DefaultValues } from 'react-hook-form';

import type { FieldOption } from '@/types/sign-up-fields.types';
import type {
  AllowedCountry,
  IndividualSignUpInput,
  OrganizationSignUpInput,
} from '@/types/sign-up-form.types';

/** Page-level copy for the two sign-up forms. */
export const SIGN_UP_FORM_COPY = {
  INDIVIDUAL_HEADING: 'Individual Membership Application Form',
  ORGANIZATION_HEADING: 'Organization Membership Application Form',
  SUBMIT: 'Submit Application',
  SUBMITTING: 'Submitting…',
  /** Exact wording required by the issue. */
  SUBMIT_FAILED: 'Submission failed. Try again later.',
  NOTE_HEADING: 'Please Note',
  NOTE_PRIMARY:
    'To vote at the Annual General Meeting, members must be registered at least 30 days in advance.',
  NOTE_SECONDARY:
    'All memberships require renewal in January. Members who join after October 1 do not need to renew until January of the next calendar year',
} as const;

/** Section headings, rendered as the `<legend>` of each section. */
export const SIGN_UP_SECTION_TITLES = {
  ACCOUNT: 'Account Information',
  CONTACT: 'Contact Information',
  ADDRESS: 'Address Information',
  INTERESTS: 'Membership Interests',
  MOTIVATION: 'Why do you want to be an RPRC member?',
  WAIVER: 'Membership Fee Waiver (Optional)',
  PROGRAMS: 'Programs and Services (Optional)',
} as const;

export const SIGN_UP_FIELD_LABELS = {
  EMAIL: 'Email Address',
  PASSWORD: 'Password',
  CONFIRM_PASSWORD: 'Confirm Password',
  NAME: 'Name',
  ORGANIZATION_NAME: 'Organization Name',
  /** The account email on the organization form, as in the old form. */
  ORGANIZATION_ACCOUNT_EMAIL: 'Organization Email Address',
  REPRESENTATIVE_NAME: 'Organization Representative Name',
  REPRESENTATIVE_EMAIL:
    'Representative Email Address (if different from the one given above)',
  PHONE_NUMBER: 'Phone Number',
  PHONE_TYPE: 'Phone Type',
  MAILING_ADDRESS: 'Mailing Address',
  CITY: 'City',
  COUNTRY: 'Country',
  INTERESTS: 'Areas of interest',
  MOTIVATION: 'Your reason for joining',
  WAIVER_REQUEST: 'I would like to request a waiver of the Membership fee',
  WAIVER_REASON: 'Reason for the waiver request (optional)',
  PROGRAMS: 'What programs or services does your organization offer?',
} as const;

export const SIGN_UP_FIELD_DESCRIPTIONS = {
  INTERESTS: 'Select all that apply.',
  WAIVER:
    'We are committed to making membership accessible to everyone. Applicants who are unable to afford the membership fee may request a waiver. Requests are reviewed confidentially, and approval is subject to availability and organizational policy.',
} as const;

export const INTEREST_OPTIONS: FieldOption<Interest>[] =
  MEMBERSHIP_INTERESTS.map((interest) => ({
    value: interest,
    label: interest,
  }));

/** Schema values are lowercase to match the `phone_type` enum in the database. */
const PHONE_TYPE_LABELS: Record<PhoneType, string> = {
  home: 'Home',
  cell: 'Cell',
};

export const PHONE_TYPE_OPTIONS: FieldOption<PhoneType>[] = PHONE_TYPES.map(
  (phoneType) => ({ value: phoneType, label: PHONE_TYPE_LABELS[phoneType] }),
);

/**
 * Countries offered in the address section. Matches the old application form
 * and the phone field (+1 numbers only). Every name is also a value the
 * schema's `countrySchema` accepts.
 */
export const ALLOWED_COUNTRIES = ['Canada', 'United States'] as const;

export const DEFAULT_COUNTRY: AllowedCountry = 'Canada';

/** ISO codes `country-state-city` uses to look up provinces and states. */
export const COUNTRY_ISO_CODES: Record<AllowedCountry, string> = {
  Canada: 'CA',
  'United States': 'US',
};

export const COUNTRY_OPTIONS: FieldOption<AllowedCountry>[] =
  ALLOWED_COUNTRIES.map((country) => ({ value: country, label: country }));

/** Region and postal code wording follows the selected country. */
export const ADDRESS_LABELS: Record<
  AllowedCountry,
  { region: string; postalCode: string }
> = {
  Canada: { region: 'Province', postalCode: 'Postal Code' },
  'United States': { region: 'State', postalCode: 'ZIP Code' },
};

/** Starting values: phone type and country preselected, as in the old form. */
const SHARED_SIGN_UP_DEFAULTS = {
  phoneType: 'cell',
  address: { country: DEFAULT_COUNTRY },
  membershipInterests: [],
} satisfies DefaultValues<IndividualSignUpInput & OrganizationSignUpInput>;

export const INDIVIDUAL_SIGN_UP_DEFAULTS: DefaultValues<IndividualSignUpInput> =
  { ...SHARED_SIGN_UP_DEFAULTS, waiverRequest: false };

export const ORGANIZATION_SIGN_UP_DEFAULTS: DefaultValues<OrganizationSignUpInput> =
  { ...SHARED_SIGN_UP_DEFAULTS };
