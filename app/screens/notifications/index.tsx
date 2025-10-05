'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NotificationType = 'booking' | 'delivery' | 'payment' | 'system' | 'promotion';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timeAgo: string;
    isRead: boolean;
    deliveryId?: string;
    amount?: string;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your delivery #ID342424 from California to Nigeria is confirmed.',
        timeAgo: '2 days ago',
        isRead: false,
        deliveryId: '#ID342424'
    },
    {
        id: '2',
        type: 'delivery',
        title: 'Driver Arrived for Pickup!',
        message: 'John Doe has arrived at your pickup location for delivery #ID342424. Please have your parcel ready.',
        timeAgo: '4 days ago',
        isRead: false,
        deliveryId: '#ID342424'
    },
    {
        id: '3',
        type: 'delivery',
        title: 'Parcel Picked Up!',
        message: 'Your parcel for delivery #ID342424 has been successfully picked up by John Doe and is now in transit.',
        timeAgo: '4 days ago',
        isRead: false,
        deliveryId: '#ID342424'
    },
    {
        id: '4',
        type: 'delivery',
        title: 'Delivery Complete!',
        message: 'Your parcel for delivery #ID342424 has been successfully delivered to California[Recipient Name]. Thank you for using Crowdshipping!',
        timeAgo: '4 days ago',
        isRead: false,
        deliveryId: '#ID342424'
    },
    {
        id: '5',
        type: 'booking',
        title: 'Your Bid Accepted!',
        message: 'Great news! Your bid of $386B for delivery #ID342424 has been accepted. Complete payment now to confirm your booking!',
        timeAgo: '4 days ago',
        isRead: false,
        deliveryId: '#ID342424',
        amount: '$386B'
    },
    {
        id: '6',
        type: 'booking',
        title: 'Booking Canceled',
        message: 'Your delivery #ID342424 from California to Maryland City has been canceled. [Optional: Reason, e.g., A cancellation fee may apply.]',
        timeAgo: '4 days ago',
        isRead: false,
        deliveryId: '#ID342424'
    },
    {
        id: '7',
        type: 'payment',
        title: 'Payment Failed',
        message: 'Your payment for delivery #ID342424 failed. Please update your payment method or try again to confirm your booking.',
        timeAgo: '4 days ago',
        isRead: false,
        deliveryId: '#ID342424'
    },
    {
        id: '8',
        type: 'promotion',
        title: 'New Offer Just For You!',
        message: 'Enjoy 50% off your next delivery with code [PROMO CODE]! Valid until June 14, 2024',
        timeAgo: '4 days ago',
        isRead: false
    },
    {
        id: '9',
        type: 'system',
        title: 'Report #ID342424',
        message: 'Your report #ID342424 status has been updated to \'Under Review\'.',
        timeAgo: '4 days ago',
        isRead: false,
        deliveryId: '#ID342424'
    }
];

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

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
                return 'bg-blue-100';
            case 'delivery':
                return 'bg-green-100';
            case 'payment':
                return 'bg-red-100';
            case 'system':
                return 'bg-gray-100';
            case 'promotion':
                return 'bg-yellow-100';
            default:
                return 'bg-gray-100';
        }
    };

    const handleNotificationPress = (notification: Notification) => {
        // Mark as read
        setNotifications(prev =>
            prev.map(n =>
                n.id === notification.id ? { ...n, isRead: true } : n
            )
        );

        // Navigate to notification details
        router.push({
            pathname: '/screens/notifications/details',
            params: {
                notificationId: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                timeAgo: notification.timeAgo,
                deliveryId: notification.deliveryId || '',
                amount: notification.amount || ''
            }
        });
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, isRead: true }))
        );
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const renderNotificationItem = (notification: Notification) => (
        <TouchableOpacity
            key={notification.id}
            className={`flex-row items-start px-4 py-4 border-b border-gray-100 ${!notification.isRead ? 'bg-orange-50' : 'bg-white'}`}
            onPress={() => handleNotificationPress(notification)}
        >
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${getNotificationColor(notification.type)}`}>
                <Text className="text-lg">
                    {getNotificationIcon(notification.type)}
                </Text>
            </View>

            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className={`text-base font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                    </Text>
                    <Text className="text-xs text-gray-500">
                        {notification.timeAgo}
                    </Text>
                </View>

                <Text className={`text-sm leading-5 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                    {notification.message}
                </Text>

                {/* Delivery ID or Amount if available */}
                {(notification.deliveryId || notification.amount) && (
                    <View className="flex-row items-center mt-2">
                        {notification.deliveryId && (
                            <View className="bg-gray-100 px-2 py-1 rounded mr-2">
                                <Text className="text-xs text-gray-600 font-medium">
                                    {notification.deliveryId}
                                </Text>
                            </View>
                        )}
                        {notification.amount && (
                            <View className="bg-green-100 px-2 py-1 rounded">
                                <Text className="text-xs text-green-700 font-medium">
                                    {notification.amount}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Unread indicator */}
            {!notification.isRead && (
                <View className="w-2 h-2 bg-orange-500 rounded-full ml-2 mt-2" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <View className="flex-row items-center">
                    <Text className="text-xl font-semibold text-gray-900">Notifications</Text>
                    {unreadCount > 0 && (
                        <View className="ml-2 bg-orange-500 rounded-full w-6 h-6 items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity onPress={markAllAsRead}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            {/* Mark All as Read Button */}
            {unreadCount > 0 && (
                <View className="bg-white px-4 py-3 border-b border-gray-100">
                    <TouchableOpacity
                        className="self-end"
                        onPress={markAllAsRead}
                    >
                        <Text className="text-orange-500 font-medium">
                            Mark all as read ({unreadCount})
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Notifications List */}
            <ScrollView className="flex-1">
                {notifications.length > 0 ? (
                    <View className="bg-white">
                        {notifications.map(renderNotificationItem)}
                    </View>
                ) : (
                    <View className="flex-1 items-center justify-center py-20">
                        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                            <Text className="text-3xl">🔔</Text>
                        </View>
                        <Text className="text-gray-500 text-center text-lg font-medium mb-2">
                            No notifications yet
                        </Text>
                        <Text className="text-gray-400 text-center">
                            We'll notify you when something important happens
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}