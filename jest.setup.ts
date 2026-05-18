jest.mock('expo-font', () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  Redirect: () => null,
  Stack: ({ children }: { children?: React.ReactNode }) => children,
  router: {
    replace: jest.fn(),
  },
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));
