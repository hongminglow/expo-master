import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/shared/theme/tokens';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  rightAccessory?: React.ReactNode;
};

export const TextField = React.forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, rightAccessory, style, ...props },
  ref,
) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputFrame, Boolean(error) && styles.inputError]}>
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          autoCapitalize="none"
          placeholderTextColor={palette.slate}
          style={[styles.input, style]}
          {...props}
        />
        {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: palette.ink,
    fontSize: typography.small,
    fontWeight: '700',
  },
  inputFrame: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
  },
  input: {
    flex: 1,
    minHeight: 48,
    color: palette.ink,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
  },
  inputError: {
    borderColor: palette.danger,
  },
  accessory: {
    paddingRight: spacing.sm,
  },
  error: {
    color: palette.danger,
    fontSize: typography.small,
  },
});
