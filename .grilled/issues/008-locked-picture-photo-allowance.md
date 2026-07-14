title: Locked picture card + Photo Allowance rule
type: AFK
status: todo

---

## Parent

[docs/brief.md](../../docs/brief.md) — glossary in [CONTEXT.md](../../CONTEXT.md) (Photo Allowance, Locked Picture).

## What to build

The Photo Allowance domain rule, client-enforced (user chose this over server-only), plus the locked card UI from the real-app mockup.

**The rule** — `features/feed/photo-allowance.ts`, a pure function: given a profile's cards and the viewer's uploaded-photo count (`VIEWER_UPLOADED_PHOTOS_COUNT = 3` in `constants.ts`), any `picture` card **beyond the first N** is demoted to locked rendering (its thumbhash/promptTitle survive; its real image renders blurred). `locked_picture` cards from the server always render locked. Non-picture kinds are never affected; card order is preserved. Note: with the fixture (max 2 pictures/profile) and N=3, demotion never triggers — the rule is proven by tests, and lowering the constant demos it live.

**Locked picture card UI**:

- Blurred visual filling the card: server-locked → render the **thumbhash as the image** (it decodes to a soft blur); client-demoted → the real image under a **heavy blur**.
- Centered stack: lock icon (lucide `Lock`) in a translucent light circle; title **"Tu vois autant de photos que tu en partages."** (white, bold); subtitle **"Débloque plus de photos en ajoutant les tiennes."** (gray); white pill button **"Ajouter mes photos"** (dark text) — **inert**.
- Prompt header (quote badge) if `promptTitle` is non-null, same as picture cards.
- **Never a heart** — locked pictures are not Likable Cards ("you can't like what you can't see").

**Tests** (vitest, co-located): demotion beyond N; N=0 locks all pictures; exactly N locks none; `locked_picture` passthrough; non-picture kinds untouched; order preserved.

## Acceptance criteria

- [ ] Camille's position-5 `locked_picture` renders the full locked UI (blur, lock, French copy, inert CTA)
- [ ] Setting `VIEWER_UPLOADED_PHOTOS_COUNT` to 1 visibly demotes Camille's second picture (manual check), restored at 3
- [ ] `photo-allowance.test.ts` covers the boundary cases above and passes
- [ ] Pure function has no react/store imports — plain TS in, plain TS out
- [ ] `npm run check` green

## Blocked by

- `005-picture-card-profile-scroll.md`
