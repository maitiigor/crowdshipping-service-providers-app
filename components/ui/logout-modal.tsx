import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

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
            <View className="flex-1 bg-black/50 justify-end">
                {/* Overlay */}
                <TouchableOpacity
                    className="flex-1"
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* Bottom Panel */}
                <View className="bg-white rounded-t-3xl px-6 py-8">
                    {/* Title */}
                    <Text className="text-2xl font-bold text-center text-[#FE0F00] mb-4">
                        Log out
                    </Text>

                    {/* Message */}
                    <Text className="text-base text-gray-700 text-center mb-8">
                        Are you sure you want to log out?
                    </Text>

                    {/* Buttons */}
                    <View className="flex-row gap-3">
                        {/* Cancel Button */}
                        <TouchableOpacity
                            className="flex-1 py-3 px-6 border border-orange-500 rounded-xl"
                            onPress={onClose}
                        >
                            <Text className="text-orange-500 font-medium text-center">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            className="flex-1 py-3 px-6 bg-orange-500 rounded-xl"
                            onPress={onConfirm}
                        >
                            <Text className="text-white font-medium text-center">
                                Yes, Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};