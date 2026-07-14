import { Quote } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import type { PromptAnswerContent } from '@/types/feed';
import { COLORS } from '@/utils/colors';
import { TITLE_FONT_FAMILY } from '@/utils/fonts';

export type PromptAnswerCardProps = {
  content: PromptAnswerContent;
};

// content.category (lifestyle/sport) is deliberately not rendered (README note).
export function PromptAnswerCard({ content }: PromptAnswerCardProps) {
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
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: COLORS.panel,
    borderRadius: 24,
    padding: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 20,
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
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  answer: {
    color: COLORS.fill,
    fontFamily: TITLE_FONT_FAMILY,
    fontSize: 26,
    lineHeight: 30,
  },
});
