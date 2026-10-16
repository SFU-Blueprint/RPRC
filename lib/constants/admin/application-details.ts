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