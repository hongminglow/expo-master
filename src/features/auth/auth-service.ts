import type { AuthSession, LoginCredentials } from './types';

export const DEMO_ACCOUNT = {
  email: 'admin@example.com',
  password: 'password',
} as const;

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export async function authenticateMockAccount(
  credentials: LoginCredentials,
  now = Date.now(),
): Promise<AuthSession> {
  const email = credentials.email.trim().toLowerCase();

  if (email !== DEMO_ACCOUNT.email || credentials.password !== DEMO_ACCOUNT.password) {
    throw new Error('Invalid email or password.');
  }

  return {
    token: `demo-session-${now}`,
    issuedAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    user: {
      id: 'u_demo_admin',
      name: 'Demo Admin',
      email,
      role: 'Operations Lead',
    },
  };
}
