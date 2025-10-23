import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/hooks/useColorScheme";
import "@/styles/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
// global styles already imported above via alias
import { getQueryClient } from "@/lib/queryClient";
import { store } from "@/store";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { Platform } from "react-native";
import { ensureI18n } from "../lib/i18n";

export default function RootLayout() {
  const colorScheme = useColorScheme();
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

                <Stack.Screen name="screens/bookings" options={{ headerShown: false }} />
                <Stack.Screen name="screens/vehicles" options={{ headerShown: false }} />
                <Stack.Screen name="screens/payments" options={{ headerShown: false }} />
                <Stack.Screen name="screens/notifications" options={{ headerShown: false }} />
                <Stack.Screen name="screens/chats" options={{ headerShown: false }} />
                <Stack.Screen name="screens/reports" options={{ headerShown: false }} />
                <Stack.Screen name="screens/support" options={{ headerShown: false }} />
                <Stack.Screen name="screens/profile" options={{ headerShown: false }} />
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
