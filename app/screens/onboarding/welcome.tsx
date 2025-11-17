import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReduxStateDebugger from "../../../components/ReduxStateDebugger";
import { useEditProfileForm } from "../../../hooks/useRedux";

export default function Welcome() {
    const { setStep } = useEditProfileForm();

    const handleRegisterPress = () => {
        // Reset form to step 1 when starting registration
        // setStep(1);
        router.push("/screens/onboarding/registration");
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ThemedView className="flex-1 px-6 py-8">
                {/* Top Logo/Brand Bar */}
                <ThemedView className="items-center mt-8 mb-16">
                    <ThemedView className="w-16 h-6 bg-[#E75B3B] rounded" />
                </ThemedView>

                {/* Main Content */}
                <ThemedView className="flex-1 justify-center">
                    {/* Welcome Title */}
                    <ThemedText className="text-4xl font-bold text-[#E75B3B] text-center mb-8 leading-tight">
                        Welcome to{"\n"}Crowdshipping!
                    </ThemedText>

                    {/* Description */}
                    <ThemedText className="text-base text-gray-700 text-center mb-12 leading-6 px-4">
                        We're excited to have you on board. Start your journey as a verified delivery partner by completing your registration. Let's get you moving!
                    </ThemedText>

                    {/* Info Items */}
                    <ThemedView className="space-y-4 mb-16">
                        {/* Shield Icon with Text */}
                        <ThemedView className="flex-row items-start px-2">
                            <ThemedView className="w-6 h-6 mr-4 mt-1">
                                <MaterialIcons name="verified-user" size={20} color="#6B7280" />
                            </ThemedView>
                            <ThemedText className="text-sm text-gray-600 flex-1 leading-5">
                                This helps us keep our community authentic, safe, and exclusive.
                            </ThemedText>
                        </ThemedView>

                        {/* Clock Icon with Text */}
                        <ThemedView className="flex-row items-start px-2">
                            <ThemedView className="w-6 h-6 mr-4 mt-1">
                                <AntDesign name="clockcircleo" size={20} color="#6B7280" />
                            </ThemedView>
                            <ThemedText className="text-sm text-gray-600 flex-1 leading-5">
                                Verification typically takes 24-48 hours.
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                {/* Register Button */}
                <ThemedView className="pb-8">
                    <TouchableOpacity
                        className="bg-[#E75B3B] py-4 rounded-xl"
                        onPress={handleRegisterPress}
                    >
                        <ThemedText className="text-white text-center font-semibold text-base">
                            Register
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>

            {/* Redux State Debugger - Only visible in development */}
            <ReduxStateDebugger />
        </SafeAreaView>
    );
}