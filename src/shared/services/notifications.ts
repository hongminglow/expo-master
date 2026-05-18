import { isRunningInExpoGo } from 'expo';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import scheduleNotificationAsync from 'expo-notifications/build/scheduleNotificationAsync';
import { Platform } from 'react-native';

let notificationHandlerConfigured = false;

export type NotificationReadiness = {
  status: string;
  canUsePushToken: boolean;
  expoPushToken?: string;
  note: string;
};

type NotificationRuntime = {
  appOwnership: string | null;
  expoGoConfig: unknown;
  expoVersion: string | null;
  isExpoGo: boolean;
  platform: string;
};

function getProjectId() {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.projectId
  );
}

function getNotificationRuntime(): NotificationRuntime {
  return {
    appOwnership: Constants.appOwnership,
    expoGoConfig: Constants.expoGoConfig,
    expoVersion: Constants.expoVersion,
    isExpoGo: isRunningInExpoGo(),
    platform: Platform.OS,
  };
}

export function isPushTokenUnsupportedRuntime(runtime: NotificationRuntime) {
  if (runtime.platform === 'web') {
    return true;
  }

  return (
    runtime.isExpoGo ||
    runtime.appOwnership === 'expo' ||
    Boolean(runtime.expoGoConfig) ||
    Boolean(runtime.expoVersion)
  );
}

async function ensureAndroidNotificationChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  const [{ default: setNotificationChannelAsync }, { AndroidImportance }] = await Promise.all([
    import('expo-notifications/build/setNotificationChannelAsync.android'),
    import('expo-notifications/build/NotificationChannelManager.types'),
  ]);

  await setNotificationChannelAsync('default', {
    name: 'default',
    importance: AndroidImportance.DEFAULT,
  });
}

async function requestNotificationPermission() {
  const existing = await getPermissionsAsync();
  return existing.status === 'granted' ? existing : requestPermissionsAsync();
}

export async function configureNotificationHandler() {
  if (notificationHandlerConfigured) {
    return true;
  }

  try {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    notificationHandlerConfigured = true;
  } catch {
    return false;
  }

  return true;
}

export async function getNotificationReadiness(): Promise<NotificationReadiness> {
  if (Platform.OS === 'web') {
    return {
      status: 'unsupported',
      canUsePushToken: false,
      note: 'Notifications require a native runtime on iOS or Android.',
    };
  }

  const runtime = getNotificationRuntime();
  if (isPushTokenUnsupportedRuntime(runtime)) {
    return {
      status: 'local-only',
      canUsePushToken: false,
      note: 'Local notifications are available here. Push tokens require a custom development build.',
    };
  }

  await configureNotificationHandler();
  await ensureAndroidNotificationChannel();
  const permission = await requestNotificationPermission();

  if (permission.status !== 'granted') {
    return {
      status: permission.status,
      canUsePushToken: false,
      note: 'Notification permission was not granted.',
    };
  }

  if (!Device.isDevice) {
    return {
      status: permission.status,
      canUsePushToken: false,
      note: 'Local notifications work in development, but push tokens require a physical device.',
    };
  }

  const projectId = getProjectId();
  if (!projectId) {
    return {
      status: permission.status,
      canUsePushToken: false,
      note: 'Add an EAS projectId to app config before requesting push tokens.',
    };
  }

  const { default: getExpoPushTokenAsync } = await import(
    'expo-notifications/build/getExpoPushTokenAsync'
  );
  const token = await getExpoPushTokenAsync({ projectId });

  return {
    status: permission.status,
    canUsePushToken: true,
    expoPushToken: token.data,
    note: 'Push-token registration is ready for a notification service.',
  };
}

export async function scheduleLocalNotification() {
  await configureNotificationHandler();
  await ensureAndroidNotificationChannel();
  const permission = await requestNotificationPermission();

  if (permission.status !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  return scheduleNotificationAsync({
    content: {
      title: 'Pulse Mobile',
      body: 'Local notifications are configured and ready.',
      data: { route: '/showcase/notifications' },
    },
    trigger: null,
  });
}
