import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  getNotificationReadiness,
  scheduleLocalNotification,
  type NotificationReadiness,
} from '@/shared/services/notifications';
import { palette, spacing, typography } from '@/shared/theme/tokens';
import { AppButton } from '@/shared/ui/app-button';
import { Card } from '@/shared/ui/card';
import { InfoRow } from '@/shared/ui/info-row';
import { Screen } from '@/shared/ui/screen';

export default function NotificationsScreen() {
  const [readiness, setReadiness] = useState<NotificationReadiness | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function checkReadiness() {
    setLoading(true);
    setMessage('');
    try {
      setReadiness(await getNotificationReadiness());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to check notification readiness.');
    } finally {
      setLoading(false);
    }
  }

  async function sendLocalNotification() {
    setLoading(true);
    setMessage('');
    try {
      await scheduleLocalNotification();
      setMessage('Local notification scheduled.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to schedule notification.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Notification readiness</Text>
        <Text style={styles.copy}>
          Local notifications work from the app. Push token registration is surfaced separately
          because production push delivery needs a physical device and project id.
        </Text>
        <View style={styles.actions}>
          <AppButton title="Check readiness" onPress={checkReadiness} loading={loading} />
          <AppButton title="Send local notification" variant="secondary" onPress={sendLocalNotification} />
        </View>
      </Card>

      {readiness ? (
        <Card style={styles.card}>
          <InfoRow label="Permission status" value={readiness.status} />
          <InfoRow label="Push token ready" value={readiness.canUsePushToken ? 'Yes' : 'No'} />
          <InfoRow label="Push token" value={readiness.expoPushToken ?? 'Not available'} />
          <InfoRow label="Note" value={readiness.note} />
        </Card>
      ) : null}

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
