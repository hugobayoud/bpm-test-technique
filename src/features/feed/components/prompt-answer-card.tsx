import { StyleSheet, View } from 'react-native';

import { LikeButton } from '@/features/feed/components/like-button';
import { PromptAnswerBody } from '@/features/feed/components/prompt-answer-body';
import type { PromptAnswerContent } from '@/types/feed';
import { COLORS } from '@/utils/colors';

export type PromptAnswerCardProps = {
  content: PromptAnswerContent;
  onLike: () => void;
};

export function PromptAnswerCard({ content, onLike }: PromptAnswerCardProps) {
  return (
    <View style={styles.panel}>
      <PromptAnswerBody content={content} />
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
    gap: 20,
  },
  likeRow: {
    alignItems: 'flex-end',
  },
});
