/**
 * Mock API Functions for RPRC Membership Signup
 * These will be replaced with real API calls later
 */

import { SignUpFormData } from '@/types/signup';

/**
 * Mock function to submit application data to API
 * Logs formatted data to console
 *
 * @param formData - Complete sign up form data
 * @returns { success: boolean, applicationId: string }
 */
export function submitToAPI(formData: SignUpFormData) {
  console.log('\n' + '='.repeat(60));
  console.log('MEMBERSHIP APPLICATION SUBMITTED');
  console.log('='.repeat(60));

  console.log('\nACCOUNT INFORMATION');
  console.log('━'.repeat(60));
  console.log(`Email:           ${formData.email}`);
  console.log(`Membership Type: ${formData.membershipType || 'Not selected'}`);
  console.log(
    `Password:        ${'*'.repeat(formData.password.length)} (${formData.password.length} characters)`,
  );

  console.log('\nCONTACT INFORMATION');
  console.log('━'.repeat(60));
  console.log(`Full Name:       ${formData.fullName}`);
  console.log(
    `Phone Number:    ${formData.phoneNumber} (${formData.phoneType})`,
  );

  console.log('\nADDRESS INFORMATION');
  console.log('━'.repeat(60));
  console.log(`Mailing Address: ${formData.mailingAddress}`);
  console.log(`City:            ${formData.city}`);
  console.log(`Province:        ${formData.province}`);
  console.log(`Country:         ${formData.country}`);
  console.log(`Postal Code:     ${formData.postalCode}`);

  console.log('\nMEMBERSHIP INTERESTS');
  console.log('━'.repeat(60));
  if (formData.interests && formData.interests.length > 0) {
    formData.interests.forEach((interest, index) => {
      console.log(`${index + 1}. ${interest}`);
    });
  } else {
    console.log('None selected');
  }

  console.log('\nWHY RPRC MEMBER?');
  console.log('━'.repeat(60));
  console.log(formData.whyrpcmember || 'Not provided');

  // Individual-specific fields
  if (formData.membershipType === 'individual') {
    console.log('\nMEMBERSHIP FEE WAIVER');
    console.log('━'.repeat(60));
    console.log(
      `Waiver Requested: ${formData.membershipwaiver ? 'Yes' : 'No'}`,
    );
    if (formData.membershipwaiver && formData.waiverreason) {
      console.log(`Reason:           ${formData.waiverreason}`);
    }
  }

  // Organization-specific fields
  if (formData.membershipType === 'organization') {
    console.log('\nORGANIZATION SERVICES');
    console.log('━'.repeat(60));
    console.log(formData.organisationservices || 'Not provided');
  }

  console.log('\nAPPLICATION STATUS');
  console.log('━'.repeat(60));
  const applicationId = getApplicationNumber();
  console.log(`Application ID:  ${applicationId}`);
  console.log(`Status:          Submitted`);
  console.log(`Timestamp:       ${new Date().toISOString()}`);

  console.log('\n' + '='.repeat(60));
  console.log('SUBMISSION SUCCESSFUL');
  console.log('='.repeat(60) + '\n');

  // Return mock success response
  return {
    success: true,
    applicationId: applicationId,
  };
}

/**
 * Mock function to generate application number (used in earlier ui design)
 * Returns hardcoded value
 *
 * @returns string - Application reference number
 */
export function getApplicationNumber(): string {
  return 'APP-561995';
}
