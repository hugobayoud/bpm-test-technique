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
