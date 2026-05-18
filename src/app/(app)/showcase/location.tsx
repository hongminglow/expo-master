import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { requestCurrentLocation, type CurrentLocation } from '@/shared/services/location';
import { palette, spacing, typography } from '@/shared/theme/tokens';
import { AppButton } from '@/shared/ui/app-button';
import { Card } from '@/shared/ui/card';
import { InfoRow } from '@/shared/ui/info-row';
import { Screen } from '@/shared/ui/screen';

export default function LocationScreen() {
  const [location, setLocation] = useState<CurrentLocation | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchLocation() {
    setLoading(true);
    setMessage('');
    try {
      setLocation(await requestCurrentLocation());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to get location.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Foreground location</Text>
        <Text style={styles.copy}>
          This demo requests foreground permission and reads a single balanced-accuracy position.
        </Text>
        <AppButton title="Get current location" onPress={fetchLocation} loading={loading} />
      </Card>

      {location ? (
        <Card style={styles.card}>
          <InfoRow label="Latitude" value={location.latitude.toFixed(6)} />
          <InfoRow label="Longitude" value={location.longitude.toFixed(6)} />
          <InfoRow label="Accuracy" value={location.accuracy ? `${Math.round(location.accuracy)} m` : 'Unknown'} />
          <InfoRow label="Timestamp" value={new Date(location.timestamp).toLocaleString()} />
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
  message: {
    color: palette.warning,
    fontSize: typography.small,
    fontWeight: '700',
  },
});
