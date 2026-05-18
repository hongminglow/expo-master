import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/auth-provider';
import { FeatureCard } from '@/features/showcase/components/feature-card';
import { featureModules } from '@/features/showcase/feature-registry';
import { palette, radius, spacing, typography } from '@/shared/theme/tokens';
import { Card } from '@/shared/ui/card';
import { Screen } from '@/shared/ui/screen';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Workspace</Text>
          <Text style={styles.title}>Welcome, {user?.name ?? 'operator'}</Text>
          <Text style={styles.subtitle}>Review device capabilities from one workspace.</Text>
        </View>
        <Link href="/settings" asChild>
          <Pressable accessibilityLabel="Open settings" style={styles.settingsButton}>
            <Feather name="settings" color={palette.ink} size={20} />
          </Pressable>
        </Link>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{featureModules.length}</Text>
          <Text style={styles.statLabel}>Tools</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>Mobile</Text>
          <Text style={styles.statLabel}>Channel</Text>
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Capability center</Text>
        <Text style={styles.sectionCopy}>Each module includes permission and unsupported-state handling.</Text>
      </View>

      <View style={styles.featureList}>
        {featureModules.map((feature) => (
          <FeatureCard feature={feature} key={feature.id} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: typography.small,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.ink,
    fontSize: typography.title,
    fontWeight: '900',
  },
  subtitle: {
    color: palette.slate,
    fontSize: typography.body,
    lineHeight: 24,
  },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    gap: spacing.xs,
  },
  statValue: {
    color: palette.ink,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  statLabel: {
    color: palette.slate,
    fontSize: typography.small,
    fontWeight: '700',
  },
  sectionHeader: {
    gap: spacing.xs,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  sectionCopy: {
    color: palette.slate,
    fontSize: typography.body,
  },
  featureList: {
    gap: spacing.md,
  },
});
