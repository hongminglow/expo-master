import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import { palette } from '@/shared/theme/tokens';

export default function AppLayout() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.surface },
        headerShadowVisible: false,
        headerTintColor: palette.ink,
        contentStyle: { backgroundColor: palette.cloud },
      }}>
      <Stack.Screen name="home" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="showcase/qr" options={{ title: 'QR Scanner' }} />
      <Stack.Screen name="showcase/notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="showcase/location" options={{ title: 'Location' }} />
      <Stack.Screen name="showcase/media-files" options={{ title: 'Media & Files' }} />
      <Stack.Screen name="showcase/security" options={{ title: 'Security' }} />
      <Stack.Screen name="showcase/device-system" options={{ title: 'Device & System' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: palette.cloud,
    flex: 1,
    justifyContent: 'center',
  },
});
