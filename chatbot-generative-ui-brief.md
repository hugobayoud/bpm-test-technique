# Brief : intégrer un chatbot à "UI générative" (le LLM choisit le composant à afficher)

> Document autonome, à donner tel quel à une autre IA. Il ne suppose aucun accès au projet source : tout le contexte, le pattern et le code de référence y sont inclus, avec une section dédiée à l'adaptation pour une app de dating.

## Contexte et objectif

Je construis une application de **dating** en **React Native / Expo**. Je veux un **chatbot** dans lequel, selon le message de l'utilisateur, l'app affiche automatiquement le **bon composant riche** dans le fil de discussion.

Exemples pour une app de dating :

- « Montre-moi des profils près de moi » → composant **carrousel de profils**
- « J'ai un date ce soir, aide-moi » → composant **fiche date / rappel**
- « Donne-moi des idées pour briser la glace avec Camille » → composant **liste d'icebreakers**
- « Analyse ma conversation avec Alex » → composant **résumé de conversation**
- une simple question générale → **texte / markdown**

Je m'inspire d'un projet de référence (Expo + Vercel AI SDK) qui fait exactement ça pour la météo et les films. Ci-dessous : **le pattern exact**, **le code de référence commenté**, puis **comment l'adapter au dating**.

---

## Le principe clé à comprendre

**Ce n'est PAS mon code qui décide quel composant afficher.** Il n'y a aucun `if (message.includes("weather"))`, aucun mapping intention→composant écrit à la main.

C'est le **LLM** qui décide, via le pattern **Generative UI** du **Vercel AI SDK** (fonction `streamUI` du sous-module `ai/rsc`, basé sur les React Server Components).

Le mécanisme :

1. On déclare une liste de **tools** (outils). Chaque tool = une capacité décrite en langage naturel + un schéma de paramètres (Zod) + une fonction `generate` qui **retourne directement un composant React**.
2. On envoie le message de l'utilisateur + un **system prompt** + la liste des tools au modèle via `streamUI`.
3. Le modèle **choisit lui-même** quel tool appeler (ou aucun → réponse texte) et **remplit les paramètres**.
4. La fonction `generate` du tool choisi s'exécute **côté serveur**, va chercher les données, et **renvoie le composant React** correspondant.
5. Le client se contente d'afficher ce composant. **Aucune logique de routage côté client.**

```
Message user → LLM (raisonnement) → choix du tool → generate() → composant React → affiché tel quel
```

Pour ajouter un nouveau type d'affichage, on ajoute juste un tool côté serveur + une mention dans le system prompt. **Le client n'est jamais modifié.**

---

## Stack / dépendances de référence

- `expo` (~54), `expo-router` (~6) avec **support RSC activé** (React Server Components + server actions dans Expo Router)
- `react` **19**, `react-native` 0.81
- `ai` (Vercel AI SDK) **^3.4** — on utilise le sous-module `ai/rsc` (`streamUI`, `createAI`, `getMutableAIState`, `useUIState`, `useAIState`, `useActions`)
- `@ai-sdk/openai` (^0.0.72) — provider OpenAI
- `zod` — schémas de paramètres des tools

> Note importante : `streamUI` + `createAI` nécessitent que les **React Server Components** et les **server actions** soient activés (ici via Expo Router RSC). Le fichier serveur porte `"use server"` / `"server-only"`, les composants interactifs portent `"use client"`.

---

## Concepts d'état du AI SDK RSC

Deux états parallèles, gérés par `createAI` :

- **AIState** : l'historique _textuel_ de la conversation, renvoyé au modèle à chaque tour (rôles `user` / `assistant`, contenu texte). C'est la "mémoire" du LLM.
- **UIState** : la liste des _nœuds React_ affichés à l'écran. Chaque entrée = `{ id, display: React.ReactNode }`. C'est ce que l'utilisateur voit.

Le client lit l'UIState (`useUIState`) et fait simplement `messages.map(m => m.display)`.

---

## Code de référence commenté (à adapter)

### 1) Le cœur : contexte AI + tools (fichier serveur)

