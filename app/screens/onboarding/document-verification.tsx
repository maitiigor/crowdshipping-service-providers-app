import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText } from "../../../components/ui/button";

interface VerificationItem {
    id: string;
    text: string;
    checked: boolean;
}

export default function DocumentVerification() {
   
    const [verificationItems, setVerificationItems] = useState<VerificationItem[]>([
        { id: '1', text: 'Readable, clear and not blurry', checked: true },
        { id: '2', text: 'Well-lit, not reflective, not too dark', checked: true },
        { id: '3', text: 'ID occupies most of the image', checked: true },
    ]);

    const [confirmationItems, setConfirmationItems] = useState<VerificationItem[]>([
        { id: '1', text: 'ID is not expired', checked: false },
    ]);

    const toggleVerificationItem = (id: string) => {
        setVerificationItems(items =>
            items.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const toggleConfirmationItem = (id: string) => {
        setConfirmationItems(items =>
            items.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const handleConfirm = () => {
        // Update document verification status in Redux
        const allVerificationChecked = verificationItems.every(item => item.checked);
        const allConfirmationChecked = confirmationItems.every(item => item.checked);


        // Navigate back to documents page or next step
        router.back();
    };

    const handleChangePhoto = () => {
        // Handle photo change
        console.log("Change photo");
        // Navigate back to allow user to retake/reselect photo
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Document Image */}
                <View className="mb-6">
                    <View className="bg-gray-100 rounded-2xl p-4">
                        {/* This would be the actual uploaded document image */}
                        <View className="bg-white rounded-xl p-4 shadow-sm">
                            <View className="flex-row items-start mb-3">
                                <View className="w-6 h-4 bg-green-600 mr-2 mt-1" />
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-green-700 mb-1">
                                        FEDERAL REPUBLIC OF NIGERIA
                                    </Text>
                                    <Text className="text-xs font-bold text-green-700 mb-1">
                                        NATIONAL DRIVERS LICENCE
                                    </Text>
                                    <View className="bg-orange-500 px-2 py-1 rounded self-start">
                                        <Text className="text-xs text-white font-bold">LAGOS STATE</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row">
                                <View className="w-20 h-24 bg-gray-200 rounded mr-3">
                                    {/* Profile photo placeholder */}
                                    <View className="w-full h-full bg-gray-300 rounded" />
                                </View>

                                <View className="flex-1">
                                    <Text className="text-xs font-bold mb-1">12-04-1985</Text>
                                    <Text className="text-xs mb-1">AYENI, MICHEAL ADEBAYO</Text>
                                    <Text className="text-xs mb-1">CHRIST EMBASSY CHURCH,</Text>
                                    <Text className="text-xs mb-1">OREGUN ROAD, OREGUN, IKEJA</Text>
                                    <Text className="text-xs mb-1">IKEJA LAGOS</Text>
                                    <Text className="text-xs mb-1">SEX: M    HT: 1.98M</Text>
                                    <Text className="text-xs mb-1">BD: O+</Text>
                                </View>

                                <View className="items-end">
                                    <Text className="text-xs mb-1">23-04-2016</Text>
                                    <Text className="text-xs mb-1">10-03-2019</Text>
                                    <Text className="text-xs">LAG</Text>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-end mt-3">
                                <View>
                                    <Text className="text-xs">LIC NO: 08521810</Text>
                                    <Text className="text-xs">DATE OF ISSUE: 03-03-2014</Text>
                                </View>
                                <View className="w-16 h-8 bg-gray-200 rounded">
                                    {/* Signature placeholder */}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Confirm The Following Section */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-black mb-4">
                        Confirm The Following
                    </Text>

                    {verificationItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className="flex-row items-center mb-3"
                            onPress={() => toggleVerificationItem(item.id)}
                        >
                            <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
                                }`}>
                                {item.checked && (
                                    <AntDesign name="check" size={12} color="white" />
                                )}
                            </View>
                            <Text className="text-gray-700 flex-1">{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Please confirm that Section */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-black mb-4">
                        Please confirm that
                    </Text>

                    {confirmationItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className="flex-row items-center mb-3"
                            onPress={() => toggleConfirmationItem(item.id)}
                        >
                            <View className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
                            <Text className="text-gray-700 flex-1">{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="px-6 pb-8 space-y-3">
                <Button
                    size="xl"
                    className="bg-[#E75B3B] rounded-xl mb-3"
                    onPress={handleConfirm}
                >
                    <ButtonText className="text-white font-semibold">
                        Confirm
                    </ButtonText>
                </Button>

                <Button
                    size="xl"
                    variant="outline"
                    className="border-gray-300 rounded-xl"
                    onPress={handleChangePhoto}
                >
                    <ButtonText className="text-gray-700 font-semibold">
                        Change Photo
                    </ButtonText>
                </Button>
            </View>
        </SafeAreaView>
    );
}