# .wayfinder — tracker markdown local

Ce dossier tient les **cartes wayfinder** de ce repo (skill `/wayfinder`). Une carte =
un gros chantier planifié comme un ensemble de **tickets-décision** résolus un par un
jusqu'à ce que le chemin vers la **destination** soit clair. C'est de la *planification*,
pas de l'implémentation — à ne pas confondre avec `.grilled/issues/`, qui sont des slices
de *build*.

Aucun tracker (GitHub / Linear…) n'était configuré pour ce repo → on adopte la convention
markdown-locale par défaut, décrite ici.

## Disposition

```text
.wayfinder/
  <slug-de-carte>/
    map.md                 # la carte (label wayfinder:map) — index bas-résolution
    tickets/NNN-*.md       # tickets-décision (child issues de la carte)
    research/*.md          # trouvailles des tickets de recherche (liées depuis le ticket)
```

## Un ticket = un fichier markdown avec frontmatter

```yaml
---
id: 002
title: Identité & maison de l'assistant
type: grilling            # research | prototype | grilling | task
mode: HITL                # HITL (avec l'humain) | AFK (agent seul)
status: open              # open | closed
assignee:                 # vide = non-réclamé ; un nom = réclamé (le « claim »)
blocked_by: [001]         # ids des tickets bloquants
---
## Question
<la décision ou l'investigation que ce ticket résout>
```

## Opérations wayfinding (comment ce repo les exprime)

- **Carte** : `map.md`, frontmatter `label: wayfinder:map`. Index, jamais un magasin :
  elle gist chaque décision close et pointe vers son ticket, sans jamais la re-stocker.
- **Tickets** : fichiers sous `tickets/`, le champ `id` fait l'identité.
- **Claim** : renseigner `assignee:` **avant** tout travail (sinon deux sessions se marchent dessus).
- **Blocage** : champ `blocked_by:` (fallback body-convention — pas de blocage natif ici).
- **Frontière** : les tickets `status: open`, `assignee` vide, et dont **tous** les `blocked_by`
  sont `status: closed`. C'est la liste des tickets prenables maintenant.
- **Résolution** : ajouter une section `## Résolution` au ticket, passer `status: closed`,
  puis ajouter une ligne dans « Décisions prises » de `map.md` (gist + lien).
