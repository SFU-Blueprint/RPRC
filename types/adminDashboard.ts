export type ColumnType = {
  label: string;
  value: string;
  width?: string;
};

export type ApplicationType = {
  id: string;
  applicantName: string;
  type: 'Individual' | 'Organization';
  dateReceived: string | Date;
  status: 'toReview' | 'rejected' | 'paymentPending' | 'active' | 'expired';
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
