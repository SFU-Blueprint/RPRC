'use client';

import { useWatch } from 'react-hook-form';

import { CheckboxField } from '@/components/sign-up/fields/CheckboxField';
import { TextareaField } from '@/components/sign-up/fields/TextareaField';
import {
  SIGN_UP_FIELD_DESCRIPTIONS,
  SIGN_UP_FIELD_LABELS,
  SIGN_UP_SECTION_TITLES,
} from '@/lib/constants/sign-up';
import { useIndividualSignUpForm } from '@/lib/hooks/useSignUpFormContext';
import { MOTIVATION_MAX_WORDS } from '@/lib/schema';

import { SignUpSection } from './SignUpSection';

/** Individual only: `waiverRequest`, and `waiverReason` once requested. */
export function WaiverSection() {
  const { control, setValue } = useIndividualSignUpForm();
  const isRequested = useWatch({ control, name: 'waiverRequest' });

  return (
    <SignUpSection
      title={SIGN_UP_SECTION_TITLES.WAIVER}
      description={SIGN_UP_FIELD_DESCRIPTIONS.WAIVER}
      layout="stack"
    >
      <CheckboxField
        control={control}
        name="waiverRequest"
        label={SIGN_UP_FIELD_LABELS.WAIVER_REQUEST}
        // A reason only makes sense with a request; don't submit a stale one.
        onValueChange={(checked) => {
          if (!checked) setValue('waiverReason', undefined);
        }}
      />
      {isRequested && (
        <TextareaField
          control={control}
          name="waiverReason"
          label={SIGN_UP_FIELD_LABELS.WAIVER_REASON}
          rows={4}
          maxWords={MOTIVATION_MAX_WORDS}
        />
      )}
    </SignUpSection>
  );
}
