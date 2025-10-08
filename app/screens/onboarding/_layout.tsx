import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="registration" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="edit-profile-documents" />
      <Stack.Screen name="edit-profile-payment" />
      <Stack.Screen name="document-verification" />
      <Stack.Screen name="create-pin" />
      <Stack.Screen name="terms-conditions" />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
}

