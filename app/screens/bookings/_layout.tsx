import { Stack } from "expo-router";
import React from "react";

export default function BookingsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="history" />
            <Stack.Screen name="details" />
        </Stack>
    );
}