import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFeed } from '@/features/feed/api';
import { SendLikeHero } from '@/features/feed/components/send-like-hero';
import { CANCEL_LABEL } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';

// Send-like modal: the liked card's hero on top, dismiss chip over its
// corner. The message field and CTA stack land in issue 015.
export function SendLikeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ cardId: string; userId: string }>();
  const { data } = useFeed();

  // Served from the TanStack Query cache: the feed was already fetched by the
  // screen that pushed this modal.
  const profile = data?.profiles.find((p) => p.userId === params.userId);
  const likedCard = profile?.cards.find((c) => c.id === params.cardId);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 4 }]}>
      {profile && likedCard ? (
        <SendLikeHero card={likedCard} firstname={profile.firstname} />
      ) : null}
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
