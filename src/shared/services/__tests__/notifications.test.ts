import { isPushTokenUnsupportedRuntime, scheduleLocalNotification } from '../notifications';

jest.mock('expo-notifications', () => {
  console.error(
    'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go with the release of SDK 53.',
  );

  return {
    AndroidImportance: {
      DEFAULT: 5,
    },
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    scheduleNotificationAsync: jest.fn(() => Promise.resolve('local-notification-id')),
    setNotificationChannelAsync: jest.fn(() => Promise.resolve(null)),
    setNotificationHandler: jest.fn(),
  };
});

jest.mock('expo-notifications/build/NotificationPermissions', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));

jest.mock('expo-notifications/build/NotificationsHandler', () => ({
  setNotificationHandler: jest.fn(),
}));

jest.mock('expo-notifications/build/NotificationChannelManager.types', () => ({
  AndroidImportance: {
    DEFAULT: 5,
  },
}));

jest.mock('expo-notifications/build/setNotificationChannelAsync.android', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('expo-notifications/build/scheduleNotificationAsync', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve('local-notification-id')),
}));

describe('notification runtime support', () => {
  it('disables push-token registration in Android Expo Go', () => {
    expect(
      isPushTokenUnsupportedRuntime({
        appOwnership: null,
        expoGoConfig: null,
        expoVersion: null,
        isExpoGo: true,
        platform: 'android',
      }),
    ).toBe(true);
  });

  it('uses Expo Go config signals when deprecated appOwnership is unavailable', () => {
    expect(
      isPushTokenUnsupportedRuntime({
        appOwnership: null,
        expoGoConfig: {},
        expoVersion: null,
        isExpoGo: false,
        platform: 'android',
      }),
    ).toBe(true);
  });

  it('allows push-token registration in custom Android builds', () => {
    expect(
      isPushTokenUnsupportedRuntime({
        appOwnership: null,
        expoGoConfig: null,
        expoVersion: null,
        isExpoGo: false,
        platform: 'android',
      }),
    ).toBe(false);
  });

  it('schedules local notifications without importing push-token side effects', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(scheduleLocalNotification()).resolves.toBe('local-notification-id');

    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining('SDK 53'));
    errorSpy.mockRestore();
  });
});
