import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { PromptHeader } from '@/features/feed/components/prompt-header';
import type { PictureContent } from '@/types/feed';
import { COLORS } from '@/utils/colors';

export type PictureCardProps = {
  content: PictureContent;
};

export function PictureCard({ content }: PictureCardProps) {
  const { promptTitle } = content;
  const answersPrompt = promptTitle !== null;

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
      <PromptHeader title={promptTitle} />
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
    // The photo bleeds to the panel edges; the panel radius clips its corners.
    overflow: 'hidden',
  },
  promptPhoto: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
});
