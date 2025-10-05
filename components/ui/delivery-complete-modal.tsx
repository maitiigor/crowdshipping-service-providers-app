import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Button, ButtonText } from './button';

interface DeliveryCompleteModalProps {
    isVisible: boolean;
    title?: string; // defaults to "Shipping Completed"
    message?: string; // defaults to "Please leave a star review for your courier"
    primaryButtonText?: string; // defaults to "Write a review"
    secondaryButtonText?: string; // defaults to "Cancel"
    initialRating?: number;
    onPrimaryPress: (rating: number) => void;
    onSecondaryPress?: () => void;
    onClose?: () => void;
    onRatingChange?: (rating: number) => void;
}

// A modal shown when delivery is completed. Includes decorative success icon,
// a 5-star rating row, and primary/secondary actions.
export default function DeliveryCompleteModal({
    isVisible,
    title = 'Shipping Completed',
    message = 'Please leave a star review for your courier',
    primaryButtonText = 'Write a review',
    secondaryButtonText = 'Cancel',
    initialRating = 0,
    onPrimaryPress,
    onSecondaryPress,
    onClose,
    onRatingChange,
}: DeliveryCompleteModalProps) {
    const [rating, setRating] = useState<number>(initialRating);

    if (!isVisible) return null;

    const handleSetRating = (value: number) => {
        setRating(value);
        onRatingChange?.(value);
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 items-center justify-center px-6">
                <View className="bg-white rounded-3xl p-8 w-full max-w-sm items-center">
                    {/* Success Icon and decorative dots */}
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

                    {/* Title and message */}
                    <Text className="text-[22px] font-bold text-[#D95E46] text-center mb-1">
                        {title}
                    </Text>
                    <Text className="text-gray-500 text-center text-[13px] mb-6 leading-5">
                        {message}
                    </Text>

                    {/* Star rating */}
                    <View className="flex-row items-center justify-center gap-x-3 mb-7">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => handleSetRating(i)}
                                accessibilityRole="button"
                                accessibilityLabel={`Rate ${i} star${i > 1 ? 's' : ''}`}
                            >
                                {rating >= i ? (
                                    <AntDesign name="star" size={28} color="#E75B3B" />
                                ) : (
                                    <AntDesign name="staro" size={28} color="#E75B3B" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Buttons */}
                    <View className="w-full gap-y-3">
                        <Button
                            size="xl"
                            className="bg-[#D7644E] rounded-xl h-[48px]"
                            onPress={() => onPrimaryPress(rating)}
                        >
                            <ButtonText className="text-white font-semibold text-base">
                                {primaryButtonText}
                            </ButtonText>
                        </Button>

                        {onSecondaryPress && (
                            <TouchableOpacity
                                className="border border-[#D7644E] rounded-xl h-[48px] items-center justify-center"
                                onPress={onSecondaryPress}
                            >
                                <Text className="text-[#D7644E] font-semibold">{secondaryButtonText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}