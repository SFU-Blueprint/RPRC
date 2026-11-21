/** User-facing text for auth actions. */
export const AUTH_COPY = {
  SIGN_OUT_FAILED: "We couldn't log you out. Please try again.",
  CREDENTIALS_REQUIRED: 'Email and password are required',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SIGN_IN_FAILED: 'Failed to sign in',
  EMAIL_REQUIRED: 'Email is required',
  RESET_EMAIL_RATE_LIMITED:
    'Please wait before requesting another email. Try again in 1 minute.',
  RESET_EMAIL_FAILED: 'Failed to send reset email',
  RESET_EMAIL_SENT: 'Password reset email sent successfully',
  PASSWORD_REQUIRED: 'Password is required',
  RESET_PASSWORD_FAILED: 'Failed to reset password',
  PASSWORD_RESET: 'Password reset successfully',
} as const;
