import { describe, expect, test } from 'vitest';

import { addressSchema, postalCodeSchema } from '@/lib/schema/address.schema';
import { individualSchema } from '@/lib/schema/individual.schema';
import { interestsSchema } from '@/lib/schema/interests.schema';
import { motivationSchema } from '@/lib/schema/motivation.schema';
import { organizationSchema } from '@/lib/schema/organization.schema';
import { passwordSchema } from '@/lib/schema/password.schema';

const validAddress = {
  mailingAddress: '1234 No. 3 Rd, Unit #205',
  country: 'Canada',
  postalCode: 'V5K 1A1',
  city: 'Richmond',
  province: 'British Columbia',
};

const validIndividual = {
  email: 'Jane.Doe@Example.com',
  name: "Mary-Jane O'Connor",
  password: 'Abcdefghijklm1!',
  confirmPassword: 'Abcdefghijklm1!',
  phoneNumber: '+16041234567',
  phoneType: 'Cell',
  address: validAddress,
  membershipInterests: ['Health'],
  motivation: 'I want to help reduce poverty in Richmond.',
};

const validOrganization = {
  email: 'rep@example.com',
  name: 'John Doe',
  organizationEmail: 'contact@example.org',
  password: 'Abcdefghijklm1!',
  confirmPassword: 'Abcdefghijklm1!',
  phoneNumber: '+16041234567',
  phoneType: 'Home',
  address: validAddress,
  membershipInterests: ['Education', 'Housing'],
  motivation: 'We serve Richmond families.',
  programsOrServices: 'Food bank and community outreach.',
};

describe('passwordSchema', () => {
  test('accepts a password that meets every rule', () => {
    expect(passwordSchema.safeParse('Abcdefghijklm1!').success).toBe(true);
  });

  test.each([
    ['fewer than 15 characters', 'Abcdefghijkl1!'],
    ['more than 72 characters', `A1!${'a'.repeat(70)}`],
    ['no uppercase letter', 'abcdefghijklm1!'],
    ['no lowercase letter', 'ABCDEFGHIJKLM1!'],
    ['no number', 'Abcdefghijklmn!'],
    ['no special character', 'Abcdefghijklm12'],
  ])('rejects a password with %s', (_label, password) => {
    expect(passwordSchema.safeParse(password).success).toBe(false);
  });

  test('reports every unmet rule at once', () => {
    const result = passwordSchema.safeParse('short');
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBeGreaterThan(1);
  });
});

describe('addressSchema', () => {
  test.each(['V5K 1A1', 'V5K1A1', '98101', '98101-1234'])(
    'accepts postal code %s',
    (postalCode) => {
      expect(postalCodeSchema.safeParse(postalCode).success).toBe(true);
    },
  );

  test('rejects a malformed postal code', () => {
    expect(postalCodeSchema.safeParse('12A B3').success).toBe(false);
  });

  test('accepts a complete address', () => {
    expect(addressSchema.safeParse(validAddress).success).toBe(true);
  });

  test('rejects a country that is not on the list', () => {
    const result = addressSchema.safeParse({
      ...validAddress,
      country: 'Narnia',
    });
    expect(result.success).toBe(false);
  });

  test('rejects a city containing digits', () => {
    expect(
      addressSchema.safeParse({ ...validAddress, city: 'Richmond2' }).success,
    ).toBe(false);
  });
});

describe('interestsSchema', () => {
  test('accepts known interests', () => {
    expect(interestsSchema.safeParse(['Health', 'Arts+Culture']).success).toBe(
      true,
    );
  });

  test('rejects an unknown interest', () => {
    expect(interestsSchema.safeParse(['Sports']).success).toBe(false);
  });
});

describe('motivationSchema', () => {
  test('accepts exactly 200 words', () => {
    expect(motivationSchema.safeParse('word '.repeat(200)).success).toBe(true);
  });

  test('rejects 201 words', () => {
    expect(motivationSchema.safeParse('word '.repeat(201)).success).toBe(false);
  });

  test('rejects an empty string', () => {
    expect(motivationSchema.safeParse('   ').success).toBe(false);
  });
});

describe('individualSchema', () => {
  test('accepts a complete application', () => {
    expect(individualSchema.safeParse(validIndividual).success).toBe(true);
  });

  test('normalises the email to lowercase', () => {
    const result = individualSchema.safeParse(validIndividual);
    expect(result.data?.email).toBe('jane.doe@example.com');
  });

  test('flags mismatched passwords on confirmPassword', () => {
    const result = individualSchema.safeParse({
      ...validIndividual,
      confirmPassword: 'Different12345!',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['confirmPassword']);
  });

  test('rejects a phone number that is not E.164', () => {
    expect(
      individualSchema.safeParse({
        ...validIndividual,
        phoneNumber: '6041234567',
      }).success,
    ).toBe(false);
  });

  test('treats the waiver fields as optional', () => {
    expect(individualSchema.safeParse(validIndividual).success).toBe(true);
  });
});

describe('organizationSchema', () => {
  test('accepts a complete application', () => {
    expect(organizationSchema.safeParse(validOrganization).success).toBe(true);
  });

  test('accepts an application without the optional fields', () => {
    const { organizationEmail, programsOrServices, ...required } =
      validOrganization;
    expect(organizationSchema.safeParse(required).success).toBe(true);
  });

  test('rejects a malformed organization email', () => {
    expect(
      organizationSchema.safeParse({
        ...validOrganization,
        organizationEmail: 'not-an-email',
      }).success,
    ).toBe(false);
  });
});
