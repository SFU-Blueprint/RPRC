import { ReviewHistoryMockType } from "@/types/review-history-mock";

export const APPLICATIONS_MOCK = [{
  id: 'APP01',
  user_id: 'USER01',
  type: 'individual',
  status: 'payment_pending',
  created_at: '2024-05-01',
}];

export const USERS_MOCK = [{
  id: 'USER01',
  role: 'individual',
  email: "leighton.kramer@gmail.com",
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}];

export const USER_ADDRESSES_MOCK = [{
  user_id: 'USER01',
  mailing_address: "2007-258 Nelsons Court",
  city: "New Westminster",
  province: "BC",
  country: "Canada",
  postal_code: "V3M 6J8",
}];

export const INDIVIDUAL_PROFILES_MOCK = [{
  user_id: 'USER01',
  name: "Leighton Kramer",
  phone_number: "604-555-1234",
  phone_type: "cell",
}];

export const INDIVIDUAL_APPLICATION_DETAILS_MOCK = [{
  application_id: 'APP01',
  reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
}];

export const APPLICATION_DETAILS_CONST = {
  breadcrumbs: 'Back to All Applications',
};

export const REVIEW_HISTORY_MOCK_ONE_APPROVAL: ReviewHistoryMockType[] = [
  {
    id: 'REV01',
    application_id: 'APP01',
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reviewer_name: 'John Doe',
    decision: 'approve',
    created_at: '2024-05-10',
  },
];

export const REVIEW_HISTORY_MOCK_ONE_REJECT: ReviewHistoryMockType[] = [
  {
    id: 'REV01',
    application_id: 'APP01',
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reviewer_name: 'John Doe',
    decision: 'reject',
    created_at: '2024-05-10',
  },
];

export const REVIEW_HISTORY_MOCK_CONFLICT: ReviewHistoryMockType[] = [
  {
    id: 'REV01',
    application_id: 'APP01',
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reviewer_name: 'John Doe',
    decision: 'approve',
    created_at: '2024-05-10',
  },
  {
    id: 'REV02',
    application_id: 'APP01',
    reason: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
    reviewer_name: 'Jane Doe',
    decision: 'reject',
    created_at: '2024-05-15',
  },
];

export const REVIEW_HISTORY_MOCK_APPROVAL: ReviewHistoryMockType[] = [
  {
    id: 'REV01',
    application_id: 'APP01',
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reviewer_name: 'John Doe',
    decision: 'approve',
    created_at: '2024-05-10',
  },
  {
    id: 'REV02',
    application_id: 'APP01',
    reason: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
    reviewer_name: 'Jane Doe',
    decision: 'approve',
    created_at: '2024-05-15',
  },
];

export const REVIEW_HISTORY_MOCK_NO_APPROVAL: ReviewHistoryMockType[] = [
  {
    id: 'REV01',
    application_id: 'APP01',
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reviewer_name: 'John Doe',
    decision: 'reject',
    created_at: '2024-05-10',
  },
  {
    id: 'REV02',
    application_id: 'APP01',
    reason: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
    reviewer_name: 'Jane Doe',
    decision: 'reject',
    created_at: '2024-05-15',
  },
];

