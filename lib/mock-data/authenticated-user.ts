import { MEMBER_DASHBOARD } from '@/lib/mock-data/member-dashboard';

/** Local identity used by pages that normally load data for the signed-in user. */
export const MOCK_AUTHENTICATED_USER = {
  id: 'demo-user-id',
  email: MEMBER_DASHBOARD.contact.email,
  role: 'member',
} as const;
