'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NotificationType = 'booking' | 'delivery' | 'payment' | 'system' | 'promotion';

export default function NotificationDetailsScreen() {
    const params = useLocalSearchParams();

    const notificationData = {
        id: params.notificationId as string || '1',
        type: params.type as NotificationType || 'booking',
        title: params.title as string || 'Notification Title',
        message: params.message as string || 'Notification message content',
        timeAgo: params.timeAgo as string || '2 days ago',
        deliveryId: params.deliveryId as string || '',
        amount: params.amount as string || ''
    };

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'booking':
                return '📋';
            case 'delivery':
                return '📦';
            case 'payment':
                return '💳';
            case 'system':
                return '⚙️';
            case 'promotion':
                return '🎉';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type: NotificationType) => {
        switch (type) {
            case 'booking':
                return 'bg-blue-100 border-blue-200';
            case 'delivery':
                return 'bg-green-100 border-green-200';
            case 'payment':
                return 'bg-red-100 border-red-200';
            case 'system':
                return 'bg-gray-100 border-gray-200';
            case 'promotion':
                return 'bg-yellow-100 border-yellow-200';
            default:
                return 'bg-gray-100 border-gray-200';
        }
    };

    const getActionButtons = () => {
        switch (notificationData.type) {
            case 'booking':
                if (notificationData.title.includes('Bid Accepted')) {
                    return (
                        <View className="space-y-3">
                            <TouchableOpacity
                                className="bg-orange-500 py-4 rounded-xl"
                                onPress={() => {
                                    // Navigate to payment
                                    router.push('/screens/payments');
                                }}
                            >
                                <Text className="text-white font-semibold text-center">
                                    Complete Payment
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="border border-gray-300 py-4 rounded-xl"
                                onPress={() => {
                                    // View booking details
                                    router.push('/screens/bookings');
                                }}
                            >
                                <Text className="text-gray-700 font-semibold text-center">
                                    View Booking
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                } else if (notificationData.title.includes('Confirmed')) {
                    return (
                        <TouchableOpacity
                            className="border border-orange-500 py-4 rounded-xl"
                            onPress={() => {
                                router.push('/screens/bookings');
                            }}
                        >
                            <Text className="text-orange-500 font-semibold text-center">
                                View Booking Details
                            </Text>
                        </TouchableOpacity>
                    );
                }
                break;
            case 'delivery':
                return (
                    <TouchableOpacity
                        className="border border-orange-500 py-4 rounded-xl"
                        onPress={() => {
                            router.push('/screens/bookings');
                        }}
                    >
                        <Text className="text-orange-500 font-semibold text-center">
                            Track Delivery
                        </Text>
                    </TouchableOpacity>
                );
            case 'payment':
                if (notificationData.title.includes('Failed')) {
                    return (
                        <View className="space-y-3">
                            <TouchableOpacity
                                className="bg-orange-500 py-4 rounded-xl"
                                onPress={() => {
                                    router.push('/screens/payments');
                                }}
                            >
                                <Text className="text-white font-semibold text-center">
                                    Retry Payment
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="border border-gray-300 py-4 rounded-xl"
                                onPress={() => {
                                    // Update payment method
                                    console.log('Update payment method');
                                }}
                            >
                                <Text className="text-gray-700 font-semibold text-center">
                                    Update Payment Method
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                }
                break;
            case 'promotion':
                return (
                    <TouchableOpacity
                        className="bg-orange-500 py-4 rounded-xl"
                        onPress={() => {
                            // Use promo code
                            console.log('Use promo code');
                        }}
                    >
                        <Text className="text-white font-semibold text-center">
                            Use Promo Code
                        </Text>
                    </TouchableOpacity>
                );
            default:
                return null;
        }
        return null;
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Notification</Text>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Notification Card */}
                <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                    {/* Icon and Header */}
                    <View className="items-center mb-6">
                        <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 border-2 ${getNotificationColor(notificationData.type)}`}>
                            <Text className="text-3xl">
                                {getNotificationIcon(notificationData.type)}
                            </Text>
                        </View>

                        <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                            {notificationData.title}
                        </Text>

                        <Text className="text-sm text-gray-500">
                            {notificationData.timeAgo}
                        </Text>
                    </View>

                    {/* Message */}
                    <View className="mb-6">
                        <Text className="text-base text-gray-700 leading-6 text-center">
                            {notificationData.message}
                        </Text>
                    </View>

                    {/* Additional Info */}
                    {(notificationData.deliveryId || notificationData.amount) && (
                        <View className="flex-row items-center justify-center mb-6">
                            {notificationData.deliveryId && (
                                <View className="bg-gray-100 px-4 py-2 rounded-lg mr-3">
                                    <Text className="text-sm text-gray-700 font-medium">
                                        Delivery ID: {notificationData.deliveryId}
                                    </Text>
                                </View>
                            )}
                            {notificationData.amount && (
                                <View className="bg-green-100 px-4 py-2 rounded-lg">
                                    <Text className="text-sm text-green-700 font-medium">
                                        Amount: {notificationData.amount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                {getActionButtons() && (
                    <View className="mb-6">
                        {getActionButtons()}
                    </View>
                )}

                {/* Additional Actions */}
                <View className="space-y-3">
                    <TouchableOpacity
                        className="border border-gray-300 py-4 rounded-xl"
                        onPress={() => {
                            // Delete notification
                            router.back();
                        }}
                    >
                        <Text className="text-gray-700 font-semibold text-center">
                            Delete Notification
                        </Text>
                    </TouchableOpacity>

                    {notificationData.type !== 'promotion' && (
                        <TouchableOpacity
                            className="border border-gray-300 py-4 rounded-xl"
                            onPress={() => {
                                // Contact support
                                router.push('/screens/support');
                            }}
                        >
                            <Text className="text-gray-700 font-semibold text-center">
                                Contact Support
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}