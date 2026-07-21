import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Fragment, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCoachQuestion } from '@/features/coach/api';
import {
  COACH_THINKING_MESSAGE,
  COACH_TITLE,
  PROFILE_COMPLETE_MESSAGE,
} from '@/features/coach/constants';
import {
  BACK_LABEL,
  RELATIONSHIP_TYPE_COPY,
  TRAINING_FREQUENCY_VALUE,
} from '@/features/feed/constants';
import { getEmptyFilterKeys } from '@/features/filters/catalogue';
import { AGE_UNIT, DISTANCE_UNIT } from '@/features/filters/constants';
import { type Filters, useFiltersStore } from '@/features/filters/store';
import { COLORS } from '@/utils/colors';
import { TITLE_FONT_FAMILY } from '@/utils/fonts';
import { AnswerBubble } from './answer-bubble';
import { CoachBubble } from './coach-bubble';
import { type CoachAnswer, CoachQuestionStep } from './coach-question-step';

// A validated step, frozen as its summary: the question asked + the value.
type FrozenStep = {
  key: string;
  questionText: string;
  answerLabel: string;
};

// The frozen value, worded exactly like the control the user tapped: unit
// readouts for the sliders, canonical chip labels for the enums.
function formatAnswerLabel(answer: CoachAnswer): string {
  switch (answer.fieldKey) {
    case 'age_range':
      return `${answer.value.min}-${answer.value.max} ${AGE_UNIT}`;
    case 'max_distance':
      return `${answer.value} ${DISTANCE_UNIT}`;
    case 'training_frequency':
      return TRAINING_FREQUENCY_VALUE[answer.value];
    case 'relationship_type':
      return RELATIONSHIP_TYPE_COPY[answer.value].label;
  }
}

// Guided chatbot thread completing the 4 Filtres one Coach Question at a
// time. The thread is screen state only (never persisted): each visit starts
// from the store's current gaps.
export function CoachScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const ageRange = useFiltersStore((state) => state.ageRange);
  const maxDistance = useFiltersStore((state) => state.maxDistance);
  const trainingFrequency = useFiltersStore((state) => state.trainingFrequency);
  const relationshipType = useFiltersStore((state) => state.relationshipType);
  const setAgeRange = useFiltersStore((state) => state.setAgeRange);
  const setMaxDistance = useFiltersStore((state) => state.setMaxDistance);
  const setTrainingFrequency = useFiltersStore(
    (state) => state.setTrainingFrequency,
  );
  const setRelationshipType = useFiltersStore(
    (state) => state.setRelationshipType,
  );

  const filters: Filters = {
    ageRange,
    maxDistance,
    trainingFrequency,
    relationshipType,
  };
  const emptyFields = getEmptyFilterKeys(filters);
  const question = useCoachQuestion(filters);
  const currentQuestion = question.data;

  const [frozenSteps, setFrozenSteps] = useState<FrozenStep[]>([]);

  // « Valider » : freeze the step, then commit to the store — emptyFields
  // shrinks, the query key changes and the next question fetches itself.
  const validateAnswer = (questionText: string, answer: CoachAnswer) => {
    setFrozenSteps((steps) => [
      ...steps,
      {
        key: `${steps.length}-${answer.fieldKey}`,
        questionText,
        answerLabel: formatAnswerLabel(answer),
      },
    ]);
    switch (answer.fieldKey) {
      case 'age_range':
        setAgeRange(answer.value);
        break;
      case 'max_distance':
        setMaxDistance(answer.value);
        break;
      case 'training_frequency':
        setTrainingFrequency(answer.value);
        break;
      case 'relationship_type':
        setRelationshipType(answer.value);
        break;
    }
  };

  const renderCurrentStep = () => {
    if (emptyFields.length === 0) {
      return <CoachBubble text={PROFILE_COMPLETE_MESSAGE} />;
    }
    if (question.isPending) {
      return <CoachBubble pending text={COACH_THINKING_MESSAGE} />;
    }
    if (currentQuestion === undefined) {
      // Query error after the retry — the deterministic fallback that keeps
      // the thread going lands with issue 020.
      return null;
    }
    return (
      <CoachQuestionStep
        fieldKey={currentQuestion.fieldKey}
        key={currentQuestion.fieldKey}
        onValidate={(answer) =>
          validateAnswer(currentQuestion.questionText, answer)
        }
        questionText={currentQuestion.questionText}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={BACK_LABEL}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <ChevronLeft color={COLORS.fill} size={24} />
        </Pressable>
        <Text style={styles.title}>{COACH_TITLE}</Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.thread,
          { paddingBottom: insets.bottom + 24 },
        ]}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
      >
        {frozenSteps.map((step) => (
          <Fragment key={step.key}>
            <CoachBubble text={step.questionText} />
            <AnswerBubble label={step.answerLabel} />
          </Fragment>
        ))}
        {renderCurrentStep()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.panel,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    color: COLORS.fill,
    fontFamily: TITLE_FONT_FAMILY,
    fontSize: 28,
  },
  thread: {
    padding: 16,
    paddingTop: 6,
    gap: 12,
  },
});
