/** Placeholder page until the design is finalized: choose individual or
 * organization membership, then fill in that form (account + application).
 */
import type { Metadata } from 'next';

import { MembershipTypeChooser } from '@/components/sign-up/MembershipTypeChooser';
import { SignUpInfoBox } from '@/components/sign-up/cards/SignUpInfoBox';

export const metadata: Metadata = {
  title: 'Choose Membership Type',
};

export default function SignUpPage() {
  return (
    <div className="my-auto grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <SignUpInfoBox />
      <MembershipTypeChooser />
    </div>
  );
}
