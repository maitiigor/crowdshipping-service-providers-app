'use client';
import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';

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
            <ThemedView className="flex-1 bg-black/50 items-center justify-center px-6">
                <ThemedView className="bg-white rounded-3xl p-8 w-full max-w-sm">
                    {/* Success Icon */}
                    <ThemedView className="items-center mb-6">
                        <ThemedView className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
                            <ThemedView className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
                                <ThemedText className="text-white text-2xl">✓</ThemedText>
                            </ThemedView>
                        </ThemedView>

                        <ThemedText className="text-xl font-bold text-gray-900 mb-2 text-center">
                            {title}
                        </ThemedText>

                        <ThemedText className="text-gray-600 text-center">
                            {message}
                        </ThemedText>
                    </ThemedView>

                    {/* Action Buttons */}
                    <ThemedView className="gap-y-3">
                        <TouchableOpacity
                            className="bg-orange-500 py-4 rounded-xl"
                            onPress={onPrimaryPress}
                        >
                            <ThemedText className="text-white font-semibold text-center">
                                {primaryButtonText}
                            </ThemedText>
                        </TouchableOpacity>

                        {secondaryButtonText && onSecondaryPress && (
                            <TouchableOpacity
                                className="border border-orange-500 py-4 rounded-xl"
                                onPress={onSecondaryPress}
                            >
                                <ThemedText className="text-orange-500 font-semibold text-center">
                                    {secondaryButtonText}
                                </ThemedText>
                            </TouchableOpacity>
                        )}
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
}