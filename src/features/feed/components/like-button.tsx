import { Heart } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { LIKE_LABEL } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';

export type LikeButtonProps = {
  onPress: () => void;
  // Overlay (default): absolutely pinned to the parent's bottom-right corner
  // (picture cards). Otherwise the button sits in normal flow and the parent
  // card positions it (text cards place it inside the panel, bottom-right).
  overlay?: boolean;
};

export function LikeButton({ onPress, overlay = true }: LikeButtonProps) {
  return (
    <Pressable
      accessibilityLabel={LIKE_LABEL}
      accessibilityRole="button"
      onPress={onPress}
      style={overlay ? styles.overlayButton : styles.button}
    >
      <Heart color={COLORS.fillOpposite} size={22} />
    </Pressable>
  );
}

const baseButton = {
  width: 48,
  height: 48,
  borderRadius: 24,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: COLORS.fill,
} as const;

const styles = StyleSheet.create({
  button: baseButton,
  overlayButton: {
    ...baseButton,
    position: 'absolute',
    bottom: 14,
    right: 14,
  },
});
