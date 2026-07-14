import { X } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { PASS_LABEL } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';

export type PassButtonProps = {
  onPress: () => void;
};

// Sticky bottom-left over the feed, above the tab bar.
export function PassButton({ onPress }: PassButtonProps) {
  return (
    <Pressable
      accessibilityLabel={PASS_LABEL}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.button}
    >
      <X color={COLORS.fill} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 20,
    bottom: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.strokeStrong,
  },
});
