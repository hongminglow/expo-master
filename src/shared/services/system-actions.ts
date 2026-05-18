import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export async function copyToClipboard(value: string) {
  await Clipboard.setStringAsync(value);
}

export async function triggerSuccessHaptic() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
