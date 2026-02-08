import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import type { Role } from '../../types/models';

interface Props {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallbackRoute?: string;
}

export function RoleGuard({ allowedRoles, children, fallbackRoute = '/(app)/(feed)' }: Props) {
  const user = useAuthStore((s) => s.user);
  if (!user || !allowedRoles.includes(user.role)) {
    return <Redirect href={fallbackRoute as any} />;
  }
  return <>{children}</>;
}
