'use client';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface SuccessModalProps {
    isVisible: boolean;
    title: string;
    message: string;
    primaryButtonText: string;
    secondaryButtonText?: string;
    onPrimaryPress: () => void;
    onSecondaryPress?: () => void;
    onClose?: () => void;
}

export default function SuccessModal({
    isVisible,
    title,
    message,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
    onClose
}: SuccessModalProps) {
    if (!isVisible) return null;

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 items-center justify-center px-6">
                <View className="bg-white rounded-3xl p-8 w-full max-w-sm">
                    {/* Success Icon */}
                    <View className="items-center mb-6">
                        <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
                            <View className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
                                <Text className="text-white text-2xl">✓</Text>
                            </View>
                        </View>

                        <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
                            {title}
                        </Text>

                        <Text className="text-gray-600 text-center">
                            {message}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-y-3">
                        <TouchableOpacity
                            className="bg-orange-500 py-4 rounded-xl"
                            onPress={onPrimaryPress}
                        >
                            <Text className="text-white font-semibold text-center">
                                {primaryButtonText}
                            </Text>
                        </TouchableOpacity>

                        {secondaryButtonText && onSecondaryPress && (
                            <TouchableOpacity
                                className="border border-orange-500 py-4 rounded-xl"
                                onPress={onSecondaryPress}
                            >
                                <Text className="text-orange-500 font-semibold text-center">
                                    {secondaryButtonText}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}