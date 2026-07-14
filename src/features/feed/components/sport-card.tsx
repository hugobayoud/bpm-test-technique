import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { ActivityRings } from '@/features/feed/components/activity-rings';
import { LikeButton } from '@/features/feed/components/like-button';
import {
  SPORT_CARD_LABEL,
  TRAINING_FREQUENCY_SWEEP,
  TRAINING_FREQUENCY_VALUE,
} from '@/features/feed/constants';
import type { SportCardContent } from '@/types/feed';
import { COLORS } from '@/utils/colors';

export type SportCardProps = {
  content: SportCardContent;
  onLike: () => void;
};

// Accent shared by a row's value and its ring, by position (outermost = first).
const SPORT_ACCENTS = [COLORS.primary, COLORS.accentPurple, COLORS.accentPink];

// content.trainingFrequency (overall) and sportIcon are deliberately not
// rendered — neither appears in the mockups (README note).
export function SportCard({ content, onLike }: SportCardProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.body}>
        <ActivityRings
          rings={content.sports.map((sport, index) => ({
            color: SPORT_ACCENTS[index % SPORT_ACCENTS.length],
            sweep: TRAINING_FREQUENCY_SWEEP[sport.trainingFrequency],
          }))}
        />
        <View style={styles.list}>
          <Text style={styles.label}>{SPORT_CARD_LABEL}</Text>
          {content.sports.map((sport, index) => (
            <View key={sport.sportKey} style={styles.row}>
              <Text numberOfLines={1} style={styles.sportName}>
                {sport.sportName}
              </Text>
              {/* SVG dotted leader: single-side dotted borders don't render on Android. */}
              <Svg height={2} style={styles.leader}>
                <Line
                  stroke={COLORS.textMuted}
                  strokeDasharray="1 6"
                  strokeLinecap="round"
                  strokeOpacity={0.5}
                  strokeWidth={2}
                  x1="0"
                  x2="100%"
                  y1="1"
                  y2="1"
                />
              </Svg>
              <Text
                style={[
                  styles.value,
                  { color: SPORT_ACCENTS[index % SPORT_ACCENTS.length] },
                ]}
              >
                {TRAINING_FREQUENCY_VALUE[sport.trainingFrequency]}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.likeRow}>
        <LikeButton onPress={onLike} overlay={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: COLORS.strokeDefault,
    backgroundColor: COLORS.panel,
    borderRadius: 24,
    padding: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 16,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  likeRow: {
    alignItems: 'flex-end',
  },
  list: {
    flex: 1,
    gap: 6,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sportName: {
    color: COLORS.fill,
    fontSize: 17,
    fontWeight: '500',
    flexShrink: 1,
  },
  leader: {
    flex: 1,
    minWidth: 16,
    // Sit slightly below the vertical center, toward the text baseline.
    marginTop: 6,
  },
  value: {
    fontSize: 17,
    fontWeight: '700',
    // Never squeeze the value: react-native-web would wrap "3-4" at the dash.
    flexShrink: 0,
  },
});
