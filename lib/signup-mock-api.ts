import { SignUpFormData } from '@/types/signup';

/**
 * Generate a mock application number
 */
export function getApplicationNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `RPRC-${timestamp}-${random}`;
}

/**
 * Submit Individual Membership Application
 * Sends only individual-relevant fields
 */
function submitIndividualToAPI(data: SignUpFormData): {
  success: boolean;
  applicationId: string;
  message: string;
  submittedData: any;
} {
  const applicationId = getApplicationNumber();

  // Structure data for Individual membership
  const individualPayload = {
    applicationType: 'individual',
    applicationId,
    timestamp: new Date().toISOString(),

    // Account Info
    account: {
      email: data.email,
      membershipType: data.membershipType,
    },

    // Personal Info
    personalInfo: {
      fullName: data.fullName,
      phone: {
        number: data.phoneNumber,
        type: data.phoneType,
      },
    },

    // Address Info
    address: {
      mailingAddress: data.mailingAddress,
      city: data.city,
      province: data.province,
      country: data.country,
      postalCode: data.postalCode,
    },

    // Membership Details
    membershipDetails: {
      interests: data.interests || [],
      whyJoining: data.whyrpcmember,
    },

    // Waiver Info (if applicable)
    waiver: data.membershipwaiver
      ? {
          requested: true,
          reason: data.waiverreason || 'No reason provided',
        }
      : null,
  };

  // Log to console as formatted JSON
  console.log('=== INDIVIDUAL MEMBERSHIP APPLICATION ===');
  console.log(JSON.stringify(individualPayload, null, 2));
  console.log('=========================================');

  return {
    success: true,
    applicationId,
    message: 'Individual membership application submitted successfully',
    submittedData: individualPayload,
  };
}

/**
 * Submit Organization Membership Application
 * Sends only organization-relevant fields
 */
function submitOrganizationToAPI(data: SignUpFormData): {
  success: boolean;
  applicationId: string;
  message: string;
  submittedData: any;
} {
  const applicationId = getApplicationNumber();

  // Structure data for Organization membership
  const organizationPayload = {
    applicationType: 'organization',
    applicationId,
    timestamp: new Date().toISOString(),

    // Account Info
    account: {
      email: data.email,
      membershipType: data.membershipType,
    },

    // Organization Info
    organizationInfo: {
      organizationName: data.fullName, // fullName is used as org name
      phone: {
        number: data.phoneNumber,
        type: data.phoneType,
      },
      programsAndServices: data.organisationservices || '',
    },

    // Representative Info
    representative: {
      name: data.representativeName || '',
      email: data.representativeEmail || null,
    },

    // Address Info
    address: {
      mailingAddress: data.mailingAddress,
      city: data.city,
      province: data.province,
      country: data.country,
      postalCode: data.postalCode,
    },

    // Membership Details
    membershipDetails: {
      interests: data.interests || [],
      whyJoining: data.whyrpcmember,
    },
  };

  // Log to console as formatted JSON
  console.log('=== ORGANIZATION MEMBERSHIP APPLICATION ===');
  console.log(JSON.stringify(organizationPayload, null, 2));
  console.log('===========================================');

  return {
    success: true,
    applicationId,
    message: 'Organization membership application submitted successfully',
    submittedData: organizationPayload,
  };
}

/**
 * Main submission function - Wrapper that routes to correct function
 * This is what components call
 */
export function submitToAPI(data: SignUpFormData): {
  success: boolean;
  applicationId: string;
  message: string;
  submittedData: any;
} {
  console.log('=== SUBMISSION STARTED ===');
  console.log(`Membership Type: ${data.membershipType}`);
  console.log('=========================');

  // Route to appropriate submission function
  if (data.membershipType === 'individual') {
    return submitIndividualToAPI(data);
  } else if (data.membershipType === 'organization') {
    return submitOrganizationToAPI(data);
  } else {
    // Fallback for invalid membership type
    console.error('Invalid membership type:', data.membershipType);
    return {
      success: false,
      applicationId: '',
      message: 'Invalid membership type',
      submittedData: null,
    };
  }
}
