import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/utils/colors';

export type AnswerBubbleProps = {
  label: string;
};

// User-side (right) bubble: the validated value of a frozen thread step.
export function AnswerBubble({ label }: AnswerBubbleProps) {
  return (
    <View style={styles.bubble}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    backgroundColor: COLORS.primary,
  },
  label: {
    color: COLORS.fillOpposite,
    fontSize: 16,
    fontWeight: '600',
  },
});
