import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/utils/colors';

export type CoachBubbleProps = {
  text: string;
  // Waiting-for-the-LLM variant: spinner + muted text.
  pending?: boolean;
};

// Coach-side (left) bubble of the thread: a question, the thinking indicator
// or the final « profil complet » message.
export function CoachBubble({ text, pending = false }: CoachBubbleProps) {
  return (
    <View style={styles.bubble}>
      {pending && <ActivityIndicator color={COLORS.textMuted} size="small" />}
      <Text style={[styles.text, pending && styles.textPending]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    backgroundColor: COLORS.panel,
  },
  text: {
    flexShrink: 1,
    color: COLORS.fill,
    fontSize: 16,
    lineHeight: 22,
  },
  textPending: {
    color: COLORS.textMuted,
  },
});
