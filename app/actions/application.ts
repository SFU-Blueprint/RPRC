'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  ApplicationStatus,
  PhoneType,
  ReviewDecision,
  UserRole,
} from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';
import {
  ApplicationErrorCode,
  SubmitApplication,
} from '@/lib/constants/application-errors';
import { isAdmin } from '@/lib/helpers/auth-helper';
import type { Database } from '@/types/database';

function formatPhoneWithAreaCode(phoneNumber: string): string {
  const normalized = phoneNumber.trim();
  if (!normalized) return normalized;
  if (normalized.startsWith('+1')) return normalized;
  return `+1 ${normalized}`;
}

/**
 * Submit Individual Membership Application
 */
export async function submitIndividualApplication(
  formData: FormData,
): Promise<SubmitApplication> {
  const supabase = await createClient();

  // Extract form data
  const data = {
    email: formData.get('email') as string,
    fullName: formData.get('fullName') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    phoneType: formData.get('phoneType') as PhoneType,
    mailingAddress: formData.get('mailingAddress') as string,
    city: formData.get('city') as string,
    province: formData.get('province') as string,
    country: formData.get('country') as string,
    postalCode: formData.get('postalCode') as string,
    interests: JSON.parse(formData.get('interests') as string) as string[],
    whyrpcmember: formData.get('whyrpcmember') as string,
    membershipwaiver: formData.get('membershipwaiver') === 'true',
    waiverreason: formData.get('waiverreason') as string | undefined,
  };
  const phoneNumberWithAreaCode = formatPhoneWithAreaCode(data.phoneNumber);

  // Validate required fields
  const requiredFields = [
    'email',
    'fullName',
    'phoneNumber',
    'phoneType',
    'mailingAddress',
    'city',
    'province',
    'country',
    'postalCode',
    'whyrpcmember',
  ];

  if (requiredFields.some((field) => !data[field as keyof typeof data])) {
    return {
      success: false,
      error: 'Missing one or more required fields',
      code: ApplicationErrorCode.VALIDATION_ERROR,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'User not authenticated',
      code: ApplicationErrorCode.VALIDATION_ERROR,
    };
  }

  // Check if user already has an application
  const { data: existingApp } = await supabase
    .from('applications')
    .select('id, status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (
    existingApp &&
    existingApp.status !== ApplicationStatus.EXPIRES_SOON &&
    existingApp.status !== ApplicationStatus.EXPIRED
  ) {
    return {
      success: false,
      error: 'You have already submitted an application',
      code: ApplicationErrorCode.APPLICATION_EXISTS,
    };
  }

  try {
    // Call RPC function for individual application creation
    const { error: rpcError } = await supabase.rpc(
      'create_individual_application',
      {
        p_user_id: user.id,
        p_name: data.fullName,
        p_phone_num: phoneNumberWithAreaCode,
        p_phone_type: data.phoneType,
        p_mailing_address: data.mailingAddress,
        p_city: data.city,
        p_country: data.country,
        p_province: data.province,
        p_postal_code: data.postalCode,
        p_reason: data.whyrpcmember,
        p_fee_waiver_reason: data.waiverreason || null,
        p_interests: data.interests,
      },
    );

    if (rpcError) {
      throw new Error(`DB transaction failed: ${rpcError.message}`);
    }
  } catch (error) {
    console.error('Individual application submission error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create application',
      code: ApplicationErrorCode.SERVER_ERROR,
    };
  }

  revalidatePath(ROUTES.MEMBERSHIP_FORM, 'layout');
  revalidatePath(ROUTES.MEMBERSHIP_DASHBOARD, 'layout');
  redirect(ROUTES.MEMBERSHIP_CONFIRMATION);
}

/**
 * Submit Organization Membership Application
 */
