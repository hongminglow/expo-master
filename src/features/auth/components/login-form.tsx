import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/shared/ui/app-button';
import { Card } from '@/shared/ui/card';
import { TextField } from '@/shared/ui/text-field';
import { palette, spacing, typography } from '@/shared/theme/tokens';

import type { LoginCredentials } from '../types';

type LoginFormProps = {
  initialEmail: string;
  initialRememberMe: boolean;
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
};

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

function validate(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid work email.';
  }

  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
}

export function LoginForm({ initialEmail, initialRememberMe, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(initialRememberMe);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setEmail(initialEmail);
    setRememberMe(initialRememberMe);
  }, [initialEmail, initialRememberMe]);

  async function handleSubmit() {
    const nextErrors = validate(email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'Unable to sign in.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Enterprise Expo</Text>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Use admin@example.com and password password.</Text>
      </View>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="username"
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
        error={errors.email}
      />

      <TextField
        ref={passwordInputRef}
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!isPasswordVisible}
        textContentType="password"
        autoComplete="password"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        error={errors.password}
        rightAccessory={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityHint="Toggles whether the password is visible."
            hitSlop={8}
            onPress={() => setIsPasswordVisible((current) => !current)}
            style={({ pressed }) => [styles.passwordToggle, pressed && styles.pressed]}>
            <Text style={styles.passwordToggleText}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        }
      />

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: rememberMe }}
        accessibilityLabel="Remember me"
        onPress={() => setRememberMe((current) => !current)}
        style={styles.rememberRow}>
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
          {rememberMe ? <Text style={styles.checkboxMark}>✓</Text> : null}
        </View>
        <Text style={styles.rememberText}>Remember me on this device</Text>
      </Pressable>

      {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

      <AppButton title="Sign in" loading={isSubmitting} onPress={handleSubmit} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: typography.small,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.ink,
    fontSize: typography.title,
    fontWeight: '800',
  },
  subtitle: {
    color: palette.slate,
    fontSize: typography.body,
    lineHeight: 22,
  },
  rememberRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: palette.line,
    borderRadius: 4,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkboxChecked: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  checkboxMark: {
    color: palette.surface,
    fontWeight: '800',
  },
  rememberText: {
    color: palette.ink,
    fontSize: typography.body,
  },
  formError: {
    color: palette.danger,
    fontSize: typography.small,
  },
  passwordToggle: {
    minHeight: 36,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordToggleText: {
    color: palette.primary,
    fontSize: typography.small,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.7,
  },
});
