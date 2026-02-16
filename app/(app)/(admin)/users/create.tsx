import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../../../src/components/layout/SafeScreen';
import { Header } from '../../../../src/components/layout/Header';
import { Input } from '../../../../src/components/ui/Input';
import { Button } from '../../../../src/components/ui/Button';
import { RoleGuard } from '../../../../src/components/guards/RoleGuard';
import { usersApi } from '../../../../src/api/endpoints/users';
import { useUIStore } from '../../../../src/stores/useUIStore';
import { colors, fontFamily, spacing, borderRadius } from '../../../../src/theme';
import type { Role, UserStatus } from '../../../../src/types/models';

const ROLES: { value: Role; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Superadmin' },
];

const STATUSES: { value: UserStatus; label: string; description: string }[] = [
  { value: 'active', label: 'Active', description: 'User can login and use the app' },
  { value: 'disabled', label: 'Disabled', description: 'User cannot login' },
];

export default function CreateUserScreen() {
  const router = useRouter();
  const showToast = useUIStore((s) => s.showToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>('active');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await usersApi.createUser({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        role: selectedRole,
        status: selectedStatus,
      });
      showToast('User created successfully', 'success');
      router.back();
    } catch (error: any) {
      showToast(error.message || 'Failed to create user', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['superadmin']}>
      <SafeScreen>
        <Header
          title="Create User"
          showBack
          onBack={() => router.back()}
          rightAction={
            <TouchableOpacity
              onPress={handleCreate}
              disabled={isLoading}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text
                style={[
                  styles.createButtonText,
                  isLoading && styles.createButtonTextDisabled,
                ]}
              >
                Create
              </Text>
            </TouchableOpacity>
          }
        />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>User Information</Text>

              <Input
                label="FULL NAME *"
                placeholder="Enter full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <View style={styles.inputSpacing} />

              <Input
                label="EMAIL *"
                placeholder="Enter email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.inputSpacing} />

              <Input
                label="PHONE (OPTIONAL)"
                placeholder="Enter phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <View style={styles.inputSpacing} />

              <Input
                label="PASSWORD *"
                placeholder="Create password (min 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Role</Text>
              <Text style={styles.sectionDescription}>
                Select the role for this user
              </Text>

              <View style={styles.roleGrid}>
                {ROLES.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.roleCard,
                      selectedRole === role.value && styles.roleCardActive,
                    ]}
                    onPress={() => setSelectedRole(role.value)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.roleRadio,
                        selectedRole === role.value && styles.roleRadioActive,
                      ]}
                    >
                      {selectedRole === role.value && (
                        <View style={styles.roleRadioInner} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.roleLabel,
                        selectedRole === role.value && styles.roleLabelActive,
                      ]}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Status</Text>
              <Text style={styles.sectionDescription}>
                Set the initial status for this user account
              </Text>

              <View style={styles.roleGrid}>
                {STATUSES.map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.roleCard,
                      selectedStatus === status.value && styles.roleCardActive,
                    ]}
                    onPress={() => setSelectedStatus(status.value)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.roleRadio,
                        selectedStatus === status.value && styles.roleRadioActive,
                      ]}
                    >
                      {selectedStatus === status.value && (
                        <View style={styles.roleRadioInner} />
                      )}
                    </View>
                    <View style={styles.roleTextContainer}>
                      <Text
                        style={[
                          styles.roleLabel,
                          selectedStatus === status.value && styles.roleLabelActive,
                        ]}
                      >
                        {status.label}
                      </Text>
                      <Text style={styles.roleDescription}>{status.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Create User"
                onPress={handleCreate}
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeScreen>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  createButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.primary.yellow,
  },
  createButtonTextDisabled: {
    opacity: 0.5,
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionDescription: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  inputSpacing: {
    height: spacing.md,
  },
  roleGrid: {
    gap: spacing.md,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardActive: {
    borderColor: colors.primary.yellow,
    backgroundColor: colors.background.light,
  },
  roleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  roleRadioActive: {
    borderColor: colors.primary.yellow,
  },
  roleRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary.yellow,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.primary,
  },
  roleLabelActive: {
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  roleDescription: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: spacing.xxxl,
  },
});
