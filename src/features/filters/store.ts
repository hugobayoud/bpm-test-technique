import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { RelationshipType, TrainingFrequency } from '@/types/feed';
import { DEFAULT_FILTERS } from './catalogue';

// The 4 matching preferences (Filtres). trainingFrequency/relationshipType
// are what the user SEEKS — not the profile attributes of the same name.
export type Filters = {
  ageRange: { min: number; max: number };
  maxDistance: number;
  trainingFrequency: TrainingFrequency | null;
  relationshipType: RelationshipType | null;
};

type FiltersStore = Filters & {
  setAgeRange: (ageRange: Filters['ageRange']) => void;
  setMaxDistance: (maxDistance: number) => void;
  setTrainingFrequency: (trainingFrequency: TrainingFrequency) => void;
  setRelationshipType: (relationshipType: RelationshipType) => void;
  reset: () => void;
};

// Persisted client state: the Filtres survive kill & relaunch. JSON
// serialization drops the setters, so only the Filters fields are stored.
export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set) => ({
      ...DEFAULT_FILTERS,
      setAgeRange: (ageRange) => set({ ageRange }),
      setMaxDistance: (maxDistance) => set({ maxDistance }),
      setTrainingFrequency: (trainingFrequency) => set({ trainingFrequency }),
      setRelationshipType: (relationshipType) => set({ relationshipType }),
      reset: () => set(DEFAULT_FILTERS),
    }),
    {
      name: 'bpm-filters',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
