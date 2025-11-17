import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    TouchableOpacity
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
                <ThemedText className="text-gray-600 mt-4">Loading booking details...</ThemedText>
            </SafeAreaView>
        );
    }

    if (!groundTrip.id) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ThemedText className="text-gray-600">Booking not found</ThemedText>
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
            <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center"
                >
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
                <ThemedText className="text-lg font-semibold text-gray-900">Booking Details</ThemedText>
                <ThemedView className="w-10" />
            </ThemedView>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Booking Header */}
                <ThemedView className="px-4 py-6 bg-gray-50">
                    <ThemedView className="flex-row items-center justify-between mb-3">
                        <ThemedText className="text-2xl font-bold text-gray-900">{groundTrip.trackingId}</ThemedText>
                        <ThemedView className={`px-3 py-1 rounded-full ${getStatusColor(groundTrip.status)}`}>
                            <ThemedText className="text-sm font-medium">{groundTrip.status.replace(/_/g, ' ')}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <ThemedText className="text-gray-600">
                        Booking Reference: {groundTrip.bookingRef}
                    </ThemedText>
                    <ThemedText className="text-gray-600">
                        Date: {formatDate(groundTrip.dateOfBooking)}
                    </ThemedText>
                </ThemedView>

                {/* Route Information */}
                <ThemedView className="px-4 py-6 border-b border-gray-100">
                    <ThemedText className="text-lg font-semibold text-gray-900 mb-4">Route Information</ThemedText>
                    <ThemedView className="flex-row items-center mb-4">
                        <Icon as={MapPinIcon} size="sm" className="text-[#E75B3B] mr-3" />
                        <ThemedView className="flex-1">
                            <ThemedText className="text-gray-500 text-sm">From</ThemedText>
                            <ThemedText className="text-gray-900 font-medium">{groundTrip.pickUpLocation}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <ThemedView className="flex-row items-center">
                        <Icon as={MapPinIcon} size="sm" className="text-green-600 mr-3" />
                        <ThemedView className="flex-1">
                            <ThemedText className="text-gray-500 text-sm">To</ThemedText>
                            <ThemedText className="text-gray-900 font-medium">{groundTrip.dropOffLocation}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                {/* Trip Details */}
                <ThemedView className="px-4 py-6 border-b border-gray-100">
                    <ThemedText className="text-lg font-semibold text-gray-900 mb-4">Trip Details</ThemedText>
                    <ThemedView className="flex-row justify-between mb-3">
                        <ThemedText className="text-gray-600">Weight</ThemedText>
                        <ThemedText className="text-gray-900 font-medium">{groundTrip.weight}kg</ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between mb-3">
                        <ThemedText className="text-gray-600">Price</ThemedText>
                        <ThemedText className="text-gray-900 font-medium">₦{groundTrip.price?.toLocaleString()}</ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-600">Customer</ThemedText>
                        <ThemedText className="text-gray-900 font-medium">{groundTrip.customer}</ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Sender Information */}
                <ThemedView className="px-4 py-6 border-b border-gray-100">
                    <ThemedText className="text-lg font-semibold text-gray-900 mb-4">Sender Information</ThemedText>
                    <ThemedView className="flex-row items-center mb-3">
                        <Icon as={UserIcon} size="sm" className="text-gray-500 mr-3" />
                        <ThemedText className="text-gray-900">{groundTrip.sender.name}</ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row items-center mb-3">
                        <Icon as={PhoneIcon} size="sm" className="text-gray-500 mr-3" />
                        <ThemedText className="text-gray-900">{groundTrip.sender.phoneNumber}</ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row items-center">
                        <Icon as={CalendarIcon} size="sm" className="text-gray-500 mr-3" />
                        <ThemedText className="text-gray-900">{groundTrip.sender.email}</ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Receiver Information */}
                <ThemedView className="px-4 py-6 border-b border-gray-100">
                    <ThemedText className="text-lg font-semibold text-gray-900 mb-4">Receiver Information</ThemedText>
                    <ThemedView className="flex-row items-center mb-3">
                        <Icon as={UserIcon} size="sm" className="text-gray-500 mr-3" />
                        <ThemedText className="text-gray-900">{groundTrip.receiver.name}</ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row items-center mb-3">
                        <Icon as={PhoneIcon} size="sm" className="text-gray-500 mr-3" />
                        <ThemedText className="text-gray-900">{groundTrip.receiver.phone}</ThemedText>
                    </ThemedView>
                    {groundTrip.receiver.alternativePhone && (
                        <ThemedView className="flex-row items-center">
                            <Icon as={PhoneIcon} size="sm" className="text-gray-500 mr-3" />
                            <ThemedText className="text-gray-900">{groundTrip.receiver.alternativePhone} (Alt)</ThemedText>
                        </ThemedView>
                    )}
                </ThemedView>

                {/* Packages Section */}
                {groundTrip.packages && groundTrip.packages.length > 0 && (
                    <ThemedView className="px-4 py-6 border-b border-gray-100">
                        <ThemedText className="text-lg font-semibold text-gray-900 mb-4">Packages</ThemedText>
                        <PackageList packages={groundTrip.packages} />
                    </ThemedView>
                )}

                <ThemedView className="h-20" />
            </ScrollView>

            {/* Action Button */}
            {groundTrip.status.toUpperCase() === 'ACCEPTED' && (
                <ThemedView className="px-4 py-4 border-t border-gray-100">
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
                </ThemedView>
            )}
        </SafeAreaView>
    );
}
