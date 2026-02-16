import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../src/components/layout/SafeScreen';
import { Button } from '../../../src/components/ui/Button';
import { Badge } from '../../../src/components/ui/Badge';
import { useBmiStore } from '../../../src/stores/useBmiStore';
import { colors, fontFamily, typography, spacing, borderRadius, shadows } from '../../../src/theme';
import type { BmiCategory, Gender } from '../../../src/types/models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_PADDING = 20; // padding on each side
const TRACK_WIDTH = SCREEN_WIDTH - spacing.xl * 2 - SLIDER_PADDING * 2;

const BMI_CATEGORY_CONFIG: Record<BmiCategory, { label: string; color: string; variant: 'info' | 'success' | 'warning' | 'error'; message: string }> = {
  underweight: {
    label: 'Underweight',
    color: colors.status.info,
    variant: 'info',
    message: 'You are below the healthy range. Consider a balanced diet to gain some weight.',
  },
  normal: {
    label: 'Normal',
    color: colors.status.success,
    variant: 'success',
    message: 'Great job! You are in the healthy range.',
  },
  overweight: {
    label: 'Overweight',
    color: colors.status.warning,
    variant: 'warning',
    message: 'You are slightly above the healthy range. A balanced diet and exercise can help.',
  },
  obese: {
    label: 'Obese',
    color: colors.status.error,
    variant: 'error',
    message: 'Your BMI is above the healthy range. Consult a healthcare professional.',
  },
};

function calculateBmiLocal(height: number, weight: number): { bmi: number; category: BmiCategory } {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category: BmiCategory = 'normal';
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 25) category = 'normal';
  else if (bmi < 30) category = 'overweight';
  else category = 'obese';
  return { bmi, category };
}

// Custom slider component using PanResponder (avoids external dependency)
interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (val: number) => void;
}

