import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  FILTER_PRIORITY_ORDER,
  type FilterKey,
  getAnsweredFilterKeys,
} from '@/features/filters/catalogue';
import { type Filters, useFiltersStore } from '@/features/filters/store';

// Monotone union of the already-completed set with the Filtres a snapshot has
// now answered. Pure and idempotent: re-completing a Filtre adds nothing,
// unanswering one never drops its key — the Coach Score only ever grows. The
// result stays in priority order: a canonical, deduplicated set.
export function reconcile(
  completedKeys: readonly FilterKey[],
  filters: Filters,
): FilterKey[] {
  const union = new Set<FilterKey>(completedKeys);
  for (const key of getAnsweredFilterKeys(filters)) {
    union.add(key);
  }
  return FILTER_PRIORITY_ORDER.filter((key) => union.has(key));
}

type CoachScoreStore = {
  // The monotone set of completed Filtres. The Coach Score is ALWAYS derived
  // from it (getCoachScore) — no raw number is ever persisted.
  completedKeys: FilterKey[];
  reconcileWith: (filters: Filters) => void;
  reset: () => void;
};

// Persisted client state: the completed set survives kill & relaunch. Only the
// set is stored; the score is recomputed from it on every read.
export const useCoachScoreStore = create<CoachScoreStore>()(
  persist(
    (set) => ({
      completedKeys: [],
      reconcileWith: (filters) =>
        set((state) => ({
          completedKeys: reconcile(state.completedKeys, filters),
        })),
      // « Recommencer » (test affordance) is the SOLE reset — in production the
      // score only climbs.
      reset: () => set({ completedKeys: [] }),
    }),
    {
      name: 'bpm-coach-score',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// One mechanism, both doors (Coach page and Filtres page): reconcile against
// the filters store on every change. reconcile is a monotone union, so this
// stays a pure accumulation whichever door moved a Filtre.
function reconcileFromFilters() {
  useCoachScoreStore.getState().reconcileWith(useFiltersStore.getState());
}

useFiltersStore.subscribe(reconcileFromFilters);

// Backfill at first load: Filtres answered before this feature existed must
// count. Both stores hydrate asynchronously from AsyncStorage; running the
// monotone reconcile after either one finishes (or now, if already hydrated)
// converges to the correct set regardless of hydration order.
useFiltersStore.persist.onFinishHydration(reconcileFromFilters);
useCoachScoreStore.persist.onFinishHydration(reconcileFromFilters);
if (useFiltersStore.persist.hasHydrated()) {
  reconcileFromFilters();
}
