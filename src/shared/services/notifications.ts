import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

let notificationHandlerConfigured = false;

export type NotificationReadiness = {
  status: string;
  canUsePushToken: boolean;
  expoPushToken?: string;
  note: string;
};

function getProjectId() {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.projectId
  );
}

async function loadNotifications() {
  return import('expo-notifications');
}

export async function configureNotificationHandler() {
  if (notificationHandlerConfigured) {
    return true;
  }

  try {
    const Notifications = await loadNotifications();
    Notifications.setNotificationHandler({
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
      note: 'Expo notifications require a native runtime on iOS or Android.',
    };
  }

  const Notifications = await loadNotifications();
  await configureNotificationHandler();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const existing = await Notifications.getPermissionsAsync();
  const permission =
    existing.status === 'granted' ? existing : await Notifications.requestPermissionsAsync();

  if (permission.status !== 'granted') {
    return {
      status: permission.status,
      canUsePushToken: false,
      note: 'Notification permission was not granted.',
    };
  }

  if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
    return {
      status: permission.status,
      canUsePushToken: false,
      note: 'Android Expo Go supports local notifications only on SDK 54. Push tokens require a development build.',
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
    note: 'Push-token registration is ready for an enterprise notification service.',
  };
}

export async function scheduleLocalNotification() {
  const Notifications = await loadNotifications();
  await configureNotificationHandler();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Enterprise Expo template',
      body: 'Local notifications are configured and ready.',
      data: { route: '/showcase/notifications' },
    },
    trigger: null,
  });
}
