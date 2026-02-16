import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, borderRadius, spacing, shadows } from '../../theme';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import type {
  Membership,
  User,
  MembershipPlan,
  Gym,
  MembershipStatus,
} from '../../types/models';

interface MembershipCardProps {
  membership: Membership;
  onPress: () => void;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  membership,
  onPress,
}) => {
  const user = typeof membership.userId === 'object' ? membership.userId as User : null;
  const plan =
    typeof membership.planId === 'object' ? (membership.planId as MembershipPlan) : null;
  const gym = typeof membership.gymId === 'object' ? (membership.gymId as Gym) : null;

  const getStatusVariant = (
    status: MembershipStatus
  ): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: MembershipStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Check if membership is expiring soon (within 7 days)
  const isExpiringSoon = () => {
    if (membership.status !== 'active') return false;
    const endDate = new Date(membership.endDate);
    const today = new Date();
    const daysLeft = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft <= 7 && daysLeft > 0;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, shadows.card]}
    >
      {/* User Info */}
      {user && (
        <View style={styles.userSection}>
          <Avatar uri={user.avatar} name={user.name} size={40} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <Badge
            text={getStatusText(membership.status)}
            variant={getStatusVariant(membership.status)}
            size="sm"
          />
        </View>
      )}

      {/* Plan & Gym Info */}
      <View style={styles.planSection}>
        <View style={styles.planRow}>
          <Ionicons name="card-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.planName}>{plan?.name || 'Unknown Plan'}</Text>
        </View>
        {gym && (
          <View style={styles.planRow}>
            <Ionicons name="business-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.gymName}>{gym.name}</Text>
          </View>
        )}
      </View>

      {/* Dates */}
      <View style={styles.datesSection}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateValue}>{formatDate(membership.startDate)}</Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>{formatDate(membership.endDate)}</Text>
        </View>
      </View>

      {/* Expiring Soon Warning */}
      {isExpiringSoon() && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning-outline" size={16} color={colors.status.warning} />
          <Text style={styles.warningText}>Expiring soon</Text>
        </View>
      )}

      {/* Price */}
      {plan && (
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Plan Price</Text>
          <Text style={styles.priceValue}>{formatCurrency(plan.price)}</Text>
        </View>
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.primary,
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  planSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  planName: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text.primary,
  },
  gymName: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  datesSection: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.light,
    marginBottom: 2,
  },
  dateValue: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.light,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  warningText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.status.warning,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  priceLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  priceValue: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.text.primary,
  },
});
