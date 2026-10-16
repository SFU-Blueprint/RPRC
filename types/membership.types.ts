import type { ApplicationStatus, ApplicationType } from '@/lib/constants/enums';

export type MemberDashboardData = {
  name: string;
  status: ApplicationStatus | null;
  type: ApplicationType | null;
  interests: string[];
  reason: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  dateReceived: string;
  dateFinalized?: string;
};
