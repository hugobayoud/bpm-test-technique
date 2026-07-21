import type { RelationshipType, TrainingFrequency } from '@/types/feed';
import { AGE_UNIT, DISTANCE_UNIT, FILTER_LABELS } from './constants';
import type { Filters } from './store';

// Wire keys of the 4 Filtres — also the vocabulary of the coach contract.
export type FilterKey =
  | 'age_range'
  | 'max_distance'
  | 'training_frequency'
  | 'relationship_type';

// Fixed priority order: tiebreak guide for the LLM, iteration order for the
// deterministic fallback and for getEmptyFilterKeys below.
export const FILTER_PRIORITY_ORDER = [
  'age_range',
  'max_distance',
  'training_frequency',
  'relationship_type',
] as const satisfies readonly FilterKey[];

// weight = the Coach Score points a Filtre grants the first time it is
// completed. Set by answering effort, not matching importance (spec « Weight »).
type RangeFilterDefinition = {
  label: string;
  unit: string;
  domain: { min: number; max: number };
  shortcuts: readonly { min: number; max: number }[];
  weight: number;
};

type SliderFilterDefinition = {
  label: string;
  unit: string;
  domain: { min: number; max: number };
  shortcuts: readonly number[];
  weight: number;
};

type EnumFilterDefinition<Value> = {
  label: string;
  options: readonly Value[];
  weight: number;
};

// The catalogue: one row per Filtre — control domain, French label and frozen
// shortcuts (code rules, never the LLM). Enum options ARE the feed unions,
// `satisfies` keeps them in sync without re-declaring the types.
export const FILTER_CATALOGUE = {
  age_range: {
    label: FILTER_LABELS.age_range,
    unit: AGE_UNIT,
    domain: { min: 18, max: 60 },
    shortcuts: [
      { min: 18, max: 25 },
      { min: 25, max: 40 },
      { min: 40, max: 50 },
      { min: 50, max: 60 },
    ],
    // Two bounds to set — the costliest answer.
    weight: 3,
  },
  max_distance: {
    label: FILTER_LABELS.max_distance,
    unit: DISTANCE_UNIT,
    domain: { min: 5, max: 160 },
    // 50 is deliberately absent: it is the unanswered sentinel.
    shortcuts: [20, 40, 80, 160],
    // One slider to drag.
    weight: 2,
  },
  training_frequency: {
    label: FILTER_LABELS.training_frequency,
    options: ['little', 'mid', 'hard'],
    // One chip to tap.
    weight: 1,
  },
  relationship_type: {
    label: FILTER_LABELS.relationship_type,
    options: ['exclusive', 'casual', 'intimate'],
    // One chip to tap.
    weight: 1,
  },
} as const satisfies {
  age_range: RangeFilterDefinition;
  max_distance: SliderFilterDefinition;
  training_frequency: EnumFilterDefinition<TrainingFrequency>;
  relationship_type: EnumFilterDefinition<RelationshipType>;
};

// Unanswered sentinels: full age domain, mid-scale 50 km, nothing sought.
// Choosing exactly a sentinel counts as unanswered — assumed spec limitation.
export const DEFAULT_FILTERS = {
  ageRange: { ...FILTER_CATALOGUE.age_range.domain },
  maxDistance: 50,
  trainingFrequency: null,
  relationshipType: null,
} satisfies Filters;

const FILTER_IS_ANSWERED: Record<FilterKey, (filters: Filters) => boolean> = {
  age_range: ({ ageRange }) =>
    ageRange.min !== DEFAULT_FILTERS.ageRange.min ||
    ageRange.max !== DEFAULT_FILTERS.ageRange.max,
  max_distance: ({ maxDistance }) =>
    maxDistance !== DEFAULT_FILTERS.maxDistance,
  training_frequency: ({ trainingFrequency }) => trainingFrequency !== null,
  relationship_type: ({ relationshipType }) => relationshipType !== null,
};

// The unanswered keys, in priority order — the coach asks them one by one.
export function getEmptyFilterKeys(filters: Filters): FilterKey[] {
  return FILTER_PRIORITY_ORDER.filter(
    (key) => !FILTER_IS_ANSWERED[key](filters),
  );
}

// The answered keys, in priority order — the complement of getEmptyFilterKeys.
// The Coach Score reconciliation folds these into its monotone completed set.
export function getAnsweredFilterKeys(filters: Filters): FilterKey[] {
  return FILTER_PRIORITY_ORDER.filter((key) =>
    FILTER_IS_ANSWERED[key](filters),
  );
}

// The Coach Score of a completed set: the Σ of its Filtres' weights. The score
// is ALWAYS derived from the set of completed keys — never stored raw.
export function getCoachScore(keys: readonly FilterKey[]): number {
  return keys.reduce((sum, key) => sum + FILTER_CATALOGUE[key].weight, 0);
}

// The score of a fully completed profile — the Σ of every weight (= 7).
export const TOTAL_WEIGHT = getCoachScore(FILTER_PRIORITY_ORDER);
