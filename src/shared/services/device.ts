import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import { Platform } from 'react-native';

export type DeviceSnapshot = {
  rows: { label: string; value: string }[];
};

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return 'Unavailable';
  }

  return String(value);
}

export async function getDeviceSnapshot(): Promise<DeviceSnapshot> {
  const network = await Network.getNetworkStateAsync();

  return {
    rows: [
      { label: 'Platform', value: Platform.OS },
      { label: 'Device name', value: displayValue(Device.deviceName) },
      { label: 'Brand', value: displayValue(Device.brand) },
      { label: 'Model', value: displayValue(Device.modelName) },
      { label: 'OS', value: `${displayValue(Device.osName)} ${displayValue(Device.osVersion)}` },
      { label: 'App ID', value: displayValue(Application.applicationId) },
      { label: 'App version', value: displayValue(Application.nativeApplicationVersion) },
      { label: 'Expo SDK', value: displayValue(Constants.expoConfig?.sdkVersion) },
      { label: 'Network type', value: displayValue(network.type) },
      { label: 'Internet reachable', value: displayValue(network.isInternetReachable) },
    ],
  };
}
