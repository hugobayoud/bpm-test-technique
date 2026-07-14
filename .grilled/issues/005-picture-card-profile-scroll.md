title: Picture card + vertical profile card list
type: AFK
status: done

---

## Parent

[docs/brief.md](../../docs/brief.md) — glossary in [CONTEXT.md](../../CONTEXT.md).

## What to build

The feed's core rendering: the current Profile's Cards in a vertical scroll, with the picture card fully styled. Mockup screenshots live in the grilling conversation; the specs below are the extracted, user-confirmed source of truth.

**Profile card list**: vertical scroll of the current profile's cards sorted by `position`, comfortable gap between cards, side margins matching the mockup, scroll under the feed header. Card kinds without a component yet render nothing (they arrive in later issues). No hearts yet (interaction issue).

**Picture card**, two variants driven by `content.promptTitle`:

- **Bare photo** (`promptTitle` null): rounded card (~24px radius), photo filling it via `expo-image`, `contentFit: 'cover'`, **fixed ~3:4 aspect ratio** (constant rhythm; confirmed liberty), **thumbhash placeholder** from `content.thumbhash` (expo-image supports thumbhash natively) with a soft transition when the real image loads.
- **Photo answering a prompt** (`promptTitle` non-null): the card becomes a dark panel with a **header row above the photo** — rounded-square badge (slightly lighter dark background) containing a **lucide `Quote` icon** (white; substitution for the app's "99" quote glyph, no asset available) + the `promptTitle` in white — then the photo below, rounded corners.

Demo: Camille's profile scrolls — bare photo at position 0, prompt-headed photo ("Mon endroit préféré") at position 2.

## Acceptance criteria

- [ ] Current profile's cards render in `position` order in a vertical scroll
- [ ] Bare picture card: rounded, 3:4, cover-fit, thumbhash placeholder visible before load
- [ ] Prompt variant shows the quote-badge header row above the photo exactly when `promptTitle` is non-null
- [ ] Unknown/unbuilt card kinds render nothing without crashing
- [ ] Styling via `StyleSheet.create` per component; colors from `utils/colors.ts`
- [ ] `npm run check` green

## Blocked by

- `004-feed-data-layer.md`
