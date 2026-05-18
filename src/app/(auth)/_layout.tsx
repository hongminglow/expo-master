import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/features/auth/auth-provider';

export default function AuthLayout() {
  const { status } = useAuth();

  if (status === 'authenticated') {
    return <Redirect href="/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
