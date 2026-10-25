import type { FieldIds } from '@/types/sign-up-fields.types';

/**
 * Stable DOM ids derived from the field's form path, e.g. `address.city`
 * becomes `field-address-city`. Labels, descriptions and errors are linked
 * to the control through these ids.
 */
function toIdSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export function getFieldIds(name: string): FieldIds {
  const base = `field-${toIdSegment(name)}`;

  return {
    control: base,
    description: `${base}-description`,
    error: `${base}-error`,
  };
}

/** Id for one option of a radio or checkbox group, e.g. `field-phoneType-Cell`. */
export function getOptionId(ids: FieldIds, value: string): string {
  return `${ids.control}-${toIdSegment(value)}`;
}

/** Builds an `aria-describedby` value from the ids that are actually rendered. */
export function getDescribedBy(
  ...ids: Array<string | false | undefined>
): string | undefined {
  const present = ids.filter(Boolean);
  return present.length > 0 ? present.join(' ') : undefined;
}

/**
 * An empty (or whitespace only) input means "not provided". Storing
 * `undefined` instead of `''` lets optional schema fields such as
 * `organizationEmail` pass, while required fields still get their
 * "is required" message from the schema.
 */
export function toOptionalString(value: string): string | undefined {
  return value.trim() === '' ? undefined : value;
}
