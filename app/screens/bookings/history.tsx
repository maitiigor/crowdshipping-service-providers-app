'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import { Box, ChevronRight, SearchIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Booking } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAirBookings } from '../../../store/slices/airTripSlice';
import { fetchDeliveryBookings } from '../../../store/slices/groundTripSlice';
import { fetchMarineBookings } from '../../../store/slices/marineTripSlice';
import { AirIcon, GroundIcon, MaritimeIcon } from '../dashboard';

type BookingStatus = 'In Progress' | 'Pending' | 'Delivered' | 'Completed' | 'Accepted' | 'Rejected';

// Helper: map API statuses to display statuses
const mapStatusToDisplayStatus = (apiStatus: string): BookingStatus => {
    const status = apiStatus.toLowerCase();

    if (
        [
            'going_to_pickup',
            'picked_up',
            'in_transit',
            'arrived_destination',
            'delivered',
            'toll_bill_pending',
            'toll_bill_paid',
            'in_progress',
        ].includes(status)
    ) {
        return 'In Progress';
    }
    if (status === 'pending') return 'Pending';
    if (status === 'completed') return 'Delivered';
    if (status === 'accepted') return 'Accepted';
    if (status === 'rejected') return 'Rejected';

    return 'Pending';
};

// Helper: format date for display
const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    } catch {
        return dateString;
    }
};

