'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingDetailsScreen() {
    const params = useLocalSearchParams();

    const bookingData = {
        id: params.bookingId as string || 'ID2350847391',
        trackingId: params.trackingId as string || '#HWDSF776567DS',
        status: params.status as string || 'In Progress',
        pickupLocation: params.pickupLocation as string || 'Tangerang City, Banten 15138',
        dropoffLocation: params.dropoffLocation as string || 'Tangerang City, Banten 15138',
        weight: params.weight as string || '5000 Kg',
        receiverName: params.receiverName as string || 'John Doe',
        receiverPhone: params.receiverPhone as string || '+234 0390 942 9428',
        bookingDate: params.bookingDate as string || 'June 12, 2025 | 10:00 am',
        expectedArrival: params.expectedArrival as string || '5-9 Days'
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'In Progress':
                return 'text-orange-600 bg-orange-100';
            case 'Pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'Delivered':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const handleCancelBooking = () => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking?',
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: () => {
                        // Handle booking cancellation
                        Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.');
                        router.back();
                    }
                }
            ]
        );
    };

    const handleRateDriver = () => {
        // Navigate to rating screen
        Alert.alert('Rate Driver', 'Rating functionality would be implemented here.');
    };

    const handleReportDriver = () => {
        // Navigate to report screen
        Alert.alert('Report Driver', 'Report functionality would be implemented here.');
    };

    const handleFileReport = () => {
        // Navigate to file report screen
        Alert.alert('File Report', 'File report functionality would be implemented here.');
    };

    const renderDetailRow = (label: string, value: string, isStatus?: boolean) => (
        <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600 text-base">{label}</Text>
            <View className="flex-1 items-end">
                {isStatus ? (
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(value)}`}>
                        <Text className={`font-medium text-sm ${getStatusColor(value).split(' ')[0]}`}>
                            {value}
                        </Text>
                    </View>
                ) : (
                    <Text className="text-gray-900 font-medium text-base text-right">
                        {value}
                    </Text>
                )}
            </View>
        </View>
    );

    const renderActionButtons = () => {
        if (bookingData.status === 'Delivered') {
            return (
                <View className="space-y-3">
                    <TouchableOpacity
                        className="border border-orange-500 py-4 rounded-xl"
                        onPress={handleRateDriver}
                    >
                        <Text className="text-orange-500 font-semibold text-center">
                            Rate Driver
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="border border-orange-500 py-4 rounded-xl"
                        onPress={handleReportDriver}
                    >
                        <Text className="text-orange-500 font-semibold text-center">
                            Report Driver
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="border border-orange-500 py-4 rounded-xl"
                        onPress={handleFileReport}
                    >
                        <Text className="text-orange-500 font-semibold text-center">
                            File a Report
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (bookingData.status === 'Pending') {
            return (
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        className="flex-1 border border-gray-300 py-4 rounded-xl"
                        onPress={() => router.back()}
                    >
                        <Text className="text-gray-700 font-semibold text-center">
                            Back
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 bg-red-500 py-4 rounded-xl"
                        onPress={handleCancelBooking}
                    >
                        <Text className="text-white font-semibold text-center">
                            Cancel Booking
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            // In Progress - no action buttons needed
            return null;
        }
    };

    const renderPackageImage = () => (
        <View className="items-center mb-6">
            <View className="w-full h-64 bg-white rounded-2xl items-center justify-center border-2 border-orange-200">
                <Image
                    source={require('../../../assets/images/package-sample.png')}
                    style={{
                        width: '90%',
                        height: '90%',
                        borderRadius: 12,
                    }}
                    resizeMode="cover"
                />
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

                <Text className="text-xl font-semibold text-gray-900">Booking Details</Text>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Package Image */}
                <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                    {renderPackageImage()}

                    {/* Booking Summary */}
                    <View className="mb-6">
                        <Text className="text-lg font-semibold text-gray-900 mb-4">
                            Booking Summary:
                        </Text>

                        <View className="space-y-0">
                            {renderDetailRow('Booking ID', bookingData.id)}
                            {renderDetailRow('Date of Booking', bookingData.bookingDate)}
                            {renderDetailRow('Pickup Location', bookingData.pickupLocation)}
                            {renderDetailRow('Drop-off Location', bookingData.dropoffLocation)}
                            {renderDetailRow('Weight', bookingData.weight)}
                            {renderDetailRow('Current Status', bookingData.status, true)}
                        </View>
                    </View>

                    {/* Receiver Information */}
                    <View className="mb-6">
                        <Text className="text-lg font-semibold text-gray-900 mb-4">
                            Receiver Information:
                        </Text>

                        <View className="space-y-0">
                            {renderDetailRow('Name', bookingData.receiverName)}
                            {renderDetailRow('Phone Number', bookingData.receiverPhone)}
                        </View>
                    </View>

                    {/* Expected Arrival Time - Only show for In Progress and Pending */}
                    {(bookingData.status === 'In Progress' || bookingData.status === 'Pending') && (
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">
                                Expected Arrival Time
                            </Text>

                            <View className="flex-row items-center justify-center bg-gray-50 rounded-xl p-4">
                                <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center mr-3">
                                    <Text className="text-white text-sm">⏰</Text>
                                </View>
                                <Text className="text-lg font-semibold text-gray-900">
                                    {bookingData.expectedArrival}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                {renderActionButtons() && (
                    <View className="mb-6">
                        {renderActionButtons()}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}