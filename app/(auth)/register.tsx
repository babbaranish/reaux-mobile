import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { useUIStore } from '../../src/stores/useUIStore';
import { colors, fontFamily, spacing } from '../../src/theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const showToast = useUIStore((s) => s.showToast);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    try {
      await register(name.trim(), email.trim(), password, phone.trim() || undefined);
      router.replace('/(app)/(feed)');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <SafeScreen style={styles.screen} edges={['top', 'left', 'right']} statusBarStyle="light-content">
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Dark header */}
          <View style={styles.headerSection}>
            <View style={styles.logoRow}>
              <View style={styles.logoBox}>
                <Text style={styles.logoR}>R</Text>
              </View>
              <Text style={styles.logoText}>REAUX LABS</Text>
            </View>
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subtext}>
              Join the community and start your fitness journey.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <Input
              label="FULL NAME"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Input
              label="EMAIL"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="PHONE (OPTIONAL)"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Input
              label="PASSWORD"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              title="Create Account  \u2192"
              onPress={handleRegister}
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            />

            <View style={styles.signinRow}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.signinLink}>Sign in {'\u2192'}</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background.dark,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    backgroundColor: colors.background.dark,
    paddingHorizontal: spacing.xl,
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  logoBox: {
    width: 36,
    height: 36,
    backgroundColor: colors.primary.yellow,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoR: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.text.onPrimary,
  },
  logoText: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.text.white,
    letterSpacing: 2,
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text.white,
    marginBottom: 8,
  },
  subtext: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.6)',
  },
  formSection: {
    flex: 1,
    backgroundColor: colors.background.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingTop: 28,
    paddingBottom: 40,
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signinText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text.secondary,
  },
  signinLink: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.text.primary,
  },
});