C'est LE fichier qui décide de tout. (Version d'origine : météo + films. Structure exacte à réutiliser.)

```tsx
// ai-context.tsx  — fichier SERVEUR
import type { CoreMessage } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import "server-only";
import { z } from "zod";

import { openai } from "@ai-sdk/openai";

// Les composants riches que le LLM peut choisir d'afficher :
import { WeatherCard } from "./weather";
import { MoviesCard, MoviesSkeleton } from "./movies/movie-card";
import MarkdownText from "./markdown-text";

// Les fonctions de récupération de données :
import { getWeatherAsync } from "./weather-data";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

// Server action appelée à CHAQUE message utilisateur.
export async function onSubmit(message: string) {
  "use server";

  const aiState = getMutableAIState();

  // 1. On ajoute le message user à l'historique textuel (AIState).
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      { id: nanoid(), role: "user", content: message },
    ],
  });

  // 2. On appelle streamUI : c'est ici que le LLM choisit un tool.
  const result = await streamUI({
    model: openai("gpt-4o-mini-2024-07-18"),
    messages: [
      {
        role: "system",
        // Le system prompt DÉCRIT les capacités = influence le choix du LLM.
        content: `\
You are a helpful chatbot assistant.
You have the following tools available:
- get_media: Lists or searches movies and TV shows.
- get_weather: Gets the weather for a city.
`,
      },
      // On rejoue tout l'historique pour donner le contexte au modèle.
      ...aiState.get().messages.map((m: any) => ({
        role: m.role,
        content: m.content,
        name: m.name,
      })),
    ],

    // 3a. Cas "pas de tool" : le modèle répond en texte → on rend du markdown.
    text: ({ content, done }) => {
      if (done) {
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            { id: nanoid(), role: "assistant", content },
          ],
        });
      }
      return <MarkdownText done={done}>{content}</MarkdownText>;
    },

    // 3b. Les TOOLS : chaque clé = un composant potentiel.
    tools: {
      get_weather: {
        description: "Get the current weather for a city",
        parameters: z
          .object({
            city: z.string().describe("the city to get the weather for"),
          })
          .required(),
        // generate est un GÉNÉRATEUR async :
        // - yield = état de chargement (skeleton) affiché immédiatement
        // - return = composant final avec les données
        async *generate({ city }) {
          yield <WeatherCard city={city} />;               // loading
          const weatherInfo = await getWeatherAsync(city); // fetch data
          return <WeatherCard city={city} data={weatherInfo} />; // final
        },
      },

      get_media: {
        description: "List movies or TV shows",
        parameters: z
          .object({
            media_type: z.enum(["tv", "movie"]).default("movie"),
            query: z.string().optional(),
            generated_description: z
              .string()
              .describe("AI-generated description of the tool call"),
          })
          .required(),
        async *generate({ media_type, query, generated_description }) {
          yield <MoviesSkeleton />;
          const movies = await fetchMovies(media_type, query); // ta fonction
          return <MoviesCard data={movies} title={generated_description} />;
        },
      },
    },
  });

  // 4. On renvoie le nœud React streamé, qui ira dans l'UIState côté client.
  return { id: nanoid(), display: result.value };
}

const nanoid = () => Math.random().toString(36).slice(2);

// Types d'état
export type Message = CoreMessage & { id: string };
export type AIState = { chatId: string; messages: Message[] };
export type UIState = { id: string; display: React.ReactNode }[];

// Enregistrement des actions + états initiaux.
const actions = { onSubmit } as const;

export const AI = createAI<AIState, UIState, typeof actions>({
  actions,
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
});
```

**Points cruciaux :**

- Le LLM choisit le tool en se basant sur le **system prompt** ET la **`description`** de chaque tool ET les **`.describe()`** des paramètres Zod. Ces textes sont ta seule "programmation" du routage → soigne-les.
- `generate` est un `async function*` (générateur) : le `yield` sert au **skeleton/loading** instantané, le `return` au **rendu final** après fetch. Effet "chargement → résultat" gratuit.
- On peut construire des tools **conditionnellement** (ex. un tool réservé au natif : `if (process.env.EXPO_OS !== "web") { tools.xxx = {...} }`) avant de les passer à `streamUI`.

