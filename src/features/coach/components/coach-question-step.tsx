import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { VALIDATE_LABEL } from '@/features/coach/constants';
import { DEFAULT_FILTERS, type FilterKey } from '@/features/filters/catalogue';
import { AgeRangeField } from '@/features/filters/components/age-range-field';
import { MaxDistanceField } from '@/features/filters/components/max-distance-field';
import { RelationshipTypeField } from '@/features/filters/components/relationship-type-field';
import { TrainingFrequencyField } from '@/features/filters/components/training-frequency-field';
import type { Filters } from '@/features/filters/store';
import type { RelationshipType, TrainingFrequency } from '@/types/feed';
import { COLORS } from '@/utils/colors';
import { CoachBubble } from './coach-bubble';

// The validated value of one Coach Question, tagged by its Filtre.
export type CoachAnswer =
  | { fieldKey: 'age_range'; value: Filters['ageRange'] }
  | { fieldKey: 'max_distance'; value: number }
  | { fieldKey: 'training_frequency'; value: TrainingFrequency }
  | { fieldKey: 'relationship_type'; value: RelationshipType };

export type CoachQuestionStepProps = {
  fieldKey: FilterKey;
  questionText: string;
  onValidate: (answer: CoachAnswer) => void;
};

// Active thread step: LLM question bubble + the control block derived from
// fieldKey through the catalogue components (never from the LLM text) +
// « Valider ». Unlike the filters screen, the draft only reaches the store
// once validated.
export function CoachQuestionStep({
  fieldKey,
  questionText,
  onValidate,
}: CoachQuestionStepProps) {
  return (
    <View style={styles.step}>
      <CoachBubble text={questionText} />
      <StepControl fieldKey={fieldKey} onValidate={onValidate} />
    </View>
  );
}

type StepProps = {
  onValidate: (answer: CoachAnswer) => void;
};

function StepControl({
  fieldKey,
  onValidate,
}: StepProps & { fieldKey: FilterKey }) {
  switch (fieldKey) {
    case 'age_range':
      return <AgeRangeStep onValidate={onValidate} />;
    case 'max_distance':
      return <MaxDistanceStep onValidate={onValidate} />;
    case 'training_frequency':
      return <TrainingFrequencyStep onValidate={onValidate} />;
    case 'relationship_type':
      return <RelationshipTypeStep onValidate={onValidate} />;
  }
}

// Slider drafts start on the unanswered sentinels — validating one untouched
// keeps the Filtre empty and the coach re-asks it (assumed spec limitation).
function AgeRangeStep({ onValidate }: StepProps) {
  const [value, setValue] = useState<Filters['ageRange']>({
    ...DEFAULT_FILTERS.ageRange,
  });
  return (
    <>
      <AgeRangeField onChange={setValue} value={value} />
      <ValidateButton
        onPress={() => onValidate({ fieldKey: 'age_range', value })}
      />
    </>
  );
}

function MaxDistanceStep({ onValidate }: StepProps) {
  const [value, setValue] = useState(DEFAULT_FILTERS.maxDistance);
  return (
    <>
      <MaxDistanceField onChange={setValue} value={value} />
      <ValidateButton
        onPress={() => onValidate({ fieldKey: 'max_distance', value })}
      />
    </>
  );
}

function TrainingFrequencyStep({ onValidate }: StepProps) {
  const [value, setValue] = useState<TrainingFrequency | null>(null);
  return (
    <>
      <TrainingFrequencyField onChange={setValue} value={value} />
      <ValidateButton
        disabled={value === null}
        onPress={() => {
          if (value !== null) {
            onValidate({ fieldKey: 'training_frequency', value });
          }
        }}
      />
    </>
  );
}

function RelationshipTypeStep({ onValidate }: StepProps) {
  const [value, setValue] = useState<RelationshipType | null>(null);
  return (
    <>
      <RelationshipTypeField onChange={setValue} value={value} />
      <ValidateButton
        disabled={value === null}
        onPress={() => {
          if (value !== null) {
            onValidate({ fieldKey: 'relationship_type', value });
          }
        }}
      />
    </>
  );
}

type ValidateButtonProps = {
  // Enum steps disable it until an option is picked; slider steps always
  // allow it (the shown value is a valid choice).
  disabled?: boolean;
  onPress: () => void;
};

function ValidateButton({ disabled = false, onPress }: ValidateButtonProps) {
  return (
    <Pressable
      accessibilityLabel={VALIDATE_LABEL}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.validate,
        disabled && styles.validateDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[styles.validateLabel, disabled && styles.validateLabelDisabled]}
      >
        {VALIDATE_LABEL}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  step: {
    gap: 10,
  },
  validate: {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  validateDisabled: {
    backgroundColor: COLORS.panel,
  },
  pressed: {
    opacity: 0.7,
  },
  validateLabel: {
    color: COLORS.fillOpposite,
    fontSize: 17,
    fontWeight: '700',
  },
  validateLabelDisabled: {
    color: COLORS.textMuted,
  },
});
