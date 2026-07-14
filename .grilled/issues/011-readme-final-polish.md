title: README + final polish pass
type: AFK
status: todo

---

## Parent

[docs/brief.md](../../docs/brief.md) — the brief asks for liberties to be pointed out when the code is sent.

## What to build

The closing slice: reviewer-facing documentation and a final coherence pass.

**README.md** covering:

- What this is (bpm feed test technique) + a screenshot/GIF if convenient.
- **Run instructions**: `npm install`, `npx expo start`, scan with Expo Go (SDK 57).
- Stack summary (Expo Router, TanStack Query, zustand, Reanimated, expo-image/thumbhash, react-native-svg, lucide) and a pointer to [CONTEXT.md](../../CONTEXT.md) for domain vocabulary.
- **Liberties & assumptions** (the brief demands these be called out):
  - Restart button on the empty feed (demo affordance).
  - Invented French labels for `casual` ("Fractionné — À fond, puis on souffle") and `intimate` ("Sprint — Intense, sans détour"); `exclusive` copied from the real app.
  - Icon substitutions: lucide `Quote` (photo prompt badge), `MessageCircleHeart` (prompt card badge) — original glyph assets unavailable.
  - Eyedropped colors not in the brief palette: accentPurple, accentPink, card panel gray.
  - Ring sweep ∝ training frequency (invented, approved rule).
  - Photo Allowance enforced client-side with `VIEWER_UPLOADED_PHOTOS_COUNT = 3`; never triggers on the fixture (max 2 pictures/profile) — covered by unit tests, lower the constant to see it.
  - Fixed ~3:4 photo ratio.
  - Inert controls: "Bloquer & Signaler", "Ajouter mes photos"; header buttons and non-Home tabs land on placeholder pages (user-directed).
  - Unused data fields: `sportIcon`, sport card's overall `trainingFrequency`, prompt `category`, the 11 hidden `info_card` fields (mockup-strict decision).
  - No persistence (in-memory feed state); no fake like/pass mutations — `api.ts` is the seam for a future backend.

**Polish pass**: `npm run check` fully green; `src/types/feed.ts` still byte-identical to baseline; dead code swept (knip); quick on-device pass over all 10 profiles for visual glitches (long prompt texts, 2-vs-3-ring cards, Raphaël's 1-picture profile).

## Acceptance criteria

- [ ] README with run instructions and the complete liberties list above
- [ ] `npm run check` green from a clean clone (`npm ci`)
- [ ] `git diff` clean on `src/types/feed.ts` vs baseline
- [ ] All 10 fixture profiles browsed on-device without visual breakage

## Blocked by

- `002-tooling-knip-biome-typecheck-vitest.md`
- `010-reaction-overlay-animations.md`
