import { ApplicationStatus, ReviewDecision } from '@/lib/constants';
import type { StatusChipType } from '@/types/admin.types';

export const STATUS_CHIPS: StatusChipType[] = [
  { color: '#2D3FB4', label: 'To Review', theme: ApplicationStatus.TO_REVIEW },
  { color: '#962123', label: 'Rejected', theme: ReviewDecision.REJECT },
  { color: '#962123', label: 'Rejected', theme: ApplicationStatus.REJECTED },
  { color: '#A87A27', label: 'Payment Pending', theme: ApplicationStatus.PAYMENT_PENDING },
  { color: '#2B8100', label: 'Active', theme: ApplicationStatus.ACTIVE },
  { color: '#2B8100', label: 'Approved', theme: ReviewDecision.APPROVE },
  { color: '#74654C', label: 'Expired', theme: ApplicationStatus.EXPIRED },
  { color: '#3A3226', label: 'Conflict', theme: ApplicationStatus.CONFLICT },
];
