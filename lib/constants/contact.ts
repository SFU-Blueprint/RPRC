/**
 * RPRC contact addresses shown to members.
 *
 * TODO: the pages currently show two different addresses. Confirm with the
 * team which one is right, then keep only that one.
 */
export const CONTACT_EMAILS = {
  /** Shown on the dashboard and in the sign-up error banners. */
  GENERAL: 'info@richmondprc.org',
  /** Shown in the membership status descriptions (payment pending, rejected). */
  MEMBERSHIP: 'rprc@gmail.com',
} as const;
