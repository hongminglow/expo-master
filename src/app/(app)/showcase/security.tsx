import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  authenticateWithBiometrics,
  getBiometricReadiness,
  readDemoSecret,
  saveDemoSecret,
  type BiometricReadiness,
} from '@/shared/services/security';
import { palette, spacing, typography } from '@/shared/theme/tokens';
import { AppButton } from '@/shared/ui/app-button';
import { Card } from '@/shared/ui/card';
import { InfoRow } from '@/shared/ui/info-row';
import { Screen } from '@/shared/ui/screen';

export default function SecurityScreen() {
  const [readiness, setReadiness] = useState<BiometricReadiness | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void getBiometricReadiness().then(setReadiness);
  }, []);

  async function verify() {
    try {
      const result = await authenticateWithBiometrics();
      setMessage(result.success ? 'Biometric verification succeeded.' : 'Verification was not completed.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Biometric verification failed.');
    }
  }

  async function saveSecret() {
    try {
      await saveDemoSecret('secure-demo-value');
      setMessage('Demo secret saved.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save secret.');
    }
  }

  async function loadSecret() {
    try {
      setSecret(await readDemoSecret());
      setMessage('Demo secret loaded.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to read secret.');
    }
  }

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Biometrics and secure storage</Text>
        <Text style={styles.copy}>
          Mobile apps commonly gate sensitive flows with biometrics and keep secrets out of local
          preference storage.
        </Text>
        {readiness ? (
          <View style={styles.details}>
            <InfoRow label="Hardware available" value={readiness.hasHardware ? 'Yes' : 'No'} />
            <InfoRow label="Biometric enrolled" value={readiness.isEnrolled ? 'Yes' : 'No'} />
            <InfoRow label="Secure storage" value={readiness.secureStoreAvailable ? 'Available' : 'Unavailable'} />
            <InfoRow
              label="Biometric storage"
              value={readiness.canUseBiometricStorage ? 'Supported' : 'Not supported'}
            />
            <InfoRow label="Supported types" value={readiness.supportedTypes.join(', ') || 'None'} />
            {readiness.warning ? <InfoRow label="Fallback note" value={readiness.warning} /> : null}
          </View>
        ) : null}
        <View style={styles.actions}>
          <AppButton title="Verify biometric" onPress={verify} />
          <AppButton title="Save demo secret" variant="secondary" onPress={saveSecret} />
          <AppButton title="Read demo secret" variant="secondary" onPress={loadSecret} />
        </View>
      </Card>

      {secret ? (
        <Card>
          <InfoRow label="SecureStore value" value={secret} />
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
  details: {
    gap: spacing.md,
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
