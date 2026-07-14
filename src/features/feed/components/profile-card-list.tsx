import { ScrollView, StyleSheet, View } from 'react-native';

import { BlockReportPill } from '@/features/feed/components/block-report-pill';
import { InfoCard } from '@/features/feed/components/info-card';
import { LikeButton } from '@/features/feed/components/like-button';
import { LockedPictureCard } from '@/features/feed/components/locked-picture-card';
import { PictureCard } from '@/features/feed/components/picture-card';
import { PromptAnswerCard } from '@/features/feed/components/prompt-answer-card';
import { SportCard } from '@/features/feed/components/sport-card';
import { VIEWER_UPLOADED_PHOTOS_COUNT } from '@/features/feed/constants';
import { applyPhotoAllowance } from '@/features/feed/photo-allowance';
import type { ProfileCard } from '@/types/feed';

export type ProfileCardListProps = {
  cards: ProfileCard[];
  onLikeCard: (cardId: string) => void;
};

// Likable Cards (see CONTEXT.md): unlocked pictures, prompt answers, sport
// cards. Info cards never are; locked pictures aren't either ("you can't
// like what you can't see").
function isLikable(card: ProfileCard, locked: boolean): boolean {
  if (locked) {
    return false;
  }
  return (
    card.type === 'picture' ||
    card.type === 'prompt_answer' ||
    card.type === 'sport_card'
  );
}

function renderCard(card: ProfileCard, locked: boolean) {
  switch (card.type) {
    case 'picture':
      return locked ? (
        <LockedPictureCard
          imageUrl={card.content.imageUrl}
          promptTitle={card.content.promptTitle}
          thumbhash={card.content.thumbhash}
        />
      ) : (
        <PictureCard content={card.content} />
      );
    case 'prompt_answer':
      return <PromptAnswerCard content={card.content} />;
    case 'sport_card':
      return <SportCard content={card.content} />;
    case 'info_card':
      return <InfoCard content={card.content} />;
    case 'locked_picture':
      return (
        <LockedPictureCard
          promptTitle={card.content.promptTitle}
          thumbhash={card.content.thumbhash}
        />
      );
    default:
      // Unreachable — every card kind is handled; biome can't tell.
      return null;
  }
}

export function ProfileCardList({ cards, onLikeCard }: ProfileCardListProps) {
  const orderedCards = [...cards].sort((a, b) => a.position - b.position);
  const allowedCards = applyPhotoAllowance(
    orderedCards,
    VIEWER_UPLOADED_PHOTOS_COUNT,
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
    >
      {allowedCards.map(({ card, locked }) => (
        <View key={card.id}>
          {renderCard(card, locked)}
          {isLikable(card, locked) ? (
            <LikeButton onPress={() => onLikeCard(card.id)} />
          ) : null}
        </View>
      ))}
      <BlockReportPill />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    // Room for the end of the scroll to clear the sticky pass button.
    paddingBottom: 96,
    gap: 16,
  },
});
