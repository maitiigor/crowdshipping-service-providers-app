import { Stack } from "expo-router";
import React from "react";

export default function ReportsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="new" />
            <Stack.Screen name="status" />
            <Stack.Screen name="details" />
        </Stack>
    );
}