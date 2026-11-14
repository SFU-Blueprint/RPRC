export const ApplicationErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  APPLICATION_EXISTS: 'APPLICATION_EXISTS',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type ApplicationErrorCodeType =
  (typeof ApplicationErrorCode)[keyof typeof ApplicationErrorCode];

export type SubmitApplication = {
  success: boolean;
  error?: string;
  code?: ApplicationErrorCodeType;
};

export const ReviewErrorMessage = {
  NOT_FOUND: 'Application not found',
  ALREADY_FINALIZED: 'This application has already been finalized',
  SAVE_FAILED: 'Failed to save the review',
  CONCURRENT_REVIEW:
    'Another review was submitted at the same time. Reload the page and try again.',
  CONCURRENT_REVIEW_NOT_WITHDRAWN:
    'Another review was submitted at the same time, and yours could not be withdrawn. Reload the page before trying again.',
} as const;
