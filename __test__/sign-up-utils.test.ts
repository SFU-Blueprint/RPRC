import { describe, expect, test } from 'vitest';

import {
  ADDRESS_LABELS,
  ALLOWED_COUNTRIES,
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY,
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
import {
  getAddressLabels,
  getRegionOptions,
  isAllowedCountry,
} from '@/lib/utils/address-utils';
import {
  getDescribedBy,
  getFieldIds,
  getOptionId,
  toOptionalString,
} from '@/lib/utils/field-utils';

describe('field-utils', () => {
  test('getFieldIds turns a form path into safe, linked DOM ids', () => {
    expect(getFieldIds('address.city')).toEqual({
      control: 'field-address-city',
      description: 'field-address-city-description',
      error: 'field-address-city-error',
    });
  });

  test('getOptionId makes option values safe for ids', () => {
    const ids = getFieldIds('membershipInterests');
    expect(getOptionId(ids, 'Arts+Culture')).toBe(
      'field-membershipInterests-Arts-Culture',
    );
    expect(getOptionId(ids, 'Health')).toBe('field-membershipInterests-Health');
  });

  test('getDescribedBy keeps only the ids that are rendered', () => {
    expect(getDescribedBy('a', false, undefined, 'b')).toBe('a b');
    expect(getDescribedBy(false, undefined)).toBeUndefined();
  });

  test.each([
    ['', undefined],
    ['   ', undefined],
    ['\n\t', undefined],
    ['Jane', 'Jane'],
    ['  Jane  ', '  Jane  '],
  ])('toOptionalString(%j) -> %j', (input, expected) => {
    expect(toOptionalString(input)).toBe(expected);
  });
});

describe('address-utils', () => {
  test('isAllowedCountry accepts only the allowed countries', () => {
    expect(isAllowedCountry('Canada')).toBe(true);
    expect(isAllowedCountry('United States')).toBe(true);
    expect(isAllowedCountry('Mexico')).toBe(false);
    expect(isAllowedCountry('canada')).toBe(false);
    expect(isAllowedCountry(undefined)).toBe(false);
  });

  test('getRegionOptions lists provinces and states, nothing for others', () => {
    const provinces = getRegionOptions('Canada').map(({ value }) => value);
    const states = getRegionOptions('United States').map(({ value }) => value);

    expect(provinces).toContain('British Columbia');
    expect(provinces).not.toContain('Washington');
    expect(states).toContain('Washington');
    expect(getRegionOptions('Mexico')).toEqual([]);
    expect(getRegionOptions(undefined)).toEqual([]);
  });

  test('getAddressLabels follows the country, Canada until one is chosen', () => {
    expect(getAddressLabels('United States')).toEqual(
      ADDRESS_LABELS['United States'],
    );
    expect(getAddressLabels(undefined)).toEqual(
      ADDRESS_LABELS[DEFAULT_COUNTRY],
    );
    expect(getAddressLabels('Mexico')).toEqual(ADDRESS_LABELS[DEFAULT_COUNTRY]);
  });
});

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
