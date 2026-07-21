# Recherche : le paysage des assistants d'app de rencontre

> Scan produit (pas technique) des features « assistant IA / compagnon non-chatbot » dans les apps de rencontre, avec priorité sur Hily.
> Méthode : ~10 recherches web + fetch de reviews, press releases et pages officielles.
> **Étiquettes de confiance** utilisées partout : **[Vérifié]** (confirmé par review/presse/page officielle) · **[Inféré]** (lecture la mieux étayée, non affirmée noir sur blanc) · **[Non confirmé]** (n'a pas pu être établi).

---

## Hily — l'assistant

### Verdict rapide sur la prémisse (« un assistant qui ressemble à un chatbot sans en être un »)

**[Non confirmé]** — Aucune source publique (reviews hands-on, App Store/Play, presse, page Hily) ne documente une surface unique et nommée de type « chatbot » chez Hily : pas d'écran conversationnel dédié, pas de compagnon IA en texte libre, pas de compte-bot « Team Hily » qui vous écrit des conseils. J'ai cherché explicitement ces trois hypothèses ; rien ne les confirme.

**[Inféré]** — La lecture la mieux étayée de la prémisse : chez Hily, l'« assistant » n'est **pas un LLM en texte libre** mais une **assistance guidée, par cartes/quick-replies, dispersée dans le flux** (des amorces de conversation proposées dans le chat, un quiz de compatibilité au format conversationnel, des « stories » de compatibilité). C'est exactement une expérience *chatbot-like sans vrai chatbot* : ça a l'air conversationnel et personnalisé, mais l'utilisateur **choisit parmi des options préparées**, il ne dialogue pas librement. C'est le sens le plus défendable de la description du ticket — à confirmer par un test in-app.

### Où ça vit / à quoi ça ressemble

- **Dans le chat, après un match** : Hily fait remonter les intérêts communs et propose des amorces de conversation prêtes à l'emploi — compliment, « pick-up line », ou question. L'utilisateur peut envoyer l'amorce suggérée **ou** écrire la sienne. **[Vérifié]** (beyondages, mindbodygreen, vidaselect)
- **À l'onboarding / sur le profil** : un **quiz de compatibilité** (~50 questions, branding « Icks & Clicks ») + un **score de synastrie zodiacale** « fun » ; le score et les points de connexion s'affichent ensuite sur les profils. **[Vérifié]** (mindbodygreen, Wikipedia/Grokipedia résumé, hily.com)
- **En fond (pas une surface d'assistant)** : matching comportemental qui réordonne le feed « Discover » selon la façon dont vous interagissez (profondeur des échanges, temps passé, mots choisis). C'est un moteur passif, pas un assistant visible. **[Vérifié]** (qwe.edu.pl, vidaselect)
- **Modération** : « Consent Guard » / filtre IA (oct. 2025) qui scanne les messages sortants explicites et exige l'opt-in du destinataire. **[Vérifié]** (recherche presse, qwe.edu.pl)

### Modèle d'interaction : **guidé, pas libre**

**[Vérifié]** — Toutes les interactions « assistées » observées sont **sélectives** : on pioche une amorce dans une liste, on répond à un quiz à choix. **[Inféré]** — Aucune preuve d'une saisie en langage naturel adressée à une IA de coaching. Le ressenti « conversationnel » vient du **format** (bulles, questions, cartes), pas d'un vrai dialogue génératif ouvert.

### Types de contenu / interactions offerts

- Amorces de conversation (compliments, questions, pick-up lines) **[Vérifié]**
- Quiz de personnalité/compatibilité + score de synastrie astro **[Vérifié]**
- « Compatibility stories » / points communs mis en avant pour donner de quoi parler **[Vérifié]**
- Conseils de profil (ajouter photos, bio, « interest badges » qui nourrissent le feed) — délivrés par la **structure de l'app**, pas par un coach conversationnel **[Vérifié]**
- **[Non confirmé]** : récaps d'activité personnalisés, perks offerts par un « assistant », tips quotidiens poussés par un bot.

### Monétisation

**[Vérifié]** — Le modèle est **freemium avec l'assistance guidée comme hameçon d'engagement puis d'upsell** :
- **Premium ~14,99 $/mois** (vidaselect).
- Éléments paywalled qui s'appuient sur les features « assistant » : **résultats complets du quiz de compatibilité** verrouillés derrière l'abonnement ; **checks de compatibilité rationnés** (~2/jour en gratuit) ; **Mega Crushes** (super-like) réservés au Premium ou gagnés via « Roulette » ; **déflouter** au-delà des ~20 premiers likes (mindbodygreen, qwe.edu.pl).
- **[Inféré]** — Le quiz « donne » un aperçu de valeur gratuitement (score, teasers) puis **monétise la suite** (résultats complets, plus de checks). Les amorces de conversation, elles, restent gratuites : elles servent l'activation/rétention plutôt que la conversion directe.

### Ton — et le pivot stratégique « Human Intelligence »

- **[Vérifié]** — Ton « purposeful / intentional », anti-swipe compulsif : Hily se vend comme « date as you are », sans pression de perfection (mindbodygreen).
- **[Vérifié] — Point le plus décisionnel** : en mai 2026 Hily a fait un **pivot marketing anti-IA**, rebrandant sa techno en « **Human Intelligence (HI)** » (jeu de mots assumé). Motif : leur *T.R.U.T.H. Report* (août 2025) montre que **69 % de la Gen Z et 74 % des Millennials estiment que l'IA rend la rencontre moins authentique**, et que **54 % des femmes / 63 % des hommes seraient moins attirés** par un match utilisant profil/contenu générés par IA (Global Dating Insights).
- **[Vérifié]** — Philosophie officielle (CPO Liubomyr Pivtorak) : utiliser la techno **là où elle aide** (ex. aide à la bio) mais **ne pas remplacer** le cœur humain de la connexion. Autrement dit : chez Hily, l'assistant reste **discret, utilitaire, et n'automatise pas l'échange**.

> Implication pour bpm : le positionnement le plus « on-trend » n'est pas « un ChatGPT dans l'app » mais **une aide guidée, honnête et bornée qui laisse l'utilisateur maître de sa voix**.

---

## Panorama comparatif

| App | Ce que fait l'« assistant » | Guidé vs libre | Monétisation |
|---|---|---|---|
| **Hily** | Amorces de conversation, quiz de compatibilité + synastrie, matching comportemental, filtre de consentement. Positionnement affiché « Human Intelligence » (anti-IA). **[Vérifié]** | **Guidé** (cartes/quiz), pas de texte libre **[Inféré]** | Freemium ~14,99 $/mois ; quiz complet + checks + Mega Crush payants |
| **Tinder** | **Photo Selector** (choisit vos meilleures photos depuis la pellicule) ; **Chemistry** (questions interactives + accès optionnel à la pellicule pour inférer hobbies → meilleurs matchs, pilier 2026) ; nudge « Are you sure? » avant message offensant. **[Vérifié]** | **Guidé** (sélection, questions), IA en coulisse | Rétention/abo (Tinder+/Gold/Platinum) ; Chemistry = pilier produit 2026 pour enrayer la chute d'abonnés |
| **Bumble** | **Opening Moves** (la femme pose un prompt, l'autre y répond) ; **icebreakers IA** (Bumble for Friends) ; **Deception Detector** (bloque 95 % des faux profils détectés) ; **vision « AI dating concierge »** (Whitney Wolfe Herd) : un agent qui filtre les matchs, voire « date » d'autres agents. **[Vérifié]** ; concierge = **vision, pas produit livré [Non confirmé]** | **Guidé** (prompts, suggestions) ; concierge envisagé plus autonome | Abo Premium/Boost ; sécurité (Deception Detector) comme argument de confiance |
| **Hinge** | **Prompt Feedback** (jan. 2025) : première feature de coaching IA — note vos réponses de profil en 3 paliers (« Great Answer » / « Try a Small Change » / « Go a Little Deeper »). **Ne rédige pas à votre place**, guidé par des PhD en sciences comportementales, privé, ignorable. **[Vérifié]** | **Guidé** (feedback, pas de génération de texte) | Rattaché à l'abo/qualité de profil ; pas de facturation à l'acte de la feature |
| **Grindr** | **AI Wingman** (beta, ~10 000 users, rollout visé 2027) : rédige des réponses, aide à planifier des dates, à terme **gère des conversations entières**. **[Vérifié]** | **Libre / agentique** (l'IA écrit à votre place) | Premium ; un pilote aurait testé un palier à **499,99 $** — signal d'automatisation « haut de gamme » |
| **Rizz** (app tierce, hors app de rencontre) | Wingman IA de poche : on **upload un screenshot** de conversation, l'IA **suggère une réponse** générée. **[Vérifié]** | **Libre** (génération de réponse) | Abo/achat ; positionné « coach à petit prix 24/7 » |

*Autres cités (non approfondis) : Keepler (aide aux conversations difficiles, anti-ghosting) ; Match Group pousse plus largement l'IA de matching. Iris / Volar évoqués comme apps « AI-first » mais non vérifiés en détail ici — voir Incertitudes.*

---

## Patterns qui bâtissent le lien (donner de la valeur d'abord)

1. **Donner de la valeur avant de demander quoi que ce soit.** Les amorces gratuites de Hily, le Prompt Feedback gratuit de Hinge, le Photo Selector de Tinder résolvent un vrai point de douleur (« je ne sais pas quoi écrire/quelle photo choisir » — 63 % des daters Hinge, 52 % des users Tinder) **sans paywall immédiat**. **[Vérifié]**
2. **Coacher sans se substituer à l'utilisateur.** Hinge affiche explicitement « keeping your voice » : l'IA nudge mais **ne dicte pas** le texte. Un user de Rizz résume le bon usage : « juste initier la conversation… puis pouvoir être moi-même ensuite ». L'IA comme **tremplin**, pas comme remplaçant. **[Vérifié]**
3. **Format guidé = friction faible + confiance.** Cartes/quick-replies/quiz donnent l'impression d'un compagnon intelligent tout en restant prévisibles, rapides, non intimidants (utile pour introvertis / retours de rupture, souvent cités en positif sur Hily). **[Vérifié]**
4. **L'IA « au service de la sécurité/authenticité »** construit de la confiance : Deception Detector (Bumble), Consent Guard (Hily), nudge « Are you sure? » (Tinder) — l'IA protège l'utilisateur plutôt que de le manipuler. **[Vérifié]**
5. **Transparence et contrôle** : feature privée, conseils ignorables, opt-in (Hinge, Consent Guard). L'utilisateur reste **maître**. **[Vérifié]**
6. **Cadrage émotionnel « de ton côté, sans arrière-pensée »** (Keepler) : un ton d'allié objectif, pas de vendeur. **[Vérifié]**

---

## Anti-patterns (le « mauvais ChatGPT » / le creepy)

1. **Le plus gros risque — l'inauthenticité perçue.** 69 % Gen Z / 74 % Millennials trouvent que l'IA rend la rencontre moins authentique ; 54 % des femmes / 63 % des hommes sont **moins attirés** par un match qui utilise du contenu IA. Un assistant qui **écrit à la place** de l'utilisateur se retourne contre lui : des users Rizz rapportent que leurs matchs deviennent **méfiants** en apprenant le coaching IA en coulisses. **[Vérifié]** → *C'est l'anti-pattern n°1 à éviter.*
2. **Substituer au lieu de supplémenter.** L'experte Kasley Killam : le risque est « d'utiliser l'IA comme substitut à la connexion humaine plutôt que comme complément ». La dépendance tue l'apprentissage/la croissance personnelle (coach Julie Nguyen). **[Vérifié]**
3. **Automatisation totale / agentique = creepy.** Le Wingman de Grindr qui « gère des conversations entières », ou les concierges Bumble qui « dateraient » entre eux : fascinant en démo, mais glisse vers le **catfishing** et le « qui parle vraiment ? ». **[Vérifié pour l'existence des visions ; réception négative = [Inféré]]**
4. **Le « bad ChatGPT » générique** : réponses fades, pick-up lines clichées, ton robotique. Hily elle-même vend l'anti-thèse (« date as you are »). Un assistant en **texte libre non borné** risque de produire du contenu hors-sujet, plat, ou embarrassant. **[Inféré]**
5. **Extraction de données intime perçue comme intrusive.** Tinder Chemistry / Photo Selector demandent l'accès à la **pellicule** — presse et users y voient un signal d'« app qui veut vos photos » sur fond de chute d'abonnés. Demander trop de données privées pour « personnaliser » érode la confiance. **[Vérifié pour la couverture presse ; ampleur du rejet = [Inféré]]**
6. **Monétiser le moment de vulnérabilité.** Verrouiller les résultats d'un quiz émotionnel, ou un palier à 499,99 $ pour « automatiser sa vie amoureuse », fait passer l'assistant de conseiller à **machine à upsell**. À bien doser : la valeur d'abord, la vente ensuite. **[Inféré à partir des faits vérifiés de pricing]**

---

## Sources

- Hily — reviews & specs : https://www.vidaselect.com/hily-dating-app-review · https://beyondages.com/hily-review/ · https://www.mindbodygreen.com/articles/hily-dating-app-review · https://tawkify.com/blog/dating-methods/hily-dating-app-reviews · https://www.qwe.edu.pl/tutorial/hily-dating-app-ai-features-guide/
- Hily — positionnement « Human Intelligence » / stats T.R.U.T.H. : https://www.globaldatinginsights.com/featured/hily-emphasizes-human-intelligence-rather-than-ai-in-dating-apps/ · (satire officielle) https://hily.com/data/hily-reintroduces-its-hi-powered-finder-and-chats/
- Tinder : https://www.tinderpressroom.com/Tinder-R-Unveils-Photo-Selector-AI-Feature-to-Make-Choosing-Profile-Pictures-Easier · https://techcrunch.com/2025/11/05/tinder-to-use-ai-to-get-to-know-users-tap-into-their-camera-roll-photos/ · https://www.help.tinder.com/hc/en-us/articles/34723594883213-AI-powered-matching
- Bumble : https://bumble.com/en-us/the-buzz/bumble-deception-detector · https://www.techtimes.com/articles/304547/20240512/bumble-founder-sees-app-using-ai-powered-dating-concierges.htm
- Hinge : https://hinge.co/newsroom/prompt-feedback · https://help.hinge.co/hc/en-us/articles/30558825479315-How-Prompt-Feedback-Works · https://techcrunch.com/2025/01/15/hinge-new-ai-feature-determines-if-your-prompt-response-is-too-basic/
- Grindr / Rizz / patterns de confiance : https://www.cbsnews.com/news/ai-dating-assistants-rizz-keepler-hinge-grindr/ · https://apps.apple.com/mm/app/rizz-app-ai-wingman/id6505082641

---

## Incertitudes (ce que je n'ai PAS pu confirmer)

- **La prémisse centrale du ticket.** Je n'ai **pas** trouvé de surface unique et nommée « assistant type chatbot » chez Hily. La lecture la mieux étayée = **assistance guidée par cartes/quiz dispersée dans le flux** (pas un LLM en texte libre). À **valider par un test in-app réel** (App Store screenshots, run de l'app) — les reviews publiques ne descendent pas à ce niveau de détail d'UI.
- **Existence d'un compte-bot / « Team Hily »** qui pousserait des tips conversationnels : recherché, **non confirmé**.
- **Récaps d'activité personnalisés et perks offerts par un assistant** chez Hily : non confirmés.
- **Pricing exact** des paliers Hily au-delà du ~14,99 $/mois cité par une seule review ; à re-vérifier sur les stores (variable par marché/promo).
- **Réception réelle** (churn/satisfaction) des features agentiques (Grindr Wingman, concierge Bumble) : ce sont surtout des **visions/betas** ; l'impact utilisateur est inféré, pas mesuré.
- **Iris / Volar** : cités dans la littérature « AI dating » mais non approfondis faute de sources fiables dans ce scan — à traiter dans une passe dédiée si besoin.
- Détail d'UI de **Tinder Chemistry** (déployé NZ/AU) : connu par la presse, pas testé de première main ici.
