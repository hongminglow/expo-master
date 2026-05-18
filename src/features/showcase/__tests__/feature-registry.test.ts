import { featureModules, getFeatureModule } from '../feature-registry';

describe('feature registry', () => {
  it('contains the required capability modules', () => {
    expect(featureModules.map((feature) => feature.id)).toEqual([
      'qr',
      'notifications',
      'location',
      'media-files',
      'security',
      'utilities',
      'device-system',
    ]);
  });

  it('defines route, permission, icon, and platform metadata for every module', () => {
    for (const feature of featureModules) {
      expect(feature.title).toBeTruthy();
      expect(feature.description).toBeTruthy();
      expect(feature.route).toMatch(/^\/showcase\//);
      expect(feature.icon).toBeTruthy();
      expect(feature.permissions.length).toBeGreaterThan(0);
      expect(feature.platforms).toEqual(expect.arrayContaining(['ios', 'android']));
    }
  });

  it('can look up a feature by id', () => {
    expect(getFeatureModule('qr')?.title).toBe('QR Scanner');
    expect(getFeatureModule('missing')).toBeUndefined();
  });
});
