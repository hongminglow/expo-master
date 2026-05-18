import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  copyToClipboard,
  openExternalUrl,
  openInAppBrowser,
  readClipboard,
  shareText,
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from '@/shared/services/system-actions';
import { palette, spacing, typography } from '@/shared/theme/tokens';
import { AppButton } from '@/shared/ui/app-button';
import { Card } from '@/shared/ui/card';
import { InfoRow } from '@/shared/ui/info-row';
import { Screen } from '@/shared/ui/screen';

const sampleText = 'Pulse Mobile quick utility sample';
const helpUrl = 'https://reactnative.dev';

export default function UtilitiesScreen() {
  const [clipboardValue, setClipboardValue] = useState('');
  const [message, setMessage] = useState('');

  async function run(label: string, action: () => Promise<void>) {
    try {
      await action();
      setMessage(label);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Action failed.');
    }
  }

  async function inspectClipboard() {
    try {
      const value = await readClipboard();
      setClipboardValue(value || 'Clipboard is empty.');
      setMessage('Clipboard read.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to read clipboard.');
    }
  }

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Quick mobile utilities</Text>
        <Text style={styles.copy}>
          Common app actions for copy/paste, tactile feedback, sharing, and browser handoff.
        </Text>

        <View style={styles.actions}>
          <AppButton
            title="Copy sample text"
            onPress={() => run('Sample copied.', () => copyToClipboard(sampleText))}
          />
          <AppButton title="Read clipboard" variant="secondary" onPress={inspectClipboard} />
          <AppButton
            title="Share sample text"
            variant="secondary"
            onPress={() => run('Share sheet opened.', () => shareText(sampleText))}
          />
          <AppButton
            title="Selection haptic"
            variant="secondary"
            onPress={() => run('Selection feedback sent.', triggerSelectionHaptic)}
          />
          <AppButton
            title="Success haptic"
            variant="secondary"
            onPress={() => run('Success feedback sent.', triggerSuccessHaptic)}
          />
          <AppButton
            title="Open external link"
            variant="secondary"
            onPress={() => run('External link opened.', () => openExternalUrl(helpUrl))}
          />
          <AppButton
            title="Open in-app browser"
            variant="secondary"
            onPress={() => run('Browser opened.', () => openInAppBrowser(helpUrl))}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <InfoRow label="Sample text" value={sampleText} />
        <InfoRow label="Clipboard" value={clipboardValue || 'Not read yet'} />
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
