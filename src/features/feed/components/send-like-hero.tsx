import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import {
  SEND_LIKE_TITLE_PREFIX,
  SUPERLIKES_REMAINING_LABEL,
} from '@/features/feed/constants';
import type { ProfileCard } from '@/types/feed';
import { COLORS } from '@/utils/colors';
import { TITLE_FONT_FAMILY } from '@/utils/fonts';

export type SendLikeHeroProps = {
  card: ProfileCard;
  firstname: string;
};

// Uniform hero frame: the liked card fills it (photos full-bleed here;
// prompt/sport content arrives with issue 014), the superlike scrim rises
// from the bottom and the title block overlays it.
export function SendLikeHero({ card, firstname }: SendLikeHeroProps) {
  return (
    <View style={styles.frame}>
      {card.type === 'picture' ? (
        <Image
          contentFit="cover"
          placeholder={{ thumbhash: card.content.thumbhash }}
          placeholderContentFit="cover"
          source={{ uri: card.content.imageUrl }}
          style={styles.photo}
          transition={300}
        />
      ) : null}
      <LinearGradient
        colors={[
          COLORS.superlikeTransparent,
          COLORS.superlike,
          COLORS.superlike,
        ]}
        locations={[0.4, 0.88, 1]}
        style={styles.scrim}
      />
      <View style={styles.copy}>
        <Text style={styles.title}>
          {SEND_LIKE_TITLE_PREFIX} {firstname}
        </Text>
        <View style={styles.countRow}>
          <Text style={styles.count}>{SUPERLIKES_REMAINING_LABEL}</Text>
          <Heart color={COLORS.fill} fill={COLORS.fill} size={18} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    marginHorizontal: 12,
    aspectRatio: 3 / 4,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: COLORS.panel,
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  copy: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 22,
    gap: 10,
  },
  title: {
    color: COLORS.fill,
    fontFamily: TITLE_FONT_FAMILY,
    fontSize: 33,
    lineHeight: 36,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.9,
  },
  count: {
    color: COLORS.fill,
    fontSize: 17,
  },
});
