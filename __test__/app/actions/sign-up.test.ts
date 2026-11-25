// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * The sign-up actions with Supabase mocked: the cookie server client (auth)
 * and an in-memory stand-in for the service-role client (queries + RPCs).
 */

const referer = vi.hoisted(() => ({ value: null as string | null }));
vi.mock('next/headers', () => ({
  headers: async () => ({ get: () => referer.value }),
  cookies: async () => ({ getAll: () => [], set: () => {} }),
}));

const auth = vi.hoisted(() => ({ signUp: vi.fn(), getUser: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth }),
}));

type Row = Record<string, unknown>;
const db = vi.hoisted(() => ({
  applications: [] as Row[],
  organization_profiles: [] as Row[],
  users: [] as Row[],
  rpcError: null as null | { message: string },
  rpc: vi.fn(),
}));

vi.mock('@/lib/supabase/admin', () => {
  function query(table: 'applications' | 'organization_profiles' | 'users') {
    const filters: Array<(row: Row) => boolean> = [];
    const rows = () => db[table].filter((row) => filters.every((f) => f(row)));
    const builder = {
      select: () => builder,
      limit: () => builder,
      order: () => builder,
      eq: (column: string, value: unknown) => {
        filters.push((row) => row[column] === value);
        return builder;
      },
      neq: (column: string, value: unknown) => {
        filters.push((row) => row[column] !== value);
        return builder;
      },
      maybeSingle: async () => ({ data: rows()[0] ?? null, error: null }),
      then: (
        resolve: (value: { data: Row[]; error: null }) => unknown,
        reject?: (reason: unknown) => unknown,
      ) => Promise.resolve({ data: rows(), error: null }).then(resolve, reject),
    };
    return builder;
  }

  return {
    createAdminClient: () => ({
      from: query,
      rpc: async (name: string, args: Row) => {
        db.rpc(name, args);
        // Like the real functions, a successful call creates the application row.
        if (!db.rpcError)
          db.applications.push({ id: 'app_new', user_id: args.p_user_id });
        return { error: db.rpcError };
      },
    }),
  };
});

const email = vi.hoisted(() => ({ queueStatusEmail: vi.fn() }));
vi.mock('@/lib/email/send-status-email', () => email);

const {
  applyAsIndividual,
  applyAsOrganization,
  signUpIndividual,
  signUpOrganization,
} = await import('@/app/actions/sign-up');

const PASSWORD = 'Abcdefghijklm1!';
const USER_ID = '11111111-1111-4111-8111-111111111111';

const address = {
  mailingAddress: '1234 No. 3 Rd',
  city: 'Richmond',
  country: 'Canada',
  province: 'British Columbia',
  postalCode: 'V6X 2B8',
};

const individualApplication = {
  name: 'Jane Doe',
  phoneNumber: '6041234567',
  phoneType: 'cell',
  address,
  membershipInterests: ['Health'],
  motivation: 'To help reduce poverty.',
  waiverRequest: false,
};

const individual = {
  ...individualApplication,
  email: 'jane@example.com',
  password: PASSWORD,
  confirmPassword: PASSWORD,
};

const organizationApplication = {
  organizationName: 'Richmond Food Bank Society',
  name: 'Jane Doe',
  representativeEmail: '',
  phoneNumber: '6041234567',
  phoneType: 'home',
  address,
  membershipInterests: ['Housing'],
  motivation: 'We run food programs.',
};

const organization = {
  ...organizationApplication,
  email: 'info@foodbank.org',
  password: PASSWORD,
  confirmPassword: PASSWORD,
};

const signUpSucceeds = () =>
  auth.signUp.mockResolvedValue({
    data: {
      user: { id: USER_ID, identities: [{}] },
      session: { access_token: 't' },
    },
    error: null,
  });

const signedInAs = (role: string | null) => {
  auth.getUser.mockResolvedValue({
    data: { user: role ? { id: USER_ID } : null },
  });
  if (role) db.users.push({ id: USER_ID, role });
};

