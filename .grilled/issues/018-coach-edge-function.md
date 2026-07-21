title: Edge Function coach — vrai appel OpenAI en Structured Outputs
type: HITL
status: done

---

## Parent

Spec : [docs/specs/coach-v1.md](../../docs/specs/coach-v1.md) — sections « Le pont (contrat wire) », « Edge Function » et « Mise en route ». Décision : [ADR 0001](../../docs/adr/0001-coach-flat-tool-calling-edge-function.md).

**HITL** : le déploiement exige Hugo — compte Supabase, clé OpenAI (secret), `deploy`.

## What to build

La function Deno `supabase/functions/coach/` et son déploiement :

1. **Function zéro-dépendance** : parse du `CoachRequest` (400 si invalide), `fetch` direct vers Chat Completions, `MODEL = 'gpt-4o-mini'` en constante unique, `response_format` `json_schema` **strict** dont l'enum `fieldKey` est construit **depuis les `emptyFields` de la requête** (décodage contraint : un champ rempli ou inconnu est impossible), re-validation de la réponse (`fieldKey ∈ emptyFields`, sinon 502), CORS permissif. Les types du contrat wire sont dupliqués en miroir commenté (la function ne peut pas importer `src/`).
2. **Prompt système** (français) : coach sportif de bpm, tutoiement, une seule question courte (~140 caractères max), respecter l'ordre des `emptyFields` sauf signal fort du profil, distinguer attributs (ce qu'il est) et Filtres (ce qu'il cherche), personnaliser via le profil.
3. **Runbook exécuté avec Hugo** : `supabase init`/`link`, `supabase secrets set OPENAI_API_KEY=…`, `supabase functions deploy coach --no-verify-jwt`, `.env.example` committé (`EXPO_PUBLIC_COACH_URL`), `.env` couvert par `.gitignore`.

## Acceptance criteria

- [ ] `curl` avec un `CoachRequest` d'exemple (profil de la spec, 4 champs vides) → 200 `{ fieldKey, questionText }`, `fieldKey` ∈ `emptyFields`, question en français tutoyé
- [ ] Même requête avec un seul champ vide → `fieldKey` est forcément celui-là
- [ ] Body invalide → 400 ; réponse OpenAI hors contrat → 502
- [ ] La clé OpenAI n'existe qu'en secret Supabase — jamais dans le repo ni le bundle
- [ ] `.env.example` committé, `.env` ignoré par git
- [ ] Risque « endpoint sans auth » documenté dans le runbook (assumé, app de test)

## Blocked by

None — parallèle à 016/017 (le contrat wire est figé par la spec)
