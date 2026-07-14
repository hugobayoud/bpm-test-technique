import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { PromptAnswerBody } from '@/features/feed/components/prompt-answer-body';
import { SportCardBody } from '@/features/feed/components/sport-card-body';
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

// The liked card's content inside the uniform frame. Photos bleed to the
// edges; text cards (prompt answer, sport) reuse the feed cards' bodies —
// same internals, no like button — top-aligned on the frame's panel bg.
function renderCardContent(card: ProfileCard) {
  switch (card.type) {
    case 'picture':
      return (
        <Image
          contentFit="cover"
          placeholder={{ thumbhash: card.content.thumbhash }}
          placeholderContentFit="cover"
          source={{ uri: card.content.imageUrl }}
          style={styles.photo}
          transition={300}
        />
      );
    case 'prompt_answer':
      return (
        <View style={styles.textContent}>
          <PromptAnswerBody content={card.content} />
        </View>
      );
    case 'sport_card':
      return (
        <View style={styles.textContent}>
          <SportCardBody content={card.content} />
        </View>
      );
    default:
      // Info and locked-picture cards are not Likable: unreachable via the
      // feed's like buttons, so the frame just stays empty.
      return null;
  }
}

// Uniform hero frame: the liked card fills it, the superlike scrim rises
// from the bottom and the title block overlays it — identical composition
// for every likable card kind.
export function SendLikeHero({ card, firstname }: SendLikeHeroProps) {
  return (
    <View style={styles.frame}>
      {renderCardContent(card)}
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
  textContent: {
    // Top inset clears the "annuler" chip zone (chip bottom within the
    // hero ≈ 56) so card text never collides with it.
    paddingTop: 76,
    paddingHorizontal: 20,
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
