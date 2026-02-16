import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, borderRadius, spacing, shadows } from '../../theme';
import { formatCurrency } from '../../utils/formatters';
import type { MembershipPlan, Gym } from '../../types/models';

interface MembershipPlanCardProps {
  plan: MembershipPlan;
  onPress: () => void;
}

export const MembershipPlanCard: React.FC<MembershipPlanCardProps> = ({
  plan,
  onPress,
}) => {
  const gymName =
    typeof plan.gymId === 'object' ? (plan.gymId as Gym).name : 'Unknown Gym';

  // Convert duration to readable format
  const getDurationText = (days: number): string => {
    if (days === 30) return '1 Month';
    if (days === 90) return '3 Months';
    if (days === 180) return '6 Months';
    if (days === 365) return '1 Year';
    return `${days} Days`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, shadows.card]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.gymName}>{gymName}</Text>
        </View>
        {!plan.isActive && (
          <View style={styles.inactiveBadge}>
            <Text style={styles.inactiveBadgeText}>Inactive</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>{getDurationText(plan.durationDays)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>{formatCurrency(plan.price)}</Text>
        </View>
      </View>

      {plan.features && plan.features.length > 0 && (
        <View style={styles.features}>
          {plan.features.slice(0, 3).map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={colors.primary.yellow}
              />
              <Text style={styles.featureText} numberOfLines={1}>
                {feature}
              </Text>
            </View>
          ))}
          {plan.features.length > 3 && (
            <Text style={styles.moreFeatures}>
              +{plan.features.length - 3} more
            </Text>
          )}
        </View>
      )}

      {plan.description && (
        <Text style={styles.description} numberOfLines={2}>
          {plan.description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  planName: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.text.primary,
    marginBottom: 2,
  },
  gymName: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  inactiveBadge: {
    backgroundColor: colors.status.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  inactiveBadgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: colors.text.white,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  features: {
    marginBottom: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  featureText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.primary,
    flex: 1,
  },
  moreFeatures: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.light,
    marginTop: 2,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
