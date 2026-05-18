import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/shared/theme/tokens';
import { Card } from '@/shared/ui/card';

import type { FeatureModule } from '../feature-registry';

type FeatureCardProps = {
  feature: FeatureModule;
};

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Link href={feature.route} asChild>
      <Pressable accessibilityRole="button" style={({ pressed }) => pressed && styles.pressed}>
        <Card style={styles.card}>
          <View style={styles.iconFrame}>
            <Feather name={feature.icon as keyof typeof Feather.glyphMap} size={20} color={palette.primary} />
          </View>
          <View style={styles.body}>
            <Text style={styles.title}>{feature.title}</Text>
            <Text style={styles.description}>{feature.description}</Text>
            <Text style={styles.meta}>{feature.permissions.join(' / ')}</Text>
          </View>
          <Feather name="chevron-right" size={20} color={palette.slate} />
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: '#E8F5EF',
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: palette.ink,
    fontSize: typography.subheading,
    fontWeight: '800',
  },
  description: {
    color: palette.slate,
    fontSize: typography.small,
    lineHeight: 18,
  },
  meta: {
    color: palette.primary,
    fontSize: typography.tiny,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
});
