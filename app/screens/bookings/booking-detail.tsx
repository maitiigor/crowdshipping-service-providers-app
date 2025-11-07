import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PackageList from '../../../components/Custom/PackageList';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, CalendarIcon, Icon, MapPinIcon, PhoneIcon, PlayIcon, UserIcon } from '../../../components/ui/icon';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchDeliveryBookingDetail } from '../../../store/slices/groundTripSlice';

export default function BookingDetailScreen() {
    const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
    const dispatch = useAppDispatch();
    const { groundTrip, loading } = useAppSelector((state) => state.groundTrip);

    useEffect(() => {
        if (bookingId) {
            dispatch(fetchDeliveryBookingDetail(bookingId));
        }
    }, [bookingId, dispatch]);

    const handleStartTrip = () => {
        router.push(`/screens/dashboard/trip-status-management?tripId=${bookingId}`);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800';
            case 'GOING_TO_PICKUP':
            case 'PICKED_UP':
            case 'IN_TRANSIT':
            case 'ARRIVED_DESTINATION':
            case 'DELIVERED':
            case 'TOLL_BILL_PENDING':
            case 'TOLL_BILL_PAID':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#E75B3B" />
                <Text className="text-gray-600 mt-4">Loading booking details...</Text>
            </SafeAreaView>
        );
    }

    if (!groundTrip.id) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-gray-600">Booking not found</Text>
                <Button
                    className="mt-4 bg-[#E75B3B]"
                    onPress={() => router.back()}
                >
                    <ButtonText>Go Back</ButtonText>
                </Button>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center"
                >
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-gray-900">Booking Details</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Booking Header */}
                <View className="px-4 py-6 bg-gray-50">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-2xl font-bold text-gray-900">{groundTrip.trackingId}</Text>
                        <View className={`px-3 py-1 rounded-full ${getStatusColor(groundTrip.status)}`}>
                            <Text className="text-sm font-medium">{groundTrip.status.replace(/_/g, ' ')}</Text>
                        </View>
                    </View>
                    <Text className="text-gray-600">
                        Booking Reference: {groundTrip.bookingRef}
                    </Text>
                    <Text className="text-gray-600">
                        Date: {formatDate(groundTrip.dateOfBooking)}
                    </Text>
                </View>

                {/* Route Information */}
                <View className="px-4 py-6 border-b border-gray-100">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Route Information</Text>
                    <View className="flex-row items-center mb-4">
                        <Icon as={MapPinIcon} size="sm" className="text-[#E75B3B] mr-3" />
                        <View className="flex-1">
                            <Text className="text-gray-500 text-sm">From</Text>
                            <Text className="text-gray-900 font-medium">{groundTrip.pickUpLocation}</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <Icon as={MapPinIcon} size="sm" className="text-green-600 mr-3" />
                        <View className="flex-1">
                            <Text className="text-gray-500 text-sm">To</Text>
                            <Text className="text-gray-900 font-medium">{groundTrip.dropOffLocation}</Text>
                        </View>
                    </View>
                </View>

                {/* Trip Details */}
                <View className="px-4 py-6 border-b border-gray-100">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Trip Details</Text>
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-gray-600">Weight</Text>
                        <Text className="text-gray-900 font-medium">{groundTrip.weight}kg</Text>
                    </View>
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-gray-600">Price</Text>
                        <Text className="text-gray-900 font-medium">₦{groundTrip.price?.toLocaleString()}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-600">Customer</Text>
                        <Text className="text-gray-900 font-medium">{groundTrip.customer}</Text>
                    </View>
                </View>

                {/* Sender Information */}
                <View className="px-4 py-6 border-b border-gray-100">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Sender Information</Text>
                    <View className="flex-row items-center mb-3">
                        <Icon as={UserIcon} size="sm" className="text-gray-500 mr-3" />
                        <Text className="text-gray-900">{groundTrip.sender.name}</Text>
                    </View>
                    <View className="flex-row items-center mb-3">
                        <Icon as={PhoneIcon} size="sm" className="text-gray-500 mr-3" />
                        <Text className="text-gray-900">{groundTrip.sender.phoneNumber}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Icon as={CalendarIcon} size="sm" className="text-gray-500 mr-3" />
                        <Text className="text-gray-900">{groundTrip.sender.email}</Text>
                    </View>
                </View>

                {/* Receiver Information */}
                <View className="px-4 py-6 border-b border-gray-100">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Receiver Information</Text>
                    <View className="flex-row items-center mb-3">
                        <Icon as={UserIcon} size="sm" className="text-gray-500 mr-3" />
                        <Text className="text-gray-900">{groundTrip.receiver.name}</Text>
                    </View>
                    <View className="flex-row items-center mb-3">
                        <Icon as={PhoneIcon} size="sm" className="text-gray-500 mr-3" />
                        <Text className="text-gray-900">{groundTrip.receiver.phone}</Text>
                    </View>
                    {groundTrip.receiver.alternativePhone && (
                        <View className="flex-row items-center">
                            <Icon as={PhoneIcon} size="sm" className="text-gray-500 mr-3" />
                            <Text className="text-gray-900">{groundTrip.receiver.alternativePhone} (Alt)</Text>
                        </View>
                    )}
                </View>

                {/* Packages Section */}
                {groundTrip.packages && groundTrip.packages.length > 0 && (
                    <View className="px-4 py-6 border-b border-gray-100">
                        <Text className="text-lg font-semibold text-gray-900 mb-4">Packages</Text>
                        <PackageList packages={groundTrip.packages} />
                    </View>
                )}

                <View className="h-20" />
            </ScrollView>

            {/* Action Button */}
            {groundTrip.status.toUpperCase() === 'ACCEPTED' && (
                <View className="px-4 py-4 border-t border-gray-100">
                    <Button
                        size="xl"
                        className="bg-[#E75B3B] rounded-xl w-full h-[47px]"
                        onPress={handleStartTrip}
                    >
                        <PlayIcon size={20} color="#FFFFFF" />
                        <ButtonText className="text-white font-semibold text-lg ml-2">
                            Start Trip
                        </ButtonText>
                    </Button>
                </View>
            )}
        </SafeAreaView>
    );
}
