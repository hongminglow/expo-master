import Feather from '@expo/vector-icons/Feather';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth/auth-provider';
import { palette, spacing, typography } from '@/shared/theme/tokens';

export default function AppLayout() {
  const { status } = useAuth();
  const insets = useSafeAreaInsets();

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
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: palette.surface },
        headerTintColor: palette.ink,
        headerTitleStyle: styles.headerTitle,
        sceneStyle: { backgroundColor: palette.cloud },
        tabBarActiveTintColor: palette.primary,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: palette.slate,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 58 + Math.max(insets.bottom, spacing.sm),
            paddingBottom: Math.max(insets.bottom, spacing.sm),
          },
        ],
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Feather color={color} name="grid" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Feather color={color} name="user" size={size} />,
        }}
      />
      <Tabs.Screen name="showcase/qr" options={{ href: null, title: 'QR Scanner' }} />
      <Tabs.Screen name="showcase/notifications" options={{ href: null, title: 'Notifications' }} />
      <Tabs.Screen name="showcase/location" options={{ href: null, title: 'Location' }} />
      <Tabs.Screen name="showcase/media-files" options={{ href: null, title: 'Media & Files' }} />
      <Tabs.Screen name="showcase/security" options={{ href: null, title: 'Security' }} />
      <Tabs.Screen name="showcase/utilities" options={{ href: null, title: 'Quick Utilities' }} />
      <Tabs.Screen
        name="showcase/platform-readiness"
        options={{ href: null, title: 'Platform Readiness' }}
      />
      <Tabs.Screen name="showcase/device-system" options={{ href: null, title: 'Device & System' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: palette.ink,
    fontSize: typography.subheading,
    fontWeight: '900',
  },
  loading: {
    alignItems: 'center',
    backgroundColor: palette.cloud,
    flex: 1,
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontSize: typography.small,
    fontWeight: '800',
  },
});
