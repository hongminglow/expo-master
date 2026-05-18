import { isPushTokenUnsupportedRuntime } from '../notifications';

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
});
