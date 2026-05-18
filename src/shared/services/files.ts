import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

export type PickedAsset = {
  name: string;
  uri: string;
  mimeType?: string | null;
  size?: number | null;
  source: 'image' | 'document';
};

export async function pickImage(): Promise<PickedAsset | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permission.status !== 'granted') {
    throw new Error('Photo library permission was not granted.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    quality: 0.8,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  return {
    name: asset.fileName ?? 'selected-image',
    uri: asset.uri,
    mimeType: asset.mimeType,
    size: asset.fileSize,
    source: 'image',
  };
}

export async function pickDocument(): Promise<PickedAsset | null> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  const info = await FileSystem.getInfoAsync(asset.uri);

  return {
    name: asset.name,
    uri: asset.uri,
    mimeType: asset.mimeType,
    size: asset.size ?? (info.exists && 'size' in info ? info.size : null),
    source: 'document',
  };
}

export async function shareAsset(asset: PickedAsset) {
  const isAvailable = await Sharing.isAvailableAsync();

  if (!isAvailable) {
    throw new Error('Native sharing is not available on this platform.');
  }

  await Sharing.shareAsync(asset.uri, {
    mimeType: asset.mimeType ?? undefined,
    dialogTitle: asset.name,
  });
}