export async function submitOrganizationApplication(
  formData: FormData,
): Promise<SubmitApplication> {
  const supabase = await createClient();

  // Extract form data
  const data = {
    email: formData.get('email') as string,
    fullName: formData.get('fullName') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    phoneType: formData.get('phoneType') as PhoneType,
    mailingAddress: formData.get('mailingAddress') as string,
    city: formData.get('city') as string,
    province: formData.get('province') as string,
    country: formData.get('country') as string,
    postalCode: formData.get('postalCode') as string,
    interests: JSON.parse(formData.get('interests') as string) as string[],
    whyrpcmember: formData.get('whyrpcmember') as string,
    organisationservices: formData.get('organisationservices') as string,
    representativeName: formData.get('representativeName') as string | undefined,
    representativeEmail: formData.get('representativeEmail') as string | undefined,
  };
  const phoneNumberWithAreaCode = formatPhoneWithAreaCode(data.phoneNumber);

  // Validate required fields
  const requiredFields = [
    'email',
    'fullName',
    'phoneNumber',
    'phoneType',
    'mailingAddress',
    'city',
    'province',
    'country',
    'postalCode',
    'whyrpcmember',
    'organisationservices',
  ];

  if (requiredFields.some((field) => !data[field as keyof typeof data])) {
    return {
      success: false,
      error: 'Missing one or more required fields',
      code: ApplicationErrorCode.VALIDATION_ERROR,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'User not authenticated',
      code: ApplicationErrorCode.VALIDATION_ERROR,
    };
  }

  // Check if user already has an application that blocks resubmission
  const { data: existingApp } = await supabase
    .from('applications')
    .select('id, status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (
    existingApp &&
    existingApp.status !== ApplicationStatus.EXPIRES_SOON &&
    existingApp.status !== ApplicationStatus.EXPIRED
  ) {
    return {
      success: false,
      error: 'You have already submitted an application',
      code: ApplicationErrorCode.APPLICATION_EXISTS,
    };
  }

  // Check if organization already exists by phone
  const { data: existingOrg } = await supabase
    .from('organization_profiles')
    .select('phone_num')
    .or(
      `phone_num.eq.${phoneNumberWithAreaCode},phone_num.eq.${data.phoneNumber}`,
    )
    .not('user_id', 'eq', user.id)
    .maybeSingle();

  if (existingOrg) {
    return {
      success: false,
      error: 'An organization with this phone number already exists',
      code: ApplicationErrorCode.APPLICATION_EXISTS,
    };
  }

  try {
    // Call RPC function for organization application creation
    const { error: rpcError } = await supabase.rpc(
      'create_organization_application',
      {
        p_user_id: user.id,
        p_org_name: data.fullName,
        p_org_rep_name: data.representativeName || null,
        p_org_rep_email: data.representativeEmail || null,
        p_phone_num: phoneNumberWithAreaCode,
        p_phone_type: data.phoneType,
        p_mailing_address: data.mailingAddress,
        p_city: data.city,
        p_country: data.country,
        p_province: data.province,
        p_postal_code: data.postalCode,
        p_reason: data.whyrpcmember,
        p_org_services: data.organisationservices,
        p_interests: data.interests,
      },
    );

    if (rpcError) {
      throw new Error(`DB transaction failed: ${rpcError.message}`);
    }
  } catch (error) {
    console.error('Organization application submission error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create application',
      code: ApplicationErrorCode.SERVER_ERROR,
    };
  }

  revalidatePath(ROUTES.MEMBERSHIP_FORM, 'layout');
  revalidatePath(ROUTES.MEMBERSHIP_DASHBOARD, 'layout');
  redirect(ROUTES.MEMBERSHIP_CONFIRMATION);
}

type SubmitApplicationReviewInput = {
  appId: string;
  reviewerName: string;
  reviewDate: string;
  decision: Database['public']['Enums']['review_decision'];
  reason: string;
};

type SubmitApplicationReviewResult = {
  success: boolean;
  error?: string;
};

function getNextApplicationStatus(
  reviews: Array<Pick<Database['public']['Tables']['application_reviews']['Row'], 'decision'>>,
): Database['public']['Enums']['application_status'] {
  const approveCount = reviews.filter(
    (review) => review.decision === ReviewDecision.APPROVE,
  ).length;
  const rejectCount = reviews.filter(
    (review) => review.decision === ReviewDecision.REJECT,
  ).length;

  if (approveCount >= 2) {
    return ApplicationStatus.PAYMENT_PENDING;
  }

  if (rejectCount >= 2) {
    return ApplicationStatus.REJECTED;
  }

  if (approveCount > 0 && rejectCount > 0) {
    return ApplicationStatus.CONFLICT;
  }

  return ApplicationStatus.TO_REVIEW;
}

export async function submitApplicationReview(
  input: SubmitApplicationReviewInput,
): Promise<SubmitApplicationReviewResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized: admin role required' };
  }

  if (
    !input.appId ||
    !input.reviewerName.trim() ||
    !input.reviewDate ||
    !input.decision ||
    !input.reason.trim()
  ) {
    return { success: false, error: 'All review fields are required' };
  }

  const { data: application } = await supabase
    .from('applications')
    .select('status')
    .eq('id', input.appId)
    .single();

  if (application?.status === 'payment_pending' || application?.status === 'rejected') {
    return { success: false, error: 'This application has already been finalized' };
  }

  const { data: existingReviews, error: reviewsError } = await supabase
    .from('application_reviews')
    .select('decision')
    .eq('application_id', input.appId);

  if (reviewsError) {
    return { success: false, error: reviewsError.message };
  }

  const reviewCreatedAt = new Date(`${input.reviewDate}T00:00:00.000Z`).toISOString();

  const { error: insertError } = await supabase.from('application_reviews').insert({
    application_id: input.appId,
    reviewer_name: input.reviewerName.trim(),
    decision: input.decision,
    reason: input.reason.trim(),
    created_at: reviewCreatedAt,
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  const allReviews = [
    ...(existingReviews ?? []),
    { decision: input.decision as Database['public']['Enums']['review_decision'] },
  ];
  const nextStatus = getNextApplicationStatus(allReviews);
  const isFinalized =
    nextStatus === ApplicationStatus.PAYMENT_PENDING ||
    nextStatus === ApplicationStatus.REJECTED;

  const { error: updateError } = await supabase
    .from('applications')
    .update({
      status: nextStatus,
      finalized_at: isFinalized ? new Date().toISOString() : null,
    })
    .eq('id', input.appId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath(ROUTES.ADMIN_DASHBOARD);
  revalidatePath(ROUTES.ADMIN_APPLICATION_DETAIL(input.appId));

  if (isFinalized) {
    revalidatePath(ROUTES.MEMBERSHIP_DASHBOARD);
  }

  return { success: true };
}
