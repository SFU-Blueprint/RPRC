'use server';

import { revalidatePath } from 'next/cache';
import { getMemberDashboardData } from '@/lib/api/services/server/member-dashboard-service';
import { createClient } from '@/lib/supabase/server';
import { ApplicationStatus } from '@/lib/constants/enums';
import { ApplicationErrorCode } from '@/lib/constants/application-errors';
import {
  PROFILE_EDITABLE_STATUSES,
  RESUBMITTABLE_STATUSES,
} from '@/lib/constants/membership-status-rules';
import { ROUTES } from '@/lib/constants/routes';
import { memberProfileEditSchema } from '@/lib/schema/member-profile-edit.schema';
import type {
  MemberDashboardData,
  MembershipProfileUpdateResult,
} from '@/types/membership.types';

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/** The user's latest application, which is the one the dashboard shows. */
async function getLatestApplication(
  supabase: SupabaseServerClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from('applications')
    .select('id, status, type')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return error ? null : data;
}

export async function fetchMemberDashboardData(): Promise<MemberDashboardData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return getMemberDashboardData(user.id);
}

/**
 * Saves the member's profile. The values are validated again here with the
 * same schema as the form, so the RPC only ever gets checked values (including
 * the stored phone format, `+1 (604)-123-4567`).
 */
export async function submitMembershipProfileUpdate(
  input: unknown,
): Promise<MembershipProfileUpdateResult> {
  const parsed = memberProfileEditSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid profile details',
      code: ApplicationErrorCode.VALIDATION_ERROR,
    };
  }
  const values = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const application = await getLatestApplication(supabase, user.id);
  if (!application) {
    return { success: false, error: 'Application not found' };
  }
  if (application.type !== values.role) {
    return {
      success: false,
      error: 'Profile type does not match your application',
      code: ApplicationErrorCode.VALIDATION_ERROR,
    };
  }
  if (!PROFILE_EDITABLE_STATUSES.includes(application.status)) {
    return {
      success: false,
      error:
        'Your profile cannot be edited while your application is being processed',
      code: ApplicationErrorCode.VALIDATION_ERROR,
    };
  }

  const shared = {
    p_user_id: user.id,
    p_phone_num: values.phoneNumber,
    p_phone_type: values.phoneType,
    p_mailing_address: values.address.mailingAddress,
    p_city: values.address.city,
    p_country: values.address.country,
    p_province: values.address.province,
    p_postal_code: values.address.postalCode,
    p_reason: values.motivation,
    p_interests: values.membershipInterests,
  };

  const { error: rpcError } =
    values.role === 'organization'
      ? await supabase.rpc('update_organization_membership_profile', {
          ...shared,
          p_org_name: values.name,
          p_org_rep_name: values.representativeName,
          p_org_rep_email: values.representativeEmail ?? null,
          p_org_services: values.programsOrServices ?? '',
        })
      : await supabase.rpc('update_individual_membership_profile', {
          ...shared,
          p_name: values.name,
        });

  if (rpcError) {
    console.error('Membership profile update error:', rpcError);
    return {
      success: false,
      error: 'Failed to save membership profile',
      code: ApplicationErrorCode.SERVER_ERROR,
    };
  }

  revalidatePath(ROUTES.MEMBERSHIP_DASHBOARD);

  return { success: true };
}

/**
 * Sends the latest application back for review: a renewal when the membership
 * has expired or expires soon, or a re-application after a rejection (once the
 * member has edited their profile).
 */
export async function submitMembershipRenewal(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const application = await getLatestApplication(supabase, user.id);
    if (!application) {
      return { success: false, error: 'Application not found' };
    }
    if (!RESUBMITTABLE_STATUSES.includes(application.status)) {
      return {
        success: false,
        error: 'Your membership cannot be renewed right now',
      };
    }

    // Only move the row if it is still in the status we checked.
    const { data: updated, error: updateError } = await supabase
      .from('applications')
      .update({ status: ApplicationStatus.TO_REVIEW })
      .eq('id', application.id)
      .eq('status', application.status)
      .select('id');

    if (updateError || !updated?.length) {
      return { success: false, error: 'Failed to submit renewal' };
    }

    revalidatePath(ROUTES.MEMBERSHIP_DASHBOARD);

    return { success: true };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}
