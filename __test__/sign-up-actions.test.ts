import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { signUpIndividual, signUpOrganization } from '@/app/actions/auth';
import type {
  IndividualSignUpValues,
  OrganizationSignUpValues,
} from '@/types/sign-up-form.types';

const referer = vi.hoisted(() => ({ value: null as string | null }));

vi.mock('next/headers', () => ({
  headers: async () => ({ get: () => referer.value }),
  cookies: async () => ({ getAll: () => [], set: () => {} }),
}));

const shared = {
  email: 'jane@example.com',
  name: 'Jane Doe',
  password: 'Abcdefghijklm1!',
  confirmPassword: 'Abcdefghijklm1!',
  phoneNumber: '+16041234567',
  phoneType: 'Cell',
  address: {
    mailingAddress: '1234 No. 3 Rd',
    city: 'Richmond',
    country: 'Canada',
    province: 'British Columbia',
    postalCode: 'V6X 2B8',
  },
  membershipInterests: ['Health'],
  motivation: 'To help reduce poverty.',
} as const;

const individual = {
  ...shared,
  waiverRequest: false,
} as unknown as IndividualSignUpValues;

const organization = {
  ...shared,
  organizationEmail: 'info@foodbank.org',
} as unknown as OrganizationSignUpValues;

let log: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.useFakeTimers();
  referer.value = 'http://localhost:3000/sign-up/individual';
  log = vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  log.mockRestore();
});

/** Runs an action while advancing the placeholder delay. */
async function run(action: Promise<void>) {
  const settled = action.then(
    () => ({ ok: true as const }),
    (error: Error) => ({ ok: false as const, error }),
  );
  await vi.advanceTimersByTimeAsync(1000);
  return settled;
}

describe('sign-up placeholder actions (app/actions/auth.ts)', () => {
  test.each([
    ['individual', () => signUpIndividual(individual)],
    ['organization', () => signUpOrganization(organization)],
  ])(
    '%s: resolves and logs the values without passwords',
    async (kind, call) => {
      const result = await run(call());

      expect(result.ok).toBe(true);
      expect(log).toHaveBeenCalledTimes(1);
      const [message, logged] = log.mock.calls[0];
      expect(message).toBe(`[sign-up placeholder] ${kind} application`);
      expect(logged).not.toHaveProperty('password');
      expect(logged).not.toHaveProperty('confirmPassword');
      expect(logged).toMatchObject({
        email: 'jane@example.com',
        name: 'Jane Doe',
      });
    },
  );

  test('waits for the placeholder delay before resolving', async () => {
    let done = false;
    void signUpIndividual(individual).then(() => {
      done = true;
    });

    await vi.advanceTimersByTimeAsync(999);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toBe(true);
  });

  test('fails when the page URL has ?simulate=failure (development)', async () => {
    referer.value = 'http://localhost:3000/sign-up/individual?simulate=failure';

    const result = await run(signUpIndividual(individual));

    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.message).toBe(
      'Simulated sign-up failure',
    );
  });

  test('ignores other query parameters', async () => {
    referer.value = 'http://localhost:3000/sign-up/individual?simulate=success';
    expect((await run(signUpIndividual(individual))).ok).toBe(true);
  });

  test('never simulates a failure in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    referer.value = 'http://localhost:3000/sign-up/individual?simulate=failure';

    expect((await run(signUpIndividual(individual))).ok).toBe(true);
  });

  test('works when the request has no referer', async () => {
    referer.value = null;
    expect((await run(signUpOrganization(organization))).ok).toBe(true);
  });
});
