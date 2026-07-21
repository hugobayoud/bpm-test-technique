import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_FILTERS } from '@/features/filters/catalogue';
import { useFiltersStore } from '@/features/filters/store';

// AsyncStorage is a native module: stub it in-memory so the persisted store
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

// The store is a module-level singleton: reset it between tests.
beforeEach(() => {
  useFiltersStore.getState().reset();
});

describe('useFiltersStore', () => {
  it('starts with every Filtre at its unanswered sentinel', () => {
    const state = useFiltersStore.getState();

    expect(state.ageRange).toEqual(DEFAULT_FILTERS.ageRange);
    expect(state.maxDistance).toBe(DEFAULT_FILTERS.maxDistance);
    expect(state.trainingFrequency).toBeNull();
    expect(state.relationshipType).toBeNull();
  });

  it('setAgeRange stores the new range', () => {
    useFiltersStore.getState().setAgeRange({ min: 25, max: 40 });

    expect(useFiltersStore.getState().ageRange).toEqual({ min: 25, max: 40 });
  });

  it('setMaxDistance stores the new distance', () => {
    useFiltersStore.getState().setMaxDistance(80);

    expect(useFiltersStore.getState().maxDistance).toBe(80);
  });

  it('setTrainingFrequency stores the sought frequency', () => {
    useFiltersStore.getState().setTrainingFrequency('mid');

    expect(useFiltersStore.getState().trainingFrequency).toBe('mid');
  });

  it('setRelationshipType stores the sought relationship', () => {
    useFiltersStore.getState().setRelationshipType('casual');

    expect(useFiltersStore.getState().relationshipType).toBe('casual');
  });

  it('reset restores every sentinel after answers', () => {
    const store = useFiltersStore.getState();
    store.setAgeRange({ min: 30, max: 45 });
    store.setMaxDistance(20);
    store.setTrainingFrequency('hard');
    store.setRelationshipType('exclusive');

    useFiltersStore.getState().reset();

    const state = useFiltersStore.getState();
    expect(state.ageRange).toEqual(DEFAULT_FILTERS.ageRange);
    expect(state.maxDistance).toBe(DEFAULT_FILTERS.maxDistance);
    expect(state.trainingFrequency).toBeNull();
    expect(state.relationshipType).toBeNull();
  });
});
