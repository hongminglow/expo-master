import {
  clearAuthSession,
  loadAuthSession,
  loadRememberedLogin,
  persistAuthSession,
  saveRememberedLogin,
} from '../auth-storage';
import type { AuthSession, KeyValueStorage } from '../types';

function createMemoryStorage(): KeyValueStorage {
  const values = new Map<string, string>();

  return {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => {
      values.set(key, value);
    },
    removeItem: async (key) => {
      values.delete(key);
    },
  };
}

const activeSession: AuthSession = {
  token: 'demo-token',
  issuedAt: 1_000,
  expiresAt: 9_999_999_999,
  user: {
    id: 'u_demo_admin',
    name: 'Demo Admin',
    email: 'admin@example.com',
    role: 'Operations Lead',
  },
};

describe('auth storage', () => {
  it('persists remembered email without storing a password', async () => {
    const storage = createMemoryStorage();

    await saveRememberedLogin(storage, {
      rememberMe: true,
      email: ' Admin@Example.com ',
    });

    await expect(loadRememberedLogin(storage)).resolves.toEqual({
      rememberMe: true,
      email: 'admin@example.com',
    });
  });

  it('clears remembered email when remember me is disabled', async () => {
    const storage = createMemoryStorage();

    await saveRememberedLogin(storage, {
      rememberMe: true,
      email: 'admin@example.com',
    });
    await saveRememberedLogin(storage, {
      rememberMe: false,
      email: 'admin@example.com',
    });

    await expect(loadRememberedLogin(storage)).resolves.toEqual({
      rememberMe: false,
      email: '',
    });
  });

  it('hydrates only unexpired persisted sessions', async () => {
    const storage = createMemoryStorage();

    await persistAuthSession(storage, activeSession);
    await expect(loadAuthSession(storage, 2_000)).resolves.toEqual(activeSession);

    await persistAuthSession(storage, {
      ...activeSession,
      expiresAt: 1_999,
    });
    await expect(loadAuthSession(storage, 2_000)).resolves.toBeNull();
  });

  it('removes the persisted session without touching remembered login data', async () => {
    const storage = createMemoryStorage();

    await saveRememberedLogin(storage, {
      rememberMe: true,
      email: 'admin@example.com',
    });
    await persistAuthSession(storage, activeSession);
    await clearAuthSession(storage);

    await expect(loadAuthSession(storage)).resolves.toBeNull();
    await expect(loadRememberedLogin(storage)).resolves.toEqual({
      rememberMe: true,
      email: 'admin@example.com',
    });
  });
});
