'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  PhoneType,
  UserRole,
} from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';
import {
  ApplicationErrorCode,
  SubmitApplication,
} from '@/lib/constants/application-errors';

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
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingApp) {
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
        p_phone_num: data.phoneNumber,
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

  // Check if organization already exists by phone or if user has already submitted an application
  const { data: existing } = await supabase
    .from('organization_profiles')
    .select('*')
    .or(
      `phone_num.eq.${data.phoneNumber},user_id.eq.${user.id}`,
    )
    .maybeSingle();

  if (existing) {
    let errorMessage = 'Organization already exists';
    if (existing.user_id === user.id) {
      errorMessage = 'You have already submitted an application';
    } else if (existing.phone_num === data.phoneNumber) {
      errorMessage = 'An organization with this phone number already exists';
    }

    return {
      success: false,
      error: errorMessage,
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
        p_phone_num: data.phoneNumber,
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
