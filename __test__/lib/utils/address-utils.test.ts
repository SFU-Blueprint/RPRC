import { describe, expect, test } from 'vitest';

import { ADDRESS_LABELS, DEFAULT_COUNTRY } from '@/lib/constants/sign-up';
import {
  getAddressLabels,
  getRegionOptions,
  isAllowedCountry,
} from '@/lib/utils/address-utils';

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
