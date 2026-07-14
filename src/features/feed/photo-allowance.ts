import type { ProfileCard } from '@/types/feed';

// A card plus its Photo Allowance verdict. Locked cards render as blurred
// teasers and are never likable ("you can't like what you can't see").
export type AllowedCard = {
  card: ProfileCard;
  locked: boolean;
};

// Photo Allowance (see CONTEXT.md): the viewer sees at most as many pictures
// per profile as they have uploaded themselves. Pictures beyond that
// allowance are demoted to locked rendering; server-sent `locked_picture`
// cards are always locked (and don't consume the allowance); other card
// kinds are never affected. Card order is preserved.
export function applyPhotoAllowance(
  cards: ProfileCard[],
  uploadedPhotosCount: number,
): AllowedCard[] {
  let picturesSeen = 0;

  return cards.map((card) => {
    switch (card.type) {
      case 'picture':
        picturesSeen += 1;
        return { card, locked: picturesSeen > uploadedPhotosCount };
      case 'locked_picture':
        return { card, locked: true };
      default:
        return { card, locked: false };
    }
  });
}
