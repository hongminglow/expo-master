import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

export type PickedAsset = {
  accessPrivileges?: 'all' | 'limited' | 'none';
  name: string;
  uri: string;
  mimeType?: string | null;
  size?: number | null;
  source: 'image' | 'document';
};

function imageResultToAsset(
  result: ImagePicker.ImagePickerResult,
  accessPrivileges?: PickedAsset['accessPrivileges'],
): PickedAsset | null {
  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  return {
    accessPrivileges,
    name: asset.fileName ?? 'selected-image',
    uri: asset.uri,
    mimeType: asset.mimeType,
    size: asset.fileSize,
    source: 'image',
  };
}

export async function pickImage(): Promise<PickedAsset | null> {
  const pendingResult = await ImagePicker.getPendingResultAsync();

  if (pendingResult && 'code' in pendingResult) {
    throw new Error(pendingResult.message);
  }

  if (pendingResult && 'canceled' in pendingResult) {
    const pendingAsset = imageResultToAsset(pendingResult);
    if (pendingAsset) {
      return pendingAsset;
    }
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error(
      permission.canAskAgain
        ? 'Photo library permission was not granted.'
        : 'Photo library access is blocked. Open app settings to allow selected photos or full access.',
    );
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    quality: 0.8,
  });

  return imageResultToAsset(result, permission.accessPrivileges);
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
