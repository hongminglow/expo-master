import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

let notificationHandlerConfigured = false;

type NotificationsModule = typeof import('expo-notifications');

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

async function isRunningInExpoGoRuntime() {
  try {
    const Expo = await import('expo');
    return Expo.isRunningInExpoGo();
  } catch {
    return false;
  }
}

async function getNotificationRuntime(): Promise<NotificationRuntime> {
  return {
    appOwnership: Constants.appOwnership,
    expoGoConfig: Constants.expoGoConfig,
    expoVersion: Constants.expoVersion,
    isExpoGo: await isRunningInExpoGoRuntime(),
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

async function loadNotifications() {
  return import('expo-notifications');
}

async function ensureAndroidNotificationChannel(Notifications: NotificationsModule) {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function requestNotificationPermission(Notifications: NotificationsModule) {
  const existing = await Notifications.getPermissionsAsync();
  return existing.status === 'granted' ? existing : Notifications.requestPermissionsAsync();
}

export async function configureNotificationHandler(Notifications?: NotificationsModule) {
  if (notificationHandlerConfigured) {
    return true;
  }

  try {
    const NotificationApi = Notifications ?? (await loadNotifications());
    NotificationApi.setNotificationHandler({
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

  const runtime = await getNotificationRuntime();
  if (isPushTokenUnsupportedRuntime(runtime)) {
    return {
      status: 'local-only',
      canUsePushToken: false,
      note: 'Local notifications are available here. Push tokens require a custom development build.',
    };
  }

  const Notifications = await loadNotifications();
  await configureNotificationHandler(Notifications);
  await ensureAndroidNotificationChannel(Notifications);
  const permission = await requestNotificationPermission(Notifications);

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

  const token = await Notifications.getExpoPushTokenAsync({ projectId });

  return {
    status: permission.status,
    canUsePushToken: true,
    expoPushToken: token.data,
    note: 'Push-token registration is ready for a notification service.',
  };
}

export async function scheduleLocalNotification() {
  const Notifications = await loadNotifications();
  await configureNotificationHandler(Notifications);
  await ensureAndroidNotificationChannel(Notifications);
  const permission = await requestNotificationPermission(Notifications);

  if (permission.status !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pulse Mobile',
      body: 'Local notifications are configured and ready.',
      data: { route: '/showcase/notifications' },
    },
    trigger: null,
  });
}
