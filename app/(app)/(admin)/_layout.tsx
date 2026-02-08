import { Stack } from 'expo-router';
import { RoleGuard } from '../../../src/components/guards/RoleGuard';

export default function AdminLayout() {
  return (
    <RoleGuard allowedRoles={['admin', 'superadmin']}>
      <Stack screenOptions={{ headerShown: false }} />
    </RoleGuard>
  );
}
