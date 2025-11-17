import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    StatusBar,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, BellIcon, Icon } from '../../../components/ui/icon';

export default function DriverFeedbackScreen() {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    // If navigated with rating param, prefill it
    const params = useLocalSearchParams<{ rating?: string }>();
    React.useEffect(() => {
        const ratingParam = params?.rating;
        if (ratingParam) {
            const parsed = parseInt(String(ratingParam), 10);
            if (!Number.isNaN(parsed)) setRating(parsed);
        }
    }, [params?.rating]);

    const handleStarPress = (starIndex: number) => {
        setRating(starIndex + 1);
    };

    const handleSubmit = () => {
        console.log('Feedback submitted:', { rating, comment });
        // TODO: Submit feedback to API
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <ThemedView className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center"
                >
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-lg font-semibold text-gray-900">
                    Driver Feedback
                </ThemedText>

                <TouchableOpacity className="w-10 h-10 items-center justify-center">
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            {/* Content */}
            <ThemedView className="flex-1 px-4 py-6">
                {/* Star Rating */}
                <ThemedView className="items-center mb-8">
                    <ThemedView className="flex-row space-x-2">
                        {[0, 1, 2, 3, 4].map((index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleStarPress(index)}
                                className="p-2"
                            >
                                <ThemedText className={`text-3xl ${index < rating ? 'text-[#E75B3B]' : 'text-gray-300'
                                    }`}>
                                    ★
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ThemedView>
                </ThemedView>

                {/* Comment Section */}
                <ThemedView className="mb-8">
                    <ThemedText className="text-lg font-medium text-gray-900 mb-3">
                        Comment
                    </ThemedText>
                    <ThemedView className="rounded-lg p-4 min-h-32  bg-[#FDEFEB]">
                        <TextInput
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Toyota"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            textAlignVertical="top"
                            className="text-gray-900 text-base flex-1"
                        />
                    </ThemedView>
                </ThemedView>

                {/* Submit Button */}
                <Button
                    size="xl"
                    className="bg-[#E75B3B] rounded-lg w-full"
                    onPress={handleSubmit}
                >
                    <ButtonText className="text-white font-semibold text-lg">
                        Submit
                    </ButtonText>
                </Button>
            </ThemedView>
        </SafeAreaView>
    );
}