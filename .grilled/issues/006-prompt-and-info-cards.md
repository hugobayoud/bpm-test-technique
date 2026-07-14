title: Prompt answer card + info card
type: AFK
status: todo

---

## Parent

[docs/brief.md](../../docs/brief.md) — glossary in [CONTEXT.md](../../CONTEXT.md).

## What to build

Two static card kinds, per the real-app mockup extracted during grilling.

**Prompt answer card** (`prompt_answer`): dark panel, generous padding. Header row: rounded-square badge (lighter dark bg) with a **lucide `MessageCircleHeart` icon** (white; substitution for bpm's heart-face glyph, no asset available) + `promptTitle` in **gray uppercase** small text. Below: `answerText` big, white, **Cal Sans**. Tall card with breathing room. The `category` field (`lifestyle`/`sport`) is deliberately **not rendered** (unused; note for README).

**Info card** (`info_card`) — mockup-strict, only four fields (the other eleven stay hidden; note for README):

- **Stats row**: cake icon + `age` │ ruler icon + `{height} cm` │ map-pin icon + `city`, separated by thin vertical dividers (strokeStrong). Icons lucide, white.
- Horizontal separator (strokeDefault/strokeStrong).
- **"Looking for" section**: search icon + label in white semibold with a gray tagline underneath, mapping `relationshipType` (map lives in `features/feed/constants.ts`):
  - `exclusive` → "Endurance" / "Le jeu long, sans chrono" (from the real app)
  - `casual` → "Fractionné" / "À fond, puis on souffle" (invented, user-approved)
  - `intimate` → "Sprint" / "Intense, sans détour" (invented, user-approved)

Info cards are never likable — no heart, this card stays purely informational (glossary: Likable Card).

Demo: Camille's profile shows her travel prompt and her info card ("Endurance").

## Acceptance criteria

- [ ] Prompt card matches spec: badge + gray uppercase title, big white Cal Sans answer
- [ ] Info card shows exactly age / height / city + separator + looking-for section, nothing else
- [ ] All three `relationshipType` values render their label + tagline (check Thomas = Fractionné, Hugo = Sprint)
- [ ] French labels/copy in `features/feed/constants.ts`, SCREAMING_SNAKE_CASE constants
- [ ] `npm run check` green

## Blocked by

- `005-picture-card-profile-scroll.md`
