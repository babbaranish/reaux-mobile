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
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { useUIStore } from '../../src/stores/useUIStore';
import { colors, fontFamily, spacing, borderRadius } from '../../src/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [codeApplied, setCodeApplied] = useState(false);

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const showToast = useUIStore((s) => s.showToast);

  const handleContinue = async () => {
    if (!email.trim() || !password.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    try {
      await login(email.trim(), password.trim());
      router.replace('/(app)/(feed)');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    }
  };

  const handleApplyCode = () => {
    if (inviteCode.trim().length > 0) {
      setCodeApplied(true);
    }
  };

  return (
    <SafeScreen
      style={styles.screen}
      edges={['top', 'left', 'right']}
      statusBarStyle="light-content"
    >
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
          {/* Dark header section */}
          <View style={styles.headerSection}>
            <View style={styles.logoRow}>
              <View style={styles.logoBox}>
                <Text style={styles.logoR}>R</Text>
              </View>
              <Text style={styles.logoText}>REAUX LABS</Text>
            </View>
            <Text style={styles.heading}>Unlock Your Potential</Text>
            <Text style={styles.subtext}>
              Manage your clients, buy supplements, and track your fitness journey.
            </Text>
          </View>

          {/* Form section */}
          <View style={styles.formSection}>
            <Input
              label="EMAIL"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="PASSWORD"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              rightIcon={
                <Link href="/(auth)/forgot-password" asChild>
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot?</Text>
                  </TouchableOpacity>
                </Link>
              }
            />

            <View style={styles.inviteRow}>
              <View style={styles.inviteInputWrap}>
                <Input
                  label="INVITE CODE (OPTIONAL)"
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChangeText={(text) => {
                    setInviteCode(text);
                    if (codeApplied) setCodeApplied(false);
                  }}
                  rightIcon={
                    codeApplied ? (
                      <View style={styles.codeApplied}>
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={colors.status.success}
                        />
                        <Text style={styles.codeAppliedText}>Code Applied!</Text>
                      </View>
                    ) : inviteCode.trim().length > 0 ? (
                      <TouchableOpacity onPress={handleApplyCode}>
                        <Text style={styles.applyText}>Apply</Text>
                      </TouchableOpacity>
                    ) : undefined
                  }
                />
              </View>
            </View>

            <Button
              title="Continue"
              onPress={handleContinue}
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR JOIN WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              <Button
                title="Google"
                onPress={() => {}}
                variant="outline"
                size="lg"
                leftIcon={
                  <Ionicons name="logo-google" size={20} color={colors.text.primary} />
                }
                style={styles.socialButton}
              />
              <Button
                title="Apple"
                onPress={() => {}}
                variant="outline"
                size="lg"
                leftIcon={
                  <Ionicons name="logo-apple" size={20} color={colors.text.primary} />
                }
                style={styles.socialButton}
              />
            </View>

            {/* Sign up link */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.signupLink}>Sign up</Text>
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
  inviteRow: {
    marginBottom: spacing.sm,
  },
  inviteInputWrap: {
    flex: 1,
  },
  codeApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  codeAppliedText: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.status.success,
  },
  applyText: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: colors.primary.yellowDark,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.gray,
  },
  dividerText: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    color: colors.text.light,
    letterSpacing: 1.5,
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text.secondary,
  },
  signupLink: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.text.primary,
  },
  forgotText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.primary.yellowDark,
  },
});
