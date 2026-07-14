title: Tooling — knip, biome, typecheck, vitest
type: AFK
status: done

---

## Parent

[docs/brief.md](../../docs/brief.md) — user explicitly requested this as an independent issue.

## What to build

The quality toolchain, wired through npm scripts, all green on the bootstrapped codebase:

- **biome** — linting + formatting (replaces eslint/prettier). Sensible RN-friendly config; format the whole repo once so later diffs stay clean.
- **typecheck** — `tsc --noEmit` script.
- **vitest** — configured for pure TypeScript unit tests only (node environment, `src/**/*.test.ts`). No react-native component rendering, no jsdom — visual fidelity is judged on-device, tests target pure logic (photo allowance, feed store, mappers with real logic). A trivial placeholder test may prove the runner works until real tests arrive in later issues.
- **knip** — dead code/exports/dependency detection, configured for the expo-router entry points so route files and app config aren't false positives.
- One aggregate script (e.g. `npm run check`) chaining lint → typecheck → test → knip. Later issues are expected to keep it green.

## Acceptance criteria

- [ ] `npm run lint` (biome) passes
- [ ] `npm run typecheck` passes
- [ ] `npm run test` (vitest) passes and picks up co-located `*.test.ts` files
- [ ] `npm run knip` passes with no false positives on expo-router routes/config
- [ ] `npm run check` runs all four
- [ ] Repo formatted once with biome; config files committed

## Blocked by

- `001-expo-bootstrap.md`
