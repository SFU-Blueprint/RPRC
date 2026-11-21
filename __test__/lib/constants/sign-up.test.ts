import { describe, expect, test } from 'vitest';

import {
  ALLOWED_COUNTRIES,
  COUNTRY_OPTIONS,
  INDIVIDUAL_SIGN_UP_DEFAULTS,
  INTEREST_OPTIONS,
  ORGANIZATION_SIGN_UP_DEFAULTS,
  PHONE_TYPE_OPTIONS,
} from '@/lib/constants/sign-up';
import {
  countrySchema,
  MEMBERSHIP_INTERESTS,
  PHONE_TYPES,
  phoneTypeSchema,
} from '@/lib/schema';

describe('sign-up constants match the schema', () => {
  test('interest options cover every schema interest, in order', () => {
    expect(INTEREST_OPTIONS.map(({ value }) => value)).toEqual([
      ...MEMBERSHIP_INTERESTS,
    ]);
  });

  test('phone type options cover every schema phone type', () => {
    expect(PHONE_TYPE_OPTIONS.map(({ value }) => value)).toEqual([
      ...PHONE_TYPES,
    ]);
  });

  test('country options are the allowed countries, each schema-valid', () => {
    expect(COUNTRY_OPTIONS.map(({ value }) => value)).toEqual([
      ...ALLOWED_COUNTRIES,
    ]);
    for (const country of ALLOWED_COUNTRIES) {
      expect(countrySchema.safeParse(country).success, country).toBe(true);
    }
  });

  test('default values are schema-valid', () => {
    for (const defaults of [
      INDIVIDUAL_SIGN_UP_DEFAULTS,
      ORGANIZATION_SIGN_UP_DEFAULTS,
    ]) {
      expect(phoneTypeSchema.safeParse(defaults.phoneType).success).toBe(true);
      expect(countrySchema.safeParse(defaults.address?.country).success).toBe(
        true,
      );
      expect(defaults.membershipInterests).toEqual([]);
    }
    expect(INDIVIDUAL_SIGN_UP_DEFAULTS.waiverRequest).toBe(false);
  });
});
