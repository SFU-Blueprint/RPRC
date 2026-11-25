import { ApplicationType } from '@/lib/constants/enums';
import { EmailTemplate } from '@/lib/constants/email';

export type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type StatusEmail =
  | { template: typeof EmailTemplate.APPLICATION_RECEIVED; renewal: boolean }
  | { template: typeof EmailTemplate.APPLICATION_APPROVED }
  | {
      template: typeof EmailTemplate.MEMBERSHIP_ACTIVE;
      feeWaived: boolean;
      renewal: boolean;
    }
  | { template: typeof EmailTemplate.APPLICATION_REJECTED };

export type Recipient = { email: string; name: string; type: ApplicationType };
