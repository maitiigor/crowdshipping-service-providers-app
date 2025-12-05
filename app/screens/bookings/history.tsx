'use client';
import { Icon } from '@/components/ui/icon';
import { router, useNavigation } from 'expo-router';
import { Box, ChevronLeft, ChevronRight, SearchIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroundTripCard from '../../../components/Custom/GroundTripCard';
import NotificationIconComponent from '../../../components/NotificationIconComponent';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Booking, GroundTrip } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAirBookings } from '../../../store/slices/airTripSlice';
import { fetchActiveDeliveryBookings } from '../../../store/slices/groundTripSlice';
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
        dispatch(fetchActiveDeliveryBookings());
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
        console.log('render booking history item', booking, type);
        return (
            <TouchableOpacity
                key={booking._id}
                onPress={() => {
                    if (type == 'Ground') {
                        router.push({
                            pathname:
                                displayStatus === 'In Progress' || displayStatus === 'Pending'
                                    ? '/screens/dashboard/trip-status-management'
                                    : '/screens/bookings/booking-detail',
                            params: { bookingId: booking._id, type: type },
                        })
                    } else if (type == 'Maritime') {
                        router.push({
                            pathname:
                                displayStatus === 'In Progress' || displayStatus === 'Pending'
                                    ? '/screens/dashboard/marine-trip-management'
                                    : '/screens/bookings/booking-detail' as any,
                            params: { bookingId: booking._id, type: type },
                        })
                    } else {

                        router.push({
                            pathname: (displayStatus === 'In Progress' || displayStatus === 'Pending'
                                ? '/screens/dashboard/air-trip-management'
                                : '/screens/bookings/booking-detail') as any,
                            params: { bookingId: booking._id, type: type },
                        });
                    }
                }
                }
                className="bg-white flex flex-row rounded-xl p-6 mb-4 shadow-sm border border-gray-100"
            >
                <ThemedView className="border border-gray-200 w-12 h-12 rounded-full items-center justify-center p-3">
                    <Box />
                </ThemedView>
                <ThemedView className="flex-1 self-center">
                    <ThemedText className="text-gray-900 font-semibold text-base ml-4">{booking._id}</ThemedText>
                    <ThemedText className="text-gray-500 text-sm ml-4">
                        {booking.status} - {formatDate(booking.createdAt)}
                    </ThemedText>
                </ThemedView>
                <ThemedView className="self-center">
                    <Icon as={ChevronRight} size="md" className="text-gray-700" />
                </ThemedView>
            </TouchableOpacity>
        );
    };

    const renderGroundBookingHistoryItem = (booking: GroundTrip, type: string) => {
        const displayStatus = mapStatusToDisplayStatus(booking.status);
        return (
            <TouchableOpacity
                key={booking.id}
                onPress={() =>
                    router.push({
                        pathname:
                            displayStatus === 'In Progress'
                                ? '/screens/dashboard/trip-status-management'
                                : '/screens/bookings/booking-detail',
                        params: { bookingId: booking.id, type: 'Ground' },
                    })
                }
                className="bg-white flex flex-row rounded-xl p-6 mb-4 shadow-sm border border-gray-100"
            >
                <ThemedView className="border border-gray-200 w-12 h-12 rounded-full items-center justify-center p-3">
                    <Box />
                </ThemedView>
                <ThemedView className="flex-1 self-center">
                    <ThemedText className="text-gray-900 font-semibold text-base ml-4">{booking.trackingId}</ThemedText>
                    <ThemedText className="text-gray-500 text-sm ml-4">
                        {booking.status} - {formatDate(booking.dateOfBooking)}
                    </ThemedText>
                </ThemedView>
                <ThemedView className="self-center">
                    <Icon as={ChevronRight} size="md" className="text-gray-700" />
                </ThemedView>
            </TouchableOpacity>
        );
    }

    const transportTypes = [
        { type: 'Ground', IconComponent: GroundIcon },
        { type: 'Maritime', IconComponent: MaritimeIcon },
        { type: 'Air', IconComponent: AirIcon },
    ];

    const navigation = useNavigation();


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => {
                return (
                    <ThemedText type="s1_subtitle" className="text-center">
                        Notifications
                    </ThemedText>
                );
            },
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 20 }, // Increased font size
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: "#FFFFFF",
                elevation: 0, // Android
                shadowOpacity: 0, // iOS
                shadowColor: "transparent", // iOS
                borderBottomWidth: 0,
            },
            headerLeft: () => (
                <ThemedView
                    style={{
                        shadowColor: "#FDEFEB1A",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.102,
                        shadowRadius: 3,
                        elevation: 4,
                    }}
                >
                    <ThemedView
                        style={{
                            shadowColor: "#0000001A",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.102,
                            shadowRadius: 2,
                            elevation: 2,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="p-2 rounded   flex justify-center items-center"
                        >
                            <Icon
                                as={ChevronLeft}
                                size="3xl"
                                className="text-typography-900"
                            />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            ),
            headerRight: () => <NotificationIconComponent />,
        });
    }, [navigation, router]);
    return (
        <SafeAreaView className="flex-1 bg-gray-50">

            {/* Transport Type Tabs */}
            <ThemedView className="px-4">
                <ThemedView className="mt-2 flex-row justify-between items-center mb-4 gap-3">
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
                                <ThemedView className="items-center">
                                    <IconComponent isActive={isActive} />
                                    <ThemedText
                                        className={`mt-2 text-sm capitalize ${isActive ? 'text-white font-medium' : 'text-gray-700'
                                            }`}
                                    >
                                        {transport.type}
                                    </ThemedText>
                                </ThemedView>
                            </TouchableOpacity>
                        );
                    })}
                </ThemedView>

                {/* Status Tabs */}
                <ThemedView className="flex-row gap-3">
                    {['Pending', 'In Progress', 'Delivered', 'Completed'].map((status) => (
                        <TouchableOpacity
                            key={status}
                            className={`flex-1 items-center justify-center py-3 rounded-lg ${getTabStyle(
                                status as BookingStatus
                            )}`}
                            onPress={() => setActiveTabCategory(status as BookingStatus)}
                        >
                            <ThemedText
                                className={`${getActiveTab() === status ? 'text-white' : 'text-gray-600'
                                    } text-sm font-medium`}
                            >
                                {status}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </ThemedView>

                <ThemedView className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 mt-3">
                    <SearchIcon size={18} color="#888" />
                    <TextInput
                        className="ml-2 flex-1 text-base"
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </ThemedView>


                {/* Booking List */}
                <ThemedView className="px-4 mt-4">
                    {selectedTransportType === 'Air' ? (
                        airLoadingBookings ? (
                            <ActivityIndicator />
                        ) : filteredAirBookings.length > 0 ? (
                            filteredAirBookings.map((booking) => renderBookingHistoryItem(booking, 'Air'))
                        ) : (
                            <ThemedView className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100">
                                <ThemedText className="text-gray-500 text-center">No Air bookings found</ThemedText>
                            </ThemedView>
                        )
                    ) : selectedTransportType === 'Maritime' ? (
                        marineLoadingBookings ? (
                            <ActivityIndicator />
                        ) : filteredMarineBookings.length > 0 ? (
                            filteredMarineBookings.map((booking) =>
                                renderBookingHistoryItem(booking, 'Maritime')
                            )
                        ) : (
                            <ThemedView className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100">
                                <ThemedText className="text-gray-500 text-center">No Maritime bookings found</ThemedText>
                            </ThemedView>
                        )
                    ) : groundTripLoading ? (
                        <ActivityIndicator />
                    ) : filteredGroundBookings.length > 0 ? (
                        filteredGroundBookings.map((booking) =>
                            <GroundTripCard trip={booking} onAccept={() => null} onReject={() => null} showActions={true} />
                        )
                    ) : (
                        <ThemedView className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100">
                            <ThemedText className="text-gray-500 text-center">No Ground bookings found</ThemedText>
                        </ThemedView>
                    )}
                </ThemedView>
            </ThemedView>
        </SafeAreaView>
    );
}