beforeEach(() => {
  auth.signUp.mockReset();
  auth.getUser.mockReset();
  db.applications = [];
  db.organization_profiles = [];
  db.users = [];
  db.rpcError = null;
  db.rpc.mockReset();
  email.queueStatusEmail.mockReset();
  referer.value = 'http://localhost:3000/sign-up/individual';
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('signUpIndividual', () => {
  test('creates the account (role from the action) and the application', async () => {
    signUpSucceeds();

    // A tampered `role` in the values must not reach sign-up metadata.
    const result = await signUpIndividual({ ...individual, role: 'admin' });

    expect(result).toEqual({ ok: true });
    expect(auth.signUp).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: PASSWORD,
      options: { data: { role: 'individual', full_name: 'Jane Doe' } },
    });
    expect(db.rpc).toHaveBeenCalledWith(
      'create_individual_application',
      expect.objectContaining({
        p_user_id: USER_ID,
        p_name: 'Jane Doe',
        p_phone_num: '+1 (604)-123-4567',
        p_phone_type: 'cell',
        p_fee_waiver: false,
        p_fee_waiver_reason: null,
        p_interests: ['Health'],
      }),
    );
  });

  test('a waiver reason is only stored when a waiver is requested', async () => {
    signUpSucceeds();
    await signUpIndividual({
      ...individual,
      waiverRequest: true,
      waiverReason: 'Student this year.',
    });
    expect(db.rpc.mock.calls[0][1]).toMatchObject({
      p_fee_waiver: true,
      p_fee_waiver_reason: 'Student this year.',
    });

    db.rpc.mockReset();
    db.applications = []; // a fresh account, not a second application
    await signUpIndividual({ ...individual, waiverReason: 'left over' });
    expect(db.rpc.mock.calls[0][1]).toMatchObject({
      p_fee_waiver: false,
      p_fee_waiver_reason: null,
    });
  });

  test('invalid values: nothing is created', async () => {
    const result = await signUpIndividual({
      ...individual,
      confirmPassword: 'x',
    });

    expect(result).toEqual({ ok: false, stage: 'account', reason: 'invalid' });
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  test.each(['user_already_exists', 'email_exists'])(
    'email already registered (%s): no application',
    async (code) => {
      auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { code, message: 'User already registered' },
      });

      const result = await signUpIndividual(individual);

      expect(result).toEqual({
        ok: false,
        stage: 'account',
        reason: 'email_exists',
      });
      expect(db.rpc).not.toHaveBeenCalled();
    },
  );

  test('a disguised existing-email response is never used', async () => {
    auth.signUp.mockResolvedValue({
      data: { user: { id: 'random-id', identities: [] }, session: null },
      error: null,
    });

    const result = await signUpIndividual(individual);

    expect(result).toMatchObject({ stage: 'account', reason: 'email_exists' });
    expect(db.rpc).not.toHaveBeenCalled();
  });

  test('account creation fails: nothing created', async () => {
    auth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: { code: 'unexpected_failure', message: 'boom' },
    });

    const result = await signUpIndividual(individual);

    expect(result).toEqual({ ok: false, stage: 'account', reason: 'failed' });
    expect(db.rpc).not.toHaveBeenCalled();
  });

  test('application step fails after the account: stage application, account kept', async () => {
    signUpSucceeds();
    db.rpcError = { message: 'insert failed' };
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await signUpIndividual(individual);

    // No rollback: the result tells the form to switch to application-only.
    expect(result).toEqual({
      ok: false,
      stage: 'application',
      reason: 'failed',
    });
  });

  test('?simulate=application-failure (development) fails after the account', async () => {
    signUpSucceeds();
    referer.value =
      'http://localhost:3000/sign-up/individual?simulate=application-failure';

    const result = await signUpIndividual(individual);

    expect(result).toMatchObject({ stage: 'application', reason: 'failed' });
    expect(auth.signUp).toHaveBeenCalled();
    expect(db.rpc).not.toHaveBeenCalled();
  });

  test('the simulation is ignored in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    signUpSucceeds();
    referer.value =
      'http://localhost:3000/sign-up/individual?simulate=application-failure';

    expect(await signUpIndividual(individual)).toEqual({ ok: true });
  });

  test('a malformed Referer is ignored by the simulation', async () => {
    signUpSucceeds();
    referer.value = 'not a url';

    expect(await signUpIndividual(individual)).toEqual({ ok: true });
  });

  test('no session ("Confirm email" still on): no application is created', async () => {
    auth.signUp.mockResolvedValue({
      data: { user: { id: USER_ID, identities: [{}] }, session: null },
      error: null,
    });

    const result = await signUpIndividual(individual);

    expect(result).toEqual({ ok: false, stage: 'account', reason: 'failed' });
    expect(db.rpc).not.toHaveBeenCalled();
  });
});

