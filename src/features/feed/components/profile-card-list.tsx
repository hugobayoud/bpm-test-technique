import { ScrollView, StyleSheet } from 'react-native';

import { InfoCard } from '@/features/feed/components/info-card';
import { PictureCard } from '@/features/feed/components/picture-card';
import { PromptAnswerCard } from '@/features/feed/components/prompt-answer-card';
import { SportCard } from '@/features/feed/components/sport-card';
import type { ProfileCard } from '@/types/feed';

export type ProfileCardListProps = {
  cards: ProfileCard[];
};

export function ProfileCardList({ cards }: ProfileCardListProps) {
  const orderedCards = [...cards].sort((a, b) => a.position - b.position);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
    >
      {orderedCards.map((card) => {
        switch (card.type) {
          case 'picture':
            return <PictureCard content={card.content} key={card.id} />;
          case 'prompt_answer':
            return <PromptAnswerCard content={card.content} key={card.id} />;
          case 'sport_card':
            return <SportCard content={card.content} key={card.id} />;
          case 'info_card':
            return <InfoCard content={card.content} key={card.id} />;
          default:
            // Card kinds without a component yet render nothing (issue 008).
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
