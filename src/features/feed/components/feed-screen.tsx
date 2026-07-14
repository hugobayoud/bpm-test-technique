import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFeed } from '@/features/feed/api';
import { FeedEmptyState } from '@/features/feed/components/feed-empty-state';
import { PassButton } from '@/features/feed/components/pass-button';
import { ReactionOverlay } from '@/features/feed/components/reaction-overlay';
import { FEED_ERROR_MESSAGE } from '@/features/feed/constants';
import { isFeedFinished, useFeedStore } from '@/features/feed/store';
import { COLORS } from '@/utils/colors';
import { FeedHeader } from './feed-header';
import { ProfileCardList } from './profile-card-list';

export function FeedScreen() {
  const insets = useSafeAreaInsets();
  const { data, isPending } = useFeed();
  const currentProfileIndex = useFeedStore(
    (state) => state.currentProfileIndex,
  );
  const reaction = useFeedStore((state) => state.reaction);
  const likeCard = useFeedStore((state) => state.likeCard);
  const passProfile = useFeedStore((state) => state.passProfile);
  const advance = useFeedStore((state) => state.advance);
  const restart = useFeedStore((state) => state.restart);

  const profiles = data?.profiles ?? [];
  const currentProfile = profiles.at(currentProfileIndex);
  const finished =
    isFeedFinished(currentProfileIndex, profiles.length) && profiles.length > 0;

  // The overlay renders in every branch: the last profile's reaction must
  // fade out onto the empty state, not unmount with the feed.
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {isPending ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.fill} size="large" />
        </View>
      ) : finished ? (
        <View style={styles.centered}>
          <FeedEmptyState onRestart={restart} />
        </View>
      ) : !currentProfile ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{FEED_ERROR_MESSAGE}</Text>
        </View>
      ) : (
        <>
          <FeedHeader firstname={currentProfile.firstname} />
          {/* Keyed remount on profile change resets the scroll to the top. */}
          <ProfileCardList
            cards={currentProfile.cards}
            key={currentProfile.userId}
            onLikeCard={likeCard}
          />
          <PassButton onPress={() => passProfile(currentProfile.userId)} />
        </>
      )}
      {/* Advancing happens mid-overlay, once it is fully opaque. */}
      <ReactionOverlay onSwap={advance} reaction={reaction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: COLORS.textMuted,
    fontSize: 15,
  },
});