describe('signUpOrganization', () => {
  test('creates the account and the application with the old form mapping', async () => {
    signUpSucceeds();

    const result = await signUpOrganization(organization);

    expect(result).toEqual({ ok: true });
    expect(auth.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'info@foodbank.org',
        options: {
          data: {
            role: 'organization',
            full_name: 'Richmond Food Bank Society',
          },
        },
      }),
    );
    expect(db.rpc).toHaveBeenCalledWith(
      'create_organization_application',
      expect.objectContaining({
        p_user_id: USER_ID,
        p_org_name: 'Richmond Food Bank Society',
        p_org_rep_name: 'Jane Doe',
        p_org_rep_email: null,
        p_phone_num: '+1 (604)-123-4567',
        p_org_services: '',
      }),
    );
  });

  test('a representative email is passed through', async () => {
    signUpSucceeds();
    await signUpOrganization({
      ...organization,
      representativeEmail: 'jane@example.com',
    });
    expect(db.rpc.mock.calls[0][1]).toMatchObject({
      p_org_rep_email: 'jane@example.com',
    });
  });

  test('a phone another organization uses is caught before the account is created', async () => {
    db.organization_profiles.push({
      user_id: 'someone-else',
      phone_num: '+1 (604)-123-4567',
    });

    const result = await signUpOrganization(organization);

    expect(result).toEqual({
      ok: false,
      stage: 'account',
      reason: 'duplicate_org_phone',
    });
    expect(auth.signUp).not.toHaveBeenCalled();
  });
});

describe('applyAsIndividual / applyAsOrganization (application only)', () => {
  test('not signed in', async () => {
    signedInAs(null);

    expect(await applyAsIndividual(individualApplication)).toEqual({
      ok: false,
      stage: 'application',
      reason: 'not_signed_in',
    });
    expect(db.rpc).not.toHaveBeenCalled();
  });

  test('signed in with a different role', async () => {
    signedInAs('organization');

    expect(await applyAsIndividual(individualApplication)).toMatchObject({
      stage: 'application',
      reason: 'failed',
    });
    expect(db.rpc).not.toHaveBeenCalled();
  });

  test('already has an application', async () => {
    signedInAs('individual');
    db.applications.push({ id: 'app-1', user_id: USER_ID });

    expect(await applyAsIndividual(individualApplication)).toMatchObject({
      stage: 'application',
      reason: 'already_has_application',
    });
    expect(db.rpc).not.toHaveBeenCalled();
  });

  test('creates the application for the session user, ignoring account fields', async () => {
    signedInAs('individual');

    const result = await applyAsIndividual({
      ...individualApplication,
      password: PASSWORD,
    });

    expect(result).toEqual({ ok: true });
    expect(auth.signUp).not.toHaveBeenCalled();
    const args = db.rpc.mock.calls[0][1];
    expect(args.p_user_id).toBe(USER_ID);
    expect(JSON.stringify(args)).not.toContain(PASSWORD);
  });

  test('organization: a phone another organization uses', async () => {
    signedInAs('organization');
    db.organization_profiles.push({
      user_id: 'someone-else',
      phone_num: '+1 (604)-123-4567',
    });

    expect(await applyAsOrganization(organizationApplication)).toEqual({
      ok: false,
      stage: 'application',
      reason: 'duplicate_org_phone',
    });
  });

  test('organization: creates the application', async () => {
    signedInAs('organization');

    expect(await applyAsOrganization(organizationApplication)).toEqual({
      ok: true,
    });
    expect(db.rpc.mock.calls[0][0]).toBe('create_organization_application');
  });
});

describe('application received email', () => {
  const received = { template: 'application_received', renewal: false };

  test('is queued for the new application after sign-up', async () => {
    signUpSucceeds();

    const result = await signUpIndividual(individual);

    expect(result).toEqual({ ok: true });
    expect(email.queueStatusEmail).toHaveBeenCalledTimes(1);
    expect(email.queueStatusEmail).toHaveBeenCalledWith('app_new', received);
  });

  test('is queued when a signed-in organization applies', async () => {
    signedInAs('organization');

    const result = await applyAsOrganization(organizationApplication);

    expect(result).toEqual({ ok: true });
    expect(email.queueStatusEmail).toHaveBeenCalledWith('app_new', received);
  });

  test('is not queued when creating the application fails', async () => {
    signUpSucceeds();
    db.rpcError = { message: 'insert failed' };

    await signUpIndividual(individual);

    expect(email.queueStatusEmail).not.toHaveBeenCalled();
  });

  test('a failure while queueing leaves the submission successful', async () => {
    signedInAs('individual');
    email.queueStatusEmail.mockImplementation(() => {
      throw new Error('boom');
    });

    const result = await applyAsIndividual(individualApplication);

    expect(result).toEqual({ ok: true });
  });
});
