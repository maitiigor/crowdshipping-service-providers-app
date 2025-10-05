'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BookingStatus = 'In Progress' | 'Pending' | 'Delivered';

interface Booking {
    id: string;
    trackingId: string;
    status: BookingStatus;
    date: string;
    pickupLocation: string;
    dropoffLocation: string;
    weight: string;
    receiverName: string;
    receiverPhone: string;
    bookingDate: string;
    expectedArrival?: string;
}

const mockBookings: Booking[] = [
    {
        id: '1',
        trackingId: '#HWDSF776567DS',
        status: 'Delivered',
        date: '24 June',
        pickupLocation: 'Tangerang City, Banten 15138',
        dropoffLocation: 'Tangerang City, Banten 15138',
        weight: '5000 Kg',
        receiverName: 'John Doe',
        receiverPhone: '+234 0390 942 9428',
        bookingDate: 'June 12, 2025 | 10:00 am'
    },
    {
        id: '2',
        trackingId: '#7XZ6V8726XCSA7',
        status: 'In Progress',
        date: '24 May',
        pickupLocation: 'Tangerang City, Banten 15138',
        dropoffLocation: 'Tangerang City, Banten 15138',
        weight: '5000 Kg',
        receiverName: 'John Doe',
        receiverPhone: '+234 0390 942 9428',
        bookingDate: 'June 12, 2025 | 10:00 am',
        expectedArrival: '5-9 Days'
    },
    {
        id: '3',
        trackingId: '#HWDSF776567DS',
        status: 'Pending',
        date: '24 June',
        pickupLocation: 'Tangerang City, Banten 15138',
        dropoffLocation: 'Tangerang City, Banten 15138',
        weight: '5000 Kg',
        receiverName: 'John Doe',
        receiverPhone: '+234 0390 942 9428',
        bookingDate: 'June 12, 2025 | 10:00 am',
        expectedArrival: '5-9 Days'
    },
    {
        id: '4',
        trackingId: '#HWDSF776567DS',
        status: 'Delivered',
        date: '24 June',
        pickupLocation: 'Tangerang City, Banten 15138',
        dropoffLocation: 'Tangerang City, Banten 15138',
        weight: '5000 Kg',
        receiverName: 'John Doe',
        receiverPhone: '+234 0390 942 9428',
        bookingDate: 'June 12, 2025 | 10:00 am'
    },
    {
        id: '5',
        trackingId: '#HWDSF776567DS',
        status: 'In Progress',
        date: '24 June',
        pickupLocation: 'Tangerang City, Banten 15138',
        dropoffLocation: 'Tangerang City, Banten 15138',
        weight: '5000 Kg',
        receiverName: 'John Doe',
        receiverPhone: '+234 0390 942 9428',
        bookingDate: 'June 12, 2025 | 10:00 am',
        expectedArrival: '5-9 Days'
    },
    {
        id: '6',
        trackingId: '#HWDSF776567DS',
        status: 'Pending',
        date: '24 June',
        pickupLocation: 'Tangerang City, Banten 15138',
        dropoffLocation: 'Tangerang City, Banten 15138',
        weight: '5000 Kg',
        receiverName: 'John Doe',
        receiverPhone: '+234 0390 942 9428',
        bookingDate: 'June 12, 2025 | 10:00 am',
        expectedArrival: '5-9 Days'
    }
];

export default function BookingHistoryScreen() {
    const [activeTab, setActiveTab] = useState<BookingStatus>('In Progress');

    const filteredBookings = mockBookings.filter(booking => booking.status === activeTab);

    const getTabStyle = (tab: BookingStatus) => {
        return activeTab === tab
            ? 'bg-orange-500 text-white'
            : 'bg-transparent text-gray-600 border border-gray-300';
    };

    const handleBookingPress = (booking: Booking) => {
        router.push({
            pathname: '/screens/bookings/details',
            params: {
                bookingId: booking.id,
                trackingId: booking.trackingId,
                status: booking.status,
                pickupLocation: booking.pickupLocation,
                dropoffLocation: booking.dropoffLocation,
                weight: booking.weight,
                receiverName: booking.receiverName,
                receiverPhone: booking.receiverPhone,
                bookingDate: booking.bookingDate,
                expectedArrival: booking.expectedArrival || ''
            }
        });
    };

    const renderBookingItem = (booking: Booking) => (
        <TouchableOpacity
            key={booking.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
            onPress={() => handleBookingPress(booking)}
        >
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center mr-3">
                        <View className="w-4 h-4 bg-[#E75b3b] rounded-sm" />
                    </View>
                    <View>
                        <Text className="text-base font-semibold text-gray-900">
                            {booking.trackingId}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            {booking.status === 'Delivered' ? 'Delivered' : 'Cancelled'} • {booking.date}
                        </Text>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-gray-400 text-lg">›</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Booking History</Text>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            {/* Tab Navigation */}
            <View className="bg-white px-4 py-4">
                <View className="flex-row justify-between justify-items-center gap-2">
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full flex items-center justify-center ${getTabStyle('In Progress')}`}
                        style={{ width: '33.33%' }}
                        onPress={() => setActiveTab('In Progress')}
                    >
                        <Text className={`font-medium text-center ${activeTab === 'In Progress' ? 'text-white' : 'text-gray-600'}`}>
                            In Progress
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full flex items-center justify-center ${getTabStyle('Pending')}`}
                        style={{ width: '33.33%' }}
                        onPress={() => setActiveTab('Pending')}
                    >
                        <Text className={`font-medium text-center ${activeTab === 'Pending' ? 'text-white' : 'text-gray-600'}`}>
                            Pending
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full flex items-center justify-center ${getTabStyle('Delivered')}`}
                        style={{ width: '33.33%' }}
                        onPress={() => setActiveTab('Delivered')}
                    >
                        <Text className={`font-medium text-center ${activeTab === 'Delivered' ? 'text-white' : 'text-gray-600'}`}>
                            Delivered
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Booking List */}
            <ScrollView className="flex-1 px-4 py-4">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(renderBookingItem)
                ) : (
                    <View className="flex-1 items-center justify-center py-20">
                        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                            <View className="w-10 h-10 bg-gray-300 rounded-lg" />
                        </View>
                        <Text className="text-gray-500 text-center">
                            No {activeTab.toLowerCase()} bookings found
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}