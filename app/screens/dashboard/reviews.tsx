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
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center mr-3">
                        <Text className="text-gray-600 font-semibold">
                            {review.customerName.charAt(0)}
                        </Text>
                    </View>
                    <View>
                        <Text className="text-gray-900 font-semibold text-base">
                            {review.customerName}
                        </Text>
                        <Text className="text-gray-500 text-sm">{review.date}</Text>
                    </View>
                </View>
                <View className="flex-row">
                    {renderStars(review.rating)}
                </View>
            </View>

            <Text className="text-gray-700 text-sm leading-6 mb-3">
                {review.comment}
            </Text>

            <View className="flex-row items-center">
                <Text className="text-gray-500 text-xs">Trip: </Text>
                <Text className="text-gray-600 text-xs font-medium">{review.tripRoute}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Reviews & Ratings</Text>

                <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Rating Summary */}
                <View className="bg-white rounded-2xl p-6 mb-6">
                    <View className="items-center">
                        <Text className="text-4xl font-bold text-gray-900 mb-2">
                            {averageRating}
                        </Text>
                        <View className="flex-row mb-2">
                            {renderStars(Math.floor(averageRating))}
                        </View>
                        <Text className="text-gray-500 text-base">
                            Based on {totalReviews} reviews
                        </Text>
                    </View>

                    {/* Rating Breakdown */}
                    <View className="mt-6 pt-6 border-t border-gray-100">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = mockReviews.filter(r => r.rating === stars).length;
                            const percentage = (count / totalReviews) * 100;
                            
                            return (
                                <View key={stars} className="flex-row items-center mb-2">
                                    <Text className="text-gray-600 text-sm w-8">{stars}</Text>
                                    <Icon as={StarIcon} size="sm" className="text-yellow-500 mr-2" />
                                    <View className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                        <View 
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </View>
                                    <Text className="text-gray-500 text-sm w-8">{count}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Reviews List */}
                <View className="mb-6">
                    <Text className="text-gray-900 font-semibold text-lg mb-4">
                        Recent Reviews
                    </Text>
                    {mockReviews.map(renderReview)}
                </View>

                {/* Load More Button */}
                <TouchableOpacity className="bg-white border border-gray-200 py-4 rounded-2xl mb-6">
                    <Text className="text-gray-700 font-semibold text-center">
                        Load More Reviews
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}