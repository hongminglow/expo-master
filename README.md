# Enterprise Expo Mobile Template

An Expo SDK 55 TypeScript starter for enterprise mobile apps. It uses Expo Router, feature-first source folders, a protected app shell, AsyncStorage-backed remember-me, SecureStore-backed session persistence, and native capability showcase screens.

## Demo Account

- Email: `admin@example.com`
- Password: `enterprise`

The remember-me flow stores only the email and remember flag in AsyncStorage. The demo session is persisted in SecureStore only when remember-me is enabled.

## Main Features

- Auth flow with protected routes and session hydration.
- Home dashboard driven by a typed Expo feature registry.
- QR scanning with `expo-camera`.
- Notification readiness and local notification scheduling with `expo-notifications`.
- Foreground location with `expo-location`.
- Image/document picking, file metadata, and sharing.
- Biometrics and SecureStore examples.
- Device, app, network, clipboard, haptics, linking, and in-app browser utilities.

## Structure

- `src/app`: Expo Router route groups for auth and protected app screens.
- `src/features/auth`: auth provider, mock auth service, storage helpers, login form, and tests.
- `src/features/showcase`: feature registry, showcase components, and tests.
- `src/shared`: UI primitives, theme tokens, and native service wrappers.

## Commands

```bash
bun install
bun run start
bun run web
bun run lint
bun run typecheck
bun run test
```

This template is optimized for Expo development builds because several native demos are limited in Expo Go or web. Web remains useful for shell-level validation, login, and route checks.

## Verification

The current automated checks cover:

- Auth storage behavior.
- Login form validation and submit payloads.
- Required showcase registry modules.
- TypeScript strict compilation.
- Expo ESLint config.
- Expo web export.
