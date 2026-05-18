import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/shared/theme/tokens';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize="none"
        placeholderTextColor={palette.slate}
        style={[styles.input, Boolean(error) && styles.inputError, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: palette.ink,
    fontSize: typography.small,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    borderColor: palette.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: palette.ink,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
  },
  inputError: {
    borderColor: palette.danger,
  },
  error: {
    color: palette.danger,
    fontSize: typography.small,
  },
});
