import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  clearAuthSession,
  loadAuthSession,
  loadRememberedLogin,
  persistAuthSession,
  saveRememberedLogin,
} from './auth-storage';
import { authenticateMockAccount } from './auth-service';
import { asyncStorageAdapter, secureStorageAdapter } from './storage-adapters';
import type { AuthContextValue, AuthSession, AuthStatus, LoginCredentials, RememberedLogin } from './types';

const AuthContext = createContext<AuthContextValue | null>(null);

const emptyRememberedLogin: RememberedLogin = {
  email: '',
  rememberMe: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [rememberedLogin, setRememberedLogin] = useState<RememberedLogin>(emptyRememberedLogin);

  const hydrateSession = useCallback(async () => {
    setStatus('loading');
    const [remembered, persistedSession] = await Promise.all([
      loadRememberedLogin(asyncStorageAdapter),
      loadAuthSession(secureStorageAdapter),
    ]);

    setRememberedLogin(remembered);
    setSession(persistedSession);
    setStatus(persistedSession ? 'authenticated' : 'unauthenticated');
  }, []);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const nextSession = await authenticateMockAccount(credentials);
    const nextRememberedLogin = {
      rememberMe: credentials.rememberMe,
      email: credentials.email,
    };

    await saveRememberedLogin(asyncStorageAdapter, nextRememberedLogin);

    if (credentials.rememberMe) {
      await persistAuthSession(secureStorageAdapter, nextSession);
    } else {
      await clearAuthSession(secureStorageAdapter);
    }

    setRememberedLogin(await loadRememberedLogin(asyncStorageAdapter));
    setSession(nextSession);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    await clearAuthSession(secureStorageAdapter);
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: session?.user ?? null,
      rememberedLogin,
      login,
      logout,
      hydrateSession,
    }),
    [hydrateSession, login, logout, rememberedLogin, session?.user, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return value;
}
