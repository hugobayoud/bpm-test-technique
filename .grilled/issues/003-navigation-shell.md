title: Navigation shell — tabs, feed header chrome, placeholder pages
type: AFK
status: done

---

## Parent

[docs/brief.md](../../docs/brief.md) — glossary in [CONTEXT.md](../../CONTEXT.md).

## What to build

The complete navigation skeleton, matching the mockups' chrome, with every dead-end landing on a dead-simple placeholder page. All copy in French.

**Tab bar** (expo-router `(tabs)` group), dark, active tint white / inactive gray:

- **Accueil** — the feed screen (stub content for now). Icon = the provided bpm logo (`src/assets/logo/bpm-logo.svg`), imported as a component via `react-native-svg` + `react-native-svg-transformer`; switch its hardcoded `fill="white"` to `currentColor` so active/inactive tint applies.
- **Likes** — heart icon, **yellow (primary) badge hardcoded to "4"** (deliberately static: it means *incoming* likes, which our data doesn't model).
- **Matchs** — chat-bubble icon.
- **Profil** — person icon.

Likes / Matchs / Profil tab screens are dead-simple placeholders (shared `placeholder-screen` component, title prop, no back button — they're tabs).

**Feed header** (part of the feed screen, not a native nav header): profile firstname as a big Cal Sans title top-left — rendered as-is from data, no uppercase transform (static stub text until the data layer lands). Top-right:

- a pill containing **filters** (sliders icon) and **rewind** (rotate-ccw icon) separated by a thin divider (strokeStrong)
- a circular **boost** button, boost blue `#48C1F3`, lightning icon, **badge hardcoded to "1"**

Each of the three pushes its own stack route (`filters`, `rewind`, `boost`) rendering the same `placeholder-screen` with a back affordance. Icons from `lucide-react-native`.

Status bar light, dark backgrounds everywhere (surface token).

## Acceptance criteria

- [ ] 4 French tabs render with correct icons; bpm logo tints white when active, gray when inactive
- [ ] Likes badge "4" (primary yellow) and boost badge "1" render as in the mockups
- [ ] Filters, rewind and boost each push a distinct placeholder page with working back navigation
- [ ] Likes / Matchs / Profil tabs show the shared placeholder screen
- [ ] All visible copy is French; colors come from `utils/colors.ts` only
- [ ] `npm run check` green

## Blocked by

- `001-expo-bootstrap.md`
