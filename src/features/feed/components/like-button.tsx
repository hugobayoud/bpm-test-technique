import { Heart } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { LIKE_LABEL } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';

export type LikeButtonProps = {
  onPress: () => void;
};

// Overlays the bottom-right corner of its parent card (Likable Cards only).
export function LikeButton({ onPress }: LikeButtonProps) {
  return (
    <Pressable
      accessibilityLabel={LIKE_LABEL}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.button}
    >
      <Heart color={COLORS.fillOpposite} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.fill,
  },
});
