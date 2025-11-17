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
            <Stack.Screen name="post-maritime-trip" />
            <Stack.Screen name="post-ground-trip" />
            <Stack.Screen name="post-air-trip" />
            <Stack.Screen name="review-bids" />
            <Stack.Screen name="negotiate-bid" />
            <Stack.Screen name="depart-port" />
            <Stack.Screen name="arrived-location" />
            <Stack.Screen name="driver-feedback" />
            <Stack.Screen name="air-trip-management" />
            <Stack.Screen name="trip-status-management" />
        </Stack>
    );
}