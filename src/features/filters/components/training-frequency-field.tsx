import { StyleSheet, View } from 'react-native';

import { TRAINING_FREQUENCY_VALUE } from '@/features/feed/constants';
import { FILTER_CATALOGUE } from '@/features/filters/catalogue';
import type { TrainingFrequency } from '@/types/feed';
import { FilterBlock } from './filter-block';
import { FilterChip } from './filter-chip';

export type TrainingFrequencyFieldProps = {
  value: TrainingFrequency | null;
  onChange: (value: TrainingFrequency) => void;
};

const { label, options } = FILTER_CATALOGUE.training_frequency;

// Chip labels reuse the sport card's sessions-per-week values — the feed
// constants are the canonical source (spec decision, cross-feature reuse).
export function TrainingFrequencyField({
  value,
  onChange,
}: TrainingFrequencyFieldProps) {
  return (
    <FilterBlock label={label}>
      <View style={styles.options}>
        {options.map((option) => (
          <FilterChip
            key={option}
            label={TRAINING_FREQUENCY_VALUE[option]}
            onPress={() => onChange(option)}
            selected={value === option}
          />
        ))}
      </View>
    </FilterBlock>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
