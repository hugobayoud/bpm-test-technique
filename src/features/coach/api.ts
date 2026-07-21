import { useQuery } from '@tanstack/react-query';

import {
  type FilterKey,
  getEmptyFilterKeys,
} from '@/features/filters/catalogue';
import type { Filters } from '@/features/filters/store';
import { fetchCoachQuestion } from '@/lib/coach-client';
import { MY_PROFILE } from './my-profile';

// Backend seam, same shape as the feed's (feedKeys/useFeed).
export const coachKeys = {
  all: ['coach'] as const,
  question: (emptyFields: FilterKey[]) =>
    [...coachKeys.all, 'question', emptyFields] as const,
};

// The thread's engine: the key is the list of unanswered Filtres, so
// validating one changes the key and the next question fetches itself. A
// generated question never goes stale — regenerating is an explicit
// removeQueries (« Recommencer », issue 020), not a background refetch.
export function useCoachQuestion(filters: Filters) {
  const emptyFields = getEmptyFilterKeys(filters);
  return useQuery({
    queryKey: coachKeys.question(emptyFields),
    queryFn: () =>
      fetchCoachQuestion({
        profile: { ...MY_PROFILE, preferences: filters },
        emptyFields,
      }),
    enabled: emptyFields.length > 0, // profile complete ⇒ zero network calls
    retry: 1,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
