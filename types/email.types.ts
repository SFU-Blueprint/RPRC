import type { ApplicationStatus, ApplicationType } from '@/lib/constants/enums';

export type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/** A status email, keyed by the status the application just moved into. */
export type StatusEmail =
  | { status: typeof ApplicationStatus.TO_REVIEW; renewal: boolean }
  | { status: typeof ApplicationStatus.PAYMENT_PENDING }
  | {
      status: typeof ApplicationStatus.ACTIVE;
      feeWaived: boolean;
      renewal: boolean;
    }
  | { status: typeof ApplicationStatus.REJECTED };

export type Recipient = { email: string; name: string; type: ApplicationType };
