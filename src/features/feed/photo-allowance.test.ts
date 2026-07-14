import { describe, expect, it } from 'vitest';

import { applyPhotoAllowance } from '@/features/feed/photo-allowance';
import type {
  InfoCard,
  LockedPictureCard,
  PictureCard,
  ProfileCard,
  PromptAnswerCard,
  SportCard,
} from '@/types/feed';

function pictureCard(position: number): PictureCard {
  return {
    id: `picture-${position}`,
    type: 'picture',
    position,
    content: {
      storageKey: `users/test/pic-${position}.jpg`,
      imageUrl: `https://example.com/pic-${position}.jpg`,
      thumbhash: '1QcSHQRnh493V4dIh4eXh1h4kJUI',
      promptKey: null,
      promptTitle: null,
    },
  };
}

function lockedPictureCard(position: number): LockedPictureCard {
  return {
    id: `locked-${position}`,
    type: 'locked_picture',
    position,
    content: {
      thumbhash: '1QcSHQRnh493V4dIh4eXh1h4kJUI',
      promptTitle: null,
    },
  };
}

function promptAnswerCard(position: number): PromptAnswerCard {
  return {
    id: `prompt-${position}`,
    type: 'prompt_answer',
    position,
    content: {
      promptKey: 'best_travel_story',
      promptTitle: 'Mon meilleur souvenir de voyage',
      answerText: 'Un trek de 5 jours en Patagonie.',
      category: 'lifestyle',
    },
  };
}

function sportCard(position: number): SportCard {
  return {
    id: `sport-${position}`,
    type: 'sport_card',
    position,
    content: {
      sports: [
        {
          sportKey: 'climbing',
          sportName: 'Escalade',
          sportIcon: 'mountain',
          trainingFrequency: 'hard',
        },
      ],
      trainingFrequency: 'hard',
    },
  };
}

function infoCard(position: number): InfoCard {
  return {
    id: `info-${position}`,
    type: 'info_card',
    position,
    content: {
      age: 27,
      height: 168,
      city: 'Paris',
      relationshipType: 'exclusive',
      zodiac: 'leo',
      diet: 'flexitarian',
      drinking: 'socially',
      smoking: 'never',
      drugs: 'never',
      kids: 'want',
      pets: 'dog',
      religion: 'agnostic',
      job: 'Architecte',
      education: null,
      originCity: 'Lyon',
    },
  };
}

describe('applyPhotoAllowance', () => {
  it('demotes pictures beyond the allowance', () => {
    const cards = [
      pictureCard(0),
      pictureCard(1),
      pictureCard(2),
      pictureCard(3),
    ];

    const result = applyPhotoAllowance(cards, 3);

    expect(result.map((entry) => entry.locked)).toEqual([
      false,
      false,
      false,
      true,
    ]);
  });

  it('locks every picture when the allowance is 0', () => {
    const cards = [pictureCard(0), pictureCard(1)];

    const result = applyPhotoAllowance(cards, 0);

    expect(result.map((entry) => entry.locked)).toEqual([true, true]);
  });

  it('locks nothing when pictures exactly fill the allowance', () => {
    const cards = [pictureCard(0), pictureCard(1), pictureCard(2)];

    const result = applyPhotoAllowance(cards, 3);

    expect(result.map((entry) => entry.locked)).toEqual([false, false, false]);
  });

  it('always locks server-sent locked_picture cards', () => {
    const cards = [lockedPictureCard(0)];

    const result = applyPhotoAllowance(cards, 10);

    expect(result[0]?.locked).toBe(true);
  });

  it('does not count locked_picture cards against the allowance', () => {
    const cards = [lockedPictureCard(0), pictureCard(1)];

    const result = applyPhotoAllowance(cards, 1);

    expect(result.map((entry) => entry.locked)).toEqual([true, false]);
  });

  it('never affects non-picture kinds, even with no allowance', () => {
    const cards = [promptAnswerCard(0), sportCard(1), infoCard(2)];

    const result = applyPhotoAllowance(cards, 0);

    expect(result.map((entry) => entry.locked)).toEqual([false, false, false]);
  });

  it('preserves card order and identity', () => {
    const cards: ProfileCard[] = [
      pictureCard(0),
      promptAnswerCard(1),
      pictureCard(2),
      sportCard(3),
      infoCard(4),
      lockedPictureCard(5),
    ];

    const result = applyPhotoAllowance(cards, 1);

    expect(result.map((entry) => entry.card)).toEqual(cards);
  });
});
