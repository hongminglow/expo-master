import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LoginForm } from '@/features/auth/components/login-form';
import { useAuth } from '@/features/auth/auth-provider';
import { palette, spacing, typography } from '@/shared/theme/tokens';
import { AppTopBar } from '@/shared/ui/app-top-bar';
import { Screen } from '@/shared/ui/screen';

export default function LoginScreen() {
  const { login, rememberedLogin } = useAuth();

  return (
    <Screen contentStyle={styles.content}>
      <AppTopBar title="Sign in" subtitle="Expo Go compatible SDK 54 workspace" />
      <View style={styles.brand}>
        <Text style={styles.brandName}>Enterprise Ready Mobile</Text>
        <Text style={styles.brandCopy}>
          A production-shaped Expo template with secure auth patterns and native capability demos.
        </Text>
      </View>
      <LoginForm
        initialEmail={rememberedLogin.email}
        initialRememberMe={rememberedLogin.rememberMe}
        onSubmit={async (credentials) => {
          await login(credentials);
          router.replace('/home');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    maxWidth: 520,
  },
  brand: {
    gap: spacing.sm,
  },
  brandName: {
    color: palette.ink,
    fontSize: typography.title,
    fontWeight: '900',
  },
  brandCopy: {
    color: palette.slate,
    fontSize: typography.body,
    lineHeight: 24,
  },
});
