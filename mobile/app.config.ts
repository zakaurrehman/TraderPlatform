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
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  backgroundColor: '#0a0a0f',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0a0a0f',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.tradewithshafy.app',
    infoPlist: {
      UIBackgroundModes: ['remote-notification'],
      NSUserTrackingUsageDescription:
        'Used to keep you signed in and deliver trade alerts.',
    },
  },
  android: {
    package: 'com.tradewithshafy.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0a0a0f',
    },
    permissions: ['NOTIFICATIONS', 'POST_NOTIFICATIONS'],
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#f5c518',
      },
    ],
    [
      'expo-build-properties',
      {
        // Google Play requires API 35+ for new apps as of 2025.
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: '35.0.0',
        },
      },
    ],
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
