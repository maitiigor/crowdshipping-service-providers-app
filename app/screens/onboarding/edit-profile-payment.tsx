import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText } from "../../../components/ui/button";
import { useEditProfileForm } from "../../../hooks/useRedux";
import { useAppSelector } from "../../../store";

export default function EditProfilePayment() {

  
    const { profile } = useAppSelector((state) => state.profile);

   

    const handleSubmit = () => {
        // Handle form submission
        console.log("Payment data:", profile.accountName);
        // Mark payment info as verified if all fields are filled
        if (profile.bankName && profile.accountName && profile.accountNumber) {
            
        }
        // Navigate to PIN creation screen
        router.push('/screens/onboarding/create-pin');
    };

    const updatePaymentData = () => {
       // updatePayment({ [field]: value });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="#000" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-black">
                    Edit Profile
                </Text>

                <TouchableOpacity className="p-2">
                    <MaterialIcons name="notifications-none" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Progress Indicator */}
            <View className="flex-row items-center justify-center px-6 py-6">
                <View className="flex-row items-center">
                    {/* Step 1 - Completed */}
                    <View className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                    <View className="w-4" />
                    {/* Step 2 - Completed */}
                    <View className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                    <View className="w-4" />
                    {/* Step 3 - Active */}
                    <View className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                </View>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Section Title */}
                <Text className="text-xl font-semibold text-black mb-6">
                    Payment Infromation
                </Text>

                {/* Bank Name */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-700 mb-2">Bank Name</Text>
                    <View className="bg-[#FDF2F0] rounded-full px-4 py-4">
                        <TextInput
                            className="text-gray-400 text-base"
                            placeholder="e.g First bank, Zenith Bank"
                            placeholderTextColor="#9CA3AF"
                            value={profile.bankName}
                        />
                    </View>
                </View>

                {/* Account Holder Name */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-700 mb-2">Account Holder Name</Text>
                    <View className="bg-[#FDF2F0] rounded-full px-4 py-4">
                        <TextInput
                            className="text-gray-400 text-base"
                            placeholder="Full Name on Account"
                            placeholderTextColor="#9CA3AF"
                            value={profile.accountName}
                        />
                    </View>
                </View>

                {/* Account Number */}
                <View className="mb-8">
                    <Text className="text-sm text-gray-700 mb-2">Account Number</Text>
                    <View className="bg-[#FDF2F0] rounded-full px-4 py-4">
                        <TextInput
                            className="text-gray-400 text-base"
                            placeholder="eg 0123456789"
                            placeholderTextColor="#9CA3AF"
                            value={profile.accountNumber}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View className="px-6 pb-8">
                <Button
                    size="xl"
                    className="bg-[#E75B3B] rounded-xl"
                    onPress={handleSubmit}
                >
                    <ButtonText className="text-white font-semibold">
                        Submit
                    </ButtonText>
                </Button>
            </View>
        </SafeAreaView>
    );
}