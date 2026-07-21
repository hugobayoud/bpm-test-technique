import type { FilterKey } from '@/features/filters/catalogue';
import { STATIC_QUESTIONS } from './constants';
import type { CoachResponse } from './types';

// Deterministic fallback (spec « Erreur LLM → fallback déterministe ») : on
// any coach error the thread silently continues with the first empty field
// in priority order and its static copy. Callers pass at least one empty
// field — a complete profile never asks for a question.
export function fallbackCoachQuestion(
  emptyFields: readonly FilterKey[],
): CoachResponse {
  const fieldKey = emptyFields[0];
  return { fieldKey, questionText: STATIC_QUESTIONS[fieldKey] };
}
