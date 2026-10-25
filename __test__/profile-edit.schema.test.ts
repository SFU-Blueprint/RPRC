import { describe, expect, test } from 'vitest';

import { individualProfileEditSchema } from '@/lib/schema/individual-profile-edit.schema';
import { organizationProfileEditSchema } from '@/lib/schema/organization-profile-edit.schema';

const validSharedValues = {
  email: 'member@example.com',
  phoneNumber: '(604)-555-1234',
  phoneType: 'cell',
  address: {
    mailingAddress: '123 Example Street',
    city: 'Richmond',
    province: 'British Columbia',
    country: 'Canada',
    postalCode: 'V6X 1A1',
  },
  membershipInterests: ['Health', 'Arts+Culture'],
  motivation: 'I want to support community services in Richmond.',
  representativeEmail: '',
  programsOrServices: '',
};

describe('individualProfileEditSchema', () => {
  test('validates and converts the existing phone input values', () => {
    const result = individualProfileEditSchema.safeParse({
      ...validSharedValues,
      role: 'individual',
      name: 'Mary-Jane O\'Connor',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phoneNumber).toBe('+16045551234');
      expect(result.data.phoneType).toBe('Cell');
    }
  });

  test('rejects malformed address, interests, and motivation', () => {
    const result = individualProfileEditSchema.safeParse({
      ...validSharedValues,
      role: 'individual',
      name: 'Member Name',
      address: { ...validSharedValues.address, city: 'Richmond2' },
      membershipInterests: ['Sports'],
      motivation: 'word '.repeat(201),
    });

    expect(result.success).toBe(false);
  });

  test('rejects a phone number that cannot be normalized to E.164', () => {
    expect(
      individualProfileEditSchema.safeParse({
        ...validSharedValues,
        role: 'individual',
        name: 'Member Name',
        phoneNumber: '(604)-555-123',
      }).success,
    ).toBe(false);
  });
});

describe('organizationProfileEditSchema', () => {
  test('keeps organization and representative names separate', () => {
    const result = organizationProfileEditSchema.safeParse({
      ...validSharedValues,
      role: 'organization',
      name: 'Richmond Community Services & Support',
      representativeName: 'Jordan Lee',
      phoneType: 'home',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Richmond Community Services & Support');
      expect(result.data.representativeName).toBe('Jordan Lee');
      expect(result.data.representativeEmail).toBeUndefined();
      expect(result.data.programsOrServices).toBeUndefined();
      expect(result.data.phoneType).toBe('Home');
    }
  });

  test('requires a valid representative name and email when provided', () => {
    expect(
      organizationProfileEditSchema.safeParse({
        ...validSharedValues,
        role: 'organization',
        name: 'Richmond Community Services',
        representativeName: '',
        representativeEmail: 'not-an-email',
      }).success,
    ).toBe(false);
  });
});
