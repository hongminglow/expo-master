import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, spacing, typography } from '@/shared/theme/tokens';

type AppTopBarProps = {
  title: string;
  subtitle?: string;
};

export function AppTopBar({ title, subtitle }: AppTopBarProps) {
  return (
    <View accessibilityRole="header" style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  title: {
    color: palette.ink,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  subtitle: {
    color: palette.slate,
    fontSize: typography.small,
    lineHeight: 18,
  },
});
