import { Stack } from "expo-router";
import React from "react";

export default function PaymentsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="transaction-details" />
            <Stack.Screen name="history" />
        </Stack>
    );
}