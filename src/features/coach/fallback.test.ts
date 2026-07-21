import { describe, expect, it } from 'vitest';

import { STATIC_QUESTIONS } from '@/features/coach/constants';
import { fallbackCoachQuestion } from '@/features/coach/fallback';
import {
  FILTER_PRIORITY_ORDER,
  type FilterKey,
} from '@/features/filters/catalogue';

describe('fallbackCoachQuestion', () => {
  it('asks the first empty field, with its static copy', () => {
    const question = fallbackCoachQuestion([
      'age_range',
      'max_distance',
      'training_frequency',
    ]);

    expect(question).toEqual({
      fieldKey: 'age_range',
      questionText: STATIC_QUESTIONS.age_range,
    });
  });

  it('pairs every Filtre with its own static question', () => {
    for (const fieldKey of FILTER_PRIORITY_ORDER) {
      expect(fallbackCoachQuestion([fieldKey])).toEqual({
        fieldKey,
        questionText: STATIC_QUESTIONS[fieldKey],
      });
    }
  });

  it('chains the 4 static questions in priority order when every call fails', () => {
    const asked: FilterKey[] = [];
    let emptyFields: FilterKey[] = [...FILTER_PRIORITY_ORDER];

    while (emptyFields.length > 0) {
      const { fieldKey } = fallbackCoachQuestion(emptyFields);
      asked.push(fieldKey);
      emptyFields = emptyFields.filter((key) => key !== fieldKey);
    }

    expect(asked).toEqual([...FILTER_PRIORITY_ORDER]);
  });
});
