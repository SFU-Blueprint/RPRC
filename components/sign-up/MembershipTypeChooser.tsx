'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { bodyStyles, headerStyles, robotoCondensed } from '@/app/fonts';
import { MembershipInfoCard } from '@/components/signup/cards/MembershipInfoCard';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/routes';
import { MEMBERSHIP_TYPE_CHOOSER_COPY as COPY } from '@/lib/constants/sign-up';
import { cn } from '@/lib/utils';

const SIGN_UP_ROUTE_BY_TYPE = {
  [UserRole.INDIVIDUAL]: ROUTES.SIGN_UP_INDIVIDUAL,
  [UserRole.ORGANIZATION]: ROUTES.SIGN_UP_ORGANIZATION,
} as const;

/**
 * `/sign-up` landing: pick a membership type, then continue to its form.
 * Only a choice; account details are collected on the form itself.
 */
export function MembershipTypeChooser() {
  const router = useRouter();
  const [membershipType, setMembershipType] = useState<
    keyof typeof SIGN_UP_ROUTE_BY_TYPE
  >(UserRole.ORGANIZATION);

  return (
    <div className="rounded-4xl bg-card-background-gray p-8 shadow-card md:p-10 lg:p-12">
      <h1
        className={cn(
          'mb-6 text-primary-black',
          headerStyles.lResponsive,
          robotoCondensed.className,
        )}
      >
        {COPY.HEADING}
      </h1>

      <div className="flex flex-col gap-4 md:flex-row md:gap-5 lg:flex-col lg:gap-6 xl:flex-row xl:gap-8">
        <MembershipInfoCard
          title={COPY.INDIVIDUAL.TITLE}
          price={COPY.INDIVIDUAL.PRICE}
          description={COPY.INDIVIDUAL.DESCRIPTION}
          isSelected={membershipType === UserRole.INDIVIDUAL}
          onSelect={() => setMembershipType(UserRole.INDIVIDUAL)}
        />
        <MembershipInfoCard
          title={COPY.ORGANIZATION.TITLE}
          price={COPY.ORGANIZATION.PRICE}
          description={COPY.ORGANIZATION.DESCRIPTION}
          isSelected={membershipType === UserRole.ORGANIZATION}
          onSelect={() => setMembershipType(UserRole.ORGANIZATION)}
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={() => router.push(SIGN_UP_ROUTE_BY_TYPE[membershipType])}
        >
          {COPY.CONTINUE}
        </Button>
        <p className={cn('text-center text-content-secondary', bodyStyles.m)}>
          {COPY.HAVE_ACCOUNT}{' '}
          <Link href={ROUTES.HOME} className="font-medium underline">
            {COPY.SIGN_IN}
          </Link>
        </p>
      </div>
    </div>
  );
}
