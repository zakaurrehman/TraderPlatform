import { ExpoConfig, ConfigContext } from 'expo/config'

/**
 * "Trade with Shafy" — Expo app config.
 * API base URL is injected via env (EXPO_PUBLIC_API_URL) so dev/prod
 * can point at different backends without code changes.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Trade with Shafy',
  slug: 'trade-with-shafy',
  scheme: 'tradewithshafy',
  version: '1.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  backgroundColor: '#ffffff',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.tradewithshafy.app',
    infoPlist: {
      UIBackgroundModes: ['remote-notification'],
      // App uses only HTTPS/TLS (standard encryption) — exempt from export docs.
      ITSAppUsesNonExemptEncryption: false,
      // NOTE: Intentionally NO NSUserTrackingUsageDescription — the app does
      // NOT use App Tracking Transparency. Including this key would force us
      // to declare tracking in App Privacy (which we don't actually do) and
      // gets rejected by Apple's automated privacy review.
    },
  },
  android: {
    package: 'com.tradewithshafy.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2563eb',
    },
    permissions: ['NOTIFICATIONS', 'POST_NOTIFICATIONS'],
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-secure-store',
    'expo-web-browser',
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#2563eb',
      },
    ],
    // NOTE: SDK 54 defaults to Android compile/target SDK 36 — no
    // expo-build-properties override needed (Play requires 35+).
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? '2f0acad8-3f21-4d53-a156-9b4094fb530f',
    },
  },
})
