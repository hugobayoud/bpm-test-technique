import { ScrollView, StyleSheet } from 'react-native';

import { InfoCard } from '@/features/feed/components/info-card';
import { LockedPictureCard } from '@/features/feed/components/locked-picture-card';
import { PictureCard } from '@/features/feed/components/picture-card';
import { PromptAnswerCard } from '@/features/feed/components/prompt-answer-card';
import { SportCard } from '@/features/feed/components/sport-card';
import { VIEWER_UPLOADED_PHOTOS_COUNT } from '@/features/feed/constants';
import { applyPhotoAllowance } from '@/features/feed/photo-allowance';
import type { ProfileCard } from '@/types/feed';

export type ProfileCardListProps = {
  cards: ProfileCard[];
};

export function ProfileCardList({ cards }: ProfileCardListProps) {
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
      {allowedCards.map(({ card, locked }) => {
        switch (card.type) {
          case 'picture':
            return locked ? (
              <LockedPictureCard
                imageUrl={card.content.imageUrl}
                key={card.id}
                promptTitle={card.content.promptTitle}
                thumbhash={card.content.thumbhash}
              />
            ) : (
              <PictureCard content={card.content} key={card.id} />
            );
          case 'prompt_answer':
            return <PromptAnswerCard content={card.content} key={card.id} />;
          case 'sport_card':
            return <SportCard content={card.content} key={card.id} />;
          case 'info_card':
            return <InfoCard content={card.content} key={card.id} />;
          case 'locked_picture':
            return (
              <LockedPictureCard
                key={card.id}
                promptTitle={card.content.promptTitle}
                thumbhash={card.content.thumbhash}
              />
            );
          default:
            // Unreachable — every card kind is handled; biome can't tell.
            return null;
        }
      })}
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
    paddingBottom: 24,
    gap: 16,
  },
});
