'use server';

import {
  createIndividualApplication,
  createOrganizationApplication,
  isOrganizationPhoneTaken,
  shouldSimulateApplicationFailure,
} from '@/lib/api/services/server/sign-up-service';
import { UserRole } from '@/lib/constants/enums';
import {
  individualApplicationSchema,
  individualSchema,
  organizationApplicationSchema,
  organizationSchema,
} from '@/lib/schema';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { SubmitResult } from '@/types/sign-up-form.types';

type AccountFailure = Extract<SubmitResult, { stage: 'account' }>;

const accountFailure = (reason: AccountFailure['reason']): AccountFailure => ({
  ok: false,
  stage: 'account',
  reason,
});

/**
 * Creates the auth account with the cookie-based server client, so the new
 * session is stored and the user is signed in when the action returns.
 *
 * `role` comes from the action, never from form values: the users trigger
 * copies it into `users.role`.
 */
async function createAccount(input: {
  email: string;
  password: string;
  role: typeof UserRole.INDIVIDUAL | typeof UserRole.ORGANIZATION;
  fullName: string;
}): Promise<{ ok: true; userId: string } | AccountFailure> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { role: input.role, full_name: input.fullName } },
  });

  if (error) {
    if (error.code === 'user_already_exists' || error.code === 'email_exists')
      return accountFailure('email_exists');
    console.error('[sign-up] creating the account failed:', error);
    return accountFailure('failed');
  }

  // Can't happen with email confirmation off; with it on, Supabase may answer
  // an existing email with a fake user whose id is random. Never use that id.
  if (!data.user || data.user.identities?.length === 0)
    return accountFailure('email_exists');

  if (!data.session)
    console.warn(
      '[sign-up] no session returned: is email confirmation still enabled?',
    );

  return { ok: true, userId: data.user.id };
}

/** Logged out: create the account, then the individual application. */
export async function signUpIndividual(values: unknown): Promise<SubmitResult> {
  const parsed = individualSchema.safeParse(values);
  if (!parsed.success) return accountFailure('invalid');

  const { email, password, ...application } = parsed.data;
  const account = await createAccount({
    email,
    password,
    role: UserRole.INDIVIDUAL,
    fullName: application.name,
  });
  if (!account.ok) return account;

  // No rollback if this fails: the user is signed in and the form switches to
  // application-only mode (docs/signup-integration-plan.md, decision 3).
  if (await shouldSimulateApplicationFailure())
    return { ok: false, stage: 'application', reason: 'failed' };
  return createIndividualApplication(
    account.userId,
    individualApplicationSchema.parse(application),
  );
}

/** Logged out: create the account, then the organization application. */
export async function signUpOrganization(
  values: unknown,
): Promise<SubmitResult> {
  const parsed = organizationSchema.safeParse(values);
  if (!parsed.success) return accountFailure('invalid');

  const { email, password, ...application } = parsed.data;

  // Checked before creating the account: a conflict the user can fix shouldn't
  // leave a new account stuck without an application.
  try {
    if (await isOrganizationPhoneTaken(application.phoneNumber))
      return accountFailure('duplicate_org_phone');
  } catch (error) {
    console.error('[sign-up] organization phone check failed:', error);
    return accountFailure('failed');
  }

  const account = await createAccount({
    email,
    password,
    role: UserRole.ORGANIZATION,
    // Matches the dashboard, which shows org_name as the member's name.
    fullName: application.organizationName,
  });
  if (!account.ok) return account;

  if (await shouldSimulateApplicationFailure())
    return { ok: false, stage: 'application', reason: 'failed' };
  return createOrganizationApplication(
    account.userId,
    organizationApplicationSchema.parse(application),
  );
}

type ApplicationOnlyUser =
  | { ok: true; userId: string }
  | Extract<SubmitResult, { stage: 'application' }>;

/** The signed-in user, if their role matches the form they submitted. */
async function getApplicationOnlyUser(
  role: typeof UserRole.INDIVIDUAL | typeof UserRole.ORGANIZATION,
): Promise<ApplicationOnlyUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { ok: false, stage: 'application', reason: 'not_signed_in' };

  const { data: profile } = await createAdminClient()
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role !== role)
    return { ok: false, stage: 'application', reason: 'invalid' };

  return { ok: true, userId: user.id };
}

/** Logged in without an application: create the individual application only. */
export async function applyAsIndividual(
  values: unknown,
): Promise<SubmitResult> {
  const user = await getApplicationOnlyUser(UserRole.INDIVIDUAL);
  if (!user.ok) return user;

  const parsed = individualApplicationSchema.safeParse(values);
  if (!parsed.success)
    return { ok: false, stage: 'application', reason: 'invalid' };

  return createIndividualApplication(user.userId, parsed.data);
}

/** Logged in without an application: create the organization application only. */
export async function applyAsOrganization(
  values: unknown,
): Promise<SubmitResult> {
  const user = await getApplicationOnlyUser(UserRole.ORGANIZATION);
  if (!user.ok) return user;

  const parsed = organizationApplicationSchema.safeParse(values);
  if (!parsed.success)
    return { ok: false, stage: 'application', reason: 'invalid' };

  return createOrganizationApplication(user.userId, parsed.data);
}
