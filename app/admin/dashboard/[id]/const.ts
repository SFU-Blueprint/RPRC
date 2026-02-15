import { ReviewHistoryMockType } from "@/types/review-history-mock";
import { date } from "zod";

export const APPLICATION_DETAILS_MOCK = {
  name: 'Leighton Kramer',
  status: 'to_review',
  type: 'individual',
  interests: ['Health', 'Education', 'Arts+Culture'],
  reason:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquiP. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
  contact: {
    email: 'leighton.kramer@gmail.com',
    phone: '+1 (123) 456-7890',
    address: '2007-258 Nelsons Court, New Westminster, BC, V3J09S',
  },
  dateReceived: '2024-05-01',

};

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

