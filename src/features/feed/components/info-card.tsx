import { Cake, MapPin, Ruler, Search } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { HEIGHT_UNIT, RELATIONSHIP_TYPE_COPY } from '@/features/feed/constants';
import type { InfoCardContent } from '@/types/feed';
import { COLORS } from '@/utils/colors';

export type InfoCardProps = {
  content: InfoCardContent;
};

// Mockup-strict: only age, height, city and relationshipType render; the other
// content fields stay hidden (README note). Info cards are never likable.
export function InfoCard({ content }: InfoCardProps) {
  const lookingFor = RELATIONSHIP_TYPE_COPY[content.relationshipType];

  return (
    <View style={styles.panel}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Cake color={COLORS.fill} size={16} />
          <Text style={styles.statText}>{content.age}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.stat}>
          <Ruler color={COLORS.fill} size={16} />
          <Text style={styles.statText}>
            {content.height} {HEIGHT_UNIT}
          </Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.stat}>
          <MapPin color={COLORS.fill} size={16} />
          <Text numberOfLines={1} style={styles.statText}>
            {content.city}
          </Text>
        </View>
      </View>
      <View style={styles.separator} />
      <View>
        <View style={styles.lookingForHeader}>
          <Search color={COLORS.fill} size={18} />
          <Text style={styles.lookingForLabel}>{lookingFor.label}</Text>
        </View>
        <Text style={styles.lookingForTagline}>{lookingFor.tagline}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: COLORS.panel,
    borderRadius: 24,
    padding: 20,
    gap: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  statText: {
    color: COLORS.fill,
    fontSize: 17,
    fontWeight: '600',
    flexShrink: 1,
  },
  verticalDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.strokeStrong,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.strokeStrong,
  },
  lookingForHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lookingForLabel: {
    color: COLORS.fill,
    fontSize: 17,
    fontWeight: '600',
  },
  // Indented so the tagline lines up with the label text, as in the mockup
  // (icon width 18 + header gap 12).
  lookingForTagline: {
    color: COLORS.textMuted,
    fontSize: 15,
    marginLeft: 30,
    marginTop: 4,
  },
});
