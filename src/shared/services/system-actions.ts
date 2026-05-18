import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform, Share } from 'react-native';

export async function copyToClipboard(value: string) {
  const didCopy = await Clipboard.setStringAsync(value);

  if (!didCopy) {
    throw new Error('Clipboard write was not completed on this platform.');
  }
}

export async function readClipboard() {
  return Clipboard.getStringAsync();
}

export async function triggerSuccessHaptic() {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Haptics can be a no-op on devices with disabled vibration or iOS low power conditions.
  }
}

export async function triggerSelectionHaptic() {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Haptics.selectionAsync();
  } catch {
    // Haptics are best-effort feedback and should never block the main action.
  }
}

export async function openExternalUrl(url: string) {
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen && !/^https?:\/\//i.test(url)) {
    throw new Error(`Cannot open ${url}`);
  }

  await Linking.openURL(url);
}

export async function openInAppBrowser(url: string) {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch {
    await openExternalUrl(url);
  }
}

export async function openAppSettings() {
  try {
    await Linking.openSettings();
  } catch {
    throw new Error('Open this app in system settings to update permissions.');
  }
}

export async function shareText(message: string) {
  await Share.share({ message });
}
