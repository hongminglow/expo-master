import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Share } from 'react-native';

export async function copyToClipboard(value: string) {
  await Clipboard.setStringAsync(value);
}

export async function readClipboard() {
  return Clipboard.getStringAsync();
}

export async function triggerSuccessHaptic() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function triggerSelectionHaptic() {
  await Haptics.selectionAsync();
}

export async function openExternalUrl(url: string) {
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    throw new Error(`Cannot open ${url}`);
  }

  await Linking.openURL(url);
}

export async function openInAppBrowser(url: string) {
  await WebBrowser.openBrowserAsync(url);
}

export async function shareText(message: string) {
  await Share.share({ message });
}
