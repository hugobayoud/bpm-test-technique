# Spec — Coach V1 : complétion des Filtres

> Issue de la session de grilling du 2026-07-21. Références : [chatbot-generative-ui-brief.md](../../chatbot-generative-ui-brief.md) (pattern conceptuel), [ADR 0001](../adr/0001-coach-flat-tool-calling-edge-function.md) (le pont retenu), [CONTEXT.md](../../CONTEXT.md) (Filtre, Coach, Coach Question).

## But

Un **Coach** guidé qui fait compléter à l'utilisateur ses 4 **Filtres**, une **Coach Question** à la fois : le LLM choisit le Filtre non répondu à demander et rédige la question (français, personnalisée via le profil) ; l'app rend le composant depuis son **catalogue**. Jamais de chat libre, aucune saisie texte. Vrai appel LLM dès la V1.

## Décisions verrouillées

- Coach guidé sur le **mécanisme generative-UI** (tool-calling) sans saisie libre — cohérent avec la décision « cerveau hybride » de `.wayfinder/assistant-lien/` (effort séparé, non affecté).
- **LLM** = choisit le champ parmi les vides + rédige la question. **Code** = valeurs, domaines, composants, validation (le catalogue).
- **Supabase Edge Function** dans ce repo ; clé OpenAI en secret ; Structured Outputs strict avec enum `fieldKey` dynamique restreint aux champs vides. **Expo Go conservé** (ADR 0001).
- Payload « riche » : `MyProfile` aplati (attributs de l'info_card + résumé sports + `preferences`), **sans** prénom, userId ni cards. App de test : envoi de PII à OpenAI assumé — à rouvrir pour la prod.
- Les 4 champs **sont des Filtres** : édition directe sur l'écran Filtres existant ([filters.tsx](../../src/app/filters.tsx), aujourd'hui placeholder) ; le Coach est une seconde porte sur le **même store**. Le tab Profil reste placeholder (hors scope V1).
- Persistance : `zustand/persist` + AsyncStorage.
- Foyer du Coach : CTA sur l'écran Filtres → page Coach poussée. Bouton **« Recommencer »** (affordance démo, même esprit que « Revoir les profils »).
- Erreur LLM → **fallback déterministe** (1er champ vide dans l'ordre + question statique). Tout rempli → bulle « complet » + Recommencer.

## Les 4 Filtres (le catalogue)

| clé wire | contrôle | domaine | défaut (= non répondu) | raccourcis (règle code) |
|---|---|---|---|---|
| `age_range` | RangeSlider, min **et** max | 18–60 ans | `{min:18, max:60}` | chips 18-25 · 25-40 · 40-50 · 50-60 |
| `max_distance` | Slider, max seul (min figé 5) | 5–160 km | `50` | chips 20 · 40 · 80 · 160 km (50 exclu : c'est la sentinelle) |
| `training_frequency` | chips enum | `little/mid/hard` | `null` | = le domaine, libellés `TRAINING_FREQUENCY_VALUE` (1-2 / 3-4 / 5+) |
| `relationship_type` | chips enum | `exclusive/casual/intimate` | `null` | = le domaine, libellés `RELATIONSHIP_TYPE_COPY` (Endurance / Fractionné / Sprint) |

- **Ordre de priorité fixe** : `age_range` → `max_distance` → `training_frequency` → `relationship_type`. Sert de guide au LLM (tiebreak) et d'ordre au fallback.
- Les raccourcis sont des **règles code figées**, jamais du LLM ; la personnalisation vit dans le texte de la question. Taper un raccourci règle le contrôle ; « Valider » committe (page Coach).
- Limitation assumée : choisir exactement la valeur par défaut = « non répondu » (au pire l'user reconfirme).
- Les enums **réutilisent les unions de `@/types/feed`** (`satisfies readonly TrainingFrequency[]` pour obtenir le tableau runtime) — jamais re-déclarées.

## Données & types (nouveaux — `src/types/feed.ts` intouché)

```ts
// features/filters/catalogue.ts
export type FilterKey = 'age_range' | 'max_distance' | 'training_frequency' | 'relationship_type';

// features/filters/store.ts — state du store (persisté)
export type Filters = {
  ageRange: { min: number; max: number };      // défaut {18,60}
  maxDistance: number;                         // défaut 50
  trainingFrequency: TrainingFrequency | null; // recherché (≠ le mien)
  relationshipType: RelationshipType | null;   // recherché (≠ le mien)
};
```

- Store `features/filters/store.ts` → `useFiltersStore` : `Filters` + setters + `reset()` ; `persist` sur AsyncStorage (clé `bpm-filters`). Nouvelle dépendance : `@react-native-async-storage/async-storage` (`npx expo install`, compatible Expo Go). Seule dépendance ajoutée côté client — pas de SDK IA dans l'app.
- `getEmptyFilterKeys(filters): FilterKey[]` — pure, renvoie les clés non répondues **dans l'ordre de priorité** (règles du tableau). Testée vitest.

```ts
// features/coach/my-profile.ts — MOI, fixture statique typée
export type MyProfile = {
  age: number; city: string; height: number; gender: Gender;
  job: string; education: string | null; originCity: string;
  relationshipType: RelationshipType; zodiac: Zodiac; diet: Diet;
  drinking: DrinkingHabit; smoking: SmokingHabit; drugs: DrugsHabit;
  kids: KidsIntention; pets: PetsStatus; religion: Religion;
  sports: string[]; trainingFrequency: TrainingFrequency;
};
```

- Fixture = le profil « Hugo » de la fixture feed, aplati (l'info_card à plat, structure cards jetée) + sports ajoutés (`['climbing','running']`, `mid`) — il n'avait pas de sport_card. Pas de `firstname` ni `userId` **par construction** du type.
- **Piège nommé** : `relationshipType`/`trainingFrequency` existent en deux sens — attribut (ce que je suis) vs Filtre (ce que je cherche). Le prompt système les distingue explicitement.

## Le pont (contrat wire)

```ts
// features/coach/types.ts — miroir commenté dans la function Deno (à garder en phase)
export type CoachRequest = {
  profile: MyProfile & { preferences: Filters }; // fixture + snapshot du store
  emptyFields: FilterKey[];                      // dérivé client via getEmptyFilterKeys
};
export type CoachResponse = { fieldKey: FilterKey; questionText: string };
```

**Garantie de format, trois crans :**
1. `json_schema` strict côté OpenAI, l'enum de `fieldKey` = les `emptyFields` de **cette** requête → décodage contraint : impossible de renvoyer un champ rempli ou inconnu.
2. La function re-valide (parse + `fieldKey ∈ emptyFields`), sinon 502.
3. Le client re-valide contre le catalogue ; tout échec → fallback déterministe.

## Edge Function (`supabase/functions/coach/index.ts`)

- Deno, **zéro dépendance** : `fetch` direct vers `https://api.openai.com/v1/chat/completions`.
- `MODEL = 'gpt-4o-mini'` — constante unique, swap facile.
- `response_format: { type: 'json_schema', json_schema: { name: 'coach_question', strict: true, schema } }` avec `fieldKey: { enum: emptyFields }`, `questionText: string`, `additionalProperties: false`.
- **Prompt système** (français) : rôle = coach sportif de bpm ; tutoiement ; ton léger et sportif ; une seule question courte (~140 caractères max) ; choisir **un** champ parmi `emptyFields` en respectant l'ordre fourni sauf signal fort du profil ; distinguer attributs (ce qu'il est) et Filtres (ce qu'il cherche) ; s'appuyer sur le profil pour personnaliser.
- Erreurs : 400 (body invalide), 502 (OpenAI KO ou réponse invalide). CORS permissif (inoffensif en natif).
- Secret : `supabase secrets set OPENAI_API_KEY=…`. Déploiement : `supabase functions deploy coach --no-verify-jwt`.
- ⚠️ **Risque assumé** (app de test) : endpoint sans auth — quiconque a l'URL consomme du crédit OpenAI. Prod = auth obligatoire + anonymisation à rouvrir.

## Client

- `lib/coach-client.ts` : `fetchCoachQuestion(request)` — **vrai** fetch vers `process.env.EXPO_PUBLIC_COACH_URL` (throw clair si absente). `.env` gitignoré, `.env.example` committé.
- `features/coach/api.ts` : `coachKeys` + `useCoachQuestion(...)` — `useQuery`, `enabled: emptyFields.length > 0`, `queryKey: coachKeys.question(emptyFields)` : la question suivante **découle du store** (un Filtre validé ⇒ `emptyFields` change ⇒ nouvelle clé ⇒ refetch). `retry: 1`. Restart ⇒ `removeQueries(coachKeys.all)` pour régénérer frais.
- **Écran Filtres** (remplit le stub `app/filters.tsx` → `FiltersScreen` dans `features/filters/components/`) : les 4 contrôles pré-remplis depuis le store, commit direct au changement (pas de « Valider » ici), + CTA « Laisse le coach remplir pour toi » → push `/coach`.
- **Page Coach** (`app/coach.tsx` → `CoachScreen` dans `features/coach/components/`) : fil vertical type chatbot.
  - Ouverture : 0 champ vide → bulle « complet » + Recommencer, **aucun appel**. Sinon → indicateur « Le coach réfléchit… » → bulle question + bloc contrôle du catalogue + « Valider ».
  - « Valider » écrit le store → le bloc se fige en résumé (question + valeur choisie) → la question suivante s'ajoute dessous.
  - Dernier champ validé → bulle finale « complet ».
  - « Recommencer » : `reset()` du store + fil vidé + `removeQueries` → repart à la question 1. Le fil est de l'état d'écran (aucune persistance du fil).
  - Erreur (réseau/HTTP/contrat) après le retry : **fallback local silencieux** = 1er de `emptyFields` + question statique — le fil continue à l'identique.
- Les composants de champ vivent dans `features/filters/components/` et sont **partagés** (le Coach les importe). Styling `StyleSheet.create` local, couleurs `COLORS`, polices `utils/fonts` (Cal Sans : titres uniquement).
- CLAUDE.md (bloc Structure) à mettre à jour : `features/filters/`, `features/coach/`, `supabase/`.

## Copy (français — `constants.ts` de chaque feature)

- `features/filters/constants.ts` : labels des 4 Filtres (« Tranche d'âge », « Distance maximale », « Fréquence d'entraînement recherchée », « Type de relation recherché »), unités (« ans », « km »), CTA coach « Laisse le coach remplir pour toi ». Les libellés enum réutilisent `RELATIONSHIP_TYPE_COPY` et `TRAINING_FREQUENCY_VALUE` importés de `features/feed/constants` (source canonique — réutilisation inter-features délibérée).
- `features/coach/constants.ts` : titre « Coach », « Le coach réfléchit… », « Valider », « Ton profil est complet 💪 », « Recommencer », et `STATIC_QUESTIONS` (fallback) :
  - `age_range` : « Quelle tranche d'âge cherches-tu ? »
  - `max_distance` : « Jusqu'à quelle distance autour de toi ? »
  - `training_frequency` : « Tu cherches quelqu'un qui s'entraîne à quel rythme ? »
  - `relationship_type` : « Tu cherches quel type de relation ? »

## Tests (vitest — TS pur uniquement, pas de rendu)

- Catalogue : règles « non répondu » des 4 champs ; `getEmptyFilterKeys` respecte l'ordre de priorité.
- Store filtres : setters, `reset()` → sentinelles/null (même style que `store.test.ts` du feed).
- Fallback : `fallbackCoachQuestion(emptyFields)` = 1er champ + copy statique.
- Garde de contrat : `isCoachResponse(x, emptyFields)`.

## Mise en route (manuelle, une fois — HITL)

1. Créer le projet Supabase (dashboard) ; `npx supabase init` puis `link`.
2. `supabase secrets set OPENAI_API_KEY=sk-…` (clé fournie par Hugo).
3. `supabase functions deploy coach --no-verify-jwt`.
4. `.env` : `EXPO_PUBLIC_COACH_URL=https://<ref>.supabase.co/functions/v1/coach` (vérifier que `.gitignore` couvre `.env`).
5. `npm start` (Expo Go). Vérification curl d'exemple fournie dans l'issue de la function.

## Hors scope V1

- Chat libre / saisie texte (décision « cerveau hybride » — jamais).
- Suggestions de valeurs générées par le LLM (tout est règles code en V1).
- Tab Profil (reste placeholder) ; tout champ au-delà des 4 ; le roster futur du brief (`browse_profiles`, `get_icebreakers`, …).
- Auth de la function, anonymisation prod, streaming/effet machine à écrire, persistance du fil entre sessions.
