import type { RelationshipType, TrainingFrequency } from '@/types/feed';

// All user-facing copy is French. bpm mixes French and franglais on purpose:
// "Likes", "Matchs", "Boost" and "Rewind" are the app's own terms.
export const TAB_LABELS = {
  HOME: 'Accueil',
  LIKES: 'Likes',
  MATCHES: 'Matchs',
  PROFILE: 'Profil',
} as const;

// Used as the pushed placeholder pages' titles and as the header buttons' labels.
export const HEADER_ACTION_TITLES = {
  FILTERS: 'Filtres',
  REWIND: 'Rewind',
  BOOST: 'Boost',
} as const;

export const BACK_LABEL = 'Retour';

// Deliberately static (README liberty): incoming likes and remaining boosts
// are not modeled by the feed data.
export const LIKES_TAB_BADGE = '4';
export const BOOST_BADGE = '1';

// Minimal error state: shown when the feed can't load (or comes back empty).
export const FEED_ERROR_MESSAGE = 'Impossible de charger les profils.';

export const HEIGHT_UNIT = 'cm';

// Info card "looking for" copy. "Endurance" is the real app's wording for
// exclusive; the casual/intimate running metaphors are invented (README liberty).
export const RELATIONSHIP_TYPE_COPY: Record<
  RelationshipType,
  { label: string; tagline: string }
> = {
  exclusive: { label: 'Endurance', tagline: 'Le jeu long, sans chrono' },
  casual: { label: 'Fractionné', tagline: 'À fond, puis on souffle' },
  intimate: { label: 'Sprint', tagline: 'Intense, sans détour' },
};

// Sport card list header (rendered uppercase, as in the mockup).
export const SPORT_CARD_LABEL = 'Séances / semaine';

// Frequency → displayed sessions-per-week value.
export const TRAINING_FREQUENCY_VALUE: Record<TrainingFrequency, string> = {
  little: '1-2',
  mid: '3-4',
  hard: '5+',
};

// Frequency → ring sweep, as a fraction of the full circle (user-approved
// rule: the ring fill is proportional to the training frequency).
export const TRAINING_FREQUENCY_SWEEP: Record<TrainingFrequency, number> = {
  little: 1 / 3,
  mid: 2 / 3,
  hard: 1,
};
