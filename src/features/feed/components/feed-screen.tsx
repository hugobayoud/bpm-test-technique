import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFeed } from '@/features/feed/api';
import { FEED_ERROR_MESSAGE } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';
import { FeedHeader } from './feed-header';
import { ProfileCardList } from './profile-card-list';

export function FeedScreen() {
  const insets = useSafeAreaInsets();
  const { data, isPending } = useFeed();

  if (isPending) {
    return (
      <View
        style={[styles.container, styles.centered, { paddingTop: insets.top }]}
      >
        <ActivityIndicator color={COLORS.fill} size="large" />
      </View>
    );
  }

  // Progression through profiles arrives with the feed store (issue 009).
  const currentProfile = data?.profiles.at(0);

  if (!currentProfile) {
    return (
      <View
        style={[styles.container, styles.centered, { paddingTop: insets.top }]}
      >
        <Text style={styles.errorText}>{FEED_ERROR_MESSAGE}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FeedHeader firstname={currentProfile.firstname} />
      <ProfileCardList cards={currentProfile.cards} />
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
