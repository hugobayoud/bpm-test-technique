title: Send-like modal — photo hero with superlike scrim & title
type: AFK
status: done

---

## Parent

Approved mockup: [.grilled/mockups/send-like-v1.html](../mockups/send-like-v1.html) (screen 1). Conventions: [docs/ui-conventions.md](../../docs/ui-conventions.md) — "Theme".

**UI-only — no server, schema, or business-logic changes.** Entirely client-side; `src/types/feed.ts` untouched; `api.ts` stays the future backend seam.

## What to build

The hero block at the top of the send-like modal, for the picture-card case:

1. A uniform 3:4 frame — radius 32, horizontal margin 12 — showing the **liked photo** full-bleed (`expo-image`, thumbhash placeholder, cover fit).
2. A scrim over it: linear gradient from transparent (~40% height) to fully opaque `COLORS.superlike` at the bottom. New dependency `expo-linear-gradient`, added with `npx expo install` (Expo Go compatible).
3. Overlaid copy, bottom-left: Cal Sans title "Envoyer un like à {firstname}" (~33px, `COLORS.fill`, wraps to two lines) and below it "Il vous reste 0 Superlikes" with a small filled lucide Heart (`COLORS.fill`, slight transparency on the row as in the mockup).
4. The count comes from a new `SUPERLIKES_REMAINING = 0` constant, placed next to the other static viewer-data liberties (`LIKES_TAB_BADGE`, `VIEWER_UPLOADED_PHOTOS_COUNT`) with a README-liberty note. The 12-Superlikes lime variant is out of scope.

The "annuler" chip from 012 overlays this hero top-right.

## Acceptance criteria

- [ ] Liking a photo shows that exact photo in the hero (not always the profile's first)
- [ ] Scrim matches the mockup: transparent up top, solid `#FF5252` at the bottom, no hex literal outside `colors.ts`
- [ ] Title is Cal Sans with the profile's real firstname; count reads "Il vous reste 0 Superlikes" + filled heart
- [ ] Thumbhash placeholder shows while the photo loads
- [ ] `SUPERLIKES_REMAINING` and all copy live in `constants.ts`; `npm run check` green

## Blocked by

- `012-send-like-modal-route.md`
