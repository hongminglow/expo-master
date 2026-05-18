import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { copyToClipboard, openExternalUrl } from '@/shared/services/system-actions';
import { palette, radius, spacing, typography } from '@/shared/theme/tokens';
import { AppButton } from '@/shared/ui/app-button';
import { Card } from '@/shared/ui/card';
import { PermissionState } from '@/shared/ui/permission-state';
import { Screen } from '@/shared/ui/screen';

export default function QrScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<string>('');
  const [message, setMessage] = useState('');

  async function copyResult() {
    await copyToClipboard(result);
    setMessage('Copied QR result to clipboard.');
  }

  async function openResult() {
    try {
      await openExternalUrl(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to open QR result.');
    }
  }

  if (Platform.OS === 'web') {
    return (
      <Screen>
        <PermissionState
          title="Camera support varies on web"
          message="Run a development build on iOS or Android for the production QR scanner path."
        />
      </Screen>
    );
  }

  if (!permission) {
    return (
      <Screen>
        <PermissionState title="Checking camera access" message="Preparing camera permission state." />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <PermissionState
          title="Camera permission required"
          message="The QR scanner needs camera access to scan badge, kiosk, or device QR codes."
          actionLabel="Allow camera"
          onAction={requestPermission}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Scan a QR code</Text>
        <Text style={styles.copy}>The scanner pauses after the first QR result to avoid duplicate events.</Text>
        <View style={styles.cameraFrame}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={result ? undefined : ({ data }) => setResult(data)}
          />
        </View>
      </Card>

      {result ? (
        <Card style={styles.card}>
          <Text style={styles.label}>Result</Text>
          <Text style={styles.result}>{result}</Text>
          <View style={styles.actions}>
            <AppButton title="Copy" variant="secondary" onPress={copyResult} />
            <AppButton title="Open" variant="secondary" onPress={openResult} />
            <AppButton title="Scan again" onPress={() => setResult('')} />
          </View>
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
  cameraFrame: {
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  label: {
    color: palette.primary,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  result: {
    color: palette.ink,
    fontSize: typography.body,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  message: {
    color: palette.success,
    fontSize: typography.small,
    fontWeight: '700',
  },
});
