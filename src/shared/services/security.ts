import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DEMO_SECRET_KEY = 'pulse.demoSecret.v1';
const webSecureFallback = new Map<string, string>();

export type BiometricReadiness = {
  canUseBiometricStorage: boolean;
  hasHardware: boolean;
  isEnrolled: boolean;
  secureStoreAvailable: boolean;
  supportedTypes: string[];
  warning?: string;
};

function describeAuthType(type: LocalAuthentication.AuthenticationType) {
  switch (type) {
    case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
      return 'Face recognition';
    case LocalAuthentication.AuthenticationType.FINGERPRINT:
      return 'Fingerprint';
    case LocalAuthentication.AuthenticationType.IRIS:
      return 'Iris';
    default:
      return 'Unknown';
  }
}

export async function getBiometricReadiness(): Promise<BiometricReadiness> {
  if (Platform.OS === 'web') {
    return {
      canUseBiometricStorage: false,
      hasHardware: false,
      isEnrolled: false,
      secureStoreAvailable: false,
      supportedTypes: ['Web fallback'],
      warning: 'Biometric prompts and native secure storage require iOS or Android.',
    };
  }

  const [hasHardware, isEnrolled, supported, secureStoreAvailable] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
    SecureStore.isAvailableAsync(),
  ]);

  return {
    canUseBiometricStorage: SecureStore.canUseBiometricAuthentication(),
    hasHardware,
    isEnrolled,
    secureStoreAvailable,
    supportedTypes: supported.map(describeAuthType),
    warning:
      hasHardware && !isEnrolled
        ? 'Biometric hardware is present, but the user has not enrolled a biometric method.'
        : undefined,
  };
}

export async function authenticateWithBiometrics() {
  if (Platform.OS === 'web') {
    return {
      success: false,
      warning: 'Biometric prompts are not available on web.',
    };
  }

  return LocalAuthentication.authenticateAsync({
    promptMessage: 'Verify access',
    cancelLabel: 'Cancel',
  });
}

export async function saveDemoSecret(value: string) {
  if (Platform.OS === 'web') {
    webSecureFallback.set(DEMO_SECRET_KEY, value);
    return;
  }

  if (!(await SecureStore.isAvailableAsync())) {
    throw new Error('Secure storage is not available on this device.');
  }

  await SecureStore.setItemAsync(DEMO_SECRET_KEY, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function readDemoSecret() {
  if (Platform.OS === 'web') {
    return webSecureFallback.get(DEMO_SECRET_KEY) ?? null;
  }

  if (!(await SecureStore.isAvailableAsync())) {
    throw new Error('Secure storage is not available on this device.');
  }

  return SecureStore.getItemAsync(DEMO_SECRET_KEY, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}
