import { Stack } from 'expo-router';

export default function ChatsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="conversation" />
            <Stack.Screen name="call" />
        </Stack>
    );
}