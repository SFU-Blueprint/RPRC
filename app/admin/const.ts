import { ApplicationType } from '@/types/admin.types';

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
    { label: 'Applicant Name', value: 'applicantName' },
    { label: 'Application Type', value: 'type' },
    { label: 'Date Received', value: 'dateReceived' },
    { label: 'Status', value: 'status' },
    { label: 'Reviewer 1', value: 'reviewer1' },
    { label: 'Reviewer 2', value: 'reviewer2' },
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
      label: 'New Applications',
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
      status: 'active',
      reviewer1: 'John Doe',
      reviewer2: 'Jane Doe',
    },
    {
      id: 'APP06',
      applicantName: 'Sarah Johnson',
      type: 'Individual',
      dateReceived: '2025-11-10',
      status: 'active',
      reviewer1: 'Jane Doe',
      reviewer2: 'John Doe',
    },
    {
      id: 'APP07',
      applicantName: 'Michael Chen',
      type: 'Organization',
      dateReceived: '2025-11-09',
      status: 'expired',
      reviewer1: 'John Doe',
      reviewer2: '',
    },
  ] as ApplicationType[],
};
