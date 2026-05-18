import type { Href } from 'expo-router';

export type FeatureModuleId =
  | 'qr'
  | 'notifications'
  | 'location'
  | 'media-files'
  | 'security'
  | 'device-system';

export type FeatureModule = {
  id: FeatureModuleId;
  title: string;
  description: string;
  route: Href;
  icon: string;
  permissions: string[];
  platforms: ('ios' | 'android' | 'web')[];
};

export const featureModules: FeatureModule[] = [
  {
    id: 'qr',
    title: 'QR Scanner',
    description: 'Scan QR codes with camera permission handling and result actions.',
    route: '/showcase/qr',
    icon: 'camera',
    permissions: ['Camera'],
    platforms: ['ios', 'android', 'web'],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Request notification access, inspect push readiness, and schedule local alerts.',
    route: '/showcase/notifications',
    icon: 'bell',
    permissions: ['Notifications'],
    platforms: ['ios', 'android'],
  },
  {
    id: 'location',
    title: 'Location',
    description: 'Request foreground location and display current coordinates.',
    route: '/showcase/location',
    icon: 'map-pin',
    permissions: ['Location'],
    platforms: ['ios', 'android', 'web'],
  },
  {
    id: 'media-files',
    title: 'Media & Files',
    description: 'Pick images and documents, inspect metadata, and share selected files.',
    route: '/showcase/media-files',
    icon: 'folder',
    permissions: ['Photos', 'Documents', 'Sharing'],
    platforms: ['ios', 'android', 'web'],
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Check biometrics and store a sample secret with SecureStore.',
    route: '/showcase/security',
    icon: 'lock',
    permissions: ['Biometrics', 'Secure storage'],
    platforms: ['ios', 'android', 'web'],
  },
  {
    id: 'device-system',
    title: 'Device & System',
    description: 'Show device, app, network, clipboard, haptics, linking, and browser utilities.',
    route: '/showcase/device-system',
    icon: 'smartphone',
    permissions: ['Network', 'Clipboard', 'External links'],
    platforms: ['ios', 'android', 'web'],
  },
];

export function getFeatureModule(id: string) {
  return featureModules.find((feature) => feature.id === id);
}
