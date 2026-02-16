import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
    <SafeScreen style={styles.screen} edges={[]} statusBarStyle="light-content">
      <ImageBackground
        source={require('../../assets/login.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(28, 28, 13, 0.85)',
            'rgba(248, 248, 245, 0.75)',

            'rgba(248, 248, 245, 0.75)',
            'rgba(248, 248, 245, 0.92)',
            'rgba(255, 255, 255, 0.97)'
          ]}
          locations={[0, 0.25, 0.5, 0.75, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
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
              {/* Logo at top */}
              <View style={styles.logoSection}>
                <Image
                  source={require('../../assets/logo-temp.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Form section at bottom */}
              <View style={styles.formSection}>
                <Text style={styles.heading}>Create Account</Text>
                <Text style={styles.subtext}>
                  Join the community and start your fitness journey.
                </Text>

                <View style={styles.formInputs}>
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
                    title="Create Account"
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
                        <Text style={styles.signinLink}>Sign in</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,

  },
  gradient: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  logoSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: 100,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logo: {
    width: 200,
    height: 60,
  },
  formSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  formInputs: {
    gap: spacing.sm,
    width: '100%',
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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
