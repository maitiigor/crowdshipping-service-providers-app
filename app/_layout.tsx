import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/hooks/useColorScheme";
import "@/lib/nativewind"; // Must be imported before components
import "@/styles/global.css";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
// global styles already imported above via alias
import { getQueryClient } from "@/lib/queryClient";
import { store } from "@/store";
import {
    createNotificationChannels,
    initializeFCM,
    setupBackgroundMessageHandler
} from "@/utils/fcmService";
import { setupNotificationResponseListener } from "@/utils/notificationHelper";
import messaging from '@react-native-firebase/messaging';
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { useFCM } from "../hooks/useFCM";
import { ensureI18n } from "../lib/i18n";

// Set up background message handler (must be outside component)
setupBackgroundMessageHandler();


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  // Initialize FCM hook (handles foreground messages)
  const { fcmToken, permissionGranted } = useFCM();
  
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // Poppins fonts for headers/titles
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    // Inter fonts for body text
    "Inter-Regular": require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
    "Inter-Italic": require("../assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf"),
  });

  const [i18nReady, setI18nReady] = React.useState(false);

  // Load phone input CSS only on web to show country flags (web only)
  React.useEffect(() => {
    if (Platform.OS === "web") {
      // Dynamic import avoids bundling into native builds
      import("react-phone-number-input/style.css").catch(() => {});
    }
  }, []);

  React.useEffect(() => {
    ensureI18n().finally(() => setI18nReady(true));
  }, []);

  // Initialize FCM and notification handling
  React.useEffect(() => {
    if (!loaded || !i18nReady) return;

    // Initialize FCM
    initializeFCM().then((token) => {
      if (token) {
        console.log('FCM initialized with token:', token);
        // TODO: Send token to backend API
        // await sendTokenToBackend(token);
      }
    });

    // Create notification channels for Android
    createNotificationChannels();

    // Handle notification taps
    const notificationSubscription = setupNotificationResponseListener((data) => {
      // Navigate based on notification data
      if (data?.screen) {
        router.push(data.screen as any);
      } else if (data?.type) {
        // Handle different notification types
        switch (data.type) {
          case 'booking_update':
          case 'booking_new':
            router.push((data.bookingId ? `/screens/bookings/${data.bookingId}` : '/screens/bookings') as any);
            break;
          case 'trip_update':
          case 'trip_new':
            router.push((data.tripId ? `/screens/trips/${data.tripId}` : '/screens/trips') as any);
            break;
          case 'message':
          case 'chat':
            router.push((data.chatId ? `/screens/chats/${data.chatId}` : '/screens/chats') as any);
            break;
          default:
            router.push('/screens/dashboard');
        }
      }
    });

    // Handle FCM token refresh
    const tokenRefreshSubscription = messaging().onTokenRefresh((token) => {
      console.log('FCM token refreshed:', token);
      // TODO: Update token on backend
      // await updateTokenOnBackend(token);
    });

    return () => {
      notificationSubscription.remove();
      tokenRefreshSubscription();
    };
  }, [loaded, i18nReady, router]);

  if (!loaded || !i18nReady) {
    // Async font loading only occurs in development.
    return null;
  }


  return (
    <GluestackUIProvider mode="light">
      <Provider store={store}>
        <QueryClientProvider client={getQueryClient()}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <GestureHandlerRootView>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="screens/language-selection" options={{ headerShown: false }} />
                <Stack.Screen name="screens/onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="screens/dashboard" options={{ headerShown: false }} />
                <Stack.Screen name="screens/trips" options={{ headerShown: false }} />
                <Stack.Screen name="screens/bookings" options={{ headerShown: false }} />
                <Stack.Screen name="screens/vehicles" options={{ headerShown: false }} />
                <Stack.Screen name="screens/payments" options={{ headerShown: false }} />
                <Stack.Screen name="screens/notifications" options={{ headerShown: false }} />
                <Stack.Screen name="screens/chats" options={{ headerShown: false }} />
                <Stack.Screen name="screens/reports" options={{ headerShown: false }} />
                <Stack.Screen name="screens/support" options={{ headerShown: false }} />
                <Stack.Screen name="screens/profile" options={{ headerShown: false }} />
                <Stack.Screen name="screens/settings" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </GestureHandlerRootView>
            <StatusBar style="auto" />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </GluestackUIProvider>
  );
}
