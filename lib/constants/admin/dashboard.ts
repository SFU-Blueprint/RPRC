import { ApplicationType, type AdminDashboardStats } from '@/types/admin.types';

/* Stat card types. */
export const STAT_CARD_TYPES = ['independent', 'organization', 'toReview'] as const;

export type StatCardType = (typeof STAT_CARD_TYPES)[number];

/** Stats for the three overview cards: independent, organization, toReview */
export type StatCardsData = Array<{ type: StatCardType; value: number }>;

/* Build stat cards array from AdminDashboardStats using STAT_CARD_TYPES order. */
export function toStatCardsData(stats: AdminDashboardStats): StatCardsData {
  return STAT_CARD_TYPES.map((type) => ({ type, value: stats[type] }));
}

/* Single source of truth for application status types.  */
export const APPLICATION_STATUS_TYPES = [
  { value: 'toReview', label: 'To Review' },
  { value: 'paymentPending', label: 'Payment Pending' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'conflict', label: 'Conflict' },
  { value: 'rejected', label: 'Rejected' },
] as const;

const ALL_TAB = { value: 'all', label: 'All' } as const;

export const ADMIN_DASHBOARD_CONST = {
  PAGE_TITLE: 'Admin Dashboard',

  /** Filter tabs: "All" plus one tab per application status type */
  TABS: [ALL_TAB, ...APPLICATION_STATUS_TYPES],
  TABLE_COLUMNS: [
    { label: 'Applicant Name', value: 'applicantName' },
    { label: 'Application Type', value: 'type' },
    { label: 'Date Received', value: 'dateReceived' },
    { label: 'Status', value: 'status' },
    { label: 'Reviewer 1', value: 'reviewer1' },
    { label: 'Reviewer 2', value: 'reviewer2' },
  ],
};

