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