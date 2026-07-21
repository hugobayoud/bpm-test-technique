title: Coach — Recommencer & fallback déterministe
type: AFK
status: done

---

## Parent

Spec : [docs/specs/coach-v1.md](../../docs/specs/coach-v1.md) — décisions « Recommencer » et « Erreur LLM → fallback déterministe ».

## What to build

La robustesse démo du Coach — il ne casse jamais et se relance de zéro :

1. **Bouton « Recommencer »** sur la page Coach : `reset()` du store (sentinelles/null), fil vidé, cache TanStack purgé (`removeQueries`) → repart à la question 1 avec une génération fraîche (pas de question re-servie du cache).
2. **Fallback déterministe** : sur erreur (réseau, HTTP, contrat) après le retry, le fil continue **en silence** avec le 1er champ vide dans l'ordre de priorité + sa question statique (`STATIC_QUESTIONS`) — jamais d'écran d'erreur.
3. **Garde de contrat côté client** : une réponse dont le `fieldKey` n'est pas un champ vide attendu est traitée comme une erreur → fallback.

## Acceptance criteria

- [ ] Mode avion (ou URL invalide) → le fil enchaîne les 4 questions statiques dans l'ordre de priorité, flow par ailleurs identique
- [ ] « Recommencer » après un flow complet → valeurs par défaut restaurées (visibles dans l'écran Filtres), fil vide, nouvelle question 1 régénérée
- [ ] Tests vitest : fallback (1er champ vide + copy statique) et garde de contrat (`fieldKey` inattendu rejeté)
- [ ] `npm run check` vert

## Blocked by

- `019-coach-screen-llm-thread.md`
