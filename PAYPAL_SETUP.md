// Capacitor config — wraps the BreakFree web app as a real native iOS/Android app.
// To use: run `npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android`
// then `npx cap add ios` and `npx cap add android`.
// This file is ready; the native projects will be generated on your machine.

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.breakfree.app',
  appName: 'BreakFree',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // Live URL — Capacitor will load this in the WebView for production builds.
    // For dev, use http://localhost:5173 (Vite default).
    url: 'https://breakfree-xyz.vercel.app',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#07080f',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'small',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#07080f',
    },
    PushNotifications: {
      // Optional — enable for daily check-in reminders
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Haptics: {
      enabled: true,
    },
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#07080f',
    allowsLinkPreview: false,
    // App Store ID (fill in after first publish)
    appStoreId: '',
  },
  android: {
    backgroundColor: '#07080f',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;