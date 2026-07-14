import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BACK_LABEL } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';
import { TITLE_FONT_FAMILY } from '@/utils/fonts';

export type PlaceholderScreenProps = {
  title: string;
  // Pushed pages get a back button; tab pages don't.
  showBack?: boolean;
};

export function PlaceholderScreen({
  title,
  showBack = false,
}: PlaceholderScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {showBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={BACK_LABEL}
          hitSlop={8}
          onPress={() => router.back()}
          style={[styles.backButton, { top: insets.top + 8 }]}
        >
          <ChevronLeft color={COLORS.fill} size={24} />
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.panel,
  },
  title: {
    color: COLORS.fill,
    fontFamily: TITLE_FONT_FAMILY,
    fontSize: 28,
  },
});
