import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, spacing, typography } from '@/shared/theme/tokens';

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  title: {
    color: palette.ink,
    fontSize: typography.subheading,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: palette.slate,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
});
