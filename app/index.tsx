import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/useAuthStore';

export default function Index() {
  const isRestoring = useAuthStore((s) => s.isRestoring);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Splash screen is still visible while restoring
  if (isRestoring) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(feed)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
