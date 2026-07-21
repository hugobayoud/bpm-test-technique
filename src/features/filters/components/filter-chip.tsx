import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS } from '@/utils/colors';

export type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

// Selectable pill shared by every Filtre control: slider shortcuts and enum
// options alike. Selection is pure state equality, so a chip also lights up
// when the slider lands exactly on its value.
export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.strokeStrong,
    backgroundColor: COLORS.surface,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    color: COLORS.fill,
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: COLORS.fillOpposite,
  },
});
