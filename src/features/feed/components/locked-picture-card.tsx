import { Image } from 'expo-image';
import { Lock } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { PromptHeader } from '@/features/feed/components/prompt-header';
import { LOCKED_PICTURE_COPY } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';

export type LockedPictureCardProps = {
  thumbhash: string;
  promptTitle: string | null;
  // Server-locked cards have no image URL: the thumbhash renders as a soft
  // blur. Client-demoted pictures keep theirs, shown under a heavy blur.
  imageUrl?: string;
};

export function LockedPictureCard({
  thumbhash,
  promptTitle,
  imageUrl,
}: LockedPictureCardProps) {
  const visual = (
    <View style={styles.visual}>
      {imageUrl === undefined ? (
        <Image contentFit="cover" source={{ thumbhash }} style={styles.photo} />
      ) : (
        <Image
          blurRadius={40}
          contentFit="cover"
          placeholder={{ thumbhash }}
          placeholderContentFit="cover"
          source={{ uri: imageUrl }}
          style={styles.photo}
          transition={300}
        />
      )}
      <View style={styles.overlay}>
        <View style={styles.lockBadge}>
          <Lock color={COLORS.fill} size={26} />
        </View>
        <Text style={styles.title}>{LOCKED_PICTURE_COPY.TITLE}</Text>
        <Text style={styles.subtitle}>{LOCKED_PICTURE_COPY.SUBTITLE}</Text>
        {/* Inert on purpose: adding photos is out of scope. */}
        <View style={styles.ctaPill}>
          <Text style={styles.ctaLabel}>{LOCKED_PICTURE_COPY.CTA}</Text>
        </View>
      </View>
    </View>
  );

  if (promptTitle === null) {
    return <View style={styles.bare}>{visual}</View>;
  }

  return (
    <View style={styles.panel}>
      <PromptHeader title={promptTitle} />
      {visual}
    </View>
  );
}

const styles = StyleSheet.create({
  bare: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  panel: {
    backgroundColor: COLORS.panel,
    borderRadius: 24,
    // The visual bleeds to the panel edges; the panel radius clips its corners.
    overflow: 'hidden',
  },
  visual: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  lockBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.strokeStrong,
  },
  title: {
    color: COLORS.fill,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  ctaPill: {
    marginTop: 8,
    backgroundColor: COLORS.fill,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  ctaLabel: {
    color: COLORS.fillOpposite,
    fontSize: 15,
    fontWeight: '600',
  },
});
