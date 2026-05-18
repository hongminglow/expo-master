import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, spacing, typography } from '@/shared/theme/tokens';

import { AppButton } from './app-button';
import { Card } from './card';

type PermissionStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
};

export function PermissionState({ title, message, actionLabel, onAction }: PermissionStateProps) {
  return (
    <Card>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {actionLabel && onAction ? (
          <AppButton title={actionLabel} onPress={onAction} variant="secondary" />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    color: palette.ink,
    fontSize: typography.subheading,
    fontWeight: '700',
  },
  message: {
    color: palette.slate,
    fontSize: typography.body,
    lineHeight: 22,
  },
});
