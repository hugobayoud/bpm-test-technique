// Coach V1 — the repo's only server piece (ADR 0001). Zero-dependency Deno:
// direct fetch to OpenAI Chat Completions in strict Structured Outputs, the
// `fieldKey` enum rebuilt from each request's emptyFields (constrained
// decoding: a filled or unknown field is unrepresentable). Deployed with
// `supabase functions deploy coach --no-verify-jwt` — see ../../README.md.

// ── Wire contract (docs/specs/coach-v1.md § « Le pont ») ────────────────────
// Commented mirror of the client-side types (src/features/coach/types.ts,
// issue 019): this function cannot import src/, keep both sides in phase.

type FilterKey =
  | 'age_range'
  | 'max_distance'
  | 'training_frequency'
  | 'relationship_type';

// Snapshot of the app's Filtres store (src/features/filters/store.ts).
// trainingFrequency/relationshipType are what the user SEEKS, not their
// profile attributes of the same name.
type Filters = {
  ageRange: { min: number; max: number };
  maxDistance: number;
  trainingFrequency: 'little' | 'mid' | 'hard' | null;
  relationshipType: 'exclusive' | 'casual' | 'intimate' | null;
};

// profile = MyProfile flattened client-side + the Filters snapshot. It is
// prompt context only — relayed to the LLM as-is, never validated field by
// field: the structural half of the contract is emptyFields.
type CoachRequest = {
  profile: Record<string, unknown> & { preferences: Filters };
  emptyFields: FilterKey[]; // non-empty, distinct, priority-ordered
};

type CoachResponse = { fieldKey: FilterKey; questionText: string };

// ── Constants ───────────────────────────────────────────────────────────────

const MODEL = 'gpt-4o-mini';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const FILTER_KEYS: readonly FilterKey[] = [
  'age_range',
  'max_distance',
  'training_frequency',
  'relationship_type',
];

// Permissive CORS — harmless for the native app, keeps curl/web debugging easy.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SYSTEM_PROMPT = `Tu es le coach de bpm, une app de rencontres entre sportifs. Tu aides l'utilisateur à compléter ses Filtres de recherche en lui posant une question à la fois.

Les 4 Filtres possibles :
- age_range : la tranche d'âge recherchée (18 à 60 ans)
- max_distance : la distance de recherche maximale (5 à 160 km)
- training_frequency : la fréquence d'entraînement recherchée chez l'autre (little = 1-2, mid = 3-4, hard = 5+ séances par semaine)
- relationship_type : le type de relation recherché (exclusive, casual ou intimate)

Tes règles :
- Choisis UN seul champ parmi ceux de emptyFields, en respectant leur ordre — sauf si un élément fort du profil justifie d'en prioriser un autre.
- Rédige UNE question courte (140 caractères maximum), en français, en tutoyant, sur un ton léger et sportif.
- Le profil décrit ce que la personne EST ; les Filtres décrivent ce qu'elle CHERCHE chez quelqu'un. Ta question porte toujours sur ce qu'elle cherche : trainingFrequency du profil = son propre rythme, le Filtre training_frequency = le rythme recherché chez l'autre.
- Personnalise la question avec le profil (sports, ville, métier…) sans jamais sortir du champ choisi.
- Ne demande jamais de réponse libre : l'utilisateur répondra via un contrôle de l'app.`;

// ── Guards ──────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFilterKey(value: unknown): value is FilterKey {
  return FILTER_KEYS.includes(value as FilterKey);
}

// 400 guard — shallow on profile (prompt context), strict on emptyFields
// (it becomes the response schema enum).
function parseCoachRequest(body: unknown): CoachRequest | null {
  if (!isRecord(body)) return null;
  const { profile, emptyFields } = body;
  if (!isRecord(profile) || !isRecord(profile.preferences)) return null;
  if (!Array.isArray(emptyFields) || emptyFields.length === 0) return null;
  if (!emptyFields.every(isFilterKey)) return null;
  if (new Set(emptyFields).size !== emptyFields.length) return null;
  return { profile, emptyFields } as CoachRequest;
}

// Tier-2 guarantee: re-validate what constrained decoding should already
// enforce; any hole (refusal, truncation, API drift) → 502.
function isCoachResponse(
  value: unknown,
  emptyFields: FilterKey[],
): value is CoachResponse {
  return (
    isRecord(value) &&
    isFilterKey(value.fieldKey) &&
    emptyFields.includes(value.fieldKey) &&
    typeof value.questionText === 'string' &&
    value.questionText.length > 0
  );
}

// ── OpenAI plumbing ─────────────────────────────────────────────────────────

// Constrained decoding: the enum is rebuilt from each request's emptyFields.
function buildResponseFormat(emptyFields: FilterKey[]) {
  return {
    type: 'json_schema',
    json_schema: {
      name: 'coach_question',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          fieldKey: { type: 'string', enum: emptyFields },
          questionText: { type: 'string' },
        },
        required: ['fieldKey', 'questionText'],
        additionalProperties: false,
      },
    },
  };
}

function extractMessageContent(completion: unknown): string | null {
  if (!isRecord(completion) || !Array.isArray(completion.choices)) return null;
  const [choice] = completion.choices;
  if (!isRecord(choice) || !isRecord(choice.message)) return null;
  const { content } = choice.message;
  return typeof content === 'string' ? content : null;
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

// ── Handler ─────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Méthode non autorisée' });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: 'CoachRequest invalide' });
  }
  const request = parseCoachRequest(body);
  if (request === null) {
    return jsonResponse(400, { error: 'CoachRequest invalide' });
  }

  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    return jsonResponse(500, { error: 'Secret OPENAI_API_KEY manquant' });
  }

  const userMessage = `Profil de l'utilisateur (préférences déjà réglées incluses) et champs vides, dans l'ordre de priorité :
${JSON.stringify(request)}`;

  let openaiResponse: Response;
  try {
    openaiResponse = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        response_format: buildResponseFormat(request.emptyFields),
      }),
    });
  } catch {
    return jsonResponse(502, { error: 'OpenAI injoignable' });
  }
  if (!openaiResponse.ok) {
    return jsonResponse(502, { error: `OpenAI HTTP ${openaiResponse.status}` });
  }

  let candidate: unknown;
  try {
    const content = extractMessageContent(await openaiResponse.json());
    candidate = content === null ? null : JSON.parse(content);
  } catch {
    return jsonResponse(502, { error: 'Réponse OpenAI hors contrat' });
  }
  if (!isCoachResponse(candidate, request.emptyFields)) {
    return jsonResponse(502, { error: 'Réponse OpenAI hors contrat' });
  }

  return jsonResponse(200, {
    fieldKey: candidate.fieldKey,
    questionText: candidate.questionText,
  });
});
