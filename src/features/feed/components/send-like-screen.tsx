import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFeed } from '@/features/feed/api';
import { SendLikeHero } from '@/features/feed/components/send-like-hero';
import {
  CANCEL_LABEL,
  GET_SUPERLIKE_LABEL,
  MESSAGE_PLACEHOLDER,
  SEND_LIKE_LABEL,
} from '@/features/feed/constants';
import { useFeedStore } from '@/features/feed/store';
import { COLORS } from '@/utils/colors';

// Send-like modal: the liked card's hero, an optional message and the CTA
// stack. The message is local state only — it dies with the modal on send
// and cancel alike (README liberty: no fake mutation, api.ts stays the
// backend seam).
export function SendLikeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ cardId: string; userId: string }>();
  const { data } = useFeed();
  const likeCard = useFeedStore((state) => state.likeCard);
  const [message, setMessage] = useState('');
  // One send per modal: a rapid double-tap must not pop the navigator twice.
  const sent = useRef(false);

  // Served from the TanStack Query cache: the feed was already fetched by the
  // screen that pushed this modal.
  const profile = data?.profiles.find((p) => p.userId === params.userId);
  const likedCard = profile?.cards.find((c) => c.id === params.cardId);

  const sendLike = (cardId: string) => {
    if (sent.current) {
      return;
    }
    sent.current = true;
    // Fired together: the reaction overlay fades in on the feed underneath
    // while the modal slides down, revealing the animation already playing.
    likeCard(cardId);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 4 }]}>
      {profile && likedCard ? (
        <>
          <SendLikeHero card={likedCard} firstname={profile.firstname} />
          <TextInput
            onChangeText={setMessage}
            placeholder={MESSAGE_PLACEHOLDER}
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="done"
            style={styles.messageInput}
            value={message}
          />
          <View style={styles.spacer} />
          <View style={[styles.ctas, { paddingBottom: insets.bottom + 14 }]}>
            {/* Rendered as designed but inert: 0-Superlikes scope cut, no
                paywall (docs/ui-conventions.md, "Out-of-scope CTAs"). */}
            <Pressable
              accessibilityLabel={GET_SUPERLIKE_LABEL}
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              disabled
              style={styles.getSuperlike}
            >
              <Text style={styles.getSuperlikeLabel}>
                {GET_SUPERLIKE_LABEL}
              </Text>
              <Heart
                color={COLORS.superlike}
                fill={COLORS.superlike}
                size={20}
              />
            </Pressable>
            <Pressable
              accessibilityLabel={SEND_LIKE_LABEL}
              accessibilityRole="button"
              onPress={() => sendLike(likedCard.id)}
              style={({ pressed }) => [
                styles.sendLike,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.sendLikeLabel}>{SEND_LIKE_LABEL}</Text>
            </Pressable>
          </View>
        </>
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
  messageInput: {
    marginTop: 26,
    marginHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.strokeStrong,
    color: COLORS.fill,
    fontSize: 16,
  },
  spacer: {
    flex: 1,
  },
  ctas: {
    paddingHorizontal: 20,
    gap: 22,
  },
  getSuperlike: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 44,
  },
  getSuperlikeLabel: {
    color: COLORS.superlike,
    fontSize: 19,
    fontWeight: '700',
  },
  sendLike: {
    height: 58,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.fill,
  },
  sendLikeLabel: {
    color: COLORS.fillOpposite,
    fontSize: 20,
    fontWeight: '700',
  },
});
