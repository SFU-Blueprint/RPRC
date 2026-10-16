import { ApplicationStatus, ApplicationType as MembershipApplicationType } from '@/lib/constants/enums';
import type { AdminApplicationPageData, ApplicationType } from '@/types/admin.types';

export const ADMIN_APPLICATIONS: ApplicationType[] = [
  { id: 'APP01', applicantName: 'Leighton Kramer', type: MembershipApplicationType.INDIVIDUAL, dateReceived: '2024-05-01', status: ApplicationStatus.TO_REVIEW, reviewer1: '—', reviewer2: '—' },
  { id: 'APP02', applicantName: 'Richmond Community Network', type: MembershipApplicationType.ORGANIZATION, dateReceived: '2024-05-08', status: ApplicationStatus.CONFLICT, reviewer1: 'Alex Morgan', reviewer2: 'Taylor Lee' },
  { id: 'APP03', applicantName: 'Sam Rivera', type: MembershipApplicationType.INDIVIDUAL, dateReceived: '2024-05-12', status: ApplicationStatus.ACTIVE, reviewer1: 'Jordan Kim', reviewer2: 'Casey Patel' },
];

const reviews = [
  { id: 'REV01', application_id: 'APP01', reviewer_name: '—', decision: 'approve', reason: 'Sample review history for the demo.', created_at: '2024-05-10', waiver_decision: null, waiver_note: null },
  { id: 'REV02', application_id: 'APP01', reviewer_name: '—', decision: 'reject', reason: 'A second sample review used to demonstrate conflicting decisions.', created_at: '2024-05-11', waiver_decision: null, waiver_note: null },
  { id: 'REV03', application_id: 'APP02', reviewer_name: 'Alex Morgan', decision: 'approve', reason: 'The application supports local community programs.', created_at: '2024-05-14', waiver_decision: null, waiver_note: null },
  { id: 'REV04', application_id: 'APP02', reviewer_name: 'Taylor Lee', decision: 'reject', reason: 'Needs further discussion by the board.', created_at: '2024-05-15', waiver_decision: null, waiver_note: null },
] as const;

export const ADMIN_APPLICATION_DETAILS: Record<string, AdminApplicationPageData> = {
  APP01: {
    headerName: 'Leighton Kramer', headerStatus: ApplicationStatus.TO_REVIEW,
    details: { type: MembershipApplicationType.INDIVIDUAL, interests: ['Health', 'Environment'], reason: 'I want to support community led poverty reduction in Richmond.', feeWaiverRequested: true, feeWaiverReason: 'I am currently experiencing financial hardship.', contact: { email: 'leighton.kramer@example.com', phone: '604-555-1234', address: 'New Westminster, BC, Canada' }, dateReceived: '2024-05-01' },
    reviewHistory: [],
  },
  APP02: {
    headerName: 'Richmond Community Network', headerStatus: ApplicationStatus.CONFLICT,
    details: { type: MembershipApplicationType.ORGANIZATION, interests: ['Environment', 'Arts + Culture'], reason: 'We work with Richmond residents to connect people with community services.', contact: { email: 'hello@richmondcommunity.example', phone: '604-555-0182', address: 'Richmond, BC, Canada' }, dateReceived: '2024-05-08' },
    reviewHistory: reviews.slice(2),
  },
  APP03: {
    headerName: 'Sam Rivera', headerStatus: ApplicationStatus.ACTIVE,
    details: { type: MembershipApplicationType.INDIVIDUAL, interests: ['Health'], reason: 'I want to contribute to a more inclusive community.', contact: { email: 'sam.rivera@example.com', phone: '604-555-0164', address: 'Richmond, BC, Canada' }, dateReceived: '2024-05-12' },
    reviewHistory: [],
  },
};
