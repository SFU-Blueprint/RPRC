/** placeholder page until design is finalized 
 * a copy of the membership/signup without the email and pass fields.
*/
import type { Metadata } from 'next';

import { MembershipTypeChooser } from '@/components/sign-up/MembershipTypeChooser';
import { SignUpInfoBox } from '@/components/signup/cards/SignUpInfoBox';

export const metadata: Metadata = {
  title: 'Choose Membership Type',
};

export default function SignUpPage() {
  return (
    <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <SignUpInfoBox />
      <MembershipTypeChooser />
    </div>
  );
}
