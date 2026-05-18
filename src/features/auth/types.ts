export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthSession = {
  token: string;
  issuedAt: number;
  expiresAt: number;
  user: User;
};

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RememberedLogin = {
  email: string;
  rememberMe: boolean;
};

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  rememberedLogin: RememberedLogin;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hydrateSession: () => Promise<void>;
};

export type KeyValueStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};
