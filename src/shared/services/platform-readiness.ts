import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export type PlatformReadinessItem = {
  area: string;
  android: string;
  ios: string;
  fallback: string;
};

export type PlatformProfile = {
  appOwnership: string;
  deviceName: string;
  isDevice: boolean;
  platform: string;
  sdkVersion: string;
};

export const platformReadinessItems: PlatformReadinessItem[] = [
  {
    area: 'Safe areas and system bars',
    android: 'Gesture and three-button navigation can overlap fixed bottom UI.',
    ios: 'Notches, Dynamic Island, and home indicator need safe-area spacing.',
    fallback: 'Screens use safe-area containers and the tab bar adds bottom inset padding.',
  },
  {
    area: 'Keyboard behavior',
    android: 'The system can resize or pan the window depending on native config.',
    ios: 'Inputs need padding behavior so the keyboard does not cover the active field.',
    fallback: 'The app uses resize mode on Android and KeyboardAvoidingView in the shared screen shell.',
  },
  {
    area: 'Permissions',
    android: 'A denied permission may become blocked after repeated denial or settings changes.',
    ios: 'Users can grant limited photo access or one-session location access.',
    fallback: 'Feature services handle denied, blocked, limited, unavailable, and retry states.',
  },
  {
    area: 'Notifications',
    android: 'Android 13 requires notification permission and channels before token registration.',
    ios: 'Authorization can be provisional, ephemeral, denied, or fully granted.',
    fallback: 'The notification service creates the Android channel and separates local alerts from push-token readiness.',
  },
  {
    area: 'Location',
    android: 'Emulators and devices can have GPS/network providers disabled.',
    ios: 'Allow Once behaves like foreground access for only the current app session.',
    fallback: 'Location checks system services first and falls back to a recent last-known fix when current GPS fails.',
  },
  {
    area: 'Camera and QR',
    android: 'Camera hardware can be missing or busy, and barcode event order differs by platform.',
    ios: 'Only one active camera preview should be mounted at a time.',
    fallback: 'The scanner checks availability, reads QR data only, and unmounts the preview while unfocused.',
  },
  {
    area: 'Media and files',
    android: 'The OS can destroy the activity after returning from the media picker.',
    ios: 'Selected photo access can be limited, and some asset names or IDs can be unavailable.',
    fallback: 'Image picking restores pending Android results and surfaces limited photo access metadata.',
  },
  {
    area: 'Sharing',
    android: 'Share targets depend on installed apps and accepted MIME types.',
    ios: 'The share sheet may reject unavailable or temporary files.',
    fallback: 'The file service checks native sharing availability before opening the share sheet.',
  },
  {
    area: 'Secure storage and biometrics',
    android: 'Secure items are removed on uninstall and biometric changes can invalidate protected keys.',
    ios: 'Keychain behavior can persist across reinstall and biometric prompts need Face ID usage text.',
    fallback: 'The app checks SecureStore availability, configures Face ID text, and treats biometric storage as optional.',
  },
  {
    area: 'Haptics',
    android: 'Vibration hardware and system settings control whether feedback is felt.',
    ios: 'Low Power Mode, camera activity, dictation, or disabled Taptic Engine can make haptics no-op.',
    fallback: 'Haptic calls are best-effort and never block the action that triggered them.',
  },
  {
    area: 'Links and browser handoff',
    android: 'Custom tabs depend on the installed/default browser.',
    ios: 'URL scheme checks are stricter for non-web schemes.',
    fallback: 'Browser handoff falls back to external links, and unsupported custom schemes show a clear error.',
  },
];

export function getPlatformProfile(): PlatformProfile {
  const owner =
    Constants.appOwnership === 'expo'
      ? 'Development runtime'
      : Constants.appOwnership ?? 'standalone/custom';

  return {
    appOwnership: owner,
    deviceName: Device.deviceName ?? 'Unknown device',
    isDevice: Device.isDevice,
    platform: Platform.OS,
    sdkVersion: Constants.expoConfig?.sdkVersion ?? 'Unknown',
  };
}