### 2) Wiring RSC (provider + écran)

```tsx
// render-root.tsx  — SERVEUR
"use server";
import { AI } from "@/components/ai-context";
import { ChatUI } from "@/components/chatui";

export async function renderRoot() {
  return (
    <AI>
      {/* provider créé par createAI : fournit AIState + UIState + actions */}
      <ChatUI />
    </AI>
  );
}
```

```tsx
// app/index.tsx  — point d'entrée
/// <reference types="react/canary" />
import { renderRoot } from "@/actions/render-root";
import React from "react";

export default function Index() {
  return <React.Suspense fallback={<Loading />}>{renderRoot()}</React.Suspense>;
}
```

### 3) Affichage (client) — aucune logique de routage

```tsx
// chatui.tsx  — CLIENT ("use client")
import { useUIState } from "ai/rsc";
import { View } from "react-native";
import { AI } from "./ai-context";

function MessagesScrollView() {
  const [messages] = useUIState<typeof AI>();
  return (
    <ScrollView>
      {messages.map((message) => (
        <View key={message.id}>{message.display}</View> // on affiche tel quel
      ))}
    </ScrollView>
  );
}
```

### 4) Envoi d'un message (client)

```tsx
// chat-toolbar.tsx  — CLIENT ("use client")
import { useActions, useUIState } from "ai/rsc";

// dans le composant :
const [messages, setMessages] = useUIState<typeof AI>();
const { onSubmit } = useActions<typeof AI>();

const onSubmitMessage = (value: string) => {
  // a) affiche tout de suite la bulle utilisateur
  setMessages((cur) => [
    ...cur,
    { id: nanoid(), display: <UserMessage>{value}</UserMessage> },
  ]);

  // b) appelle la server action ; la réponse est { id, display } → on l'ajoute
  onSubmit(value).then((responseMessage) => {
    setMessages((cur) => [...cur, responseMessage]);
  });
};
```

C'est tout le cycle. Résumé du flux :

```
User tape un message
  → chat-toolbar: setMessages(+ bulle user) ; onSubmit(value)   [client]
    → ai-context.onSubmit: update AIState ; streamUI(...)        [serveur]
       → LLM choisit un tool + params
         → tool.generate(): yield <Skeleton/> ; fetch ; return <Card data/>
    → renvoie { id, display }
  → chat-toolbar: setMessages(+ réponse)
    → chatui: messages.map(m => m.display)                       [client]
```

---

## Adaptation pour l'app de dating

Garde **exactement** la même architecture. Tu ne changes que : (a) le **system prompt**, (b) la **liste des tools**, (c) les **composants** riches, (d) les **fonctions de data**.

### System prompt suggéré

```
You are the in-app assistant for a dating app. You help the user discover
profiles, prepare for dates, and improve their conversations.
Available tools:
- browse_profiles: Show a carousel of suggested profiles matching criteria.
- get_icebreakers: Generate opening-message ideas for a given match.
- date_plan: Suggest date ideas for a city / vibe / budget.
- conversation_coach: Summarize and give advice on a conversation with a match.
Use a tool when it produces a better experience than plain text.
Only answer in plain text for general questions.

User info:
- name: <injecté>
- city: <injecté>
- preferences: <injecté>
```

### Tools suggérés (à mettre dans `tools: { ... }`)

