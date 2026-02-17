import { ApplicationStatus, ReviewDecision } from "@/lib/constants";

/** Config for one status chip: color, label, and theme (ApplicationStatus or ReviewDecision). */
export type StatusChipType = {
  color: string;
  label: string;
  theme: ApplicationStatus | ReviewDecision;
};

/** Result of: from('applications').select('id, created_at, status, type, user_id') */
export type ApplicationRow = {
  id: string;
  created_at: string;
  status: string;
  type: 'individual' | 'organization';
  user_id: string;
};

/** Result of: from('users').select('id, individual_profiles(name), organization_profiles(org_name)') */
export type UserWithProfilesRow = {
  id: string;
  individual_profiles: { name: string } | { name: string }[] | null;
  organization_profiles: { org_name: string } | { org_name: string }[] | null;
};

/** Result of: from('application_reviews').select('application_id, reviewer_name, created_at') */
export type ReviewRow = {
  application_id: string;
  reviewer_name: string;
  created_at: string;
};

/** First two reviewers per application (by created_at), used when mapping to ApplicationType */
export type ReviewerPair = { reviewer1: string; reviewer2: string };

export type ColumnType = {
  label: string;
  value: string;
  width?: string;
};

export type ApplicationType = {
  id: string;
  applicantName: string;
  type: 'individual' | 'organization';
  dateReceived: string | Date;
  status: 'to_review' | 'rejected' | 'payment_pending' | 'active' | 'expired' | 'conflict';
  reviewer1: string;
  reviewer2: string;
};

/** Stats for the admin overview cards (independent, organization, applications counts). */
export type AdminDashboardStats = {
  independent: number;
  organization: number;
  applications: number;
};

/** Props for the Manage Applications section (applications list from server). */
export type ManageApplicationsProps = {
  applications: ApplicationType[];
};

export type AdminDashboardTablePropTypes = {
  columns: ColumnType[];
  applications: ApplicationType[];
  currentTab: {
    label: string;
    value: string;
  };
  pagination?: {
    itemCount: number;
    numberPerPage: number;
  };
};

export type AdminDashboardMobileTablePropTypes = {
  applications: ApplicationType[];
  currentTab: {
    label: string;
    value: string;
  };
  pagination?: {
    itemCount: number;
    numberPerPage: number;
  };
};

export type AdminReviewProps = {
  createdAt: string;
  reviewerName: string;
  decision: ReviewDecision
  reason: string;
  isFinalDecision: boolean;
};
