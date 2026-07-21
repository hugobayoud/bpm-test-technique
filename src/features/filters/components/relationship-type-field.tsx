import { StyleSheet, View } from 'react-native';

import { RELATIONSHIP_TYPE_COPY } from '@/features/feed/constants';
import { FILTER_CATALOGUE } from '@/features/filters/catalogue';
import type { RelationshipType } from '@/types/feed';
import { FilterBlock } from './filter-block';
import { FilterChip } from './filter-chip';

export type RelationshipTypeFieldProps = {
  value: RelationshipType | null;
  onChange: (value: RelationshipType) => void;
};

const { label, options } = FILTER_CATALOGUE.relationship_type;

// Chip labels reuse the info card's relationship wording (Endurance /
// Fractionné / Sprint) — the feed constants are the canonical source.
export function RelationshipTypeField({
  value,
  onChange,
}: RelationshipTypeFieldProps) {
  return (
    <FilterBlock label={label}>
      <View style={styles.options}>
        {options.map((option) => (
          <FilterChip
            key={option}
            label={RELATIONSHIP_TYPE_COPY[option].label}
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
