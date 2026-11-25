import { headers } from 'next/headers';

import { EmailTemplate } from '@/lib/constants/email';
import { queueStatusEmail } from '@/lib/email/send-status-email';
import { createAdminClient } from '@/lib/supabase/admin';
import { nullableArg } from '@/lib/utils/rpc-utils';
import type {
  ApplicationFailure,
  IndividualApplicationValues,
  OrganizationApplicationValues,
  SubmitResult,
} from '@/types/sign-up-form.types';

const applicationFailure = (
  reason: ApplicationFailure['reason'],
): ApplicationFailure => ({ ok: false, stage: 'application', reason });

/**
 * Development only: open the sign-up form with `?simulate=application-failure`
 * to see what happens when the account is created but the application isn't.
 * Only the sign-up actions check it, so the retry in application-only mode on
 * the same page can succeed.
 */
export async function shouldSimulateApplicationFailure(): Promise<boolean> {
  if (process.env.NODE_ENV === 'production') return false;
  const referer = (await headers()).get('referer');
  if (!referer) return false;
  try {
    return (
      new URL(referer).searchParams.get('simulate') === 'application-failure'
    );
  } catch {
    return false;
  }
}

/** Whether the user already has an application (any status). */
export async function userHasApplication(userId: string): Promise<boolean> {
  const { data, error } = await createAdminClient()
    .from('applications')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
  if (error) throw new Error(`Application lookup failed: ${error.message}`);
  return (data ?? []).length > 0;
}

/**
 * Whether another organization already uses this phone number. `storedPhone`
 * is the stored format (`+1 (604)-123-4567`). The user's own row is ignored.
 */
export async function isOrganizationPhoneTaken(
  storedPhone: string,
  userId?: string,
): Promise<boolean> {
  let query = createAdminClient()
    .from('organization_profiles')
    .select('user_id')
    .eq('phone_num', storedPhone)
    .limit(1);
  if (userId) query = query.neq('user_id', userId);

  const { data, error } = await query;
  if (error) throw new Error(`Phone lookup failed: ${error.message}`);
  return (data ?? []).length > 0;
}

/**
 * Runs after the application is created. Never fails the submission (the caller catches).
 * Sends the "application received" email. The individual RPC returns no id, so look up the
 * user's application: `finishApplication` only creates one when the user had none.
 */
async function afterApplicationCreated(userId: string): Promise<void> {
  const { data, error } = await createAdminClient()
    .from('applications')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Application lookup failed: ${error.message}`);
  if (!data) throw new Error('Application not found after creating it');

  queueStatusEmail(data.id, {
    template: EmailTemplate.APPLICATION_RECEIVED,
    renewal: false,
  });
}

async function finishApplication(
  userId: string,
  createApplication: () => PromiseLike<{ error: { message: string } | null }>,
): Promise<SubmitResult> {
  try {
    if (await userHasApplication(userId))
      return applicationFailure('already_has_application');

    const { error } = await createApplication();
    if (error) {
      console.error('[sign-up] creating the application failed:', error);
      return applicationFailure('failed');
    }
  } catch (error) {
    console.error('[sign-up] creating the application failed:', error);
    return applicationFailure('failed');
  }

  try {
    await afterApplicationCreated(userId);
  } catch (error) {
    console.error('[sign-up] after-application step failed:', error);
  }
  return { ok: true };
}

/**
 * Creates an individual application for `userId` with the service-role client
 * (the application functions aren't executable by clients).
 */
export async function createIndividualApplication(
  userId: string,
  values: IndividualApplicationValues,
): Promise<SubmitResult> {
  return finishApplication(userId, () =>
    createAdminClient().rpc('create_individual_application', {
      p_user_id: userId,
      p_name: values.name,
      p_phone_num: values.phoneNumber,
      p_phone_type: values.phoneType,
      p_mailing_address: values.address.mailingAddress,
      p_city: values.address.city,
      p_country: values.address.country,
      p_province: values.address.province,
      p_postal_code: values.address.postalCode,
      p_reason: values.motivation,
      p_fee_waiver: values.waiverRequest ?? false,
      p_fee_waiver_reason: nullableArg(
        values.waiverRequest ? values.waiverReason : null,
      ),
      p_interests: values.membershipInterests,
    }),
  );
}

/** Creates an organization application for `userId` (service-role client). */
export async function createOrganizationApplication(
  userId: string,
  values: OrganizationApplicationValues,
): Promise<SubmitResult> {
  try {
    if (await isOrganizationPhoneTaken(values.phoneNumber, userId))
      return applicationFailure('duplicate_org_phone');
  } catch (error) {
    console.error('[sign-up] organization phone check failed:', error);
    return applicationFailure('failed');
  }

  return finishApplication(userId, () =>
    createAdminClient().rpc('create_organization_application', {
      p_user_id: userId,
      p_org_name: values.organizationName,
      p_org_rep_name: values.name,
      p_org_rep_email: nullableArg(values.representativeEmail),
      p_phone_num: values.phoneNumber,
      p_phone_type: values.phoneType,
      p_mailing_address: values.address.mailingAddress,
      p_city: values.address.city,
      p_country: values.address.country,
      p_province: values.address.province,
      p_postal_code: values.address.postalCode,
      p_reason: values.motivation,
      // org_services is NOT NULL; the field is optional, as in profile edit.
      p_org_services: values.programsOrServices ?? '',
      p_interests: values.membershipInterests,
    }),
  );
}
