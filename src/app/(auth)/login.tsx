import { router } from 'expo-router';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LoginForm } from '@/features/auth/components/login-form';
import { useAuth } from '@/features/auth/auth-provider';
import { palette, radius, spacing, typography } from '@/shared/theme/tokens';
import { Screen } from '@/shared/ui/screen';

export default function LoginScreen() {
  const { login, rememberedLogin } = useAuth();

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.brand}>
        <View style={styles.logoFrame}>
          <Image
            accessibilityLabel="Pulse Mobile logo"
            contentFit="contain"
            source={require('../../../assets/images/splash-icon.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.brandName}>Pulse Mobile</Text>
        <Text style={styles.brandCopy}>Use your work account to continue.</Text>
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
    alignSelf: 'center',
    gap: spacing.xl,
    justifyContent: 'center',
    maxWidth: 520,
    width: '100%',
  },
  brand: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoFrame: {
    alignItems: 'center',
    backgroundColor: palette.ink,
    borderRadius: radius.lg,
    height: 72,
    justifyContent: 'center',
    marginBottom: spacing.xs,
    width: 72,
  },
  logo: {
    height: 52,
    width: 52,
  },
  brandName: {
    color: palette.ink,
    fontSize: typography.title,
    fontWeight: '900',
    textAlign: 'center',
  },
  brandCopy: {
    color: palette.slate,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: 'center',
  },
});
