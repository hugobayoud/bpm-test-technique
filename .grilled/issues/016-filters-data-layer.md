title: Filtres — data layer : store persisté, catalogue & dérivation
type: AFK
status: done

---

## Parent

Spec : [docs/specs/coach-v1.md](../../docs/specs/coach-v1.md) — sections « Les 4 Filtres (le catalogue) » et « Données & types ». Glossaire : [CONTEXT.md](../../CONTEXT.md) (Filtre). Même découpe que `004-feed-data-layer.md` : la fondation pure-TS, sans UI.

## What to build

La couche données des 4 Filtres, nouvelle feature `features/filters/` :

1. **Le catalogue** : `FilterKey` (`age_range` | `max_distance` | `training_frequency` | `relationship_type`), ordre de priorité fixe (cet ordre-là), domaines (18–60 ; 5–160 km ; enums), défauts-sentinelles (`{18,60}`, `50`, `null`, `null`), règles « non répondu », raccourcis figés (18-25 · 25-40 · 40-50 · 50-60 ; 20 · 40 · 80 · 160 km — 50 exclu, c'est la sentinelle). Les enums réutilisent les unions de `@/types/feed` via `satisfies` (tableau runtime sans re-déclaration) ; les libellés réutilisent `TRAINING_FREQUENCY_VALUE` et `RELATIONSHIP_TYPE_COPY` du feed (source canonique, réutilisation inter-features délibérée).
2. **`useFiltersStore`** : `Filters` + setters + `reset()`, `zustand/persist` sur AsyncStorage (clé `bpm-filters`). Nouvelle dépendance `@react-native-async-storage/async-storage` via `npx expo install` (compatible Expo Go).
3. **`getEmptyFilterKeys(filters)`** : pure, renvoie les clés non répondues dans l'ordre de priorité.
4. CLAUDE.md (bloc Structure) mis à jour : `features/filters/`, `features/coach/`, `supabase/`.

## Acceptance criteria

- [ ] `getEmptyFilterKeys` testé : les 4 règles « non répondu » (== {18,60}, == 50, null, null) et l'ordre `age_range` → `max_distance` → `training_frequency` → `relationship_type`
- [ ] Store testé : setters + `reset()` restaure sentinelles/null (même style que `store.test.ts` du feed)
- [ ] Aucun type de `@/types/feed` re-déclaré ; `src/types/feed.ts` intouché
- [ ] Copy française dans le `constants.ts` de la feature
- [ ] `npm run check` vert

## Blocked by

None - can start immediately
