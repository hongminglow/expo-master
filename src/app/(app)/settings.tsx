import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import { palette, radius, spacing, typography } from '@/shared/theme/tokens';
import { AppButton } from '@/shared/ui/app-button';
import { Card } from '@/shared/ui/card';
import { Screen } from '@/shared/ui/screen';

export default function SettingsScreen() {
  const { logout, user } = useAuth();

  return (
    <Screen>
      <Card style={styles.card}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DA</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.title}>{user?.name ?? 'Demo Admin'}</Text>
            <Text style={styles.copy}>{user?.email ?? 'admin@example.com'}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user?.role ?? 'Administrator'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Department</Text>
          <Text style={styles.value}>Operations</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>Kuala Lumpur</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.title}>Account details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Employee ID</Text>
          <Text style={styles.value}>EMP-1042</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Access level</Text>
          <Text style={styles.value}>Workspace manager</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Last access</Text>
          <Text style={styles.value}>Today</Text>
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
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  avatarText: {
    color: palette.surface,
    fontSize: typography.subheading,
    fontWeight: '900',
  },
  profileText: {
    flex: 1,
    gap: 2,
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
