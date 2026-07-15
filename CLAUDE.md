# bpm feed — test technique

Recreate the bpm dating-app feed (Expo SDK 57 / RN 0.86, npm, Expo Go only — no custom native code). Domain glossary: `CONTEXT.md` (Profile, Card, Likable Card, Photo Allowance…). Work is sliced into `.grilled/issues/` and implemented in order via the implement-next-issue skill.

## Commands

- `npm start` — Expo dev server (scan with Expo Go)
- `npm run typecheck` — `tsc --noEmit`
- Tooling issue 002 adds: `lint` (biome), `test` (vitest), `knip`, `check` (all four)

## Hard constraints

- `src/types/feed.ts` is provided and **must stay byte-identical**. Never re-declare, extend, or zod-duplicate its types — import from `@/types/feed`.
- Colors **only** from `src/utils/colors.ts` (`COLORS`) — no hex literals in components (`app.json` is the one exception, static config). Font families only from `src/utils/fonts.ts`; Cal Sans is for titles only.
- All UI copy in **French**, defined in the feature's `constants.ts`.
- No `theme/` folder (user decision: `utils/colors.ts` instead).

## Structure

```
src/
  app/            # expo-router routes — thin files only (re-export/compose from features)
  features/feed/  # the only feature: components/, api.ts, store.ts, constants.ts, fixtures/
  components/     # shared composed components; components/ui/ for shared primitives
  lib/            # mock api client, query client
  utils/          # colors.ts, fonts.ts
  types/feed.ts   # provided, untouched
  assets/         # fonts/, logo/
assets/           # root: app icons referenced by app.json only
```

## Conventions

- Files kebab-case. Component `post-card.tsx` → exports `function PostCard` (+ `type PostCardProps` only if it has props). Screen `*-screen.tsx` → `function XxxScreen`. Hook `use-x.ts` → `function useX`. Store `store.ts` → `useFeedStore`. Queries `api.ts` → `useFeed`, `feedKeys`. Constants `constants.ts` → SCREAMING_SNAKE_CASE. Tests co-located `*.test.ts`.
- Styling: `StyleSheet.create` in each component file. No shared style files.
- Short files; split anything reusable into its own component. No speculative props — add a prop only when the current implementation uses it.
- Data flows fixture → `lib` mock client (~500ms artificial delay) → TanStack Query hook in `features/feed/api.ts`. Zustand only for genuine client state (feed progression). No fake like/pass mutations — `api.ts` is the future backend seam.
- Vitest tests target pure TS logic only (photo allowance, store) — no component rendering tests.
