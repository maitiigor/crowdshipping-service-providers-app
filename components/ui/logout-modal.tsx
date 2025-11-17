import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';

interface LogoutModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onClose, onConfirm }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <ThemedView className="flex-1 bg-black/50 justify-end">
                {/* Overlay */}
                <TouchableOpacity
                    className="flex-1"
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* Bottom Panel */}
                <ThemedView className="bg-white rounded-t-3xl px-6 py-8">
                    {/* Title */}
                    <ThemedText className="text-2xl font-bold text-center text-[#FE0F00] mb-4">
                        Log out
                    </ThemedText>

                    {/* Message */}
                    <ThemedText className="text-base text-gray-700 text-center mb-8">
                        Are you sure you want to log out?
                    </ThemedText>

                    {/* Buttons */}
                    <ThemedView className="flex-row gap-3">
                        {/* Cancel Button */}
                        <TouchableOpacity
                            className="flex-1 py-3 px-6 border border-orange-500 rounded-xl"
                            onPress={onClose}
                        >
                            <ThemedText className="text-orange-500 font-medium text-center">
                                Cancel
                            </ThemedText>
                        </TouchableOpacity>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            className="flex-1 py-3 px-6 bg-orange-500 rounded-xl"
                            onPress={onConfirm}
                        >
                            <ThemedText className="text-white font-medium text-center">
                                Yes, Logout
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
};