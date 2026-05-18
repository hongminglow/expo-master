import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import { DEMO_ACCOUNT } from '@/features/auth/auth-service';
import { palette, spacing, typography } from '@/shared/theme/tokens';
import { AppButton } from '@/shared/ui/app-button';
import { Card } from '@/shared/ui/card';
import { Screen } from '@/shared/ui/screen';

export default function SettingsScreen() {
  const { logout, rememberedLogin, user } = useAuth();

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Signed in profile</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user?.role}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.title}>Remember me</Text>
        <Text style={styles.copy}>
          AsyncStorage keeps only the remembered email flag and email address. SecureStore keeps the
          demo session only when remember-me is enabled.
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Remembered email</Text>
          <Text style={styles.value}>{rememberedLogin.email || 'Not saved'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Demo account</Text>
          <Text style={styles.value}>{DEMO_ACCOUNT.email}</Text>
        </View>
      </Card>

      <AppButton title="Sign out" variant="danger" onPress={logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  title: {
    color: palette.ink,
    fontSize: typography.subheading,
    fontWeight: '900',
  },
  copy: {
    color: palette.slate,
    fontSize: typography.body,
    lineHeight: 23,
  },
  row: {
    borderTopColor: palette.line,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  label: {
    color: palette.slate,
    fontSize: typography.small,
    fontWeight: '700',
  },
  value: {
    color: palette.ink,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
