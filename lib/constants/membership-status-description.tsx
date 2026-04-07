import React from 'react';
import { ApplicationStatus } from '@/lib/constants/enums';

export const MEMBERSHIP_STATUS_DESCRIPTION_TEXT: Record<ApplicationStatus, React.ReactNode> = {
  active: <>
    Memberships must be renewed annually at the start of each year.
    <br /><br />
    To vote at the Annual General Meeting, members must be registered at least 30 days in advance.
  </>,

  expired: <>
    Your membership has expired. Please renew to continue your membership.
    <br /><br />
    Members must submit a renewal application form via their profiles. A processing fee of $5 is needed if the application is approved.
  </>,

  expires_soon: <>
    Memberships must be renewed annually at the start of each year.
    <br /><br />
    Members must submit a renewal application form via their profiles. A processing fee of $5 will need to be paid if the application is approved.
  </>,

  to_review: <>
    Your membership renewal is under processing. The status will be updated within <strong>14 business days</strong>.
    <br /><br />
    Please check your registered email or membership profile for updates about your application.
  </>,

  conflict: <>
    Your membership renewal is under processing. The status will be updated within <strong>14 business days</strong>.
    <br /><br />
    Please check your registered email or membership profile for updates about your application.
  </>,

  payment_pending: <>
    Your membership has been approved. Please complete payment <strong>within 30 days</strong> to activate it.
    <br /><br />
    The individual membership fee is $5 and paid annually at the time of renewal.
    <br />
    <small>For more information, contact <a href="mailto:rprc@gmail.com" className="underline hover:opacity-75">rprc@gmail.com</a></small>
  </>,

  rejected: <>
    Your membership application was not approved.
    <br /><br />
    For more information, please contact us at <a href="mailto:rprc@gmail.com" className="underline hover:opacity-75">rprc@gmail.com</a>.
  </>,
};
