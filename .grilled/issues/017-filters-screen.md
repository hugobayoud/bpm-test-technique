title: Écran Filtres — 4 contrôles branchés au store + CTA coach
type: AFK
status: todo

---

## Parent

Spec : [docs/specs/coach-v1.md](../../docs/specs/coach-v1.md) — section « Client » (écran Filtres). Conventions : [docs/ui-conventions.md](../../docs/ui-conventions.md).

## What to build

Remplacer le placeholder de l'écran Filtres (déjà poussé depuis le header du feed) par l'éditeur direct des 4 Filtres :

1. Les 4 blocs, pré-remplis depuis `useFiltersStore`, **commit direct** au changement (fin de glissement pour les sliders, tap pour les chips) — pas de bouton « Valider » ici :
   - Tranche d'âge : slider double poignée 18–60 + chips raccourcis
   - Distance max : slider simple poignée 5–160 (min figé) + chips raccourcis
   - Fréquence recherchée & relation recherchée : chips enum (libellés canoniques du feed)
2. Les composants de champ sont **réutilisables** (`features/filters/components/`) : la page Coach (019) les importera tels quels. Double poignée : lib JS pure compatible Expo Go ou deux sliders min/max — au choix de l'implémentation, aucun natif custom.
3. CTA « Laisse le coach remplir pour toi » → push d'une route `/coach` **placeholder** (précédent `PlaceholderScreen`), remplacée en 019.

## Acceptance criteria

- [ ] Les 4 Filtres s'éditent depuis l'écran Filtres ; en revenant sur l'écran, les valeurs relues du store sont affichées
- [ ] Kill & relaunch de l'app → valeurs conservées (persist AsyncStorage)
- [ ] Un tap sur un raccourci règle le contrôle et committe ; 50 km n'apparaît pas dans les raccourcis distance
- [ ] Le CTA coach pousse la route `/coach` (placeholder)
- [ ] Toute dépendance ajoutée est compatible Expo Go (JS pure ou `npx expo install`)
- [ ] Copy française dans `constants.ts` ; `npm run check` vert

## Blocked by

- `016-filters-data-layer.md`
