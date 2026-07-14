import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EMPTY_FEED_MESSAGE, RESTART_LABEL } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';
import { TITLE_FONT_FAMILY } from '@/utils/fonts';

export type FeedEmptyStateProps = {
  onRestart: () => void;
};

export function FeedEmptyState({ onRestart }: FeedEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{EMPTY_FEED_MESSAGE}</Text>
      {/* Demo affordance (user-approved liberty): replays the same feed. */}
      <Pressable
        accessibilityRole="button"
        onPress={onRestart}
        style={styles.restartButton}
      >
        <Text style={styles.restartLabel}>{RESTART_LABEL}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
    padding: 24,
  },
  message: {
    color: COLORS.fill,
    fontFamily: TITLE_FONT_FAMILY,
    fontSize: 24,
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  restartLabel: {
    color: COLORS.fillOpposite,
    fontSize: 15,
    fontWeight: '600',
  },
});
