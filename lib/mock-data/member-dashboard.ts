import { ApplicationStatus, ApplicationType } from '@/lib/constants/enums';
import type { MemberDashboardData } from '@/types/membership.types';

export const MEMBER_DASHBOARD: MemberDashboardData = {
  name: 'Leighton Kramer',
  status: ApplicationStatus.ACTIVE,
  type: ApplicationType.INDIVIDUAL,
  interests: ['Health', 'Environment'],
  reason: 'I want to support community led poverty reduction and help make services more accessible in Richmond.',
  contact: {
    email: 'leighton.kramer@example.com',
    phone: '604-555-1234',
    address: 'New Westminster, BC, Canada',
  },
  dateReceived: '2024-05-01',
  dateFinalized: '2024-05-15',
};
