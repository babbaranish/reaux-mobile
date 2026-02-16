import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../src/components/layout/SafeScreen';
import { Header } from '../../../src/components/layout/Header';
import { Avatar } from '../../../src/components/ui/Avatar';
import { RoleGuard } from '../../../src/components/guards/RoleGuard';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { colors, fontFamily, spacing, borderRadius } from '../../../src/theme';

interface MenuItemProps {
  label: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
  </TouchableOpacity>
);

export default function AdminDashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isSuperadmin = user?.role === 'superadmin';

  return (
    <RoleGuard allowedRoles={['admin', 'superadmin']}>
      <SafeScreen>
        <Header title="Admin Panel" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <Avatar uri={user?.avatar} name={user?.name} size={64} />
            <Text style={styles.userName}>{user?.name || 'Admin'}</Text>
            <Text style={styles.userRole}>{user?.role || 'admin'}</Text>
          </View>

          {/* Superadmin: Gym Management */}
          {isSuperadmin && (
            <View style={styles.navigationSection}>
              <Text style={styles.sectionTitle}>Superadmin</Text>
              <View style={styles.menuCard}>
                <MenuItem
                  label="Manage Gyms"
                  onPress={() => router.push('/(app)/(admin)/gyms')}
                />
              </View>
            </View>
          )}

          {/* Memberships */}
          <View style={styles.navigationSection}>
            <Text style={styles.sectionTitle}>Memberships</Text>
            <View style={styles.menuCard}>
              <MenuItem
                label="Membership Plans"
                onPress={() => router.push('/(app)/(admin)/memberships/plans')}
              />
              <View style={styles.divider} />
              <MenuItem
                label="User Memberships"
                onPress={() => router.push('/(app)/(admin)/memberships/memberships')}
              />
            </View>
          </View>

          {/* Shop Management */}
          <View style={styles.navigationSection}>
            <Text style={styles.sectionTitle}>Shop</Text>
            <View style={styles.menuCard}>
              <MenuItem
                label="Manage Products"
                onPress={() => router.push('/(app)/(admin)/products')}
              />
              <View style={styles.divider} />
              <MenuItem
                label="Manage Orders"
                onPress={() => router.push('/(app)/(admin)/orders')}
              />
            </View>
          </View>

          {/* Admin Navigation */}
          <View style={styles.navigationSection}>
            <Text style={styles.sectionTitle}>Management</Text>
            <View style={styles.menuCard}>
              <MenuItem
                label="Analytics"
                onPress={() => router.push('/(app)/(admin)/analytics')}
              />
              <View style={styles.divider} />
              <MenuItem
                label="Sales Report"
                onPress={() => router.push('/(app)/(admin)/sales-report')}
              />
              <View style={styles.divider} />
              <MenuItem
                label="Fees"
                onPress={() => router.push('/(app)/(admin)/fees')}
              />
              <View style={styles.divider} />
              <MenuItem
                label="User Management"
                onPress={() => router.push('/(app)/(admin)/users')}
              />
              <View style={styles.divider} />
              <MenuItem
                label="Manage Challenges"
                onPress={() => router.push('/(app)/(admin)/challenges')}
              />
              <View style={styles.divider} />
              <MenuItem
                label="Promo Banners"
                onPress={() => router.push('/(app)/(admin)/promo/past')}
              />
            </View>
          </View>

          {/* Legal Section - Hidden for now */}
          {/* <View style={styles.navigationSection}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <View style={styles.menuCard}>
              <MenuItem
                label="Privacy Policy"
                onPress={() => {}}
              />
              <View style={styles.divider} />
              <MenuItem
                label="Terms and Conditions"
                onPress={() => {}}
              />
              <View style={styles.divider} />
              <MenuItem
                label="Cancellation and Refund"
                onPress={() => {}}
              />
              <View style={styles.divider} />
              <MenuItem
                label="User Data Policy"
                onPress={() => {}}
              />
            </View>
          </View> */}
        </ScrollView>
      </SafeScreen>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  userName: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  userRole: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  navigationSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  menuCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  menuLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginLeft: spacing.lg,
  },
});
