import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import PackageList from '../../../components/Custom/PackageList';

import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, InfoIcon, MapPinIcon, PackageIcon, TruckIcon } from 'lucide-react-native';
import { useShowToast } from '../../../hooks/useShowToast';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchDeliveryBookingDetail, updateTripStatus } from '../../../store/slices/groundTripSlice';



// Trip status flow with descriptions
const TRIP_STATUSES = [
    { key: 'IN_PROGRESS', label: 'In Progress', description: 'Trip is yet to start', icon: TruckIcon },
    { key: 'GOING_TO_PICKUP', label: 'Going to Pickup', description: 'On the way to collect packages', icon: TruckIcon },
    { key: 'PICKED_UP', label: 'Picked Up', description: 'Packages collected successfully', icon: PackageIcon },
    { key: 'IN_TRANSIT', label: 'In Transit', description: 'Packages are being transported', icon: TruckIcon },
    { key: 'ARRIVED_DESTINATION', label: 'Arrived at Destination', description: 'Reached the delivery location', icon: MapPinIcon },
    { key: 'DELIVERED', label: 'Delivered', description: 'Packages delivered to recipient', icon: CheckCircleIcon },
    { key: 'TOLL_BILL_PENDING', label: 'Toll Bill Pending', description: 'Awaiting toll payment', icon: ClockIcon },
    { key: 'TOLL_BILL_PAID', label: 'Toll Bill Paid', description: 'Toll payment completed', icon: CheckCircleIcon },
    { key: 'COMPLETED', label: 'Completed', description: 'Trip completed successfully', icon: CheckCircleIcon }
];

