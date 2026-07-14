import { StyleSheet, View } from 'react-native';

import { LikeButton } from '@/features/feed/components/like-button';
import { SportCardBody } from '@/features/feed/components/sport-card-body';
import type { SportCardContent } from '@/types/feed';
import { COLORS } from '@/utils/colors';

export type SportCardProps = {
  content: SportCardContent;
  onLike: () => void;
};

export function SportCard({ content, onLike }: SportCardProps) {
  return (
    <View style={styles.panel}>
      <SportCardBody content={content} />
      <View style={styles.likeRow}>
        <LikeButton onPress={onLike} overlay={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: COLORS.strokeDefault,
    backgroundColor: COLORS.panel,
    borderRadius: 24,
    padding: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 16,
  },
  likeRow: {
    alignItems: 'flex-end',
  },
});