export default function BookingHistoryScreen() {
    const dispatch = useAppDispatch();
    const { groundTrips, loading: groundTripLoading } = useAppSelector((state) => state.groundTrip);
    const { marineBookings, loadingBookings: marineLoadingBookings } = useAppSelector(
        (state) => state.marineTrip
    );
    const { airBookings, loadingBookings: airLoadingBookings } = useAppSelector(
        (state) => state.airTrip
    );

    const [selectedTransportType, setSelectedTransportType] = useState<'Ground' | 'Maritime' | 'Air'>(
        'Ground'
    );

    // Maintain separate tab state for each transport type
    const [activeAirTab, setActiveAirTab] = useState<BookingStatus>('In Progress');
    const [activeMarineTab, setActiveMarineTab] = useState<BookingStatus>('In Progress');
    const [activeGroundTab, setActiveGroundTab] = useState<BookingStatus>('In Progress');

    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all bookings on mount
    useEffect(() => {
        dispatch(fetchAirBookings());
        dispatch(fetchMarineBookings());
        dispatch(fetchDeliveryBookings());
    }, [dispatch]);

    // Get active tab dynamically
    const getActiveTab = (): BookingStatus => {
        if (selectedTransportType === 'Air') return activeAirTab;
        if (selectedTransportType === 'Maritime') return activeMarineTab;
        return activeGroundTab;
    };

    // Set active tab based on selected transport type
    const setActiveTabCategory = (tab: BookingStatus) => {
        if (selectedTransportType === 'Air') setActiveAirTab(tab);
        else if (selectedTransportType === 'Maritime') setActiveMarineTab(tab);
        else setActiveGroundTab(tab);
    };

    // Compute tab styles
    const getTabStyle = (tab: BookingStatus) =>
        getActiveTab() === tab
            ? 'bg-[#E75B3B] text-white'
            : 'bg-transparent text-gray-600 border border-gray-300';

    // Filter bookings per category
    const filteredAirBookings = airBookings
        .filter((booking) => mapStatusToDisplayStatus(booking.status) === activeAirTab)
        .filter(
            (booking) =>
                booking._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.status?.toLowerCase().includes(searchQuery.toLowerCase())
            //   ||
            //   booking?.pickup?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            //   booking?.destination?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const filteredMarineBookings = marineBookings
        .filter((booking) => mapStatusToDisplayStatus(booking.status) === activeMarineTab)
        .filter(
            (booking) =>
                booking._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.status?.toLowerCase().includes(searchQuery.toLowerCase())
            //    ||
            //   booking?.pickup?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            //   booking?.destination?.toLowerCase().includes(searchQuery.toLowerCase())
        );




    const filteredGroundBookings = groundTrips.filter(
        (trip) => mapStatusToDisplayStatus(trip.status) === activeGroundTab
    );

    // Render individual booking item
    const renderBookingHistoryItem = (booking: Booking, type: string) => {
        const displayStatus = mapStatusToDisplayStatus(booking.status);

        return (
            <TouchableOpacity
                key={booking._id}
                onPress={() =>
                    router.push({
                        pathname:
                            displayStatus === 'In Progress'
                                ? '/screens/dashboard/trip-status-management'
                                : '/screens/bookings/booking-detail',
                        params: { bookingId: booking._id },
                    })
                }
                className="bg-white flex flex-row rounded-xl p-6 mb-4 shadow-sm border border-gray-100"
            >
                <View className="border border-gray-200 w-12 h-12 rounded-full items-center justify-center p-3">
                    <Box />
                </View>
                <View className="flex-1 self-center">
                    <Text className="text-gray-900 font-semibold text-base ml-4">{booking._id}</Text>
                    <Text className="text-gray-500 text-sm ml-4">
                        {booking.status} - {formatDate(booking.createdAt)}
                    </Text>
                </View>
                <View className="self-center">
                    <Icon as={ChevronRight} size="md" className="text-gray-700" />
                </View>
            </TouchableOpacity>
        );
    };

    const transportTypes = [
        { type: 'Ground', IconComponent: GroundIcon },
        { type: 'Maritime', IconComponent: MaritimeIcon },
        { type: 'Air', IconComponent: AirIcon },
    ];

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

            {/* Transport Type Tabs */}
            <View className="px-4">
                <View className="mt-2 flex-row justify-between items-center mb-4 gap-3">
                    {transportTypes.map((transport) => {
                        const isActive = selectedTransportType === transport.type;
                        const IconComponent = transport.IconComponent;
                        return (
                            <TouchableOpacity
                                key={transport.type}
                                onPress={() => setSelectedTransportType(transport.type as any)}
                                className={`flex-1 items-center justify-center py-5 rounded-2xl ${isActive ? 'bg-[#E75B3B]' : 'bg-white'
                                    }`}
                                activeOpacity={isActive ? 0.8 : 1}
                            >
                                <View className="items-center">
                                    <IconComponent isActive={isActive} />
                                    <Text
                                        className={`mt-2 text-sm capitalize ${isActive ? 'text-white font-medium' : 'text-gray-700'
                                            }`}
                                    >
                                        {transport.type}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Status Tabs */}
                <View className="flex-row gap-3">
                    {['In Progress', 'Pending', 'Delivered', 'Completed'].map((status) => (
                        <TouchableOpacity
                            key={status}
                            className={`flex-1 items-center justify-center py-3 rounded-lg ${getTabStyle(
                                status as BookingStatus
                            )}`}
                            onPress={() => setActiveTabCategory(status as BookingStatus)}
                        >
                            <Text
                                className={`${getActiveTab() === status ? 'text-white' : 'text-gray-600'
                                    } text-sm font-medium`}
                            >
                                {status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 mt-3">
                    <SearchIcon size={18} color="#888" />
                    <TextInput
                        className="ml-2 flex-1 text-base"
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>


                {/* Booking List */}
                <View className="px-4 mt-4">
                    {selectedTransportType === 'Air' ? (
                        airLoadingBookings ? (
                            <ActivityIndicator />
                        ) : filteredAirBookings.length > 0 ? (
                            filteredAirBookings.map((booking) => renderBookingHistoryItem(booking, 'Air'))
                        ) : (
                            <View className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100">
                                <Text className="text-gray-500 text-center">No Air bookings found</Text>
                            </View>
                        )
                    ) : selectedTransportType === 'Maritime' ? (
                        marineLoadingBookings ? (
                            <ActivityIndicator />
                        ) : filteredMarineBookings.length > 0 ? (
                            filteredMarineBookings.map((booking) =>
                                renderBookingHistoryItem(booking, 'Maritime')
                            )
                        ) : (
                            <View className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100">
                                <Text className="text-gray-500 text-center">No Maritime bookings found</Text>
                            </View>
                        )
                    ) : groundTripLoading ? (
                        <ActivityIndicator />
                    ) : filteredGroundBookings.length > 0 ? (
                       null
                    ) : (
                        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100">
                            <Text className="text-gray-500 text-center">No Ground bookings found</Text>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