```tsx
tools: {
  browse_profiles: {
    description:
      "Show a carousel of suggested dating profiles. Use when the user " +
      "wants to see, browse, or filter people to date.",
    parameters: z.object({
      max_distance_km: z.number().default(25),
      age_min: z.number().optional(),
      age_max: z.number().optional(),
      interests: z.array(z.string()).optional()
        .describe("interests to prioritize, e.g. ['climbing','jazz']"),
    }).required(),
    async *generate({ max_distance_km, age_min, age_max, interests }) {
      yield <ProfilesSkeleton />;
      const profiles = await fetchProfiles({ max_distance_km, age_min, age_max, interests });
      return <ProfilesCarousel data={profiles} />;
    },
  },

  get_icebreakers: {
    description:
      "Generate opening-message ideas to start a conversation with a match. " +
      "Use when the user asks how to start / what to say to someone.",
    parameters: z.object({
      match_name: z.string().describe("the name of the match"),
      match_id: z.string().optional(),
      tone: z.enum(["funny", "flirty", "sincere", "casual"]).default("casual"),
    }).required(),
    async *generate({ match_name, match_id, tone }) {
      yield <IcebreakersSkeleton />;
      const ideas = await generateIcebreakers({ match_name, match_id, tone });
      return <IcebreakersList matchName={match_name} ideas={ideas} />;
    },
  },

  date_plan: {
    description:
      "Suggest concrete date ideas for a city/vibe/budget. Use when the " +
      "user is planning or preparing a date.",
    parameters: z.object({
      city: z.string(),
      vibe: z.enum(["chill", "adventurous", "romantic", "fun"]).default("chill"),
      budget: z.enum(["low", "medium", "high"]).default("medium"),
    }).required(),
    async *generate({ city, vibe, budget }) {
      yield <DatePlanSkeleton />;
      const ideas = await fetchDateIdeas({ city, vibe, budget });
      return <DatePlanCard city={city} vibe={vibe} ideas={ideas} />;
    },
  },

  conversation_coach: {
    description:
      "Summarize a conversation with a match and give improvement advice. " +
      "Use when the user asks to analyze/improve a chat with someone.",
    parameters: z.object({
      match_id: z.string(),
    }).required(),
    async *generate({ match_id }) {
      yield <CoachSkeleton />;
      const analysis = await analyzeConversation(match_id); // ta logique / un 2e appel LLM
      return <ConversationCoachCard data={analysis} />;
    },
  },
}
```

Chaque composant (`ProfilesCarousel`, `IcebreakersList`, `DatePlanCard`, `ConversationCoachCard`) est un composant React Native standard qui accepte des props optionnelles pour gérer l'état de chargement (props `data` absentes = skeleton), exactement comme le `WeatherCard` de référence :

```tsx
export function ProfilesCarousel({ data }: { data?: Profile[] }) {
  if (!data) return <ProfilesSkeleton />;
  return (
    <ScrollView horizontal>
      {data.map((p) => (
        <ProfileCard key={p.id} profile={p} />
      ))}
    </ScrollView>
  );
}
```

### Ce qu'il NE faut PAS faire

- Ne mets aucune détection d'intention à la main côté client (pas de regex sur le message).
- Ne modifie pas `chatui.tsx` quand tu ajoutes un composant : le rendu reste `messages.map(m => m.display)`.
- Ne fais pas les appels API sensibles côté client : tout se passe dans `generate` (serveur), où tu as accès aux clés API et à la DB.

---

## Checklist pour ajouter un nouveau composant piloté par le chatbot

1. Créer le composant React Native (avec un état skeleton via props optionnelles).
2. Créer la/les fonction(s) de récupération de données (serveur).
3. Ajouter une entrée dans `tools: { ... }` : `description` claire + `parameters` Zod avec `.describe()` explicites + `generate` (`yield` skeleton → `return` composant final).
4. Mentionner le tool dans le **system prompt**.
5. Rien d'autre. Tester en formulant la demande en langage naturel.

---

## Questions ouvertes (pour l'IA qui recevra ce brief)

1. Comment gérer la **sécurité / autorisation** dans `generate` (l'utilisateur ne doit voir que les profils/conversations autorisés) ? Comment passer l'identité de l'utilisateur au serveur (headers, session) ?
2. Comment gérer les **erreurs** d'un tool (fetch qui échoue) pour afficher une carte d'erreur plutôt que de casser le stream ?
3. Est-ce viable en **production Expo** (RSC + server actions) ou faut-il un backend séparé exposant `streamUI` ?
4. Comment **tester** le choix des tools par le LLM de façon déterministe ?
