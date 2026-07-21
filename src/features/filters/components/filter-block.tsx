import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/utils/colors';

export type FilterBlockProps = {
  label: string;
  // Live value readout next to the label (slider Filtres only).
  readout?: string;
  children: ReactNode;
};

// Panel card wrapping one Filtre: the shared shell of the 4 field components.
export function FilterBlock({ label, readout, children }: FilterBlockProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {readout !== undefined && <Text style={styles.readout}>{readout}</Text>}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 24,
    gap: 14,
    backgroundColor: COLORS.panel,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    flex: 1,
    color: COLORS.fill,
    fontSize: 15,
    fontWeight: '600',
  },
  readout: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
