# bpm feed - test technique

Recréation du feed bpm : les profils défilent verticalement card par card, on peut liker une card précise ou on passe le profil entier, et le feed avance. (data en local)

## Tester l'app

Expo Go ne supporte plus le SDK 57, l'app se teste donc en build standalone.

**Android** Scanner ce QR code, installer l'APK (Android demande une confirmation, normal hors Play Store), c'est tout :

Lien direct : [installer l'APK](LIEN_INSTALL_APK_A_COLLER)

Le build utilise notamment EAS Update si je fais une mise a jour.

**iOS.** Pas de build partageable sans compte Apple Developer. Mais sur Mac, le simulateur fait très bien l'affaire :

```bash
npm install
npx expo start
```

Puis touche `i` (simulateur iOS). Expo y installe tout seul la version d'Expo Go compatible SDK 57. Le projet est 100% managed, aucun code natif custom.

Pas de backend : les données viennent d'une fixture locale servie avec ~500 ms de délai simulé. C'est voulu, conforme au brief. Les checks : `npm run check` (biome + typecheck + vitest + knip).

## Stack

- **Expo Router**, shell à tabs : les boutons du header et les tabs hors Accueil montrent des pages placeholder
- **TanStack Query**, le feed sort d'une fixture JSON via un mock client : [api.ts](src/features/feed/api.ts) serait le point d'entrée prévue si on ajoute un vrai backend.
- **Zustand**, état client du feed (progression, like/pass)
- **Reanimated**, pour les animations like/pass
- **expo-image** (placeholders thumbhash), **react-native-svg** (rings, logo), icônes **lucide**

## Démarche

Point de départ : le brief via le Notion que tu m'as partagé + le JSON d'exemple, et le screen que tu m'as laissé sur Notion. Je l'ai traité comme un mockup livré par un designer. Je n'ai volontairement pas multiplié les captures du vrai feed bpm : avec Fable 5, le challenge aurait été trop simple.

Tout est fait avec Claude Code (Fable 5 ou Opus 4.8) et mes skills perso, en une grosse après-midi de travail. Mon workflow se sépare en trois process :

(note: pas facile de partager une conversation depuis Claude Desktop, donc j'ai généré un HTML pour chaque conversation).

1. **Grilling**, l'IA m'interviewe (~20 questions) et toutes les décisions sont figées avant de coder. [Voir la conversation](https://htmlpreview.github.io/?https://github.com/hugobayoud/bpm-test-technique/blob/main/docs/conversations/grilling.html)
2. **to-issues**, le plan est découpé en 11 issues, à implémenté dans l'ordre. Elles sont dans [.grilled/issues/](.grilled/issues/) . Je les laisse volontairement dans le repo pour que tu puisses les lire mais en temps normal, je ne les aurait pas commité (pas utile).
3. **implement-next-issue**, une issue = une conversation fraîche = une PR mergée dans `main`, avec `npm run check` à chaque fois. [Voir un exemple](https://htmlpreview.github.io/?https://github.com/hugobayoud/bpm-test-technique/blob/main/docs/conversations/implement-next-issue.html)

J'ai tendance à créer une nouvelle conversation neuve par issue pour que l'IA reparte sur une base saine : pas de pollution des issues précédentes, et on reste sous ~250K tokens. Au-delà, je trouve qu'elle hallucine beaucoup plus.

Les deux premières issues posent le socle de la codebase : Expo / Expo Go et les ressources (icônes, iOS, Android), puis le tooling :

- biome (formatage),
- knip (code mort),
- vitest (tests sur la logique pure uniquement).

La page d'envoi de like est arrivée dans un second temps. J'ai d'abord dessiné mes mockups sur Figma (les deux états : superlikes restants ou épuisés, cf. plus bas), puis une session avec le skill **grill-the-interface** pour trancher toutes les questions d'UI avant de coder. Ça a donné les 4 dernières issues. [Voir la conversation](https://htmlpreview.github.io/?https://github.com/hugobayoud/bpm-test-technique/blob/main/docs/conversations/grill-the-interface.html)

## Deux divergences assumées avec l'app actuelle

### 1. La carte « photos verrouillées »

| Original bpm | Ma version |
| ------------ | ---------- |
|              |            |

Le message original m'a vraiment fait hésiter : « Tu n'as pas assez de photos » en plein milieu du profil de quelqu'un d'autre, avec un bouton pour ajouter _mes_ photos. La règle est bonne, on voit autant de photos qu'on en partage, mais le wording ne m'a pas permis de comprendre directement. Je l'ai reformulée pour l'expliquer : « Tu vois autant de photos que tu en partages. »

### 2. La page d'envoi de like

| Original bpm | Superlikes restants | Plus de superlikes |
| ------------ | ------------------- | ------------------ |
|              |                     |                    |

La page originale me semble perfectible, je vous ai donc proposé autre chose. Deux états créés via des mockups : s'il reste des superlikes, le CTA Superlike est mis en avant. Sinon, la page a une redirection pour en obtenir.

## Choix et libertés

- **Logo et icônes custom** le brief ne fournissait pas le logo de bpm pour la tab bar ni le petit icône custom dans les card de type prompt. J'ai donc recréé rapidement le logo de BPM sur Figma au format svg, il est donc pas parfait mais je n'allais pas t'embêter avec ça. Et pour l'icône custom de la card prompt, j'ai mis une alternative de lucide.
- **Couleurs à la pipette** (approximatives) pour celles hors palette du brief : `accentPurple`, `accentPink`, gris des panneaux.
- **Rings sport** : remplissage proportionnel à la fréquence d'entraînement (1-2 → 1/3, 3-4 → 2/3, 5+ → plein), règle inventée, je suis pas sûr que ce soit exactement la bonne.
- **Photo Allowance** Pour pouvoir voir, sur certains profil la card "photos verrouillées", j'ai dû appliquée dans le code une règle avec `VIEWER_UPLOADED_PHOTOS_COUNT = 3` pour que la card "photos verrouillées" apparaissent sur certains profils.
- **Ratio photo fixe ~3:4.**
- **Contrôles inertes** : « Bloquer & Signaler » et « Ajouter mes photos » ne font rien ; boutons du header et tabs hors Accueil mènent à des pages placeholder.
- **Badges statiques** : Likes (4) et Boost (1)
- **Pas de persistance** : l'état du feed vit en mémoire ; pas de fausses mutations like/pass.
- **Enums sûrement pas exhaustifs** : les types sont déduits du seul JSON d'exemple.
- **Cal Sans :** récupérée sur Google Fonts et embarquée dans le projet, réservée aux titres.

## Et avec plus de temps ?

- **Brancher un vrai backend** evidemment. Avec [api.ts](src/features/feed/api.ts) , remplacer le mock client par de vraies requêtes, ajouter les mutations like/pass.
- **Persister** l'état du feed. Aujourd'hui tout est en mémoire sur le tel.
- **Durcir les types**. Les enums méritent une vraie liste exhaustive.
