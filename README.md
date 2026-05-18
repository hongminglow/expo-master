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
- Quick utilities for clipboard, haptics, text sharing, links, and in-app browser handoff.
- Device, app, network, clipboard, haptics, linking, and in-app browser utilities.

## Coverage Matrix

This template intentionally covers the common mobile capabilities that most teams need early:

| Area | Included |
| --- | --- |
| Authentication | Login, protected routes, session hydration, logout |
| Local persistence | AsyncStorage remember-me data, SecureStore session/secret storage |
| Camera and QR | QR scanner, result copy/open actions, camera permission handling |
| Notifications | Permission readiness, Android channel setup, local notifications, push-token readiness guard |
| Location | Foreground permission and current coordinates |
| Media and files | Image picker, document picker, file metadata, native share sheet |
| Security | Biometrics readiness, biometric prompt, secure secret storage |
| Quick utilities | Clipboard copy/read, haptics, text sharing, external links, in-app browser |
| Device/system | Device/app/runtime/network diagnostics |
| Utilities | Clipboard, haptics, deep/external links, in-app browser |
| App shell | Expo Router route groups, shared screen layout, reusable UI primitives, theme tokens |
| Quality gates | Strict TypeScript, ESLint, Jest tests, typed feature registry |

## Optional Add-ons

The template is ready to kickstart common business, utility, internal, and consumer apps. It does not install every Expo SDK package by default because many are domain-specific and add permissions, binary size, or setup work.

Good next add-ons when a product needs them:

- `expo-updates` for over-the-air app updates in development/production build workflows.
- `expo-sqlite` for offline-first local data.
- `expo-localization` for multilingual apps.
- `expo-screen-orientation` and `expo-screen-capture` for media, kiosk, or secure-screen flows.
- `expo-calendar`, `expo-contacts`, `expo-mail-composer`, `expo-sms`, or `expo-print` for productivity apps.
- `react-native-maps` when the app needs maps, not just coordinates.
- `expo-audio` / `expo-video` for media-heavy products.
- `expo-task-manager` / background tasks for background work.
- `expo-store-review` for public consumer apps.

For most teams, those should be added per product requirement instead of being forced into the base template.

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

Some native modules still behave differently in Expo Go than in a production build, but the project is aligned to the SDK version supported by Play Store Expo Go.

Android push notifications are not available in Expo Go from SDK 53 onward. The notifications screen therefore supports local notifications in Expo Go and only attempts push-token registration in a custom development build.

## Branding And Release

The app identity is configured in `app.json` as Pulse Mobile. The launcher icon, adaptive icon, and splash logo all point to the generated assets in `assets/images`.

Expo Go does not fully reproduce the final native splash screen on recent SDKs. Use it for day-to-day development on a phone, then verify the exact icon and splash behavior with a release build.

For store releases:

- `expo.version` is the user-facing app version, such as `1.0.0`.
- `android.versionCode` and `ios.buildNumber` are the store build numbers. Each uploaded binary needs a new build number.
- `eas.json` uses the recommended remote version source and production `autoIncrement`, so EAS Build can increment store build numbers automatically.
- Use `eas build --profile preview --platform android` for an installable Android APK.
- Use `eas build --profile production --platform android` for a Play Store-ready Android build.
- Native changes such as new packages, permissions, icons, splash, app name, bundle ID, or SDK upgrades require a new build. JavaScript-only fixes can later be shipped with EAS Update after configuring `expo-updates`.

## Verification

The current automated checks cover:

- Auth storage behavior.
- Login form validation and submit payloads.
- Required showcase registry modules.
- Notification runtime guards for Android Expo Go.
- TypeScript strict compilation.
- Expo ESLint config.
