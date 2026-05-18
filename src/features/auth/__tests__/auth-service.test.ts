import { authenticateMockAccount } from '../auth-service';

describe('auth service', () => {
  it('accepts the documented demo account credentials', async () => {
    await expect(
      authenticateMockAccount({
        email: 'admin@example.com',
        password: 'password',
        rememberMe: true,
      }),
    ).resolves.toMatchObject({
      user: {
        email: 'admin@example.com',
        name: 'Demo Admin',
      },
    });
  });

  it('rejects an invalid password', async () => {
    await expect(
      authenticateMockAccount({
        email: 'admin@example.com',
        password: 'password1',
        rememberMe: true,
      }),
    ).rejects.toThrow('Invalid email or password.');
  });
});
