import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';

import { AuthProvider } from '@/features/auth/auth-provider';
import { palette } from '@/shared/theme/tokens';

const appTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: palette.cloud,
    card: palette.surface,
    text: palette.ink,
    border: palette.line,
    primary: palette.primary,
  },
};

export default function RootLayout() {
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(palette.cloud);
  }, []);

  return (
    <ThemeProvider value={appTheme}>
      <AuthProvider>
        <StatusBar backgroundColor={palette.cloud} style="dark" translucent={false} />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: palette.cloud },
            headerShown: false,
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
