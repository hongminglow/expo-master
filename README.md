# Enterprise Expo Mobile Template

An Expo SDK 54 TypeScript starter for enterprise mobile apps. It uses Expo Router, feature-first source folders, a protected app shell, AsyncStorage-backed remember-me, SecureStore-backed session persistence, and native capability showcase screens.

## Demo Account

- Email: `admin@example.com`
- Password: `password`

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

If Bun on Windows cannot spawn local tools, use the direct Node entrypoint:

```bash
node ./node_modules/expo/bin/cli start
```

## Android Phone With Expo Go

This project targets SDK 54 so it can open in the Play Store version of Expo Go.

1. Connect your Android phone and computer to the same Wi-Fi.
2. Run `bun run start`.
3. Scan the QR code with Expo Go.
4. If LAN cannot connect, press `s` in the Expo terminal to switch connection mode, then choose Tunnel.

Some native modules still behave differently in Expo Go than in a production build, but the project is now aligned to the SDK version supported by Play Store Expo Go.

## Verification

The current automated checks cover:

- Auth storage behavior.
- Login form validation and submit payloads.
- Required showcase registry modules.
- TypeScript strict compilation.
- Expo ESLint config.
- Expo web export.
