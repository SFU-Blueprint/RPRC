import { ReviewDecision } from "@/lib/constants";

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
  status: 'to_review' | 'rejected' | 'payment_pending' | 'active' | 'expired';
  reviewer1: string;
  reviewer2: string;
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
