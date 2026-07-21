# Coach — Edge Function (runbook)

Seule pièce serveur du repo ([ADR 0001](../docs/adr/0001-coach-flat-tool-calling-edge-function.md), [spec](../docs/specs/coach-v1.md)) : [functions/coach/index.ts](functions/coach/index.ts) tient la clé OpenAI et transforme un `CoachRequest` (profil aplati + Filtres vides) en `CoachResponse` `{ fieldKey, questionText }` via Chat Completions en Structured Outputs **strict** — l'enum `fieldKey` est reconstruit à chaque requête depuis `emptyFields`, un champ déjà rempli est donc irreprésentable dans la réponse du modèle.

## Mise en route (une fois, manuelle)

Prérequis :

- un compte [Supabase](https://supabase.com) avec un projet créé (dashboard → **New project**, n'importe quelle région proche) ;
- une clé API [OpenAI](https://platform.openai.com/api-keys) — conseil : lui poser un plafond de dépense bas côté OpenAI.

À la racine du repo (pas besoin de Docker, le deploy bundle via l'API Supabase) :

```bash
npx supabase login                      # ouvre le navigateur
npx supabase init                       # génère supabase/config.toml (répondre n aux questions IDE) — committable
npx supabase link --project-ref <ref>   # <ref> = l'identifiant du projet, visible dans l'URL du dashboard
npx supabase secrets set OPENAI_API_KEY=sk-...   # la clé ne vit QUE là — jamais dans le repo ni le bundle
npx supabase functions deploy coach --no-verify-jwt
```

Puis côté app :

```bash
cp .env.example .env                    # renseigner <project-ref> dans EXPO_PUBLIC_COACH_URL
npm start                               # Expo Go
```

Re-déploiement après modification de la function : relancer la seule commande `deploy`.

## Vérification (curl)

Blocs importables tels quels dans Postman (**Import → Raw text**) comme exécutables en terminal — remplacer `<project-ref>`.

**1. Profil de la spec, 4 champs vides** — attendu : `200` `{ fieldKey, questionText }` avec `fieldKey` parmi les 4, question en français tutoyé :

```bash
curl --location 'https://<project-ref>.supabase.co/functions/v1/coach' \
  --header 'Content-Type: application/json' \
  --data '{
    "profile": {
      "age": 29, "city": "Marseille", "height": 178, "gender": "man",
      "job": "Chef de projet", "education": "Kedge Business School", "originCity": "Marseille",
      "relationshipType": "intimate", "zodiac": "gemini", "diet": "omnivore",
      "drinking": "often", "smoking": "sometimes", "drugs": "never",
      "kids": "dont_want", "pets": "other", "religion": "muslim",
      "sports": ["climbing", "running"], "trainingFrequency": "mid",
      "preferences": {
        "ageRange": { "min": 18, "max": 60 }, "maxDistance": 50,
        "trainingFrequency": null, "relationshipType": null
      }
    },
    "emptyFields": ["age_range", "max_distance", "training_frequency", "relationship_type"]
  }'
```

**2. Un seul champ vide** — attendu : `fieldKey` est forcément `"relationship_type"` (l'enum du schéma ne contient que lui) :

```bash
curl --location 'https://<project-ref>.supabase.co/functions/v1/coach' \
  --header 'Content-Type: application/json' \
  --data '{
    "profile": {
      "age": 29, "city": "Marseille", "height": 178, "gender": "man",
      "job": "Chef de projet", "education": "Kedge Business School", "originCity": "Marseille",
      "relationshipType": "intimate", "zodiac": "gemini", "diet": "omnivore",
      "drinking": "often", "smoking": "sometimes", "drugs": "never",
      "kids": "dont_want", "pets": "other", "religion": "muslim",
      "sports": ["climbing", "running"], "trainingFrequency": "mid",
      "preferences": {
        "ageRange": { "min": 25, "max": 40 }, "maxDistance": 40,
        "trainingFrequency": "mid", "relationshipType": null
      }
    },
    "emptyFields": ["relationship_type"]
  }'
```

**3. Body invalide** — attendu : `400` `{ "error": "CoachRequest invalide" }` :

```bash
curl --location -i 'https://<project-ref>.supabase.co/functions/v1/coach' \
  --header 'Content-Type: application/json' \
  --data '{}'
```

Si les trois renvoient `401 Missing authorization header` : la function a été déployée **sans** `--no-verify-jwt` — relancer le deploy avec le flag.

Le `502` couvre l'autre bord du contrat (OpenAI KO ou réponse hors schéma) : non reproductible à la demande sans invalider la clé — le client (issue 019) le traite par fallback déterministe.

## ⚠️ Risque assumé : endpoint sans auth

`--no-verify-jwt` expose la function **sans authentification** : quiconque possède l'URL peut consommer du crédit OpenAI. Assumé pour cette app de test (URL non publiée, plafond de dépense sur la clé) ; en prod : auth obligatoire + anonymisation du payload — cf. « Hors scope V1 » de la spec.
