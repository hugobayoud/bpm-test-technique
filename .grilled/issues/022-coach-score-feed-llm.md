title: Coach Score — feed LLM (payload + prompt + redéploiement)
type: HITL
status: todo

---

## Parent

Grillé le 2026-07-21 (session `/grill-with-docs`). Glossaire : [CONTEXT.md](../../CONTEXT.md) (**Coach Score**). Étend le pont wire de la spec : [docs/specs/coach-v1.md](../../docs/specs/coach-v1.md) — sections « Le pont (contrat wire) » et « Edge Function ». Prolonge `018-coach-edge-function.md` (function live, ref `ksjeszuiquxcicnllrgf`).

**HITL** : le redéploiement de la function exige Hugo (Supabase `deploy`).

## What to build

Le Coach **motive avec le score** — le pont transporte le Coach Score, le prompt s'en sert. La réponse ne change pas : seule la **requête** grandit et le **prompt système** évolue.

1. **Contrat wire élargi** : `CoachRequest` gagne deux champs **top-level** — `coachScore` (points gagnés) et `remainingScore` (= `TOTAL_WEIGHT − coachScore`, points encore gagnables), calculés **côté client**. Ils vivent à côté de `emptyFields` (métadonnée de progression) ; `MyProfile` reste des attributs d'identité purs. `CoachResponse` **byte-identique**.
2. **Client** : `useCoachQuestion` (`features/coach/api.ts`) lit le score store et ajoute `coachScore` + `remainingScore` au `CoachRequest`. Pas de changement de `queryKey` (les `emptyFields` suffisent — le score est snapshotté au moment du fetch). `isCoachResponse` et le fallback déterministe **intouchés**.
3. **Edge Function** (`supabase/functions/coach/index.ts`) : le miroir commenté du contrat ajoute les 2 champs ; le prompt système les injecte avec la consigne **« encouragé, pas forcé »** — le coach PEUT glisser une note de progression/points quand c'est naturel, surtout **près de la fin** (« plus que X points ! »), mais garde les règles dures : **une** question courte (~140 caractères), **un** champ de `emptyFields`, personnalisé via le profil. Jamais de points à chaque question.
4. **Redéploiement** (avec Hugo) : `supabase functions deploy coach --no-verify-jwt`. Runbook `supabase/README.md`. `.env` de Hugo inchangé (même URL).

## Acceptance criteria

- [ ] `CoachRequest` porte `coachScore` + `remainingScore` ; `CoachResponse` inchangé ; `isCoachResponse` inchangé (contrat de réponse non régressé)
- [ ] Le client envoie les 2 valeurs lues du score store, avec `remainingScore` = `TOTAL_WEIGHT − coachScore`
- [ ] `curl` avec score (ex. 3 champs remplis / 1 vide, `coachScore` élevé, `remainingScore` faible) → 200 `{ fieldKey, questionText }`, contrat respecté, `fieldKey` = le seul champ vide
- [ ] Prompt système : usage **encouragé-pas-forcé** des points documenté ; observé bout-en-bout (expo web) — le coach PEUT motiver (au moins près de la complétion) sans jamais casser la règle « une seule question »
- [ ] Fallback déterministe et validation client toujours verts (aucune régression)
- [ ] Function redéployée ; risque « endpoint sans auth » toujours assumé (app de test)

## Blocked by

- `021-coach-score-catalogue-weights-and-store.md` (le Coach Score à envoyer)
