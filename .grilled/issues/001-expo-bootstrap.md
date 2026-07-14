title: Expo SDK 57 bootstrap — tree, tokens, fonts, conventions
type: AFK
status: todo

---

## Parent

[docs/brief.md](../../docs/brief.md) — domain glossary in [CONTEXT.md](../../CONTEXT.md).

## What to build

A blank Expo app (SDK 57, React Native 0.86, TypeScript strict, npm, Expo Go — no dev build) that boots to a dark screen proving the design foundations work: surface background, Cal Sans loaded, splash held until fonts are ready.

Decisions locked during the grilling (user-mandated, treat as fixed):

- Package manager **npm**. Expo Go compatible only — no custom native code.
- Path alias `@/*` → `src/*`.
- The provided `src/types/feed.ts` is the single source of truth for feed types. It must remain byte-identical. Never duplicate or re-declare its interfaces/enums anywhere (this also forbids zod schemas mirroring them).
- Colors live in `src/utils/colors.ts` (user instruction overrides the usual `theme/` folder — do not create `theme/`). Palette from the brief plus eyedropped additions:
  - surface `#0D0D0D`, fill `#FFFFFF`, fillOpposite `#0D0D0D`, strokeDefault `rgba(255,255,255,0.05)`, strokeStrong `rgba(255,255,255,0.10)`, primary `#E1FF00`, boost `#48C1F3`, superlike `#FF5252`
  - additions: accentPurple `≈ #B36BFF`, accentPink `≈ #FF2D87` (sport rings/values), a card panel dark gray (`≈ #1A1A1A`) and a muted text gray — eyedropped from mockups, flag as approximations.
- Font tokens in `src/utils/fonts.ts` (Cal Sans family constant). Cal Sans is titles-only; everything else uses the system font. Font file already at `src/assets/fonts/cal-sans-regular.ttf`.
- Approved folder tree (create only what this issue needs; later issues fill it):

```
src/
  app/                # expo-router, thin route files only
  features/feed/      # the only feature
  components/ui/      # shared primitives, only when genuinely shared
  components/         # shared composed components (placeholder-screen later)
  lib/                # mock api client, query client
  types/feed.ts       # provided, untouched
  utils/colors.ts, utils/fonts.ts
  assets/fonts/, assets/logo/
```

- Also write a `CLAUDE.md` at the repo root capturing the working conventions so future implementation sessions follow them without this conversation: file naming (kebab-case; `post-card.tsx` exports `function PostCard` + `type PostCardProps`; screens `*-screen.tsx` export `function XxxScreen`; hooks `use-x.ts`; feature files `api.ts` / `store.ts` / `constants.ts`; tests co-located `*.test.ts(x)`), styling via `StyleSheet.create` in each component (no shared style files), short files / split into reusable components, no speculative props, colors only via `utils/colors.ts`, French UI copy, types only from `@/types/feed`.

Scaffolding note: `create-expo-app` must not clobber the existing `src/` assets, `docs/`, `CONTEXT.md`, or git history — scaffold into the existing repo (or scaffold aside and merge), then strip template demo screens.

## Acceptance criteria

- [ ] `npm install && npx expo start` boots in Expo Go on the dark surface with a Cal Sans title rendered (temporary proof screen is fine)
- [ ] Splash screen stays up until Cal Sans is loaded (no font flash)
- [ ] `npx tsc --noEmit` passes with `strict: true` and the `@/*` alias resolving
- [ ] `src/types/feed.ts` is byte-identical to the baseline commit (`git diff` clean on it)
- [ ] `src/utils/colors.ts` contains the full palette above; no hex literals elsewhere
- [ ] `CLAUDE.md` exists with the conventions above
- [ ] Expo template demo content removed

## Blocked by

None - can start immediately
