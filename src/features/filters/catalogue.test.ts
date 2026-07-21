import { describe, expect, it } from 'vitest';

import {
  DEFAULT_FILTERS,
  FILTER_CATALOGUE,
  FILTER_PRIORITY_ORDER,
  getAnsweredFilterKeys,
  getCoachScore,
  getEmptyFilterKeys,
  TOTAL_WEIGHT,
} from '@/features/filters/catalogue';
import type { Filters } from '@/features/filters/store';

// Every Filtre answered, away from every sentinel.
const ANSWERED_FILTERS: Filters = {
  ageRange: { min: 25, max: 35 },
  maxDistance: 30,
  trainingFrequency: 'hard',
  relationshipType: 'exclusive',
};

describe('getEmptyFilterKeys', () => {
  it('returns every key in priority order when everything is at its sentinel', () => {
    expect(getEmptyFilterKeys(DEFAULT_FILTERS)).toEqual([
      'age_range',
      'max_distance',
      'training_frequency',
      'relationship_type',
    ]);
  });

  it('returns nothing once every Filtre is answered', () => {
    expect(getEmptyFilterKeys(ANSWERED_FILTERS)).toEqual([]);
  });

  it('treats the untouched age range {18, 60} as unanswered', () => {
    const filters: Filters = {
      ...ANSWERED_FILTERS,
      ageRange: { min: 18, max: 60 },
    };
    expect(getEmptyFilterKeys(filters)).toEqual(['age_range']);
  });

  it('treats an age range as answered as soon as one bound moved', () => {
    const minMoved: Filters = {
      ...ANSWERED_FILTERS,
      ageRange: { min: 19, max: 60 },
    };
    const maxMoved: Filters = {
      ...ANSWERED_FILTERS,
      ageRange: { min: 18, max: 59 },
    };
    expect(getEmptyFilterKeys(minMoved)).toEqual([]);
    expect(getEmptyFilterKeys(maxMoved)).toEqual([]);
  });

  it('treats the sentinel distance 50 as unanswered, any other value as answered', () => {
    expect(
      getEmptyFilterKeys({ ...ANSWERED_FILTERS, maxDistance: 50 }),
    ).toEqual(['max_distance']);
    expect(
      getEmptyFilterKeys({ ...ANSWERED_FILTERS, maxDistance: 49 }),
    ).toEqual([]);
  });

  it('treats a null sought frequency as unanswered', () => {
    const filters: Filters = { ...ANSWERED_FILTERS, trainingFrequency: null };
    expect(getEmptyFilterKeys(filters)).toEqual(['training_frequency']);
  });

  it('treats a null sought relationship as unanswered', () => {
    const filters: Filters = { ...ANSWERED_FILTERS, relationshipType: null };
    expect(getEmptyFilterKeys(filters)).toEqual(['relationship_type']);
  });

  it('keeps the priority order on a partial subset', () => {
    const filters: Filters = {
      ...ANSWERED_FILTERS,
      maxDistance: 50,
      relationshipType: null,
    };
    expect(getEmptyFilterKeys(filters)).toEqual([
      'max_distance',
      'relationship_type',
    ]);
  });
});

describe('getAnsweredFilterKeys', () => {
  it('returns nothing when every Filtre is at its sentinel', () => {
    expect(getAnsweredFilterKeys(DEFAULT_FILTERS)).toEqual([]);
  });

  it('returns every key in priority order once all are answered', () => {
    expect(getAnsweredFilterKeys(ANSWERED_FILTERS)).toEqual([
      'age_range',
      'max_distance',
      'training_frequency',
      'relationship_type',
    ]);
  });

  it('is the complement of getEmptyFilterKeys on a partial subset', () => {
    const filters: Filters = {
      ...ANSWERED_FILTERS,
      maxDistance: 50,
      relationshipType: null,
    };
    expect(getAnsweredFilterKeys(filters)).toEqual([
      'age_range',
      'training_frequency',
    ]);
    expect(getEmptyFilterKeys(filters)).toEqual([
      'max_distance',
      'relationship_type',
    ]);
  });
});

describe('getCoachScore & TOTAL_WEIGHT', () => {
  it('scores an empty set at 0', () => {
    expect(getCoachScore([])).toBe(0);
  });

  it('scores each Filtre at its own weight', () => {
    expect(getCoachScore(['age_range'])).toBe(3);
    expect(getCoachScore(['max_distance'])).toBe(2);
    expect(getCoachScore(['training_frequency'])).toBe(1);
    expect(getCoachScore(['relationship_type'])).toBe(1);
  });

  it('sums the weights of a set', () => {
    expect(getCoachScore(['age_range', 'training_frequency'])).toBe(4);
  });

  it('totals every weight to 7', () => {
    expect(TOTAL_WEIGHT).toBe(7);
    expect(getCoachScore(FILTER_PRIORITY_ORDER)).toBe(TOTAL_WEIGHT);
  });
});

describe('FILTER_CATALOGUE', () => {
  it('excludes the sentinel 50 from the distance shortcuts', () => {
    expect(FILTER_CATALOGUE.max_distance.shortcuts).not.toContain(
      DEFAULT_FILTERS.maxDistance,
    );
  });

  it('keeps every shortcut inside its domain', () => {
    const { domain: distanceDomain, shortcuts: distances } =
      FILTER_CATALOGUE.max_distance;
    for (const value of distances) {
      expect(value).toBeGreaterThanOrEqual(distanceDomain.min);
      expect(value).toBeLessThanOrEqual(distanceDomain.max);
    }

    const { domain: ageDomain, shortcuts: ageRanges } =
      FILTER_CATALOGUE.age_range;
    for (const range of ageRanges) {
      expect(range.min).toBeGreaterThanOrEqual(ageDomain.min);
      expect(range.max).toBeLessThanOrEqual(ageDomain.max);
    }
  });
});
