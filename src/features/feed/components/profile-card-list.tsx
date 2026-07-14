import { ScrollView, StyleSheet } from 'react-native';

import { PictureCard } from '@/features/feed/components/picture-card';
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
          default:
            // Card kinds without a component yet render nothing (issues 006-008).
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