function CustomSlider({ value, min, max, step, onValueChange }: CustomSliderProps) {
  const fraction = (value - min) / (max - min);
  const thumbSize = 24;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        updateValue(gestureState.x0);
      },
      onPanResponderMove: (_, gestureState) => {
        updateValue(gestureState.moveX);
      },
    }),
  ).current;

  const updateValue = (pageX: number) => {
    const trackStart = spacing.xl + SLIDER_PADDING;
    const relativeX = pageX - trackStart;
    const clampedX = Math.max(0, Math.min(TRACK_WIDTH, relativeX));
    const rawValue = min + (clampedX / TRACK_WIDTH) * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const finalValue = Math.max(min, Math.min(max, steppedValue));
    onValueChange(finalValue);
  };

  return (
    <View style={sliderStyles.container} {...panResponder.panHandlers}>
      <View style={sliderStyles.track}>
        <View
          style={[
            sliderStyles.filledTrack,
            { width: `${fraction * 100}%` },
          ]}
        />
      </View>
      <View
        style={[
          sliderStyles.thumb,
          {
            left: fraction * TRACK_WIDTH - thumbSize / 2 + SLIDER_PADDING,
          },
        ]}
      />
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: SLIDER_PADDING,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border.gray,
    overflow: 'hidden',
  },
  filledTrack: {
    height: '100%',
    backgroundColor: colors.primary.yellow,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    top: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.yellow,
    borderWidth: 3,
    borderColor: colors.background.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default function HealthScreen() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [gender, setGender] = useState<Gender>('male');
  const [result, setResult] = useState<{ bmi: number; category: BmiCategory } | null>(null);

  const { recordBmi, getLatest, latestRecord, isLoading } = useBmiStore();

  useEffect(() => {
    getLatest();
  }, []);

  const handleCalculate = useCallback(async () => {
    const localResult = calculateBmiLocal(height, weight);
    setResult(localResult);

    try {
      await recordBmi(height, weight);
    } catch {
      // Still show local result even if API fails
    }
  }, [height, weight, recordBmi]);

  const handleSeeHistory = useCallback(() => {
    router.push('/(app)/(health)/history' as any);
  }, []);

  const bmiConfig = result ? BMI_CATEGORY_CONFIG[result.category] : null;

  // Compute color bar position (BMI 15-40 range mapped to bar width)
  const getBarPosition = (bmi: number) => {
    const minBmi = 15;
    const maxBmi = 40;
    const clamped = Math.max(minBmi, Math.min(maxBmi, bmi));
    return ((clamped - minBmi) / (maxBmi - minBmi)) * 100;
  };

  return (
    <SafeScreen>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Heading */}
        <View style={styles.headingSection}>
          <Text style={styles.heading}>Check your Body stats</Text>
          <Text style={styles.subtitle}>
            Enter your height and weight to get your comprehensive BMI analysis
          </Text>
        </View>

        {/* Height slider */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Height</Text>
            <Text style={styles.sliderValue}>{height} cm</Text>
          </View>
          <CustomSlider
            value={height}
            min={100}
            max={220}
            step={1}
            onValueChange={setHeight}
          />
          <View style={styles.sliderRange}>
            <Text style={styles.rangeText}>100 cm</Text>
            <Text style={styles.rangeText}>220 cm</Text>
          </View>
        </View>

        {/* Weight slider */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Weight</Text>
            <Text style={styles.sliderValue}>{weight} kg</Text>
          </View>
          <CustomSlider
            value={weight}
            min={30}
            max={200}
            step={1}
            onValueChange={setWeight}
          />
          <View style={styles.sliderRange}>
            <Text style={styles.rangeText}>30 kg</Text>
            <Text style={styles.rangeText}>200 kg</Text>
          </View>
        </View>

        {/* Gender toggle */}
        <View style={styles.genderSection}>
          <Text style={styles.sliderLabel}>Gender</Text>
          <View style={styles.genderToggle}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
              onPress={() => setGender('male')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="male"
                size={18}
                color={gender === 'male' ? colors.text.primary : colors.text.secondary}
              />
              <Text
                style={[
                  styles.genderText,
                  gender === 'male' && styles.genderTextActive,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
              onPress={() => setGender('female')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="female"
                size={18}
                color={gender === 'female' ? colors.text.primary : colors.text.secondary}
              />
              <Text
                style={[
                  styles.genderText,
                  gender === 'female' && styles.genderTextActive,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calculate button */}
        <Button
          title="CALCULATE BMI"
          onPress={handleCalculate}
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
        />

        {/* Result card */}
        {result && bmiConfig && (
          <View style={[styles.resultCard, shadows.card]}>
            <Text style={styles.resultLabel}>YOUR RESULT</Text>

            <Text style={[styles.resultBmi, { color: bmiConfig.color }]}>
              {result.bmi.toFixed(1)}
            </Text>

            <Badge text={bmiConfig.label} variant={bmiConfig.variant} size="md" />

            {/* Color bar */}
            <View style={styles.colorBar}>
              <View style={[styles.colorSegment, { backgroundColor: colors.status.info, flex: 1 }]} />
              <View style={[styles.colorSegment, { backgroundColor: colors.status.success, flex: 2 }]} />
              <View style={[styles.colorSegment, { backgroundColor: colors.status.warning, flex: 1.5 }]} />
              <View style={[styles.colorSegment, { backgroundColor: colors.status.error, flex: 2 }]} />
            </View>

            {/* Indicator position */}
            <View style={styles.indicatorContainer}>
              <View style={[styles.barIndicator, { left: `${getBarPosition(result.bmi)}%` }]}>
                <View style={styles.barIndicatorLine} />
                <View style={styles.barIndicatorDot} />
              </View>
            </View>

            <Text style={styles.resultMessage}>{bmiConfig.message}</Text>
          </View>
        )}

        {/* Personalized diet plan suggestion */}
        {result && (
          <TouchableOpacity
            style={[styles.dietSuggestionCard, shadows.card]}
            onPress={() => router.push('/(app)/(diet)/suggested' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.dietSuggestionContent}>
              <Ionicons name="restaurant" size={24} color={colors.primary.yellowDark} />
              <View style={styles.dietSuggestionTextBlock}>
                <Text style={styles.dietSuggestionTitle}>View Suggested Diets</Text>
                <Text style={styles.dietSuggestionSubtitle}>
                  Diet plans tailored to your BMI ({result.bmi.toFixed(1)} - {BMI_CATEGORY_CONFIG[result.category].label})
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
            </View>
          </TouchableOpacity>
        )}

        {/* See History button */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={handleSeeHistory}
          activeOpacity={0.7}
        >
          <Ionicons name="time-outline" size={20} color={colors.text.primary} />
          <Text style={styles.historyButtonText}>See History</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  headingSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  heading: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  sliderSection: {
    marginBottom: spacing.xxl,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sliderLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.primary,
  },
  sliderValue: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 22,
    color: colors.primary.yellowDark,
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SLIDER_PADDING,
    marginTop: spacing.xs,
  },
  rangeText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.light,
  },
  genderSection: {
    marginBottom: spacing.xxl,
  },
  genderToggle: {
    flexDirection: 'row',
    marginTop: spacing.md,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.pill,
    padding: 3,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
  },
  genderButtonActive: {
    backgroundColor: colors.primary.yellow,
  },
  genderText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  genderTextActive: {
    color: colors.text.primary,
  },
  resultCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.card,
    padding: spacing.xxl,
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  resultLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.light,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  resultBmi: {
    fontFamily: fontFamily.bold,
    fontSize: 56,
    lineHeight: 64,
    marginBottom: spacing.md,
  },
  colorBar: {
    flexDirection: 'row',
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: spacing.xl,
  },
  colorSegment: {
    height: '100%',
  },
  indicatorContainer: {
    width: '100%',
    height: 20,
    position: 'relative',
    marginBottom: spacing.md,
  },
  barIndicator: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    marginLeft: -6,
  },
  barIndicatorLine: {
    width: 2,
    height: 8,
    backgroundColor: colors.background.dark,
  },
  barIndicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.dark,
    borderWidth: 2,
    borderColor: colors.background.white,
  },
  resultMessage: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  dietSuggestionCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  dietSuggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dietSuggestionTextBlock: {
    flex: 1,
  },
  dietSuggestionTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  dietSuggestionSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
    marginTop: 2,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
    borderWidth: 1.5,
    borderColor: colors.border.gray,
  },
  historyButtonText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text.primary,
  },
  bottomSpacer: {
    height: spacing.xxxl,
  },
});
