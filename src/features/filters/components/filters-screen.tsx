import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BACK_LABEL, HEADER_ACTION_TITLES } from '@/features/feed/constants';
import { COACH_CTA_LABEL } from '@/features/filters/constants';
import { useFiltersStore } from '@/features/filters/store';
import { COLORS } from '@/utils/colors';
import { TITLE_FONT_FAMILY } from '@/utils/fonts';
import { AgeRangeField } from './age-range-field';
import { MaxDistanceField } from './max-distance-field';
import { RelationshipTypeField } from './relationship-type-field';
import { TrainingFrequencyField } from './training-frequency-field';

// Direct editor of the 4 Filtres: every control commits to the store as soon
// as a value settles — no validate button here (spec decision). The coach CTA
// is the second door onto the same store.
export function FiltersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
        <Text style={styles.title}>{HEADER_ACTION_TITLES.FILTERS}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AgeRangeField onChange={setAgeRange} value={ageRange} />
        <MaxDistanceField onChange={setMaxDistance} value={maxDistance} />
        <TrainingFrequencyField
          onChange={setTrainingFrequency}
          value={trainingFrequency}
        />
        <RelationshipTypeField
          onChange={setRelationshipType}
          value={relationshipType}
        />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable
          accessibilityLabel={COACH_CTA_LABEL}
          accessibilityRole="button"
          onPress={() => router.push('/coach')}
          style={({ pressed }) => [styles.coachCta, pressed && styles.pressed]}
        >
          <Text style={styles.coachCtaLabel}>{COACH_CTA_LABEL}</Text>
        </Pressable>
      </View>
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
  content: {
    padding: 16,
    paddingTop: 6,
    gap: 14,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  coachCta: {
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.fill,
  },
  coachCtaLabel: {
    color: COLORS.fillOpposite,
    fontSize: 17,
    fontWeight: '700',
  },
});
