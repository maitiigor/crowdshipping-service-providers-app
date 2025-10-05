import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsConditions() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-3"
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-gray-900">
                    Terms & Condition
                </Text>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-4 py-6">
                {/* Section 1 */}
                <View className="mb-6">
                    <Text className="text-base font-medium text-[#E75B3B] mb-3">
                        1. Acceptance of Terms
                    </Text>
                    <Text className="text-sm text-gray-700 leading-5 mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    </Text>
                </View>

                {/* Section 2 */}
                <View className="mb-6">
                    <Text className="text-base font-medium text-[#E75B3B] mb-3">
                        2. Eligibility
                    </Text>
                    <Text className="text-sm text-gray-700 leading-5 mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    </Text>
                </View>

                {/* Section 3 */}
                <View className="mb-6">
                    <Text className="text-base font-medium text-[#E75B3B] mb-3">
                        3. Account Creation
                    </Text>
                    <Text className="text-sm text-gray-700 leading-5 mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    </Text>
                </View>

                {/* Section 4 */}
                <View className="mb-6">
                    <Text className="text-base font-medium text-[#E75B3B] mb-3">
                        4. App Usage
                    </Text>
                    <Text className="text-sm text-gray-700 leading-5 mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    </Text>
                </View>

                {/* Add more sections as needed */}
                <View className="mb-8">
                    <Text className="text-base font-medium text-[#E75B3B] mb-3">
                        5. Service Modifications
                    </Text>
                    <Text className="text-sm text-gray-700 leading-5 mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View className="px-4 pb-8 pt-4 border-t border-gray-100">
                <TouchableOpacity
                    className="bg-[#E75B3B] py-4 rounded-xl mb-3"
                    onPress={() => router.back()}
                >
                    <Text className="text-white text-center font-semibold text-base">
                        Accept
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-white py-4 rounded-xl border border-[#E75B3B]"
                    onPress={() => router.back()}
                >
                    <Text className="text-[#E75B3B] text-center font-semibold text-base">
                        Decline
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}