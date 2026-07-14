// Types for the profile feed API response.
// See docs/feed-response-example.json for a sample payload.

// ============ Shared vocabularies ============

export type Gender = 'woman' | 'man';

export type TrainingFrequency = 'little' | 'mid' | 'hard';

export type PromptCategory = 'lifestyle' | 'sport';

export type RelationshipType = 'exclusive' | 'casual' | 'intimate';

export type Zodiac =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type Diet =
  | 'omnivore'
  | 'flexitarian'
  | 'vegetarian'
  | 'pescatarian'
  | 'vegan';

// Frequency-style habits: the sample payload only shows a subset of values,
// they likely share a fuller scale (never / sometimes / socially / often)
export type DrinkingHabit = 'never' | 'socially' | 'often';

export type SmokingHabit = 'never' | 'sometimes';

export type DrugsHabit = 'never';

export type KidsIntention =
  | 'want'
  | 'dont_want'
  | 'unsure'
  | 'have'
  | 'have_want_more'
  | 'dont_have';

export type PetsStatus = 'dog' | 'cat' | 'other' | 'none' | 'want';

export type Religion =
  | 'agnostic'
  | 'atheist'
  | 'spiritual'
  | 'christian'
  | 'muslim'
  | 'buddhist'
  | 'other';

// ============ Card contents ============

export interface PictureContent {
  storageKey: string;
  imageUrl: string;
  thumbhash: string;
  promptKey: string | null; // a picture can optionally answer a prompt
  promptTitle: string | null;
}

export interface PromptAnswerContent {
  promptKey: string;
  promptTitle: string;
  answerText: string;
  category: PromptCategory;
}

export interface SportPractice {
  sportKey: string; // open vocabulary ("climbing", "padel", ...)
  sportName: string; // localized display name
  sportIcon: string; // icon identifier ("mountain", "bike", ...)
  trainingFrequency: TrainingFrequency;
}

export interface SportCardContent {
  sports: SportPractice[];
  trainingFrequency: TrainingFrequency; // overall frequency across sports
}

export interface InfoCardContent {
  age: number;
  height: number; // cm
  city: string;
  relationshipType: RelationshipType;
  zodiac: Zodiac;
  diet: Diet;
  drinking: DrinkingHabit;
  smoking: SmokingHabit;
  drugs: DrugsHabit;
  kids: KidsIntention;
  pets: PetsStatus;
  religion: Religion;
  job: string;
  education: string | null;
  originCity: string;
}

// Blurred/teaser picture: no storageKey or imageUrl on purpose
export interface LockedPictureContent {
  thumbhash: string;
  promptTitle: string | null;
}

// ============ Cards (discriminated union) ============

interface BaseCard {
  id: string; // UUID
  position: number; // display order within the profile
}

export interface PictureCard extends BaseCard {
  type: 'picture';
  content: PictureContent;
}

export interface PromptAnswerCard extends BaseCard {
  type: 'prompt_answer';
  content: PromptAnswerContent;
}

export interface SportCard extends BaseCard {
  type: 'sport_card';
  content: SportCardContent;
}

export interface InfoCard extends BaseCard {
  type: 'info_card';
  content: InfoCardContent;
}

export interface LockedPictureCard extends BaseCard {
  type: 'locked_picture';
  content: LockedPictureContent;
}

export type ProfileCard =
  | PictureCard
  | PromptAnswerCard
  | SportCard
  | InfoCard
  | LockedPictureCard;

// Derived from the union so it can never drift out of sync
export type CardType = ProfileCard['type'];

// ============ Top level ============

export interface Profile {
  userId: string; // UUID
  firstname: string;
  age: number;
  city: string;
  height: number; // cm
  gender: Gender;
  cards: ProfileCard[];
}

export interface FeedResponse {
  profiles: Profile[];
}
