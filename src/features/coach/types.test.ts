import { describe, expect, it } from 'vitest';

import { isCoachResponse } from '@/features/coach/types';
import type { FilterKey } from '@/features/filters/catalogue';

// This request's still-unanswered Filtres — age_range is deliberately absent
// (already answered).
const EMPTY_FIELDS: FilterKey[] = ['max_distance', 'relationship_type'];

describe('isCoachResponse', () => {
  it('accepts a question for a field awaiting one', () => {
    const response = {
      fieldKey: 'max_distance',
      questionText: "Jusqu'à quelle distance autour de toi ?",
    };

    expect(isCoachResponse(response, EMPTY_FIELDS)).toBe(true);
  });

  it('rejects a valid Filtre that is not awaiting a question', () => {
    const response = { fieldKey: 'age_range', questionText: 'Quel âge ?' };

    expect(isCoachResponse(response, EMPTY_FIELDS)).toBe(false);
  });

  it('rejects an unknown fieldKey', () => {
    const response = { fieldKey: 'shoe_size', questionText: 'Ta pointure ?' };

    expect(isCoachResponse(response, EMPTY_FIELDS)).toBe(false);
  });

  it('rejects a missing or empty questionText', () => {
    expect(isCoachResponse({ fieldKey: 'max_distance' }, EMPTY_FIELDS)).toBe(
      false,
    );
    expect(
      isCoachResponse(
        { fieldKey: 'max_distance', questionText: '' },
        EMPTY_FIELDS,
      ),
    ).toBe(false);
  });

  it('rejects non-object payloads', () => {
    expect(isCoachResponse(null, EMPTY_FIELDS)).toBe(false);
    expect(isCoachResponse(undefined, EMPTY_FIELDS)).toBe(false);
    expect(isCoachResponse('max_distance', EMPTY_FIELDS)).toBe(false);
  });
});
