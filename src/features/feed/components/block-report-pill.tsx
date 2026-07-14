import { StyleSheet, Text, View } from 'react-native';

import { BLOCK_REPORT_LABEL } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';

// Sits at the end of the profile scroll (user decision: not sticky).
// Inert on purpose: blocking/reporting is out of scope.
export function BlockReportPill() {
  return (
    <View style={styles.pill}>
      <Text style={styles.label}>{BLOCK_REPORT_LABEL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'center',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 22,
    justifyContent: 'center',
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.strokeStrong,
  },
  label: {
    color: COLORS.fill,
    fontSize: 15,
    fontWeight: '600',
  },
});
