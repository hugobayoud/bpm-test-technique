import type { FilterKey } from '@/features/filters/catalogue';

// French copy of the coach thread.
export const COACH_TITLE = 'Coach';
export const COACH_THINKING_MESSAGE = 'Le coach réfléchit…';
export const VALIDATE_LABEL = 'Valider';
export const PROFILE_COMPLETE_MESSAGE = 'Ton profil est complet 💪';
export const RESTART_LABEL = 'Recommencer';

// Static questions of the deterministic fallback: when the LLM cannot
// answer, the thread continues on these instead of an error screen.
export const STATIC_QUESTIONS = {
  age_range: "Quelle tranche d'âge cherches-tu ?",
  max_distance: "Jusqu'à quelle distance autour de toi ?",
  training_frequency: "Tu cherches quelqu'un qui s'entraîne à quel rythme ?",
  relationship_type: 'Tu cherches quel type de relation ?',
} as const satisfies Record<FilterKey, string>;
