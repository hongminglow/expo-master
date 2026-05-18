import { platformReadinessItems } from '../platform-readiness';

describe('platform readiness matrix', () => {
  it('covers common Android and iOS mobile pitfalls', () => {
    expect(platformReadinessItems.map((item) => item.area)).toEqual([
      'Safe areas and system bars',
      'Keyboard behavior',
      'Permissions',
      'Notifications',
      'Location',
      'Camera and QR',
      'Media and files',
      'Sharing',
      'Secure storage and biometrics',
      'Haptics',
      'Links and browser handoff',
    ]);
  });

  it('defines a fallback for every platform difference', () => {
    for (const item of platformReadinessItems) {
      expect(item.android).toBeTruthy();
      expect(item.ios).toBeTruthy();
      expect(item.fallback).toBeTruthy();
    }
  });
});
