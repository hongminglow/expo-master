import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AuthProvider } from '@/features/auth/auth-provider';
import { darkPalette, palette } from '@/shared/theme/tokens';

const appLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.cloud,
    card: palette.surface,
    text: palette.ink,
    border: palette.line,
    primary: palette.primary,
  },
};

const appDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: darkPalette.cloud,
    card: darkPalette.surface,
    text: darkPalette.ink,
    border: darkPalette.line,
    primary: darkPalette.primary,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? appDarkTheme : appLightTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
