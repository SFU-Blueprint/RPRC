/**
 * Supabase's generated types mark every RPC argument as non-null, even when the
 * function accepts null (e.g. `p_fee_waiver_reason`, `p_org_rep_email`). Use
 * this to pass "no value" as SQL NULL without a type error.
 */
export function nullableArg(value: string | null | undefined): string {
  return (value ?? null) as unknown as string;
}
