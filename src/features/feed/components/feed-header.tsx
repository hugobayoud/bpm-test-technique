import { useRouter } from 'expo-router';
import { RotateCcw, SlidersHorizontal, Zap } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BOOST_BADGE, HEADER_ACTION_TITLES } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';
import { TITLE_FONT_FAMILY } from '@/utils/fonts';

export type FeedHeaderProps = {
  firstname: string;
};

export function FeedHeader({ firstname }: FeedHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{firstname}</Text>
      <View style={styles.actions}>
        <View style={styles.pill}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={HEADER_ACTION_TITLES.FILTERS}
            onPress={() => router.push('/filters')}
            style={styles.pillButton}
          >
            <SlidersHorizontal color={COLORS.fill} size={18} />
          </Pressable>
          <View style={styles.pillDivider} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={HEADER_ACTION_TITLES.REWIND}
            onPress={() => router.push('/rewind')}
            style={styles.pillButton}
          >
            <RotateCcw color={COLORS.fill} size={18} />
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={HEADER_ACTION_TITLES.BOOST}
          onPress={() => router.push('/boost')}
          style={styles.boostButton}
        >
          <Zap color={COLORS.fill} fill={COLORS.fill} size={18} />
          <View style={styles.boostBadge}>
            <Text style={styles.boostBadgeText}>{BOOST_BADGE}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    color: COLORS.fill,
    fontFamily: TITLE_FONT_FAMILY,
    fontSize: 32,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.strokeDefault,
    backgroundColor: COLORS.panel,
  },
  pillButton: {
    height: '100%',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.strokeStrong,
  },
  boostButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.boost,
  },
  boostBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  boostBadgeText: {
    color: COLORS.fillOpposite,
    fontSize: 10,
    fontWeight: '700',
  },
});
