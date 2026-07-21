import type {
  Diet,
  DrinkingHabit,
  DrugsHabit,
  Gender,
  KidsIntention,
  PetsStatus,
  RelationshipType,
  Religion,
  SmokingHabit,
  TrainingFrequency,
  Zodiac,
} from '@/types/feed';

// ME — the coach's prompt context. No firstname and no userId by construction
// (spec decision on the payload). relationshipType/trainingFrequency are here
// profile ATTRIBUTES (what I am); the Filtres of the same name (what I seek)
// travel separately as `preferences`.
export type MyProfile = {
  age: number;
  city: string;
  height: number;
  gender: Gender;
  job: string;
  education: string | null;
  originCity: string;
  relationshipType: RelationshipType;
  zodiac: Zodiac;
  diet: Diet;
  drinking: DrinkingHabit;
  smoking: SmokingHabit;
  drugs: DrugsHabit;
  kids: KidsIntention;
  pets: PetsStatus;
  religion: Religion;
  sports: string[];
  trainingFrequency: TrainingFrequency;
};

// The feed fixture's Hugo, flattened (info_card spread flat, cards structure
// dropped) + sports added — his fixture profile has no sport_card.
export const MY_PROFILE: MyProfile = {
  age: 29,
  city: 'Marseille',
  height: 178,
  gender: 'man',
  job: 'Chef de projet',
  education: 'Kedge Business School',
  originCity: 'Marseille',
  relationshipType: 'intimate',
  zodiac: 'gemini',
  diet: 'omnivore',
  drinking: 'often',
  smoking: 'sometimes',
  drugs: 'never',
  kids: 'dont_want',
  pets: 'other',
  religion: 'muslim',
  sports: ['climbing', 'running'],
  trainingFrequency: 'mid',
};
