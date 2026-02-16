export const APPLICATION_DETAIL_ICON_SIZES = {
    LARGE: 30,
    SMALL: 20,
} as const;

export const CONFIRM_REVIEW_TEXT = {
    FIRST_APPROVAL_TITLE: "Submit First Approval",
    FIRST_APPROVAL_DESCRIPTION: "You're submitting an approval for this application. This review will be recorded. ",

    FINAL_APPROVAL_TITLE: "Submit Final Approval",
    FINAL_APPROVAL_DESCRIPTION: "You're submitting an approval for this application. This is the second approval from your team and will finalize the approval for this application.",

    FIRST_REJECTION_TITLE: "Submit First Rejection",
    FIRST_REJECTION_DESCRIPTION: "You're submitting a rejection for this application. This review will be recorded. ",

    FINAL_REJECTION_TITLE: "Submit Final Rejection",
    FINAL_REJECTION_DESCRIPTION: "You're submitting a rejection for this application. This is the second rejection from your team and will finalize the rejection for this application.",

    MIXED_DECISION_TITLE: "Submit a Different Decision",
    MIXED_DECISION_DESCRIPTION: "You’re submitting a decision that is different from another decision made on this application. Applications with conflicting decisions will require team discussion."
} as const;