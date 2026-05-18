import * as Location from 'expo-location';

export type CurrentLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
  source: 'current' | 'last-known';
};

export async function requestCurrentLocation(): Promise<CurrentLocation> {
  const servicesEnabled = await Location.hasServicesEnabledAsync();

  if (!servicesEnabled) {
    throw new Error('Location services are disabled. Enable location services in system settings.');
  }

  const permission = await Location.requestForegroundPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      permission.canAskAgain
        ? 'Location permission was not granted.'
        : 'Location access is blocked. Open app settings to allow location while using the app.',
    );
  }

  let position: Location.LocationObject | null = null;
  let source: CurrentLocation['source'] = 'current';

  try {
    position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch {
    try {
      position = await Location.getLastKnownPositionAsync({
        maxAge: 60_000,
        requiredAccuracy: 1000,
      });
    } catch {
      position = null;
    }
    source = 'last-known';
  }

  if (!position) {
    throw new Error('Location is unavailable right now. Move outdoors or check simulator location settings.');
  }

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
    source,
  };
}
