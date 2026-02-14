// Error codes for authentication operations
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
