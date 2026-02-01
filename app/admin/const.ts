import { ApplicationType } from '@/types/adminDashboard';

export const ADMIN_DASHBOARD_CONST = {
  PAGE_TITLE: 'Admin Dashboard',
  TABS: [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'To Review',
      value: 'toReview',
    },
    {
      label: 'Payment Pending',
      value: 'paymentPending',
    },
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Expired',
      value: 'expired',
    },
    {
      label: 'Rejected',
      value: 'rejected',
    },
  ],
  TABLE_COLUMNS: [
    { label: 'Applicant Name', value: 'applicantName', width: 'w-[260px]' },
    { label: 'Application Type', value: 'type', width: 'w-[200px]' },
    { label: 'Date Received', value: 'dateReceived', width: 'w-[200px]' },
    { label: 'Status', value: 'status', width: 'w-[280px]' },
    { label: 'Reviewer 1', value: 'reviewer1', width: 'w-[150px]' },
    { label: 'Reviewer 2', value: 'reviewer2', width: 'w-[150px]' },
  ],
};

export const ADMIN_DASHBOARD_MOCK = {
  ADMIN_NAME: 'John Doe',
  PROFILE_PICTURE_URL: undefined,
  STAT_CARDS: [
    {
      label: 'Independent Members',
      value: 30,
    },
    {
      label: 'Organization Members',
      value: 20,
    },
    {
      label: 'New Applications Submitted',
      value: 6,
    },
  ],
  APPLICATIONS_MOCK: [
    {
      id: 'APP01',
      applicantName: 'Leighton Kramer',
      type: 'Individual',
      dateReceived: '2026-01-06',
      status: 'toReview',
      reviewer1: '',
      reviewer2: '',
    },
    {
      id: 'APP02',
      applicantName: 'Marceline Avila',
      type: 'Organization',
      dateReceived: '2025-12-18',
      status: 'toReview',
      reviewer1: 'Jane Doe',
      reviewer2: '',
    },
    {
      id: 'APP03',
      applicantName: 'Jensen Vang',
      type: 'Organization',
      dateReceived: '2025-11-11',
      status: 'rejected',
      reviewer1: 'John Doe',
      reviewer2: 'Jane Doe',
    },
    {
      id: 'APP04',
      applicantName: 'Linda Wu',
      type: 'Individual',
      dateReceived: '2025-11-11',
      status: 'paymentPending',
      reviewer1: 'John Doe',
      reviewer2: 'Jane Doe',
    },
    {
      id: 'APP05',
      applicantName: 'Carter Higgins',
      type: 'Organization',
      dateReceived: '2025-11-05',
      status: 'completed',
      reviewer1: 'John Doe',
      reviewer2: 'Jane Doe',
    },
  ] as ApplicationType[],
};
