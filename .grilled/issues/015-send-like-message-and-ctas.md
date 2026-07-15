title: Send-like modal — message field, CTA stack & send flow
type: AFK
status: done

---

## Parent

Approved mockup: [.grilled/mockups/send-like-v1.html](../mockups/send-like-v1.html) (screens 1 & 4; states table). Conventions: [docs/ui-conventions.md](../../docs/ui-conventions.md) — "Buttons" (primary CTA recipe, pressed = opacity 0.7, out-of-scope CTAs rendered but inert).

**UI-only — no server, schema, or business-logic changes.** Entirely client-side; `src/types/feed.ts` untouched; `api.ts` stays the future backend seam (no fake mutations — the message is never transmitted).

## What to build

The lower half of the send-like modal and the flow that hands off to the existing like animation:

1. **Message field** below the hero: single-line `TextInput`, placeholder "Un petit message personnalisé (optionnel)" (`COLORS.textMuted`), hairline bottom border `COLORS.strokeStrong`. Static layout: the keyboard may cover the CTAs; the return key dismisses it. The text is local state only, discarded on send **and** cancel (README liberty).
2. **CTA stack** pinned at the bottom (20px margins):
   - "Obtenir Superlike" + filled heart — text button in full-strength `COLORS.superlike`, rendered exactly as the mockup but **inert**: `disabled` + `accessibilityState={{ disabled: true }}`, no pressed feedback (0-Superlikes scope cut, no paywall).
   - "Envoyer Like" — primary pill per conventions (`COLORS.fill` bg, `COLORS.fillOpposite` bold label, ~56 high, fully rounded, pressed = opacity 0.7).
3. **Send flow**: tapping "Envoyer Like" fires `router.back()` and `likeCard(cardId)` **simultaneously** — the lime reaction overlay fades in on the feed underneath while the modal slides down, so dismissal reveals the animation already playing; the profile swap still happens invisibly under the opaque overlay, exactly as today. The store's existing double-reaction guard keeps a double-tap to one like.

## Acceptance criteria

- [ ] "Envoyer Like" dismisses the modal onto the already-running like overlay, then the feed advances — one continuous motion, like recorded once in `likedCardIds`
- [ ] Double-tapping "Envoyer Like" records and advances exactly one profile
- [ ] "Obtenir Superlike" looks like the mockup, does nothing, and reports disabled to accessibility
- [ ] Typed message is kept while the modal is open, never sent anywhere, gone on cancel and on send
- [ ] Return key dismisses the keyboard; CTAs are reachable again after dismissal
- [ ] All copy French, in `constants.ts`; `npm run check` green

## Blocked by

- `012-send-like-modal-route.md` (can run in parallel with 013/014)
