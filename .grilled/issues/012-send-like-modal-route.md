title: Send-like modal — route, entry point & dismissal
type: AFK
status: done

---

## Parent

Approved mockup: [.grilled/mockups/send-like-v1.html](../mockups/send-like-v1.html) (screen 1 for the shell; states table for dismissal). Conventions: [docs/ui-conventions.md](../../docs/ui-conventions.md) — "Overlays & modals".

**UI-only — no server, schema, or business-logic changes.** Entirely client-side; `src/types/feed.ts` untouched; `api.ts` stays the future backend seam (no fake mutations).

## What to build

The "Envoyer un like" full-screen modal shell and its wiring, shown **before** the like animation:

1. A top-level expo-router route (thin file per project structure; screen component lives in the feed feature) presented as `fullScreenModal` with slide-from-bottom, outside `(tabs)` so the tab bar is hidden. Params: `userId` + `cardId`; the profile and liked card are resolved from the TanStack Query cache (`useFeed`), not refetched.
2. Entry point: the feed's like callback changes from recording the like to **pushing this route** — the single change point that covers picture, prompt-answer and sport-card like buttons alike. Nothing is recorded in the store on open.
3. Dismissal: an "annuler" chip (lowercase label, `COLORS.panel` pill, white text, top-right, pressed = opacity 0.7) calls `router.back()`; the Android hardware back does the same. No iOS swipe-to-dismiss (fullScreenModal default). After dismissal the feed is exactly as before — same profile, same scroll, nothing in `likedCardIds`.

Screen background `COLORS.surface`, light status bar, safe areas respected. New French copy ("annuler", screen-level labels) in `features/feed/constants.ts` (SCREAMING_SNAKE_CASE). The hero, message field and CTAs come in 013–015; this slice may show the bare dark screen with the chip.

## Acceptance criteria

- [ ] Tapping any like button (picture overlay, prompt answer, sport card) opens the modal full-screen with no tab bar visible
- [ ] Nothing is recorded in the feed store when the modal opens
- [ ] "annuler" dismisses back to the untouched feed (same profile, same scroll position)
- [ ] Android hardware back behaves exactly like "annuler"
- [ ] Route file is a thin re-export; screen component lives in `features/feed/components/`
- [ ] All new copy is French and lives in `constants.ts`; `npm run check` green

## Blocked by

None - can start immediately
