import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FILTER_CATALOGUE } from '@/features/filters/catalogue';
import {
  AGE_MAX_THUMB_LABEL,
  AGE_MIN_THUMB_LABEL,
} from '@/features/filters/constants';
import type { Filters } from '@/features/filters/store';
import { FilterBlock } from './filter-block';
import { FilterChip } from './filter-chip';
import { RangeSlider } from './range-slider';

type AgeRange = Filters['ageRange'];

export type AgeRangeFieldProps = {
  value: AgeRange;
  // Fired when a value settles: slider release or shortcut tap. The filters
  // screen commits it straight to the store; the coach page (019) buffers it
  // behind its « Valider » button.
  onChange: (value: AgeRange) => void;
};

const { domain, label, shortcuts, unit } = FILTER_CATALOGUE.age_range;

export function AgeRangeField({ value, onChange }: AgeRangeFieldProps) {
  // Value being dragged, not yet committed — null outside a gesture, so any
  // external store change (coach reset…) shows through immediately.
  const [draft, setDraft] = useState<AgeRange | null>(null);
  const shown = draft ?? value;

  const commit = (next: AgeRange) => {
    setDraft(null);
    onChange(next);
  };

  return (
    <FilterBlock label={label} readout={`${shown.min}-${shown.max} ${unit}`}>
      <RangeSlider
        domain={domain}
        max={shown.max}
        maxThumbLabel={AGE_MAX_THUMB_LABEL}
        min={shown.min}
        minThumbLabel={AGE_MIN_THUMB_LABEL}
        onChange={setDraft}
        onCommit={commit}
      />
      <View style={styles.shortcuts}>
        {shortcuts.map((shortcut) => (
          <FilterChip
            key={`${shortcut.min}-${shortcut.max}`}
            label={`${shortcut.min}-${shortcut.max}`}
            onPress={() => onChange({ min: shortcut.min, max: shortcut.max })}
            selected={shown.min === shortcut.min && shown.max === shortcut.max}
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
