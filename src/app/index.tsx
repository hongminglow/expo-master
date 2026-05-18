import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import { palette, spacing, typography } from '@/shared/theme/tokens';

export default function IndexScreen() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={palette.primary} />
        <Text style={styles.loadingText}>Preparing secure workspace</Text>
      </View>
    );
  }

  return <Redirect href={status === 'authenticated' ? '/home' : '/login'} />;
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: palette.cloud,
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: palette.slate,
    fontSize: typography.body,
  },
});
