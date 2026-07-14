import { Quote } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/utils/colors';

export type PromptHeaderProps = {
  title: string;
};

// Header row shared by picture and locked-picture cards answering a prompt.
export function PromptHeader({ title }: PromptHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Lucide Quote filled white: substitution for bpm's "99" quote glyph (no asset). */}
      <View style={styles.badge}>
        <Quote color={COLORS.fill} fill={COLORS.fill} size={14} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 8,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.strokeStrong,
  },
  title: {
    flex: 1,
    color: COLORS.fill,
    fontSize: 16,
    fontWeight: '600',
  },
});
