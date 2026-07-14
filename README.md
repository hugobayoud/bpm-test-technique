# bpm feed — test technique

Recreation of the bpm dating-app feed: browse one profile at a time as a vertical scroll of cards, like a specific card or pass the whole profile, and the feed advances.

## Run

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (Expo SDK 57, no custom native code).

Checks: `npm run check` (biome + typecheck + vitest + knip).

## Stack

- **Expo Router** — tab shell; header buttons and non-Home tabs push placeholder pages
- **TanStack Query** — feed fetched from a JSON fixture through a mock client with ~500 ms artificial delay ([api.ts](src/features/feed/api.ts) is the seam for a real backend)
- **Zustand** — client-only feed state (progression, like/pass)
- **Reanimated** — like/pass reaction overlay
- **expo-image** (thumbhash placeholders), **react-native-svg** (activity rings, logo), **lucide** icons

Domain vocabulary (Profile, Card, Likable Card, Photo Allowance…): see [CONTEXT.md](CONTEXT.md).

## Liberties & assumptions

- **Restart button** on the empty feed — demo affordance, replays the same feed.
- **Invented French labels** for relationship types: casual = « Fractionné — À fond, puis on souffle », intimate = « Sprint — Intense, sans détour ». Exclusive (« Endurance ») uses the real app's wording.
- **Icon substitution**: lucide `Quote` (filled) replaces bpm's quote glyph on the photo-prompt header and the prompt card badge — original assets unavailable. All icons are lucide.
- **Eyedropped colors** not in the brief palette (approximate): `accentPurple`, `accentPink`, panel gray.
- **Ring sweep ∝ training frequency** (1/3, 2/3, full) — invented rule.
- **Photo Allowance** enforced client-side with `VIEWER_UPLOADED_PHOTOS_COUNT = 3`. It never triggers on the fixture (max 2 pictures per profile) — covered by unit tests; lower the constant to 1 to see it live.
- **Fixed ~3:4 photo ratio.**
- **Inert controls**: « Bloquer & Signaler » and « Ajouter mes photos » do nothing; header buttons and non-Home tabs land on placeholder pages.
- **Static badges**: Likes tab (4) and Boost (1) — incoming likes and boosts are not modeled.
- **Unused data fields**: `sportIcon`, the sport card's overall `trainingFrequency`, prompt `category`, and the 11 hidden `info_card` fields — the mockup doesn't display them.
- **No persistence**: feed state is in-memory; no fake like/pass mutations.
