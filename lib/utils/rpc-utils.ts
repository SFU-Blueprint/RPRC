/**
 * Supabase's generated types mark every RPC argument as non-null, even when the
 * function accepts null (e.g. `p_fee_waiver_reason`, `p_org_rep_email`). Use
 * this to pass "no value" as SQL NULL without a type error.
 */
export function nullableArg(value: string | null | undefined): string {
  return (value ?? null) as unknown as string;
}

/** Supabase returns an embedded one-to-one row as an object, or an array in some shapes. */
export function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