export default function TripStatusManagementScreen() {
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    const dispatch = useAppDispatch();
    const showToast = useShowToast();
    const { groundTrip, loading } = useAppSelector((state) => state.groundTrip);

    // Bottom sheet configuration
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);



    useEffect(() => {
        if (tripId) {
            dispatch(fetchDeliveryBookingDetail(tripId));
        }
    }, [tripId, dispatch]);

    useEffect(() => {
        // Set current status index based on trip status
        if (groundTrip.status) {
            const statusIndex = TRIP_STATUSES.findIndex(status => status.key === groundTrip.status);
            if (statusIndex !== -1) {
                setCurrentStatusIndex(statusIndex);
            }
        }
    }, [groundTrip.status]);

    const handleStatusUpdate = async (statusKey: string) => {
        if (!tripId) return;

        // If updating to DELIVERED, redirect to confirm delivery screen for image upload
        if (statusKey === 'DELIVERED') {
            router.push({
                pathname: '/screens/dashboard/confirm-delivery',
                params: { tripId: tripId }
            });
            return;
        }

        try {
            setIsUpdating(true);
            await dispatch(updateTripStatus({ id: tripId, status: statusKey })).unwrap();
            console.log("trip status updated:", groundTrip.status)

            showToast({
                title: "Status Updated",
                description: `Trip status updated to ${TRIP_STATUSES.find(s => s.key === statusKey)?.label}`,
                icon: CheckCircleIcon,
                action: "success"
            });

            // Update local status index
            const newIndex = TRIP_STATUSES.findIndex(status => status.key === statusKey);
            if (newIndex !== -1) {
                setCurrentStatusIndex(newIndex);
            }
        } catch (error: any) {
            showToast({
                title: "Update Failed",
                description: error.message || "Failed to update trip status",
                icon: ArrowLeftIcon,
                action: "error"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const getNextStatus = () => {
        if (currentStatusIndex < TRIP_STATUSES.length - 1) {
            return TRIP_STATUSES[currentStatusIndex + 1];
        }
        return null;
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

    if (loading && !groundTrip.id) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#E75B3B" />
                <Text className="text-gray-600 mt-4">Loading trip details...</Text>
            </SafeAreaView>
        );
    }

    const nextStatus = getNextStatus();

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" backgroundColor="white" />

                {/* Header */}
                <View className="bg-white px-4 py-3 border-b border-gray-100">
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            className="w-10 h-10 items-center justify-center"
                            onPress={() => router.back()}
                        >
                            <ArrowLeftIcon size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-lg font-semibold text-gray-900">Trip Management</Text>
                        <View className="w-10" />
                    </View>
                </View>

                {/* Full Screen Map Placeholder */}
                <View className="flex-1 relative">
                    <View className="flex-1 bg-gray-100 items-center justify-center">
                        {/* Map placeholder with pickup location indicator */}
                        <View className="absolute top-8 left-4 right-4 bg-white rounded-lg p-3 shadow-sm">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                                    <Text className="text-white font-bold text-sm">A</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-blue-600 font-medium text-sm">Pick-up point</Text>
                                    <Text className="text-gray-700 text-sm" numberOfLines={2}>
                                        {groundTrip.pickUpLocation || 'Loading...'}
                                    </Text>
                                </View>
                                <TouchableOpacity className="bg-blue-500 px-3 py-1 rounded">
                                    <Text className="text-white text-xs font-medium">Navigate</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Map content */}
                        <View className="flex-1 items-center justify-center">
                            <MapPinIcon size={48} color="#E75B3B" />
                            <Text className="text-gray-500 text-lg mt-4">Real-time Trip Tracking</Text>
                            <Text className="text-gray-400 text-sm mt-2">
                                GPS tracking and navigation
                            </Text>
                        </View>

                        {/* Navigation button at bottom of map */}
                        <View className="absolute bottom-8 left-4 right-4">
                            <TouchableOpacity className="bg-[#E75B3B] rounded-lg py-4 items-center shadow-lg">
                                <View className="flex-row items-center">
                                    <TruckIcon size={20} color="white" />
                                    <Text className="text-white font-semibold text-lg ml-2">Navigate</Text>
                                </View>
                                <Text className="text-white text-sm mt-1">
                                    Navigating to pickup location for booking {groundTrip.trackingId}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Bottom Sheet */}
                <BottomSheet
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    enablePanDownToClose={false}
                    backgroundStyle={{ backgroundColor: 'white' }}
                    handleIndicatorStyle={{ backgroundColor: '#E5E7EB' }}
                >
                    <BottomSheetScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >

                        {/* Quick Action Buttons - Visible in collapsed view */}
                        <View className="px-4 mb-6">
                            {nextStatus && (
                                <TouchableOpacity
                                    className="bg-[#E75B3B] rounded-lg py-4 items-center mb-3"
                                    onPress={() => handleStatusUpdate(nextStatus.key)}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text className="text-white font-semibold text-lg">
                                            {currentStatusIndex === 0 ? 'Go to Pick up Location' : `${nextStatus.label}`}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            )}

                            {/* Completed Message */}
                            {!nextStatus && (
                                <View className="bg-green-50 rounded-xl p-4 mb-3">
                                    <Text className="text-green-800 font-semibold text-center">
                                        🎉 Trip Completed Successfully!
                                    </Text>
                                    <Text className="text-green-600 text-center mt-1">
                                        All deliveries have been completed
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Booking Summary Header */}
                        <View className="px-4 mb-6">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">Booking Summary:</Text>

                            {/* Booking Details Grid */}
                            <View className="space-y-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500">Booking ID</Text>
                                    <Text className="font-semibold text-gray-900">{groundTrip.trackingId}</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500">Date of Booking</Text>
                                    <Text className="font-semibold text-gray-900">{formatDate(groundTrip.dateOfBooking)}</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500">Current Status</Text>
                                    <View className="bg-orange-100 px-2 py-1 rounded">
                                        <Text className="text-orange-800 font-medium text-sm">
                                            {TRIP_STATUSES[currentStatusIndex]?.label || 'Unknown'}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500">Pickup Location</Text>
                                    <Text className="font-semibold text-gray-900 flex-1 text-right" numberOfLines={1}>
                                        {groundTrip.pickUpLocation}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500">Drop-off Location</Text>
                                    <Text className="font-semibold text-gray-900 flex-1 text-right" numberOfLines={1}>
                                        {groundTrip.dropOffLocation}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500">Weight</Text>
                                    <Text className="font-semibold text-gray-900">{groundTrip.weight} kg</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500">Price</Text>
                                    <Text className="font-semibold text-gray-900">₦{groundTrip.price?.toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Receiver Information */}
                        {groundTrip.receiver && (
                            <View className="px-4 mb-6">
                                <Text className="text-lg font-semibold text-gray-900 mb-4">Receiver Information:</Text>
                                <View className="space-y-3">
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-500">Name</Text>
                                        <Text className="font-semibold text-gray-900">
                                            {groundTrip.receiver.name || 'N/A'}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-500">Phone Number</Text>
                                        <Text className="font-semibold text-gray-900">
                                            {groundTrip.receiver.phone || 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Sender Information */}
                        {groundTrip.sender && (
                            <View className="px-4 mb-6">
                                <Text className="text-lg font-semibold text-gray-900 mb-4">Sender Information:</Text>
                                <View className="space-y-3">
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-500">Name</Text>
                                        <Text className="font-semibold text-gray-900">
                                            {groundTrip.sender.name || 'N/A'}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-500">Phone Number</Text>
                                        <Text className="font-semibold text-gray-900">
                                            {groundTrip.sender.phoneNumber || 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Packages Section */}
                        {groundTrip.packages && groundTrip.packages.length > 0 && (
                            <View className="mb-6">
                                <Text className="text-lg font-semibold text-gray-900 mb-4">Packages</Text>
                                <PackageList packages={groundTrip.packages} />
                            </View>
                        )}

                        {/* Status Progress */}
                        <View className="px-4 mb-6">
                            <Text className="text-lg font-semibold text-[#131927] mb-4">Trip Progress</Text>
                            <View className="space-y-3">
                                {TRIP_STATUSES.slice(0, currentStatusIndex + 2).map((status, index) => {
                                    const isCompleted = index <= currentStatusIndex;
                                    const isCurrent = index === currentStatusIndex;
                                    const StatusIcon = status.icon;

                                    return (
                                        <View key={status.key} className="flex-row items-center">
                                            <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${isCompleted ? 'bg-[#E75B3B]' : 'bg-gray-200'
                                                }`}>
                                                <StatusIcon size={20} color={isCompleted ? 'white' : '#E75B3B'} />
                                                {/* <Icon
                                                    as={StatusIcon}
                                                    size="sm"
                                                    className={isCompleted ? 'text-white' : 'text-gray-400'}
                                                /> */}
                                            </View>
                                            <View className="flex-1">
                                                <Text className={`font-medium ${isCurrent ? 'text-[#E75B3B]' : 'text-gray-900'}`}>
                                                    {status.label}
                                                </Text>
                                                <Text className="text-gray-500 text-sm">
                                                    {status.description}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Secondary Actions - Only visible when expanded */}
                        <View className="px-4 flex-row space-x-3 mb-4">
                            <TouchableOpacity
                                className="flex-1 border border-gray-300 rounded-lg py-3 items-center"
                                onPress={() => {
                                    // Handle cancel booking
                                    showToast({
                                        title: "Cancel Booking",
                                        description: "Booking cancellation feature coming soon",
                                        icon: InfoIcon,
                                        action: "info"
                                    });
                                }}
                            >
                                <Text className="text-gray-700 font-medium">Cancel Booking</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 bg-orange-500 rounded-lg py-3 items-center"
                                onPress={() => {
                                    // Handle decline change request
                                    showToast({
                                        title: "Change Request",
                                        description: "Change request feature coming soon",
                                        icon: InfoIcon,
                                        action: "info"
                                    });
                                }}
                            >
                                <Text className="text-white font-medium">Decline Change Request</Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
