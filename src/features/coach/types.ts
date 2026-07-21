import type { FilterKey } from '@/features/filters/catalogue';
import type { Filters } from '@/features/filters/store';
import type { MyProfile } from './my-profile';

// Wire contract of the coach Edge Function (docs/specs/coach-v1.md, « Le
// pont ») — mirrored as comments in supabase/functions/coach/index.ts, which
// cannot import src/. Keep both sides in phase.
export type CoachRequest = {
  profile: MyProfile & { preferences: Filters }; // fixture + store snapshot
  emptyFields: FilterKey[]; // derived client-side via getEmptyFilterKeys
};

export type CoachResponse = {
  fieldKey: FilterKey;
  questionText: string;
};

// Tier 3 of the format guarantee (spec « Le pont ») : the client re-checks
// that the response is a non-empty question for a field actually awaiting
// one. Callers treat any failure as an error → deterministic fallback.
export function isCoachResponse(
  value: unknown,
  emptyFields: readonly FilterKey[],
): value is CoachResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const { fieldKey, questionText } = value as Partial<
    Record<keyof CoachResponse, unknown>
  >;
  return (
    typeof fieldKey === 'string' &&
    emptyFields.some((key) => key === fieldKey) &&
    typeof questionText === 'string' &&
    questionText.length > 0
  );
}
