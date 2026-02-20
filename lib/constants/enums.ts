/**
 * Centralized Enums
 * These match the database enums defined in the schema
 */

/**
 * User Role Enum
 * Matches database: user_role enum ('individual','organization','admin')
 */
export const UserRole = {
  INDIVIDUAL: 'individual',
  ORGANIZATION: 'organization',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Phone Type Enum
 * Matches database: phone_type enum ('home','cell')
 */
export const PhoneType = {
  HOME: 'home',
  CELL: 'cell',
} as const;

export type PhoneType = (typeof PhoneType)[keyof typeof PhoneType];

/**
 * Application Type Enum
 * Matches database: application_type enum ('individual','organization')
 */
export const ApplicationType = {
  INDIVIDUAL: 'individual',
  ORGANIZATION: 'organization',
} as const;

export type ApplicationType = (typeof ApplicationType)[keyof typeof ApplicationType];

/**
 * Application Status Enum
 * Matches database: application_status enum
 */
export const ApplicationStatus = {
  TO_REVIEW: 'to_review',
  PAYMENT_PENDING: 'payment_pending',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CONFLICT: 'conflict',
  REJECTED: 'rejected',
} as const;

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

/**
 * Review Decision Enum
 * Matches database: review_decision enum ('approve','reject')
 */
export const ReviewDecision = {
  APPROVE: 'approve',
  REJECT: 'reject',
} as const;

export type ReviewDecision = (typeof ReviewDecision)[keyof typeof ReviewDecision];

/**
 * Membership Interest Enum
 * Shared list for interest chips/options
 */
export const MembershipInterest = {
  HEALTH: 'Health',
  ENVIRONMENT: 'Environment',
  ARTS_CULTURE: 'Arts + Culture',
} as const;

export type MembershipInterest =
  (typeof MembershipInterest)[keyof typeof MembershipInterest];

/**
 * Payment Transaction Status Enum
 * Matches database: payment_transaction_status enum
 */
export const PaymentTransactionStatus = {
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_ACTION: 'requires_action',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  CANCELED: 'canceled',
  FAILED: 'failed',
} as const;

export type PaymentTransactionStatus = (typeof PaymentTransactionStatus)[keyof typeof PaymentTransactionStatus];

/**
 * Helper function to check if a value is a valid enum value
 */
export function isValidEnumValue<T extends Record<string, string>>(
  enumObj: T,
  value: string
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}

/**
 * Helper function to get all enum values as an array
 */
export function getEnumValues<T extends Record<string, string>>(
  enumObj: T
): T[keyof T][] {
  return Object.values(enumObj) as T[keyof T][];
}
