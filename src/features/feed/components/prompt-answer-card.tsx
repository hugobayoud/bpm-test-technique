import { Quote } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { LikeButton } from '@/features/feed/components/like-button';
import type { PromptAnswerContent } from '@/types/feed';
import { COLORS } from '@/utils/colors';
import { TITLE_FONT_FAMILY } from '@/utils/fonts';

export type PromptAnswerCardProps = {
  content: PromptAnswerContent;
  onLike: () => void;
};

// content.category (lifestyle/sport) is deliberately not rendered (README note).
export function PromptAnswerCard({ content, onLike }: PromptAnswerCardProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        {/* Same "99" quote glyph as picture prompt headers in the real app;
            lucide Quote filled white is the shared substitution (no asset). */}
        <View style={styles.badge}>
          <Quote color={COLORS.fill} fill={COLORS.fill} size={14} />
        </View>
        <Text style={styles.title}>{content.promptTitle}</Text>
      </View>
      <Text style={styles.answer}>{content.answerText}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.strokeStrong,
  },
  title: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  answer: {
    color: COLORS.fill,
    fontFamily: TITLE_FONT_FAMILY,
    fontSize: 23,
  },
});
