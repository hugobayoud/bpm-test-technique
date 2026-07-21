title: Page Coach — fil guidé branché au vrai LLM
type: AFK
status: todo

---

## Parent

Spec : [docs/specs/coach-v1.md](../../docs/specs/coach-v1.md) — sections « Client » (page Coach) et « Le pont ». Glossaire : [CONTEXT.md](../../CONTEXT.md) (Coach, Coach Question). **La slice traçante** : première démo bout en bout avec le vrai LLM.

## What to build

Remplacer la route `/coach` placeholder par le fil guidé complet, nouvelle feature `features/coach/` :

1. **Données & seam** : fixture `MyProfile` « moi » (profil Hugo de la fixture feed aplati + sports `['climbing','running']`/`mid`) ; client fetch vers `EXPO_PUBLIC_COACH_URL` (throw clair si la variable manque) ; seam TanStack `coachKeys` + `useCoachQuestion` — `enabled` seulement s'il reste des champs vides, queryKey sur `emptyFields` (un Filtre validé ⇒ clé changée ⇒ la question suivante se fetche seule), `retry: 1`.
2. **`CoachScreen`** : fil vertical type chatbot — indicateur « Le coach réfléchit… » pendant le fetch ; puis bulle question (`questionText`) + bloc contrôle **issu du catalogue** (composants de 017) + bouton « Valider » ; « Valider » écrit le store et fige le bloc en résumé (question + valeur choisie) ; la question suivante s'ajoute dessous ; dernier champ validé → bulle « Ton profil est complet 💪 ». Le fil est de l'état d'écran, non persisté.
3. Ouverture avec 0 champ vide → bulle « complet » directe, **aucun appel réseau**.

## Acceptance criteria

- [ ] Démo bout en bout dans Expo Go : Filtres → CTA coach → vraies questions LLM une à une jusqu'à la bulle finale
- [ ] Chaque « Valider » persiste la valeur (visible ensuite dans l'écran Filtres) et déclenche automatiquement la question suivante
- [ ] Le contrôle affiché découle toujours de `fieldKey` via le catalogue — jamais du texte du LLM
- [ ] Ouverture avec profil déjà complet → bulle « complet », zéro appel réseau
- [ ] Aucune saisie de texte libre nulle part dans le fil
- [ ] Copy française dans `constants.ts` ; `npm run check` vert

## Blocked by

- `017-filters-screen.md`
- `018-coach-edge-function.md`
