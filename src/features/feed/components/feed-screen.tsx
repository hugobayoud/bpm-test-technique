import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFeed } from '@/features/feed/api';
import { FeedEmptyState } from '@/features/feed/components/feed-empty-state';
import { PassButton } from '@/features/feed/components/pass-button';
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
  const likeCard = useFeedStore((state) => state.likeCard);
  const passProfile = useFeedStore((state) => state.passProfile);
  const advance = useFeedStore((state) => state.advance);
  const restart = useFeedStore((state) => state.restart);

  if (isPending) {
    return (
      <View
        style={[styles.container, styles.centered, { paddingTop: insets.top }]}
      >
        <ActivityIndicator color={COLORS.fill} size="large" />
      </View>
    );
  }

  const profiles = data?.profiles ?? [];
  const currentProfile = profiles.at(currentProfileIndex);

  if (
    isFeedFinished(currentProfileIndex, profiles.length) &&
    profiles.length > 0
  ) {
    return (
      <View
        style={[styles.container, styles.centered, { paddingTop: insets.top }]}
      >
        <FeedEmptyState onRestart={restart} />
      </View>
    );
  }

  if (!currentProfile) {
    return (
      <View
        style={[styles.container, styles.centered, { paddingTop: insets.top }]}
      >
        <Text style={styles.errorText}>{FEED_ERROR_MESSAGE}</Text>
      </View>
    );
  }

  // Advancing is instant for now: the reaction overlay issue (010) will play
  // its animation between the reaction and advance().
  const handleLikeCard = (cardId: string) => {
    likeCard(cardId);
    advance();
  };

  const handlePass = () => {
    passProfile(currentProfile.userId);
    advance();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FeedHeader firstname={currentProfile.firstname} />
      {/* Keyed remount on profile change resets the scroll to the top. */}
      <ProfileCardList
        cards={currentProfile.cards}
        key={currentProfile.userId}
        onLikeCard={handleLikeCard}
      />
      <PassButton onPress={handlePass} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: COLORS.textMuted,
    fontSize: 15,
  },
});
