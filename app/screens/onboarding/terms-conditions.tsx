import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsConditions() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <ThemedView className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-3"
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <ThemedText className="text-lg font-semibold text-gray-900">
                    Terms & Condition
                </ThemedText>
            </ThemedView>

            {/* Content */}
            <ScrollView className="flex-1 px-4 py-6">
                {/* Section 1 */}
                <ThemedView className="mb-6">
                    <ThemedText className="text-base font-medium text-[#E75B3B] mb-3">
                        1. Acceptance of Terms
                    </ThemedText>
                    <ThemedText className="text-sm text-gray-700 leading-5 mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    </ThemedText>
                </ThemedView>

                {/* Section 2 */}
                <ThemedView className="mb-6">
                    <ThemedText className="text-base font-medium text-[#E75B3B] mb-3">
                        2. Eligibility
                    </ThemedText>
                    <ThemedText className="text-sm text-gray-700 leading-5 mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    </ThemedText>
                </ThemedView>

                {/* Section 3 */}
                <ThemedView className="mb-6">
                    <ThemedText className="text-base font-medium text-[#E75B3B] mb-3">
                        3. Account Creation
                    </ThemedText>
                    <ThemedText className="text-sm text-gray-700 leading-5 mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    </ThemedText>
                </ThemedView>

                {/* Section 4 */}
                <ThemedView className="mb-6">
                    <ThemedText className="text-base font-medium text-[#E75B3B] mb-3">
                        4. App Usage
                    </ThemedText>
                    <ThemedText className="text-sm text-gray-700 leading-5 mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    </ThemedText>
                </ThemedView>

                {/* Add more sections as needed */}
                <ThemedView className="mb-8">
                    <ThemedText className="text-base font-medium text-[#E75B3B] mb-3">
                        5. Service Modifications
                    </ThemedText>
                    <ThemedText className="text-sm text-gray-700 leading-5 mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    </ThemedText>
                </ThemedView>
            </ScrollView>

            {/* Bottom Buttons */}
            <ThemedView className="px-4 pb-8 pt-4 border-t border-gray-100">
                <TouchableOpacity
                    className="bg-[#E75B3B] py-4 rounded-xl mb-3"
                    onPress={() => router.back()}
                >
                    <ThemedText className="text-white text-center font-semibold text-base">
                        Accept
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-white py-4 rounded-xl border border-[#E75B3B]"
                    onPress={() => router.back()}
                >
                    <ThemedText className="text-[#E75B3B] text-center font-semibold text-base">
                        Decline
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </SafeAreaView>
    );
}