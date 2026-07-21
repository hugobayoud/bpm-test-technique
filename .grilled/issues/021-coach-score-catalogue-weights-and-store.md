title: Coach Score — poids du catalogue & store persisté (set monotone)
type: AFK
status: todo

---

## Parent

Grillé le 2026-07-21 (session `/grill-with-docs`). Glossaire : [CONTEXT.md](../../CONTEXT.md) (termes **Coach Score**, **Weight**, entrée **Coach** élargie « compléter son profil »). S'appuie sur la couche Filtres (`016-filters-data-layer.md`) et la CoachScreen (`019-coach-screen-llm-thread.md`). Pas d'ADR (proposé, refusé — la rationale « set monotone plutôt que somme dérivée » vit dans le glossaire + mémoire projet).

## What to build

La notion **Coach Score** côté client : un score de complétion pondéré, **accumulé et monotone** — chaque item gagne son **Weight** à sa **1re** complétion, jamais retiré ensuite.

1. **Poids du catalogue** : un champ `weight` sur chacune des 4 entrées de `FILTER_CATALOGUE` — `age_range` **3**, `max_distance` **2**, `training_frequency` **1**, `relationship_type` **1** (par effort de réponse, pas par importance de matching). Helpers purs dans le catalogue : `TOTAL_WEIGHT` (Σ des poids = 7) et `getCoachScore(keys)` (Σ des poids des clés fournies). Aucun type de `@/types/feed` re-déclaré.
2. **Store dédié** `features/coach/score-store.ts` → `useCoachScoreStore` (`zustand/persist`, clé `bpm-coach-score`, AsyncStorage) : état = `completedKeys: FilterKey[]` (le **set monotone** des Filtres déjà complétés), action `reset()` (vide le set), sélecteur dérivé `coach_score = getCoachScore(completedKeys)`. **Aucun nombre brut persisté** — le score se recalcule toujours du set.
3. **Réconciliation** (fonction pure testable, ex. `reconcile(completedKeys, filters)`) : `completedKeys ← completedKeys ∪ answeredKeys(filters)` où `answeredKeys` = complément de `getEmptyFilterKeys`. Union **monotone** : désanswer un Filtre ne retire jamais sa clé. Le store **s'abonne à `useFiltersStore`** et réconcilie à chaque changement — un seul mécanisme couvre les **deux portes** (page Coach *et* page Filtres). La dépendance reste coach→filtres.
4. **Backfill à l'hydratation** : au 1er chargement, une réconciliation (même fonction) pour que les Filtres **déjà répondus avant cette feature** comptent — le score reflète l'état réel, puis accumule.
5. **Reset Recommencer** : le `restart()` de `CoachScreen` appelle aussi `reset()` du score store. « Recommencer » (affordance test) est le **seul** reset ; en prod le score ne fait que monter.
6. **Aucun affichage** du score à l'écran : il ne transparaîtra que par la voix du coach (cf. `022`).

## Acceptance criteria

- [ ] `getCoachScore` et `TOTAL_WEIGHT` testés (vitest, TS pur) : Σ des poids, total = 7
- [ ] Réconciliation testée : 1re complétion ajoute le poids ; re-compléter le même Filtre n'ajoute rien (idempotent) ; désanswer garde la clé (score ne baisse pas) ; union depuis un snapshot de filtres (les 2 portes passent par là) ; backfill = les Filtres déjà répondus comptent au 1er chargement
- [ ] Store testé (même style que `store.test.ts` des filtres) : `reset()` vide le set (`coach_score` = 0) ; `coach_score` dérivé cohérent avec `completedKeys`
- [ ] Weights ajoutés à `FILTER_CATALOGUE` sans re-déclarer aucun type de `@/types/feed` ; `src/types/feed.ts` intouché
- [ ] « Recommencer » remet le Coach Score à 0 en plus des filtres (vérifié dans l'app)
- [ ] `npm run check` vert

## Blocked by

None — `016-filters-data-layer.md` (store filtres) et `019-coach-screen-llm-thread.md` (restart de la CoachScreen) déjà done.
