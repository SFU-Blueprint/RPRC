import type {
  ApplicationStatus,
  ApplicationType,
  PhoneType,
} from '@/lib/constants/enums';
import type { ApplicationErrorCodeType } from '@/lib/constants/application-errors';

export type BaseMemberDashboardData = {
  name: string;
  status: ApplicationStatus | null;
  type: ApplicationType | null;
  interests: string[];
  reason: string;
  contact: {
    email: string;
    phone: string;
    phoneType?: PhoneType | null;
    address: string;
    addressFields?: {
      mailingAddress: string;
      city: string;
      province: string;
      country: string;
      postalCode: string;
    };
  };
  dateReceived: string;
  dateFinalized?: string;
};

export type IndividualMemberDashboardData = BaseMemberDashboardData & {
  feeWaiver?: boolean | null;
  feeWaiverReason?: string | null;
};

export type OrganizationMemberDashboardData = BaseMemberDashboardData & {
  representativeName?: string | null;
  representativeEmail?: string | null;
  servicesOffered?: string | null;
};

export type MemberDashboardData =
  | IndividualMemberDashboardData
  | OrganizationMemberDashboardData;

export type MembershipProfileUpdateBase = {
  name: string;
  phone: string;
  phoneType: PhoneType;
  mailingAddress: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  interests: string[];
  reason: string;
};

export type IndividualMembershipProfileUpdate = MembershipProfileUpdateBase;

export type OrganizationMembershipProfileUpdate = MembershipProfileUpdateBase & {
  representativeName: string;
  representativeEmail?: string;
  servicesOffered?: string | null;
};

export type MembershipProfileUpdateResult = {
  success: boolean;
  error?: string;
  code?: ApplicationErrorCodeType;
};
