'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  ApplicationStatus,
  ApplicationType,
  PhoneType,
  UserRole,
} from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';
import {
  ApplicationErrorCode,
  SubmitApplication,
} from '@/lib/constants/application-errors';

export async function submitApplication(
  formData: FormData,
): Promise<SubmitApplication> {
  const supabase = await createClient();

  // Extract form data
  const data = {
    email: formData.get('email') as string,
    fullName: formData.get('fullName') as string,
    phoneNumber: formData.get('phoneNumber') as string,
    membershipType: formData.get('membershipType') as string,
    phoneType: formData.get('phoneType') as PhoneType,
    mailingAddress: formData.get('mailingAddress') as string,
    city: formData.get('city') as string,
    province: formData.get('province') as string,
    country: formData.get('country') as string,
    postalCode: formData.get('postalCode') as string,
    interests: JSON.parse(formData.get('interests') as string),
    whyrpcmember: formData.get('whyrpcmember') as string,
    organisationservices: formData.get('organisationservices') as
      | string
      | undefined,
    representativeName: formData.get('representativeName') as
      | string
      | undefined,
    representativeEmail: formData.get('representativeEmail') as
      | string
      | undefined,
    membershipwaiver: formData.get('membershipwaiver') as string | undefined,
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

  if (
    requiredFields.some((field) => !data[field as keyof typeof data])
  ) {
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

  if (data.membershipType === UserRole.INDIVIDUAL) {
    // Validation logic for individual applications
    // **Database updates for individual applications**
  } else {
    // Check if organization already exists (by name, phone, OR user_id) or if user has already submitted an application
    const { data: existing } = await supabase
      .from('organization_profiles')
      .select('*')
      .or(
        `org_name.eq.${data.fullName},phone_num.eq.${data.phoneNumber},user_id.eq.${user.id}`,
      )
      .maybeSingle();

    if (existing) {
      let errorMessage = 'Organization already exists';
      if (existing.user_id === user.id) {
        errorMessage = 'You have already submitted an application';
      } else if (existing.org_name === data.fullName) {
        errorMessage = 'An organization with this name already exists';
      } else if (existing.phone_num === data.phoneNumber) {
        errorMessage = 'An organization with this phone number already exists';
      }

      return {
        success: false,
        error: errorMessage,
        code: ApplicationErrorCode.APPLICATION_EXISTS,
      };
    }

    // **Database updates for organization applications**
    // TODO: This logic should be handled in a DB transaction to prevent partial writes
    try {
      // 1. Create organization profile
      const { error: orgProfileError } = await supabase
        .from('organization_profiles')
        .insert({
          user_id: user.id,
          org_name: data.fullName,
          org_rep_name: data.representativeName ?? null,
          org_rep_email: data.representativeEmail ?? null,
          phone_num: data.phoneNumber,
          phone_type: data.phoneType,
        });

      if (orgProfileError)
        throw new Error(
          `Organization profile creation failed: ${orgProfileError.message}`,
        );

      // 2. Create organization address
      const { error: orgAddressError } = await supabase
        .from('user_addresses')
        .insert({
          user_id: user.id,
          mailing_address: data.mailingAddress,
          city: data.city,
          country: data.country,
          province: data.province,
          postal_code: data.postalCode,
        });

      if (orgAddressError)
        throw new Error(
          `Organization address creation failed: ${orgAddressError.message}`,
        );

      // 3. Create organization application
      const { data: orgAppData, error: orgAppError } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          type: ApplicationType.ORGANIZATION,
          status: ApplicationStatus.TO_REVIEW,
        })
        .select()
        .single();

      if (orgAppError)
        throw new Error(
          `Organization application creation failed: ${orgAppError.message}`,
        );

      const applicationId = orgAppData?.id;

      // 4. Create organization application details
      const { error: orgAppDetailsError } = await supabase
        .from('organization_application_details')
        .insert({
          application_id: applicationId,
          reason: data.whyrpcmember,
          org_services: data.organisationservices ?? null,
        });

      if (orgAppDetailsError)
        throw new Error(
          `Organization application details creation failed: ${orgAppDetailsError.message}`,
        );

      // 5. Create organization application interests
      // Get interest IDs for the selected interest names
      const { data: selectedInterests } = await supabase
        .from('membership_interests')
        .select('id')
        .in('name', data.interests);

      const { error: orgInterestsError } = await supabase
        .from('application_interests')
        .insert(
          selectedInterests?.map((interest) => ({
            application_id: applicationId,
            interest_id: interest.id,
          })) || [],
        );

      if (orgInterestsError)
        throw new Error(
          `Organization interests creation failed: ${orgInterestsError.message}`,
        );
    } catch (error) {
      console.error('Application submission error:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create application',
        code: ApplicationErrorCode.SERVER_ERROR,
      };
    }
  }
  revalidatePath(ROUTES.MEMBERSHIP_FORM, 'layout')
  revalidatePath(ROUTES.MEMBERSHIP_DASHBOARD, 'layout')
  redirect(ROUTES.MEMBERSHIP_CONFIRMATION);
}
