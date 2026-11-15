import { ApplicationStatus } from '@/lib/constants/enums';

/**
 * Statuses in which the member can edit their profile. Not while the
 * application is under review, waiting for payment, or in conflict.
 */
export const PROFILE_EDITABLE_STATUSES: readonly ApplicationStatus[] = [
  ApplicationStatus.ACTIVE,
  ApplicationStatus.EXPIRES_SOON,
  ApplicationStatus.EXPIRED,
  ApplicationStatus.REJECTED,
];

/**
 * Statuses from which the member can send their application back for review:
 * renewing an expiring or expired membership, or re-applying after a
 * rejection (after editing their profile).
 */
export const RESUBMITTABLE_STATUSES: readonly ApplicationStatus[] = [
  ApplicationStatus.EXPIRES_SOON,
  ApplicationStatus.EXPIRED,
  ApplicationStatus.REJECTED,
];
