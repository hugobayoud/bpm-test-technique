import { describe, expect, it } from 'vitest';

import {
  DEFAULT_FILTERS,
  FILTER_CATALOGUE,
  getEmptyFilterKeys,
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
