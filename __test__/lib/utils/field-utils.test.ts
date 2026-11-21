import { describe, expect, test } from 'vitest';

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
