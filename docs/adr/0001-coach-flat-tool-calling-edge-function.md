# Coach V1 : tool-calling « plat » derrière une Supabase Edge Function — pas de streamUI/RSC

Le brief du coach (`chatbot-generative-ui-brief.md`) prescrit `streamUI` (Vercel AI SDK, `ai/rsc`) : le serveur renvoie des composants React. On retient à la place un **pont données-seulement** : une Supabase Edge Function (dans ce repo, `supabase/functions/coach/`) tient la clé OpenAI et appelle Chat Completions en Structured Outputs — l'enum `fieldKey` du schéma est construit **à chaque requête**, restreint aux Filtres non répondus — et renvoie `{ fieldKey, questionText }` ; le **catalogue client** mappe `fieldKey` → composant, domaine, validation. Raisons : RSC/server actions ne tournent pas sous Expo Go (cible du repo), le seul apport de `streamUI` — des composants rendus côté serveur — est nul quand le jeu de composants est un catalogue fermé de 4 entrées, et une fonction serverless donne le vrai appel LLM sans second repo.

## Considered Options

- **`streamUI` + Expo RSC (le brief, littéralement)** — rejeté : exige un dev build + le support RSC expérimental d'Expo, pénible à tester, zéro bénéfice pour un catalogue fermé.
- **Expo Router API routes + EAS Hosting** — rejeté : infra plus récente à configurer/héberger ; la fonction Supabase = un fichier + une commande de déploiement.
- **Clé OpenAI dans l'app / appel direct client** — rejeté d'office : la clé s'extrait du bundle.

## Consequences

- Expo Go reste suffisant ; aucune dépendance IA côté client.
- La garantie de format est **structurelle** : le modèle ne peut littéralement pas produire un champ hors de l'enum de la requête (décodage contraint), la fonction re-valide, le client re-valide contre le catalogue.
- Ajouter une capacité au Coach = une entrée de catalogue + une extension de schéma, donc une mise à jour de l'app — contrairement à la promesse RSC du « client jamais modifié ». Assumé pour la V1.
- Le brief reste la référence **conceptuelle** (tools = jeu fermé que le LLM choisit) ; sa stack littérale n'est pas utilisée.
