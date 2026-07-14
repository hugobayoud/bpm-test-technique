import { Image } from 'expo-image';
import { Quote } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import type { PictureContent } from '@/types/feed';
import { COLORS } from '@/utils/colors';

export type PictureCardProps = {
  content: PictureContent;
};

export function PictureCard({ content }: PictureCardProps) {
  const answersPrompt = content.promptTitle !== null;

  const photo = (
    <Image
      contentFit="cover"
      placeholder={{ thumbhash: content.thumbhash }}
      placeholderContentFit="cover"
      source={{ uri: content.imageUrl }}
      style={answersPrompt ? styles.promptPhoto : styles.barePhoto}
      transition={300}
    />
  );

  if (!answersPrompt) {
    return photo;
  }

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        {/* Lucide Quote filled white: substitution for bpm's "99" quote glyph (no asset). */}
        <View style={styles.badge}>
          <Quote color={COLORS.fill} fill={COLORS.fill} size={14} />
        </View>
        <Text style={styles.title}>{content.promptTitle}</Text>
      </View>
      {photo}
    </View>
  );
}

const styles = StyleSheet.create({
  barePhoto: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 24,
  },
  panel: {
    backgroundColor: COLORS.panel,
    borderRadius: 24,
    padding: 12,
    gap: 12,
  },
  promptPhoto: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.strokeStrong,
  },
  title: {
    flex: 1,
    color: COLORS.fill,
    fontSize: 15,
    fontWeight: '600',
  },
});
