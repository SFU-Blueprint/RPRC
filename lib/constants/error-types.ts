/**
 * Application Error Types
 * 
 * Centralized error codes and types for the entire application.
 * Includes error page types and auth operation error codes.
 */

// =============================================================================
// AUTH ERROR CODES (for server actions and API responses)
// =============================================================================

export const AuthErrorCode = {
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  RATE_LIMITED: 'RATE_LIMITED',
} as const

export type AuthErrorCodeType = typeof AuthErrorCode[keyof typeof AuthErrorCode]

// Response types for auth actions
export type SignupResponse = 
  | { success: true; userId: string; email: string | undefined; emailExists?: boolean }
  | { error: string; code: AuthErrorCodeType }

export type LoginResponse = 
  | { success: true }
  | { error: string; code: AuthErrorCodeType }

export type ForgotPasswordResponse = 
  | { success: true; message: string }
  | { error: string; code: AuthErrorCodeType }

export type ResetPasswordResponse = 
  | { success: true; message: string }
  | { error: string; code: AuthErrorCodeType }

export type ResendConfirmationResponse = 
  | { success: true; message: string }
  | { error: string; code: AuthErrorCodeType }

// =============================================================================
// ERROR PAGE TYPES (for /error page routing)
// =============================================================================

export const ErrorType = {
  LINK_EXPIRED: 'link_expired',
  LINK_INVALID: 'link_invalid',
  SERVER_ERROR: 'server_error',
} as const

export type ErrorTypeValue = typeof ErrorType[keyof typeof ErrorType]

/**
 * Error messages and metadata for each error type
 */
export const ERROR_MESSAGES: Record<ErrorTypeValue, {
  title: string
  description: string
}> = {
  [ErrorType.LINK_EXPIRED]: {
    title: 'Link expired',
    description: 'This confirmation link has expired. Links are valid for 24 hours. Please request a new one.',
  },
  [ErrorType.LINK_INVALID]: {
    title: 'Invalid link',
    description: 'This link is invalid or has already been used. Please request a new confirmation link.',
  },
  [ErrorType.SERVER_ERROR]: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again later or contact support if the problem persists.',
  },
}
