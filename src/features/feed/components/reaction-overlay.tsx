import { Heart, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  REACTION_FADE_IN_MS,
  REACTION_FADE_OUT_MS,
  REACTION_HOLD_MS,
} from '@/features/feed/constants';
import type { FeedReaction } from '@/features/feed/store';
import { COLORS } from '@/utils/colors';

export type ReactionOverlayProps = {
  reaction: FeedReaction | null;
  // Fired once the overlay is fully opaque: the swap happens invisibly.
  onSwap: () => void;
};

const ICON_SIZE = 96;
const ICON_ENTRY_SCALE = 0.5;

export function ReactionOverlay({ reaction, onSwap }: ReactionOverlayProps) {
  // Latched copy: the store clears `reaction` at the swap (mid-sequence), but
  // the overlay must keep covering the feed until the fade-out completes.
  const [activeReaction, setActiveReaction] = useState<FeedReaction | null>(
    null,
  );
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (!reaction) {
      return;
    }
    setActiveReaction(reaction);
    opacity.set(0);
    iconScale.set(ICON_ENTRY_SCALE);
    iconScale.set(withSpring(1));
    opacity.set(
      withSequence(
        withTiming(1, { duration: REACTION_FADE_IN_MS }, (finished) => {
          if (finished) {
            runOnJS(onSwap)();
          }
        }),
        withDelay(
          REACTION_HOLD_MS,
          withTiming(0, { duration: REACTION_FADE_OUT_MS }, (finished) => {
            if (finished) {
              runOnJS(setActiveReaction)(null);
            }
          }),
        ),
      ),
    );
  }, [reaction, opacity, iconScale, onSwap]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.get() }],
  }));

  if (!activeReaction) {
    return null;
  }

  // While mounted the overlay covers the feed and swallows every touch, so no
  // reaction input can fire until the sequence is over.
  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Animated.View style={iconStyle}>
        {activeReaction === 'like' ? (
          <Heart
            color={COLORS.primary}
            fill={COLORS.primary}
            size={ICON_SIZE}
          />
        ) : (
          <X color={COLORS.fill} size={ICON_SIZE} strokeWidth={2.5} />
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
});
