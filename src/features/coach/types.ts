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
