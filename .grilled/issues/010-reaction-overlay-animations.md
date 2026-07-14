title: Reaction overlay — the like & pass animations
type: AFK
status: todo

---

## Parent

[docs/brief.md](../../docs/brief.md) — this is the brief's explicit core deliverable ("Add the pass and like animations").

## What to build

The full-screen reaction interstitial, exactly as specified by the user during grilling, driven by the store's transient reaction state and built with `react-native-reanimated`:

1. On Like or Pass, a **fully opaque** overlay (surface `#0D0D0D`) **fades in ~200ms** over everything (tab bar too if the mockup composition allows; at minimum over the whole feed).
2. **Hold 1 second**: centered icon with a slight **scale-pop** on entry (spring) —
   - **Pass**: white cross, same glyph as the X button, bigger.
   - **Like**: heart filled with primary `#E1FF00`.
3. **While opaque**, the profile swap happens invisibly underneath (advance + scroll reset — already built in 009, resequenced to fire mid-overlay).
4. **Fade out ~250ms**, revealing the next profile (or the empty state after the last one).

Guards: all reaction inputs (hearts, X) **disabled while the sequence runs** — a rapid double-tap must advance exactly one profile. Timings/durations as named constants in `features/feed/constants.ts`.

## Acceptance criteria

- [ ] Tap heart → fade-in → 1s hold with popping yellow heart → fade-out onto the next profile
- [ ] Tap X → same with big white cross
- [ ] Profile swap is never visible mid-transition (overlay fully opaque)
- [ ] Double-tapping heart/X during the sequence advances exactly one profile
- [ ] Last profile's reaction fades out onto the empty state
- [ ] Timings (200ms / 1000ms / 250ms) live as constants; `npm run check` green

## Blocked by

- `009-feed-store-like-pass.md`
