import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  getPlatformProfile,
  platformReadinessItems,
} from '@/shared/services/platform-readiness';
import { palette, spacing, typography } from '@/shared/theme/tokens';
import { Card } from '@/shared/ui/card';
import { InfoRow } from '@/shared/ui/info-row';
import { Screen } from '@/shared/ui/screen';

export default function PlatformReadinessScreen() {
  const profile = useMemo(() => getPlatformProfile(), []);

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Platform readiness</Text>
        <Text style={styles.copy}>
          Common Android and iOS differences are handled through shared layout, permission, and
          native service wrappers.
        </Text>
        <View style={styles.details}>
          <InfoRow label="Current platform" value={profile.platform} />
          <InfoRow label="Physical device" value={profile.isDevice ? 'Yes' : 'No'} />
          <InfoRow label="Device" value={profile.deviceName} />
          <InfoRow label="Runtime SDK" value={profile.sdkVersion} />
          <InfoRow label="Runtime owner" value={profile.appOwnership} />
        </View>
      </Card>

      {platformReadinessItems.map((item) => (
        <Card key={item.area} style={styles.card}>
          <Text style={styles.sectionTitle}>{item.area}</Text>
          <InfoRow label="Android pitfall" value={item.android} />
          <InfoRow label="iOS pitfall" value={item.ios} />
          <InfoRow label="Fallback" value={item.fallback} />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  title: {
    color: palette.ink,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: typography.subheading,
    fontWeight: '900',
  },
  copy: {
    color: palette.slate,
    fontSize: typography.body,
    lineHeight: 23,
  },
  details: {
    gap: spacing.md,
  },
});
