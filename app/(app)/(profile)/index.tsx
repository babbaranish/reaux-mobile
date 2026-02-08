import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../src/components/layout/SafeScreen';
import { Header } from '../../../src/components/layout/Header';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { useImagePicker } from '../../../src/hooks/useImagePicker';
import {
  colors,
  typography,
  fontFamily,
  spacing,
  borderRadius,
  layout,
} from '../../../src/theme';
import type { Gym } from '../../../src/types/models';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const uploadAvatarAction = useAuthStore((s) => s.uploadAvatar);
  const isLoading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);
  const { pickImage } = useImagePicker();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [hasChanges, setHasChanges] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const gym = typeof user?.gymId === 'object' ? (user.gymId as Gym) : null;

  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      setHasChanges(value !== (user?.name || '') || phone !== (user?.phone || ''));
    },
    [user?.name, user?.phone, phone],
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      setPhone(value);
      setHasChanges(name !== (user?.name || '') || value !== (user?.phone || ''));
    },
    [user?.name, user?.phone, name],
  );

  const handleSave = async () => {
    try {
      await updateProfile({ name, phone });
      setHasChanges(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleUploadAvatar = async () => {
    const result = await pickImage();
    if (result) {
      try {
        await uploadAvatarAction(result.uri, result.type, result.fileName);
        Alert.alert('Success', 'Profile picture updated');
      } catch {
        Alert.alert('Error', 'Failed to upload profile picture');
      }
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeScreen>
      <Header
        title="Profile"
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/(app)/(profile)/edit')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="pencil-outline"
              size={22}
              color={colors.text.primary}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar
            uri={user?.avatar}
            name={user?.name}
            size={100}
          />
          <TouchableOpacity onPress={handleUploadAvatar}>
            <Text style={styles.uploadLink}>Upload</Text>
          </TouchableOpacity>
          <Text style={styles.uploadHint}>
            Tap to upload / change your account profile picture
          </Text>
        </View>

        {/* Personal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal</Text>
          <Input
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={handleNameChange}
          />
          <View style={styles.fieldSpacing} />
          <Input
            label="Email"
            placeholder="Email address"
            value={user?.email || ''}
            onChangeText={() => {}}
            keyboardType="email-address"
            style={styles.readOnlyField}
          />
          <Text style={styles.readOnlyHint}>Email cannot be changed</Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Input
            label="Phone"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
          />
        </View>

        {/* Admin: Gym Details */}
        {isAdmin && gym && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gym Details</Text>
            <Input
              label="Gym Name"
              placeholder="Gym name"
              value={gym.name || ''}
              onChangeText={() => {}}
              style={styles.readOnlyField}
            />
            <View style={styles.fieldSpacing} />
            <Input
              label="Location"
              placeholder="Location"
              value={
                [gym.address?.city, gym.address?.state]
                  .filter(Boolean)
                  .join(', ') || ''
              }
              onChangeText={() => {}}
              style={styles.readOnlyField}
            />
            <View style={styles.fieldSpacing} />
            <Input
              label="Email"
              placeholder="Gym email"
              value={gym.email || ''}
              onChangeText={() => {}}
              style={styles.readOnlyField}
            />
            <View style={styles.fieldSpacing} />
            <Input
              label="Phone"
              placeholder="Gym phone"
              value={gym.phone || ''}
              onChangeText={() => {}}
              style={styles.readOnlyField}
            />
          </View>
        )}

        {/* Admin: Fees Overview */}
        {isAdmin && (
          <Card
            style={styles.linkCard}
            onPress={() => router.push('/(app)/(admin)/fees')}
          >
            <View style={styles.linkCardContent}>
              <View style={styles.linkCardLeft}>
                <Ionicons
                  name="cash-outline"
                  size={22}
                  color={colors.text.primary}
                />
                <View style={styles.linkCardText}>
                  <Text style={styles.linkCardTitle}>Fees Overview</Text>
                  <Text style={styles.linkCardSubtitle}>
                    View gym membership fees
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.light}
              />
            </View>
          </Card>
        )}

        {/* Admin Panel */}
        {isAdmin && (
          <Card
            style={styles.linkCard}
            onPress={() => router.push('/(app)/(admin)')}
          >
            <View style={styles.linkCardContent}>
              <View style={styles.linkCardLeft}>
                <Ionicons
                  name="shield-outline"
                  size={22}
                  color={colors.text.primary}
                />
                <View style={styles.linkCardText}>
                  <Text style={styles.linkCardTitle}>Admin Panel</Text>
                  <Text style={styles.linkCardSubtitle}>
                    Manage gyms, products, users, and more
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.light}
              />
            </View>
          </Card>
        )}

        {/* My Orders */}
        {isAdmin && (
          <Card
            style={styles.linkCard}
            onPress={() => router.push('/(app)/(shop)/orders')}
          >
            <View style={styles.linkCardContent}>
              <View style={styles.linkCardLeft}>
                <Ionicons
                  name="bag-outline"
                  size={22}
                  color={colors.text.primary}
                />
                <View style={styles.linkCardText}>
                  <Text style={styles.linkCardTitle}>My Orders</Text>
                  <Text style={styles.linkCardSubtitle}>
                    View all your past orders
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.light}
              />
            </View>
          </Card>
        )}

        {/* Save Changes Button */}
        {hasChanges && (
          <View style={styles.saveButtonContainer}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            />
          </View>
        )}

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="outline"
            size="lg"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  uploadLink: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.status.info,
    marginTop: spacing.md,
  },
  uploadHint: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.light,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  fieldSpacing: {
    height: spacing.md,
  },
  readOnlyField: {
    opacity: 0.6,
  },
  readOnlyHint: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.text.light,
    marginTop: spacing.xs,
  },
  linkCard: {
    marginBottom: spacing.md,
  },
  linkCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkCardText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  linkCardTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text.primary,
  },
  linkCardSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.secondary,
    marginTop: 2,
  },
  saveButtonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  logoutContainer: {
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
});
