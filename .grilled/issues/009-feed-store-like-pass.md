title: Feed store + like/pass interactions + empty state
type: AFK
status: todo

---

## Parent

[docs/brief.md](../../docs/brief.md) — glossary in [CONTEXT.md](../../CONTEXT.md) (Like, Pass, Likable Card, Feed).

## What to build

The feed's interaction loop as a small, tested state machine. Advancing is **instant** in this issue — the overlay animation lands in the next one.

**Store** — `features/feed/store.ts`, `useFeedStore` (zustand, in-memory only, no persistence):

- State: current profile index, liked card ids, passed profile ids, and a transient reaction state (`'like' | 'pass' | null`) that the overlay issue will consume.
- Actions: `likeCard(cardId)` (records the id, ends the profile), `passProfile()` (records it), `advance()`, `restart()` (full reset). Finished = index past the last profile.

**Hearts** — white circular heart button, bottom-right **on Likable Cards only**: unlocked pictures, prompt answers, sport cards. Never on info cards or locked pictures. Tapping = Like on that specific card.

**Sticky footer** over the feed, above the tab bar: dark circular **X button** bottom-left (Pass), next to it the pill **"Bloquer & Signaler"** (dark, white text) — rendered, **inert** (user decision). Footer hidden on the empty state.

**Flow**: like or pass → feed advances to the next profile, scroll resets to top, header firstname updates. After the last profile: **empty state** — centered French message (e.g. "Plus de profils pour le moment") + a **restart button** that resets the store to the first profile (demo affordance, user-approved liberty).

**Tests** (vitest, co-located `store.test.ts`): like records the card id and advances; pass records the profile and advances; reaction state transitions; finishing after the last profile; restart clears everything.

## Acceptance criteria

- [ ] Hearts appear exactly on Likable Cards (picture/prompt/sport), never on info or locked cards
- [ ] Like and Pass both advance: next profile's cards render, scroll back at top, header updates
- [ ] X + inert "Bloquer & Signaler" pill sit sticky at the bottom as in the mockups
- [ ] After the 10th profile: empty state with restart; restart replays the feed from Camille
- [ ] `store.test.ts` covers the transitions above and passes
- [ ] `npm run check` green

## Blocked by

- `006-prompt-and-info-cards.md`
- `007-sport-card-rings.md`
- `008-locked-picture-photo-allowance.md`
