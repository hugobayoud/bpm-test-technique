import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/utils/colors';
import { TITLE_FONT_FAMILY } from '@/utils/fonts';

// Temporary proof screen: replaced by the (tabs) group in issue 003.
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>bpm</Text>
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
  title: {
    color: COLORS.fill,
    fontFamily: TITLE_FONT_FAMILY,
    fontSize: 48,
  },
});
