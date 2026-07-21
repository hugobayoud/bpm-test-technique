import type { FilterKey } from './catalogue';

// Block titles of the 4 Filtres. Enum chip labels are deliberately NOT here:
// the canonical ones live in the feed's constants (TRAINING_FREQUENCY_VALUE,
// RELATIONSHIP_TYPE_COPY) — cross-feature reuse decided in the spec.
export const FILTER_LABELS = {
  age_range: "Tranche d'âge",
  max_distance: 'Distance maximale',
  training_frequency: "Fréquence d'entraînement recherchée",
  relationship_type: 'Type de relation recherché',
} as const satisfies Record<FilterKey, string>;

export const AGE_UNIT = 'ans';
export const DISTANCE_UNIT = 'km';
