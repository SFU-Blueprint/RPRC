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
    phoneType: 'cell',
    address: 'New Westminster, BC, Canada',
    addressFields: {
      mailingAddress: '123 Example Street',
      city: 'New Westminster',
      province: 'British Columbia',
      country: 'Canada',
      postalCode: 'V3L 1A1',
    },
  },
  dateReceived: '2024-05-01',
  dateFinalized: '2024-05-15',
};

export const ORGANIZATION_MEMBER_DASHBOARD: MemberDashboardData = {
  name: 'Richmond Community Services',
  status: ApplicationStatus.ACTIVE,
  type: ApplicationType.ORGANIZATION,
  interests: ['Health', 'Environment'],
  reason: 'We want to support community-led poverty reduction and improve access to local services.',
  contact: {
    email: 'contact@richmondservices.example',
    phone: '604-555-9876',
    phoneType: 'cell',
    address: '456 Community Road, Richmond, British Columbia, Canada, V6X 1A1',
    addressFields: {
      mailingAddress: '456 Community Road',
      city: 'Richmond',
      province: 'British Columbia',
      country: 'Canada',
      postalCode: 'V6X 1A1',
    },
  },
  representativeName: 'Jordan Lee',
  representativeEmail: 'jordan.lee@example.com',
  servicesOffered: 'Community outreach and family support services.',
  dateReceived: '2024-05-01',
  dateFinalized: '2024-05-15',
};
