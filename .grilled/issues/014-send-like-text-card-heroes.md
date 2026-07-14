title: Send-like modal — text-card heroes in the uniform frame
type: AFK
status: todo

---

## Parent

Approved mockup: [.grilled/mockups/send-like-v1.html](../mockups/send-like-v1.html) (screens 2–3). Conventions: [docs/ui-conventions.md](../../docs/ui-conventions.md) — "Theme".

**UI-only — no server, schema, or business-logic changes.** Entirely client-side; `src/types/feed.ts` untouched; `api.ts` stays the future backend seam.

## What to build

The hero is always the liked card itself — this slice covers the two Likable Card kinds without a photo:

1. **Prompt answer liked**: the card's content (quote badge + uppercase muted prompt title, Cal Sans answer text) rendered top-aligned inside the same 3:4 / radius-32 frame on a `COLORS.panel` background, with a top inset (~76) so the content clears the "annuler" chip zone. Long answers simply run under the scrim.
2. **Sport card liked**: same treatment — activity rings + "Séances / semaine" list top-aligned in the frame, panel background, same top inset.
3. In both cases the card's own like button is **not** rendered, and the scrim + title + Superlike count overlay is identical to the photo hero (013) — composition strictly shared across all three card kinds.

Reuse the existing card internals rather than duplicating their layout (whether by extracting subcomponents or a render prop is the implementer's call — no visual drift from the feed cards).

## Acceptance criteria

- [ ] Liking a prompt answer shows that prompt's header + answer in the hero frame, no like button, content clear of the "annuler" chip
- [ ] Liking a sport card shows the rings + per-sport list in the hero frame, same rules
- [ ] Scrim, title and count overlay are pixel-identical in position to the photo hero
- [ ] Prompt/sport rendering in the hero visually matches the feed cards (same fonts, colors, ring sweeps)
- [ ] `npm run check` green

## Blocked by

- `013-send-like-photo-hero.md`
