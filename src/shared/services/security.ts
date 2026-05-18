import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DEMO_SECRET_KEY = 'enterprise.demoSecret.v1';
const webSecureFallback = new Map<string, string>();

export type BiometricReadiness = {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: string[];
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
      hasHardware: false,
      isEnrolled: false,
      supportedTypes: ['Web fallback'],
    };
  }

  const [hasHardware, isEnrolled, supported] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  return {
    hasHardware,
    isEnrolled,
    supportedTypes: supported.map(describeAuthType),
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

  await SecureStore.setItemAsync(DEMO_SECRET_KEY, value);
}

export async function readDemoSecret() {
  if (Platform.OS === 'web') {
    return webSecureFallback.get(DEMO_SECRET_KEY) ?? null;
  }

  return SecureStore.getItemAsync(DEMO_SECRET_KEY);
}
