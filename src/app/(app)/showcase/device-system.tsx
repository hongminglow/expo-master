import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getDeviceSnapshot, type DeviceSnapshot } from '@/shared/services/device';
import {
  copyToClipboard,
  openExternalUrl,
  openInAppBrowser,
  triggerSuccessHaptic,
} from '@/shared/services/system-actions';
import { palette, spacing, typography } from '@/shared/theme/tokens';
import { AppButton } from '@/shared/ui/app-button';
import { Card } from '@/shared/ui/card';
import { InfoRow } from '@/shared/ui/info-row';
import { Screen } from '@/shared/ui/screen';

const docsUrl = 'https://docs.expo.dev';

export default function DeviceSystemScreen() {
  const [snapshot, setSnapshot] = useState<DeviceSnapshot | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void getDeviceSnapshot().then(setSnapshot);
  }, []);

  async function run(label: string, action: () => Promise<void>) {
    try {
      await action();
      setMessage(label);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Action failed.');
    }
  }

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Device and system utilities</Text>
        <Text style={styles.copy}>
          Inspect app/runtime metadata and trigger small system integrations used across enterprise apps.
        </Text>
        <View style={styles.actions}>
          <AppButton
            title="Copy diagnostics"
            onPress={() =>
              run('Diagnostics copied.', () =>
                copyToClipboard(JSON.stringify(snapshot?.rows ?? [], null, 2)),
              )
            }
          />
          <AppButton
            title="Haptic success"
            variant="secondary"
            onPress={() => run('Haptic feedback sent.', triggerSuccessHaptic)}
          />
          <AppButton
            title="Open docs"
            variant="secondary"
            onPress={() => run('Opened Expo docs.', () => openExternalUrl(docsUrl))}
          />
          <AppButton
            title="In-app browser"
            variant="secondary"
            onPress={() => run('Opened browser session.', () => openInAppBrowser(docsUrl))}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        {snapshot?.rows.map((row) => (
          <InfoRow label={row.label} value={row.value} key={row.label} />
        )) ?? <Text style={styles.copy}>Loading device snapshot.</Text>}
      </Card>

      {message ? <Text style={styles.message}>{message}</Text> : null}
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
  copy: {
    color: palette.slate,
    fontSize: typography.body,
    lineHeight: 23,
  },
  actions: {
    gap: spacing.sm,
  },
  message: {
    color: palette.success,
    fontSize: typography.small,
    fontWeight: '700',
  },
});
