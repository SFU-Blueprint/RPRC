import type { ReactNode } from 'react';

import { headerStyles, robotoCondensed } from '@/app/fonts';
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { cn } from '@/lib/utils';

type SignUpSectionProps = {
  title: string;
  description?: ReactNode;
  /** `grid`: two columns from `md` up. `stack`: one full-width column. */
  layout?: 'grid' | 'stack';
  children: ReactNode;
};

/**
 * One titled group of the sign-up form: a `<fieldset>` whose `<legend>` is
 * the section heading (MDN "How to structure a web form"). Heading style
 * matches the existing application form (Roboto Condensed, `headerStyles`).
 */
export function SignUpSection({
  title,
  description,
  layout = 'grid',
  children,
}: SignUpSectionProps) {
  return (
    <FieldSet className="gap-5">
      <FieldLegend
        className={cn(
          // A <legend> ignores the fieldset's flex gap, so it needs its own margin.
          'mb-5 text-primary-black sm:mb-6',
          headerStyles.mResponsive,
          robotoCondensed.className,
        )}
      >
        {title}
      </FieldLegend>
      {description && (
        <FieldDescription className="max-w-3xl text-primary-black">
          {description}
        </FieldDescription>
      )}
      <FieldGroup
        className={cn(
          'gap-5',
          layout === 'grid' && 'grid grid-cols-1 items-start md:grid-cols-2',
        )}
      >
        {children}
      </FieldGroup>
    </FieldSet>
  );
}
