title: Feed data layer — mock api, TanStack Query, loading state
type: AFK
status: todo

---

## Parent

[docs/brief.md](../../docs/brief.md).

## What to build

The feed's data path, end to end: fixture → simulated async client → TanStack Query → first real data visible on the feed screen.

- Copy `docs/feed-response-example.json` **byte-identical** into the feed feature as a fixture (`features/feed/fixtures/`). The `docs/` original stays untouched as reference.
- A tiny client in `lib/` that resolves the fixture as a typed `FeedResponse` (types imported from `@/types/feed` — never re-declared) after an **artificial ~500ms delay**, simulating a network fetch. No zod validation (duplicating the provided types is forbidden).
- A query client in `lib/`, provided at the root layout.
- `features/feed/api.ts` exposing `feedKeys` and a `useFeed()` query hook — this file is the seam where a real endpoint would plug in later. **No fake like/pass mutations** (decided: store actions model reactions until a backend exists).
- Feed screen consumes `useFeed()`: centered loading indicator while pending, then the header title shows the **current profile's firstname** (first profile for now — progression arrives with the store issue). Error state can be minimal (French one-liner).

Demo: launch → spinner for ~half a second → header reads "Camille".

## Acceptance criteria

- [ ] Fixture file is byte-identical to `docs/feed-response-example.json`
- [ ] Feed data flows through `lib` client → `useFeed()` → screen; no component imports the JSON directly
- [ ] Loading indicator visible during the artificial delay, then "Camille" renders in the Cal Sans header
- [ ] All feed data typing comes from `@/types/feed`; no duplicated interfaces, no zod
- [ ] `npm run check` green

## Blocked by

- `003-navigation-shell.md`
