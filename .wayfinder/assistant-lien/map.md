---
label: wayfinder:map
slug: assistant-lien
title: "Assistant « lien » — décisions produit"
driver: hugobayoud
---

# Assistant « lien » — décisions produit

## Destination

Un **doc de décisions produit** (stack-agnostique) pour l'assistant « lien » de bpm : le
concept & la philosophie du *lien*, le modèle d'interaction (guidé, quasi zéro saisie libre),
la palette du **donner** qui bâtit la confiance, et le modèle du **prendre** qui la convertit —
verrouillé et prêt à passer à un futur effort de build. **On s'arrête avant toute UI.**

## Notes

- **Domaine** : bpm, app de rencontre pour sportifs. Feature nouvelle = un « assistant » qui
  *ressemble* à un chatbot sans en être un (réf. Hily). But : créer du **lien** (confiance) puis
  le monétiser. Surtout pas un ChatGPT au rabais.
- **Cerveau = hybride** (tranché au charting) : coquille 100 % guidée/scriptée, **jamais** de chat
  libre ; mais vraie génération LLM pour le contenu perso (tips, récaps, offres sur-mesure).
- **Langue de travail** : français. *Ubiquitous language* émergent (à sharper au fil des tickets) :
  **Assistant**, **Lien** (la confiance construite), **Donner** (interactions à valeur, sans
  contrepartie), **Prendre** (conversion de la confiance), **Signal** (donnée user qui personnalise),
  **Arc** (séquencement donner→prendre).
- **Skills par session** : `/grilling` (grill-the-build / grill-the-edge / grill-the-interface),
  `/domain-modeling`. Recherche externe via subagent web.
- **Préférences de l'effort** : une question à la fois, avec recommandation ; scope minimal ;
  ne rien construire (planification pure) ; ne pas re-déclarer les types de `@/types/feed`.
- **Effort frère (2026-07-21)** : un « Coach V1 » (complétion des 4 Filtres, vrai appel LLM via
  Supabase Edge Function) a été spécifié et découpé en issues **hors de cette carte** — voir
  `docs/specs/coach-v1.md` + ADR 0001. La carte reste décisions produit ; ses tickets 001-004
  restent ouverts et non affectés.

## Décisions prises

<!-- index — une ligne par ticket clos : gist + lien vers le ticket qui tient le détail -->

_(aucune encore — le charting ne résout rien à la main ; la recherche T1 est en vol.)_

## Not yet specified

<!-- brouillard en scope : questions qu'on sent venir mais pas encore assez nettes pour un ticket -->

- **Modèle d'interaction détaillé** — les mécaniques guidées précises (chips de choix, cartes,
  faux fil scripté, quick-replies, et où/si une saisie minimale est jamais permise). Se précisera
  une fois l'identité & la maison fixées (« Identité & maison de l'assistant »).
- **Orchestration & arc donner→prendre** — ce qui déclenche l'assistant (temps, comportement /
  signaux), la cadence, le ratio donner:prendre, le seuil de confiance avant la première « demande ».
  Se précisera une fois le donner et le prendre définis.
- **Voix & ton** — la personnalité de l'assistant (français, franglais bpm, registre sportif).
  Se précisera après l'identité.
- **Mesure du succès** — comment on sait que le lien se crée et convertit (rétention, confiance,
  conversion IAP/abo). En scope mais pas encore net.
- **Doc de synthèse final** — assembler toutes les décisions verrouillées en l'artefact
  « décisions produit » (la destination). Se précisera quand les décisions auront atterri.

## Out of scope

<!-- consciemment hors de CET effort ; ne graduera jamais tant que la destination ne change pas -->

- **Chat libre / conversation ouverte type ChatGPT** — écarté par le choix « cerveau hybride » :
  l'user ne tape pas librement.
- **Tout build / implémentation dans ce repo** (UI, fixtures, code, slices `.grilled/issues`) —
  la destination s'arrête aux décisions. Un futur effort séparé (p. ex. `/grill-the-interface` →
  `/to-issues`) le prendra.
- **Ingénierie d'intégration LLM/backend réelle** — le doc décide *qu'*il y a du contenu généré,
  pas *comment* le câbler.
