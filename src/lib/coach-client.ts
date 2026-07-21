import {
  type CoachRequest,
  type CoachResponse,
  isCoachResponse,
} from '@/features/coach/types';

// Real network client — unlike the feed's mock, the coach ships with its
// backend from V1 (ADR 0001): the Supabase Edge Function behind this URL.
export async function fetchCoachQuestion(
  request: CoachRequest,
): Promise<CoachResponse> {
  const url = process.env.EXPO_PUBLIC_COACH_URL;
  if (!url) {
    throw new Error(
      'EXPO_PUBLIC_COACH_URL manquante : copier .env.example vers .env (mise en route : supabase/README.md)',
    );
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Coach HTTP ${response.status}`);
  }
  // The function already re-validates OpenAI's constrained output (tiers 1-2
  // of the contract); tier 3 re-checks it here — a response for a field that
  // is not awaiting a question is an error like any other (→ fallback).
  const payload: unknown = await response.json();
  if (!isCoachResponse(payload, request.emptyFields)) {
    throw new Error('Coach : réponse hors contrat');
  }
  return payload;
}
