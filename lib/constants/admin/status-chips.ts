import { ApplicationStatus, ReviewDecision } from '@/lib/constants';
import type { StatusChipType } from '@/types/admin.types';

export const STATUS_CHIPS: StatusChipType[] = [
  { color: '#00519F', label: 'To Review', theme: ApplicationStatus.TO_REVIEW },
  { color: '#393533', label: 'Rejected', theme: ApplicationStatus.REJECTED },
  { color: '#393533', label: 'Rejected', theme: ReviewDecision.REJECT },
  { color: '#C67D38', label: 'Payment Pending', theme: ApplicationStatus.PAYMENT_PENDING },
  { color: '#5EB42D', label: 'Active', theme: ApplicationStatus.ACTIVE },
  { color: '#2B8100', label: 'Approved', theme: ReviewDecision.APPROVE },
  { color: '#BE282B', label: 'Expired', theme: ApplicationStatus.EXPIRED },
  { color: '#C67D38', label: 'Conflict', theme: ApplicationStatus.CONFLICT },
];
