import React from 'react';
import { ApplicationStatus, UserRole } from '@/lib/constants/enums';
import { APPLICATION_FEES } from '@/lib/constants/processing-fees';

export function MembershipStatusDescription({ status, role }: { status: ApplicationStatus, role: UserRole }) {

  console.log(role);
  const price = role === UserRole.ORGANIZATION ? APPLICATION_FEES.ORGANIZATION : APPLICATION_FEES.INDIVIDUAL;

  if (status === ApplicationStatus.ACTIVE) {
    return (
      <>
        Memberships must be renewed annually at the start of each year.
        <br /><br />
        To vote at the Annual General Meeting, members must be registered at least 30 days in advance.
      </>
    )
  }

  if (status === ApplicationStatus.EXPIRED) {
    return (
      <>
        Your membership has expired. Please renew to continue your membership.
        <br /><br />
        Members must submit a renewal application form via their profiles. A processing fee of ${price} is needed if the application is approved.
      </>
    );
  }

  if (status === ApplicationStatus.EXPIRES_SOON) {
    return (
      <>
        Memberships must be renewed annually at the start of each year.
        <br /><br />
        Members must submit a renewal application form via their profiles. A processing fee of ${price} will need to be paid if the application is approved.
      </>
    );
  }

  if (status === ApplicationStatus.TO_REVIEW) {
    return (
      <>
        Your membership renewal is under processing. The status will be updated within <strong>14 business days</strong>.
        <br /><br />
        Please check your registered email or membership profile for updates about your application.
      </>
    );
  }

  if (status === ApplicationStatus.CONFLICT) {
    return (
      <>
        Your membership renewal is under processing. The status will be updated within <strong>14 business days</strong>.
        <br /><br />
        Please check your registered email or membership profile for updates about your application.
      </>
    );
  }

  if (status === ApplicationStatus.PAYMENT_PENDING) {
    return (
      <>
        Your membership has been approved. Please complete payment <strong>within 30 days</strong> to activate it.
        <br /><br />
        The individual membership fee is ${price} and paid annually at the time of renewal.
        <br />
        <small>For more information, contact <a href="mailto:rprc@gmail.com" className="underline hover:opacity-75">rprc@gmail.com</a></small>
      </>
    );
  }

  if (status === ApplicationStatus.REJECTED) {
    return (
      <>
        Your membership application was not approved.
        <br /><br />
        For more information, please contact us at <a href="mailto:rprc@gmail.com" className="underline hover:opacity-75">rprc@gmail.com</a>.
      </>
    );
  }
}
