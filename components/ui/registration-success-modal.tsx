import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Text,
    View
} from "react-native";
import { Button, ButtonText } from "./button";

interface RegistrationSuccessModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function RegistrationSuccessModal({
    isVisible,
    onClose
}: RegistrationSuccessModalProps) {
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 items-center justify-center px-6">
                <View className="bg-white rounded-3xl p-8 w-full max-w-sm items-center">
                    {/* Success Icon with Animation Circles */}
                    <View className="items-center justify-center mb-6">
                        {/* Outer decorative circles */}
                        <View className="absolute w-24 h-24 rounded-full bg-[#E75B3B]/10" />
                        <View className="absolute w-16 h-16 rounded-full bg-[#E75B3B]/20" />
                        <View className="absolute w-8 h-8 rounded-full bg-[#E75B3B]/30" />
                        <View className="absolute w-4 h-4 rounded-full bg-[#E75B3B]/40" />

                        {/* Main success circle */}
                        <View className="w-12 h-12 bg-[#E75B3B] rounded-full items-center justify-center">
                            <AntDesign name="check" size={20} color="white" />
                        </View>

                        {/* Small decorative dots */}
                        <View className="absolute -top-2 -left-2 w-2 h-2 bg-[#E75B3B]/60 rounded-full" />
                        <View className="absolute -bottom-1 -right-3 w-1.5 h-1.5 bg-[#E75B3B]/40 rounded-full" />
                        <View className="absolute top-3 -right-4 w-1 h-1 bg-[#E75B3B]/50 rounded-full" />
                        <View className="absolute -bottom-3 -left-1 w-1 h-1 bg-[#E75B3B]/30 rounded-full" />
                    </View>

                    {/* Success Title */}
                    <Text className="text-2xl font-bold text-black text-center mb-4">
                        Registration{'\n'}Successful!
                    </Text>

                    {/* Success Message */}
                    <Text className="text-gray-500 text-center text-base mb-8 leading-6">
                        Your details have been sent to us{'\n'}
                        we will get back to you soon.
                    </Text>

                    {/* Close Button */}
                    <Button
                        size="xl"
                        className="bg-[#E75B3B] rounded-xl w-full"
                        onPress={onClose}
                    >
                        <ButtonText className="text-white font-semibold">
                            Close App
                        </ButtonText>
                    </Button>
                </View>
            </View>
        </Modal>
    );
}