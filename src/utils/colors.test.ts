import { describe, expect, it } from 'vitest';

import { COLORS } from '@/utils/colors';

// Wiring proof for the vitest setup (node env, `@/` alias, co-located tests).
// Real logic tests (photo allowance, feed store) arrive with their issues.
describe('COLORS', () => {
  it('contains only hex or rgba values', () => {
    for (const value of Object.values(COLORS)) {
      expect(value).toMatch(/^(#[0-9a-f]{6}|rgba\(\d+, \d+, \d+, 0\.\d+\))$/i);
    }
  });
});
