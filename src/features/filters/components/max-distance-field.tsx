import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FILTER_CATALOGUE } from '@/features/filters/catalogue';
import { FilterBlock } from './filter-block';
import { FilterChip } from './filter-chip';
import { RangeSlider } from './range-slider';

export type MaxDistanceFieldProps = {
  value: number;
  // Fired when a value settles: slider release or shortcut tap.
  onChange: (value: number) => void;
};

const { domain, label, shortcuts, unit } = FILTER_CATALOGUE.max_distance;

// Single-thumb slider: the minimum distance is frozen at domain.min. The 50
// km sentinel is deliberately absent from the shortcuts (catalogue rule).
export function MaxDistanceField({ value, onChange }: MaxDistanceFieldProps) {
  const [draft, setDraft] = useState<number | null>(null);
  const shown = draft ?? value;

  return (
    <FilterBlock label={label} readout={`${shown} ${unit}`}>
      <RangeSlider
        domain={domain}
        max={shown}
        maxThumbLabel={label}
        onChange={(next) => setDraft(next.max)}
        onCommit={(next) => {
          setDraft(null);
          onChange(next.max);
        }}
      />
      <View style={styles.shortcuts}>
        {shortcuts.map((shortcut) => (
          <FilterChip
            key={shortcut}
            label={`${shortcut} ${unit}`}
            onPress={() => onChange(shortcut)}
            selected={shown === shortcut}
          />
        ))}
      </View>
    </FilterBlock>
  );
}

const styles = StyleSheet.create({
  shortcuts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
