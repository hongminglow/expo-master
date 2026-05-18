import { useColorScheme } from 'react-native';

import { darkPalette, palette } from './tokens';

export function useAppTheme() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkPalette : palette;

  return {
    colors,
    isDark: scheme === 'dark',
  };
}
