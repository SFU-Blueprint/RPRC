'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { bodyStyles, headerStyles, robotoCondensed } from '@/app/fonts';
import { MembershipInfoCard } from '@/components/signup/cards/MembershipInfoCard';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';

const SIGN_UP_ROUTE_BY_TYPE = {
  individual: ROUTES.SIGN_UP_INDIVIDUAL,
  organization: ROUTES.SIGN_UP_ORGANIZATION,
} as const;

/**
 * `/sign-up` landing: pick a membership type, then continue to its form.
 * Only a choice; account details are collected on the form itself.
 */
export function MembershipTypeChooser() {
  const router = useRouter();
  const [membershipType, setMembershipType] =
    useState<keyof typeof SIGN_UP_ROUTE_BY_TYPE>('organization');

  return (
    <div className="rounded-4xl bg-card-background-gray p-8 shadow-card md:p-10 lg:p-12">
      <h1
        className={cn(
          'mb-6 text-primary-black',
          headerStyles.lResponsive,
          robotoCondensed.className,
        )}
      >
        Choose Membership Type
      </h1>

      <div className="flex flex-col gap-4 md:flex-row md:gap-5 lg:flex-col lg:gap-6 xl:flex-row xl:gap-8">
        <MembershipInfoCard
          title="Individual"
          price="$5/yr"
          description="This is the option for individuals who want to join the RPRC. the Membership fee may be waived in special cases. The $5 fee is due after application is approved."
          isSelected={membershipType === 'individual'}
          onSelect={() => setMembershipType('individual')}
        />
        <MembershipInfoCard
          title="Organization"
          price="$25/yr"
          description="This option is for organizations that want to join or work with the RPRC. The $25 organization fee is due after application is accepted."
          isSelected={membershipType === 'organization'}
          onSelect={() => setMembershipType('organization')}
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={() => router.push(SIGN_UP_ROUTE_BY_TYPE[membershipType])}
        >
          Continue
        </Button>
        <p className={cn('text-center text-content-secondary', bodyStyles.m)}>
          Already have an account?{' '}
          <Link href={ROUTES.HOME} className="font-medium underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
