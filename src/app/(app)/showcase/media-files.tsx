import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { pickDocument, pickImage, shareAsset, type PickedAsset } from '@/shared/services/files';
import { palette, spacing, typography } from '@/shared/theme/tokens';
import { AppButton } from '@/shared/ui/app-button';
import { Card } from '@/shared/ui/card';
import { InfoRow } from '@/shared/ui/info-row';
import { Screen } from '@/shared/ui/screen';

function formatBytes(value?: number | null) {
  if (!value) {
    return 'Unknown';
  }

  return `${(value / 1024).toFixed(1)} KB`;
}

export default function MediaFilesScreen() {
  const [asset, setAsset] = useState<PickedAsset | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function run(action: () => Promise<PickedAsset | null>) {
    setLoading(true);
    setMessage('');
    try {
      const nextAsset = await action();
      if (nextAsset) {
        setAsset(nextAsset);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to pick file.');
    } finally {
      setLoading(false);
    }
  }

  async function shareSelected() {
    if (!asset) {
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await shareAsset(asset);
      setMessage('Share sheet opened.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to share file.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Media and file access</Text>
        <Text style={styles.copy}>
          Pick an image or document, inspect file metadata, then hand it to the native share sheet.
        </Text>
        <View style={styles.actions}>
          <AppButton title="Pick image" onPress={() => run(pickImage)} loading={loading} />
          <AppButton title="Pick document" variant="secondary" onPress={() => run(pickDocument)} />
        </View>
      </Card>

      {asset ? (
        <Card style={styles.card}>
          <InfoRow label="Source" value={asset.source} />
          {asset.source === 'image' ? (
            <InfoRow label="Photo access" value={asset.accessPrivileges ?? 'Unknown'} />
          ) : null}
          <InfoRow label="Name" value={asset.name} />
          <InfoRow label="MIME type" value={asset.mimeType ?? 'Unknown'} />
          <InfoRow label="Size" value={formatBytes(asset.size)} />
          <InfoRow label="URI" value={asset.uri} />
          <AppButton title="Share selected file" onPress={shareSelected} variant="secondary" />
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
