import { Calendar, StepForward, User } from 'lucide-react';
import { ApplicationStatus } from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';

export const INFO_CARDS = [
  {
    ID: 1,
    ICON: User,
    HEADING: 'Check Your Email',
    DESCRIPTION:
      'A confirmation email has been sent to your registered email address, further about your application status will be sent here.',
  },
  {
    ID: 2,
    ICON: User,
    HEADING: 'View Your Profile',
    DESCRIPTION:
      'All following steps will be done through the applicant profile including viewing membership status.',
  },
  {
    ID: 3,
    ICON: Calendar,
    HEADING: 'Review Period',
    DESCRIPTION:
      'Our team will review your application within 14 business days.',
  },
  {
    ID: 4,
    ICON: StepForward,
    HEADING: 'Next Steps',
    DESCRIPTION:
      "Once approved, you'll receive payment instructions. After confirmation, your membership will be activated.",
  },
];

export const MEMBERSHIP_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active Membership',
  EXPIRES_SOON: 'Expires Soon',
  EXPIRED: 'Membership Expired',
  UNDER_PROCESSING: 'Under Processing',
  PAYMENT_PENDING: 'Payment Pending',
  REJECTED: 'Application Rejected',
};

export const MEMBERSHIP_STATUS_CTA: Record<string, string> = {
  EXPIRES_SOON: 'Renew Membership',
  EXPIRED: 'Renew Membership',
  PAYMENT_PENDING: 'Make Payment',
  REJECTED: 'Re-Apply',
};

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  {
    label: string;
    labelBg: string;
    labelText: string;
    borderColor: string;
    validUntilText?: string;
    ctaText?: string;
    ctaHref?: string;
    ctaColor?: string;
    ctaTextColor?: string;
  }
> = {
  active: {
    label: MEMBERSHIP_STATUS_LABELS.ACTIVE,
    labelBg: 'bg-primary-light',
    labelText: 'text-content-active',
    borderColor: 'border-signup-primary-green-700',
  },
  expires_soon: {
    label: MEMBERSHIP_STATUS_LABELS.EXPIRES_SOON,
    labelBg: 'bg-surface-secondary',
    labelText: 'text-warning',
    borderColor: 'border-warning-stroke',
    ctaText: MEMBERSHIP_STATUS_CTA.EXPIRES_SOON,
    ctaHref: ROUTES.MEMBERSHIP_RENEW,
    ctaColor: 'bg-warning-stroke hover:bg-warning-stroke/90',
    ctaTextColor: 'text-white',
  },

  expired: {
    label: MEMBERSHIP_STATUS_LABELS.EXPIRED,
    labelBg: 'bg-surface-rejected',
    labelText: 'text-content-error',
    borderColor: 'border-destructive-default',
    ctaText: MEMBERSHIP_STATUS_CTA.EXPIRED,
    ctaHref: ROUTES.MEMBERSHIP_RENEW,
    ctaColor: 'bg-destructive-default hover:bg-destructive-default/90',
    ctaTextColor: 'text-white',
  },
  to_review: {
    label: MEMBERSHIP_STATUS_LABELS.UNDER_PROCESSING,
    labelBg: 'bg-surface-secondary',
    labelText: 'text-warning',
    borderColor: 'border-warning-stroke',
  },
  conflict: {
    label: MEMBERSHIP_STATUS_LABELS.UNDER_PROCESSING,
    labelBg: 'bg-surface-secondary',
    labelText: 'text-warning',
    borderColor: 'border-warning-stroke',
  },
  payment_pending: {
    label: MEMBERSHIP_STATUS_LABELS.PAYMENT_PENDING,
    labelBg: 'bg-surface-secondary',
    labelText: 'text-warning',
    borderColor: 'border-warning-stroke',
    ctaText: MEMBERSHIP_STATUS_CTA.PAYMENT_PENDING,
    ctaHref: '#',
    ctaColor: 'bg-warning-stroke hover:bg-warning-stroke/90',
    ctaTextColor: 'text-white',
  },
  rejected: {
    label: MEMBERSHIP_STATUS_LABELS.REJECTED,
    labelBg: 'bg-surface-rejected',
    labelText: 'text-content-error',
    borderColor: 'border-destructive-default',
    ctaText: MEMBERSHIP_STATUS_CTA.REJECTED,
    ctaHref: ROUTES.MEMBERSHIP_RENEW,
    ctaColor: 'bg-destructive-default hover:bg-destructive-default/90',
    ctaTextColor: 'text-white',
  },
};
