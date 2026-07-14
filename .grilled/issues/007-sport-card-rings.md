title: Sport card — activity rings + sessions/week list
type: AFK
status: todo

---

## Parent

[docs/brief.md](../../docs/brief.md) — glossary in [CONTEXT.md](../../CONTEXT.md).

## What to build

The `sport_card`, the most intricate visual, per the two mockups extracted during grilling. Dark panel, two zones:

**Right — the list**: small gray uppercase label **"SÉANCES / SEMAINE"**, then one row per sport (data max is 3): `sportName` in white, a **dotted leader line**, and the frequency value right-aligned, colored.

- Frequency → value mapping (in `features/feed/constants.ts`): `little` → **"1-2"**, `mid` → **"3-4"**, `hard` → **"5+"**.
- **Positional accent colors** shared by a row's value and its ring: sport 1 → primary `#E1FF00`, sport 2 → accentPurple, sport 3 → accentPink (from `utils/colors.ts`).

**Left — activity rings** (custom `react-native-svg`, Apple-Watch style): one ring per sport, **outermost = first sport**, each over a dark muted track of its own color, round line caps. **Sweep ∝ frequency** (user-approved rule): `little` ≈ 33%, `mid` ≈ 66%, `hard` ≈ 100% of the circle.

Deliberately **unused fields** (note for README): `sportIcon` and the card-level overall `trainingFrequency` — neither appears in the mockups.

Demo: Camille's card — Escalade "5+" yellow full ring, Course à pied "3-4" purple ⅔ ring, Yoga "1-2" pink ⅓ ring.

## Acceptance criteria

- [ ] "SÉANCES / SEMAINE" header + name / dotted leader / colored value rows match the mockup
- [ ] Mapping little→"1-2", mid→"3-4", hard→"5+" correct across all fixture profiles
- [ ] Rings: one per sport, outermost first, positional colors, sweep ∝ frequency, muted tracks, round caps
- [ ] Works with 2 sports (most profiles) and 3 sports (Camille, Maxime)
- [ ] `npm run check` green

## Blocked by

- `005-picture-card-profile-scroll.md`
