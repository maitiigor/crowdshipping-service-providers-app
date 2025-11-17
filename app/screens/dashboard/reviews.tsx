'use client';
import { ArrowLeftIcon, BellIcon, Icon, StarIcon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Review {
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
    tripRoute: string;
}

const mockReviews: Review[] = [
    {
        id: '1',
        customerName: 'John Doe',
        rating: 5,
        comment: 'Excellent service! Very professional and on time. Package was delivered safely.',
        date: '2 days ago',
        tripRoute: 'Lagos → Abuja'
    },
    {
        id: '2',
        customerName: 'Sarah Johnson',
        rating: 4,
        comment: 'Good driver, but arrived a bit late. Overall satisfied with the service.',
        date: '1 week ago',
        tripRoute: 'Ibadan → Lagos'
    },
    {
        id: '3',
        customerName: 'Mike Wilson',
        rating: 5,
        comment: 'Amazing experience! Very careful with fragile items. Highly recommended.',
        date: '2 weeks ago',
        tripRoute: 'Lagos → Port Harcourt'
    },
    {
        id: '4',
        customerName: 'Emma Davis',
        rating: 4,
        comment: 'Professional service. Good communication throughout the trip.',
        date: '3 weeks ago',
        tripRoute: 'Kano → Lagos'
    },
    {
        id: '5',
        customerName: 'David Brown',
        rating: 5,
        comment: 'Perfect delivery! Package arrived in excellent condition. Thank you!',
        date: '1 month ago',
        tripRoute: 'Lagos → Benin'
    }
];

export default function ReviewsScreen() {
    const averageRating = 4.8;
    const totalReviews = mockReviews.length;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Icon
                key={index}
                as={StarIcon}
                size="sm"
                className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
            />
        ));
    };

    const renderReview = (review: Review) => (
        <View key={review.id} className="bg-white rounded-2xl p-6 mb-4">
            <ThemedView className="flex-row items-center justify-between mb-3">
                <ThemedView className="flex-row items-center">
                    <ThemedView className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center mr-3">
                        <ThemedText className="text-gray-600 font-semibold">
                            {review.customerName.charAt(0)}
                        </ThemedText>
                    </ThemedView>
                    <ThemedView>
                        <ThemedText className="text-gray-900 font-semibold text-base">
                            {review.customerName}
                        </ThemedText>
                        <ThemedText className="text-gray-500 text-sm">{review.date}</ThemedText>
                    </ThemedView>
                </ThemedView>
                <ThemedView className="flex-row">
                    {renderStars(review.rating)}
                </ThemedView>
            </ThemedView>

            <ThemedText className="text-gray-700 text-sm leading-6 mb-3">
                {review.comment}
            </ThemedText>

            <ThemedView className="flex-row items-center">
                <ThemedText className="text-gray-500 text-xs">Trip: </ThemedText>
                <ThemedText className="text-gray-600 text-xs font-medium">{review.tripRoute}</ThemedText>
            </ThemedView>
        </View >
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <ThemedView className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-xl font-semibold text-gray-900">Reviews & Ratings</ThemedText>

                <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Rating Summary */}
                <ThemedView className="bg-white rounded-2xl p-6 mb-6">
                    <ThemedView className="items-center">
                        <ThemedText className="text-4xl font-bold text-gray-900 mb-2">
                            {averageRating}
                        </ThemedText>
                        <ThemedView className="flex-row mb-2">
                            {renderStars(Math.floor(averageRating))}
                        </ThemedView>
                        <ThemedText className="text-gray-500 text-base">
                            Based on {totalReviews} reviews
                        </ThemedText>
                    </ThemedView>

                    {/* Rating Breakdown */}
                    <ThemedView className="mt-6 pt-6 border-t border-gray-100">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = mockReviews.filter(r => r.rating === stars).length;
                            const percentage = (count / totalReviews) * 100;

                            return (
                                <View key={stars} className="flex-row items-center mb-2">
                                    <ThemedText className="text-gray-600 text-sm w-8">{stars}</ThemedText>
                                    <Icon as={StarIcon} size="sm" className="text-yellow-500 mr-2" />
                                    <ThemedView className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                        <View
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </ThemedView>
                                    <ThemedText className="text-gray-500 text-sm w-8">{count}</ThemedText>
                                </ThemedView>
                            );
                        })}
                    </ThemedView>
                </ThemedView>

                {/* Reviews List */}
                <ThemedView className="mb-6">
                    <ThemedText className="text-gray-900 font-semibold text-lg mb-4">
                        Recent Reviews
                    </ThemedText>
                    {mockReviews.map(renderReview)}
                </ThemedView>

                {/* Load More Button */}
                <TouchableOpacity className="bg-white border border-gray-200 py-4 rounded-2xl mb-6">
                    <ThemedText className="text-gray-700 font-semibold text-center">
                        Load More Reviews
                    </ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView >
    );
}