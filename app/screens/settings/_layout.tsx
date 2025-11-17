

import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

export default function SettingsLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider
      value={colorScheme === "dark" ? NavigationDarkTheme : NavigationDefaultTheme}
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
