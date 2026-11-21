export const ApplicationErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type ApplicationErrorCodeType =
  (typeof ApplicationErrorCode)[keyof typeof ApplicationErrorCode];

/** Messages shared by more than one server action. */
export const ActionErrorMessage = {
  UNAUTHENTICATED: 'User not authenticated',
  APPLICATION_NOT_FOUND: 'Application not found',
  UNEXPECTED: 'An unexpected error occurred',
} as const;

export const ReviewErrorMessage = {
  NOT_FOUND: ActionErrorMessage.APPLICATION_NOT_FOUND,
  ADMIN_REQUIRED: 'Unauthorized: admin role required',
  MISSING_FIELDS: 'All review fields are required',
  ALREADY_FINALIZED: 'This application has already been finalized',
  SAVE_FAILED: 'Failed to save the review',
  INVALID_REVIEW_DATE: 'Review date must be a valid date',
  CONCURRENT_REVIEW:
    'Another review was submitted at the same time. Reload the page and try again.',
  CONCURRENT_REVIEW_NOT_WITHDRAWN:
    'Another review was submitted at the same time, and yours could not be withdrawn. Reload the page before trying again.',
} as const;

/** Messages from the member dashboard actions (profile edit and renewal). */
export const MembershipErrorMessage = {
  INVALID_PROFILE: 'Invalid profile details',
  PROFILE_TYPE_MISMATCH: 'Profile type does not match your application',
  PROFILE_LOCKED:
    'Your profile cannot be edited while your application is being processed',
  PROFILE_SAVE_FAILED: 'Failed to save membership profile',
  RENEWAL_NOT_ALLOWED: 'Your membership cannot be renewed right now',
  RENEWAL_FAILED: 'Failed to submit renewal',
} as const;

/** Messages from the admin application list. */
export const AdminErrorMessage = {
  LOAD_APPLICATIONS_FAILED: 'Failed to load applications. Please try again.',
} as const;
