import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CANCEL_LABEL } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';

// Send-like modal shell: the hero, message field and CTA stack land in later
// slices (013-015). The chip already sits where the hero's top-right corner
// will be, per the approved mockup.
export function SendLikeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel={CANCEL_LABEL}
        accessibilityRole="button"
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.cancelChip,
          { top: insets.top + 20 },
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.cancelLabel}>{CANCEL_LABEL}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  cancelChip: {
    position: 'absolute',
    // Hero horizontal margin (12) + chip inset inside the hero (16).
    right: 28,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.panel,
    zIndex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  cancelLabel: {
    color: COLORS.fill,
    fontSize: 15,
    fontWeight: '600',
  },
});
