import type { AuthSession, KeyValueStorage, RememberedLogin } from './types';

const REMEMBERED_LOGIN_KEY = 'pulse.rememberedLogin.v1';
const AUTH_SESSION_KEY = 'pulse.authSession.v1';

const defaultRememberedLogin: RememberedLogin = {
  email: '',
  rememberMe: false,
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function parseJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function loadRememberedLogin(storage: KeyValueStorage): Promise<RememberedLogin> {
  const rememberedLogin = parseJson<RememberedLogin>(await storage.getItem(REMEMBERED_LOGIN_KEY));

  if (!rememberedLogin?.rememberMe || !rememberedLogin.email) {
    return defaultRememberedLogin;
  }

  return {
    rememberMe: true,
    email: normalizeEmail(rememberedLogin.email),
  };
}

export async function saveRememberedLogin(
  storage: KeyValueStorage,
  rememberedLogin: RememberedLogin,
) {
  if (!rememberedLogin.rememberMe) {
    await storage.removeItem(REMEMBERED_LOGIN_KEY);
    return;
  }

  await storage.setItem(
    REMEMBERED_LOGIN_KEY,
    JSON.stringify({
      rememberMe: true,
      email: normalizeEmail(rememberedLogin.email),
    }),
  );
}

export async function loadAuthSession(
  storage: KeyValueStorage,
  now = Date.now(),
): Promise<AuthSession | null> {
  const session = parseJson<AuthSession>(await storage.getItem(AUTH_SESSION_KEY));

  if (!session?.token || !session.user || session.expiresAt <= now) {
    await storage.removeItem(AUTH_SESSION_KEY);
    return null;
  }

  return session;
}

export async function persistAuthSession(storage: KeyValueStorage, session: AuthSession) {
  await storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export async function clearAuthSession(storage: KeyValueStorage) {
  await storage.removeItem(AUTH_SESSION_KEY);
}
