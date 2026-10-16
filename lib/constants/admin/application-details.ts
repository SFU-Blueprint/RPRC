// Keep these exports available for legacy callers while storing mock records in the lib catalog.
export {
  APPLICATIONS_MOCK,
  USERS_MOCK,
  USER_ADDRESSES_MOCK,
  INDIVIDUAL_PROFILES_MOCK,
  INDIVIDUAL_APPLICATION_DETAILS_MOCK,
  REVIEW_HISTORY_MOCK_ONE_APPROVAL,
  REVIEW_HISTORY_MOCK_ONE_REJECT,
  REVIEW_HISTORY_MOCK_CONFLICT,
  REVIEW_HISTORY_MOCK_APPROVAL,
  REVIEW_HISTORY_MOCK_NO_APPROVAL,
} from '@/lib/mock-data/admin-application-records';

export const APPLICATION_DETAIL_ICON_SIZES = {
  LARGE: 30,
  MEDIUM: 25,
  SMALL: 20,
} as const;

export const CONFIRM_REVIEW_TEXT = {
  FIRST_APPROVAL_TITLE: "Submit First Approval",
  FIRST_APPROVAL_DESCRIPTION:
    "You're previewing an approval for this application. Demo reviews are not saved. ",

  FINAL_APPROVAL_TITLE: "Submit Final Approval",
  FINAL_APPROVAL_DESCRIPTION:
    "You're previewing an approval for this application. Demo reviews are not saved.",

  FIRST_REJECTION_TITLE: "Submit First Rejection",
  FIRST_REJECTION_DESCRIPTION:
    "You're previewing a rejection for this application. Demo reviews are not saved. ",

  FINAL_REJECTION_TITLE: "Submit Final Rejection",
  FINAL_REJECTION_DESCRIPTION:
    "You're previewing a rejection for this application. Demo reviews are not saved.",

  MIXED_DECISION_TITLE: "Submit a Different Decision",
  MIXED_DECISION_DESCRIPTION:
    "You’re previewing a different decision. Demo reviews are not saved."
} as const;

export const APPLICATION_DETAILS_CONST = {
  breadcrumbs: 'Back to All Applications',
};

export const MOBILE_TABS = [
  {
    label: 'Details',
    value: 'details'
  },
  {
    label: 'Submit Review',
    value: 'submit_review'
  },
  {
    label: 'Review History',
    value: 'review_history'
  },
]
