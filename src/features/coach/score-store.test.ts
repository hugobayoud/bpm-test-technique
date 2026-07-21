import { beforeEach, describe, expect, it, vi } from 'vitest';

import { reconcile, useCoachScoreStore } from '@/features/coach/score-store';
import {
  DEFAULT_FILTERS,
  getCoachScore,
  TOTAL_WEIGHT,
} from '@/features/filters/catalogue';
import { type Filters, useFiltersStore } from '@/features/filters/store';

// AsyncStorage is a native module: stub it in-memory so both persisted stores
// can be imported under vitest's node environment.
vi.mock('@react-native-async-storage/async-storage', () => {
  const storage = new Map<string, string>();
  return {
    default: {
      getItem: async (key: string) => storage.get(key) ?? null,
      setItem: async (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: async (key: string) => {
        storage.delete(key);
      },
    },
  };
});

// Every Filtre answered, away from every sentinel.
const ANSWERED_FILTERS: Filters = {
  ageRange: { min: 25, max: 35 },
  maxDistance: 30,
  trainingFrequency: 'hard',
  relationshipType: 'exclusive',
};

// Both stores are module-level singletons: reset them between tests.
beforeEach(() => {
  useFiltersStore.getState().reset();
  useCoachScoreStore.getState().reset();
});

describe('reconcile', () => {
  it('adds a Filtre the first time its snapshot answers it', () => {
    const next = reconcile([], {
      ...DEFAULT_FILTERS,
      ageRange: { min: 25, max: 35 },
    });

    expect(next).toEqual(['age_range']);
    expect(getCoachScore(next)).toBe(3);
  });

  it('is idempotent — re-completing the same Filtre adds nothing', () => {
    const once = reconcile([], ANSWERED_FILTERS);
    const twice = reconcile(once, ANSWERED_FILTERS);

    expect(twice).toEqual(once);
    expect(getCoachScore(twice)).toBe(TOTAL_WEIGHT);
  });

  it('keeps a key even after its Filtre is unanswered — the score never drops', () => {
    // age_range already completed; the new snapshot has it back at its
    // sentinel but answers max_distance instead.
    const next = reconcile(['age_range'], {
      ...DEFAULT_FILTERS,
      maxDistance: 20,
    });

    expect(next).toEqual(['age_range', 'max_distance']);
    expect(getCoachScore(next)).toBe(5); // 3 kept + 2 gained, none lost
  });

  it('unions from any filters snapshot — one path for both doors', () => {
    // Distance already done via one door; the age answer arrives via another.
    const next = reconcile(['max_distance'], {
      ...DEFAULT_FILTERS,
      ageRange: { min: 30, max: 40 },
    });

    expect(next).toEqual(['age_range', 'max_distance']); // priority order
  });

  it('backfills Filtres answered before the feature existed at first load', () => {
    expect(reconcile([], ANSWERED_FILTERS)).toEqual([
      'age_range',
      'max_distance',
      'training_frequency',
      'relationship_type',
    ]);
  });
});

describe('useCoachScoreStore', () => {
  it('starts empty — a fresh Coach Score of 0', () => {
    const { completedKeys } = useCoachScoreStore.getState();

    expect(completedKeys).toEqual([]);
    expect(getCoachScore(completedKeys)).toBe(0);
  });

  it('derives coach_score as the Σ of the completed set', () => {
    useCoachScoreStore.getState().reconcileWith(ANSWERED_FILTERS);

    const { completedKeys } = useCoachScoreStore.getState();
    expect(getCoachScore(completedKeys)).toBe(TOTAL_WEIGHT);
  });

  it('reconciles on any filters change — the Filtres door feeds the same set', () => {
    useFiltersStore.getState().setAgeRange({ min: 25, max: 35 });

    const { completedKeys } = useCoachScoreStore.getState();
    expect(completedKeys).toEqual(['age_range']);
    expect(getCoachScore(completedKeys)).toBe(3);
  });

  it('reset empties the set — coach_score back to 0', () => {
    useCoachScoreStore.getState().reconcileWith(ANSWERED_FILTERS);
    expect(getCoachScore(useCoachScoreStore.getState().completedKeys)).toBe(
      TOTAL_WEIGHT,
    );

    useCoachScoreStore.getState().reset();

    const { completedKeys } = useCoachScoreStore.getState();
    expect(completedKeys).toEqual([]);
    expect(getCoachScore(completedKeys)).toBe(0);
  });
});
