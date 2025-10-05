import { Stack } from "expo-router";
import React from "react";

export default function DashboardLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="post-trip" />
            <Stack.Screen name="review-bids" />
            <Stack.Screen name="depart-port" />
            <Stack.Screen name="arrived-location" />
            <Stack.Screen name="driver-feedback" />
        </Stack>
    );
}