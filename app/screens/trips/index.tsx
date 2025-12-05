'use client';
import { Icon } from '@/components/ui/icon';
import { Href, router, useNavigation } from 'expo-router';
import { ChevronLeft, SearchIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import GroundTripCard from '../../../components/Custom/GroundTripCard';
import NotificationIconComponent from '../../../components/NotificationIconComponent';
import ParallaxScrollView from '../../../components/ParallaxScrollView';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { useShowToast } from '../../../hooks/useShowToast';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAirTrips } from '../../../store/slices/airTripSlice';
import { acceptBooking, fetchActiveDeliveryBookings, fetchDeliveryBookings, rejectBooking } from '../../../store/slices/groundTripSlice';
import { fetchMarineTrips } from '../../../store/slices/marineTripSlice';
import { AirIcon, AirTripSummaryCard, GroundIcon, MaritimeIcon, MaritimeSummaryCard } from '../dashboard';


type TripStatus = 'In Progress' | 'Pending' | 'All' | 'Accepted' | 'Rejected' | 'Cancelled' | 'Concluded' | 'Active';

interface Booking {
    id: string;
    trackingId: string;
    status: TripStatus;
    date: string;
    pickupLocation: string;
    dropoffLocation: string;
    weight: string;
    receiverName: string;
    receiverPhone: string;
    bookingDate: string;
    expectedArrival?: string;
}



export default function TripHistoryScreen() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TripStatus>('All');


    const { trips: marineTrips, loadingTrips, error: marineTripsError } = useAppSelector((state) => state.marineTrip);

    const { airTrips, error: airTripsError, loading: airTripsLoading } = useAppSelector((state) => state.airTrip);

    const { groundTrips, error: groundTripError, loading: groundTripLoading } = useAppSelector((state) => state.groundTrip)

    const [selectedTransportType, setSelectedTransportType] = useState('Ground');

    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useAppDispatch();
    const showToast = useShowToast();

    const handleAcceptBooking = async (bookingId: string) => {
        try {
            await dispatch(acceptBooking(bookingId)).unwrap();
            // Refresh the ground trips list
            dispatch(fetchDeliveryBookings());
        } catch (error: any) {
            throw error;
        }
    };

    const handleRejectBooking = async (bookingId: string) => {
        try {
            await dispatch(rejectBooking(bookingId)).unwrap();
            // Refresh the ground trips list
            dispatch(fetchDeliveryBookings());
        } catch (error: any) {
            throw error;
        }
    };

    const transportTypes = [
        { type: 'Ground', IconComponent: GroundIcon },
        { type: 'Maritime', IconComponent: MaritimeIcon },
        { type: 'Air', IconComponent: AirIcon },
    ];

    const getTabStyle = (tab: TripStatus) => {
        return activeTab === tab
            ? 'bg-[#E75B3B] text-white'
            : 'bg-transparent text-gray-600 border border-gray-300';
    };




    type TransportType = (typeof transportTypes)[number]['type'];

    const transportRoutes: Record<TransportType, Href> = {
        Ground: '/screens/dashboard/post-ground-trip',
        Maritime: '/screens/dashboard/post-maritime-trip',
        Air: '/screens/dashboard/post-air-trip',
    } as const;


    const retryFetchTrips = (type: string) => {
        if (type == 'Maritime') {
            dispatch(fetchMarineTrips());
        }

        if (type == "Ground") {
            dispatch(fetchDeliveryBookings());
            dispatch(fetchActiveDeliveryBookings());
        }
        if (type == "Air") {
            dispatch(fetchAirTrips());
        }
    };
    const renderMyPostedTripContent = () => {
        const filters: Record<TripStatus, (status: string) => boolean> = {
            'All': () => true,
            'Accepted': (status) => ['accepted'].includes(status.toLowerCase()),
            'Pending': (status) => ['pending'].includes(status.toLowerCase()),
            'Cancelled': (status) => ['cancelled'].includes(status.toLowerCase()),
            'Rejected': (status) => ['rejected'].includes(status.toLowerCase()),
            'In Progress': (status) => ['going_to_pickup', 'picked_up', 'in_transit', 'arrived_destination'].includes(status.toLowerCase()),
            'Concluded': (status) => ['delivered', 'completed'].includes(status.toLowerCase()),
            'Active': (status) => ['accepted', 'going_to_pickup', 'picked_up', 'in_transit', 'arrived_destination', 'delivered', 'toll_bill_pending', 'toll_bill_paid'].includes(status.toLowerCase()),
        };

        const filterTrips = (trips: any[], statusKey: keyof typeof filters) => {
            const lowerSearch = searchQuery.toLowerCase().trim();

            if (selectedTransportType === "Air") {
                return trips.filter((trip) => {
                    const matchesStatus = filters[statusKey](trip.status.toLowerCase());
                    const matchesSearch =
                        !lowerSearch ||
                        trip.tripId?.toLowerCase().includes(lowerSearch) ||
                        trip.depatureAirport.city?.toLowerCase().includes(lowerSearch) ||
                        trip.departureAirport.iata?.toLowerCase().includes(lowerSearch) ||
                        trip.arrivalAirport.city?.toLowerCase().includes(lowerSearch) ||
                        trip.arrivalAirport.iata?.toLowerCase().includes(lowerSearch);
                    return matchesStatus && matchesSearch;
                });
            } else if (selectedTransportType === "Maritime") {

                return trips.filter((trip) => {
                    const matchesStatus = filters[statusKey](trip.status.toLowerCase());
                    const matchesSearch =
                        !lowerSearch ||
                        trip.trackingId?.toLowerCase().includes(lowerSearch) ||
                        trip.pickUpLocation?.toLowerCase().includes(lowerSearch) ||
                        trip.dropOffLocation?.toLowerCase().includes(lowerSearch) ||
                        trip.customer?.toLowerCase?.().includes(lowerSearch);
                    return matchesStatus && matchesSearch;
                });
            }

            return trips.filter((trip) => {
                const matchesStatus = filters[statusKey](trip.status.toLowerCase());
                const matchesSearch =
                    !lowerSearch ||
                    trip.trackingId?.toLowerCase().includes(lowerSearch) ||
                    trip.pickUpLocation?.toLowerCase().includes(lowerSearch) ||
                    trip.dropOffLocation?.toLowerCase().includes(lowerSearch) ||
                    trip.customer?.toLowerCase?.().includes(lowerSearch);
                return matchesStatus && matchesSearch;
            });
        };

        if (selectedTransportType === 'Maritime') {
            if (loadingTrips) {
                return (
                    <ThemedView className="items-center py-6">
                        <ActivityIndicator size="small" color="#E75B3B" />
                        <ThemedText className="text-gray-500 mt-2">{t('dashboard.loading.maritime_trips')}</ThemedText>
                    </ThemedView>
                );
            }

            if (marineTripsError) {
                return (
                    <ThemedView className="bg-red-50 border border-red-100 rounded-2xl p-5">
                        <ThemedText className="text-red-600 font-medium mb-2">{t('dashboard.errors.unable_to_load_maritime')}</ThemedText>
                        <ThemedText className="text-red-600 mb-3">{marineTripsError.message}</ThemedText>
                        <TouchableOpacity
                            onPress={() => retryFetchTrips('Maritime')}
                            className="self-start bg-[#E75B3B] px-5 py-2 rounded-lg"
                        >
                            <ThemedText className="text-white font-medium">{t('dashboard.errors.try_again')}</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                );
            }

            const filtered = filterTrips(marineTrips, activeTab);

            if (filtered.length === 0) {
                return (
                    <ThemedView className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 items-center">
                        <ThemedText className="text-gray-600 text-center">
                            {t('trips.list.empty_desc')}
                        </ThemedText>
                    </ThemedView>
                );
            }

            return filtered.map((trip) => (
                <MaritimeSummaryCard key={trip._id} trip={trip} />
            ));
        }

        if (selectedTransportType === 'Air') {
            if (airTripsLoading) {
                return (
                    <ThemedView className="items-center py-6">
                        <ActivityIndicator size="small" color="#E75B3B" />
                        <ThemedText className="text-gray-500 mt-2">{t('dashboard.loading.air_trips')}</ThemedText>
                    </ThemedView>
                );
            }

            if (airTripsError) {
                return (
                    <ThemedView className="bg-red-50 border border-red-100 rounded-2xl p-5">
                        <ThemedText className="text-red-600 font-medium mb-2">{t('dashboard.errors.unable_to_load_air')}</ThemedText>
                        <ThemedText className="text-red-600 mb-3">{airTripsError.message}</ThemedText>
                        <TouchableOpacity
                            onPress={() => retryFetchTrips('Air')}
                            className="self-start bg-[#E75B3B] px-5 py-2 rounded-lg"
                        >
                            <ThemedText className="text-white font-medium">{t('dashboard.errors.try_again')}</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                );
            }

            const filtered = filterTrips(airTrips, activeTab);

            if (filtered.length === 0) {
                return (
                    <ThemedView className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 items-center">
                        <ThemedText className="text-gray-600 text-center">
                            {t('trips.list.empty_desc')}
                        </ThemedText>
                    </ThemedView>
                );
            }

            return filtered.map((trip) => (
                <AirTripSummaryCard key={trip._id} trip={trip} />
            ));
        }

        if (selectedTransportType === 'Ground') {
            if (groundTripLoading) {
                return (
                    <ThemedView className="items-center py-6">
                        <ActivityIndicator size="small" color="#E75B3B" />
                        <ThemedText className="text-gray-500 mt-2">{t('dashboard.loading.ground_trips')}</ThemedText>
                    </ThemedView>
                );
            }

            if (groundTripError) {
                return (
                    <ThemedView className="bg-red-50 border border-red-100 rounded-2xl p-5">
                        <ThemedText className="text-red-600 font-medium mb-2">{t('dashboard.errors.unable_to_load_ground')}</ThemedText>
                        <ThemedText className="text-red-600 mb-3">{groundTripError.message}</ThemedText>
                        <TouchableOpacity
                            onPress={() => retryFetchTrips('Ground')}
                            className="self-start bg-[#E75B3B] px-5 py-2 rounded-lg"
                        >
                            <ThemedText className="text-white font-medium">{t('dashboard.errors.try_again')}</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                );
            }

            const filtered = filterTrips(groundTrips, activeTab);

            if (filtered.length === 0) {
                return (
                    <ThemedView className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 items-center">
                        <ThemedText className="text-gray-600 text-center">
                            {t('trips.list.empty_desc')}
                        </ThemedText>
                    </ThemedView>
                );
            }

            return filtered.map((trip) => (
                <GroundTripCard
                    key={trip.id}
                    trip={trip}
                    onAccept={handleAcceptBooking}
                    onReject={handleRejectBooking}
                />
            ));
        }

        return null;
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
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => {
                return (
                    <ThemedText type="s1_subtitle" className="text-center">
                        {t('trips.header.title')}
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
        <ParallaxScrollView headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}>

            {/* Booking List */}

            {/* My Posted Trips */}
            <ThemedView className="px-4 mb-3">
                {/* <ThemedText className="text-xl font-bold text-gray-900 mb-4">My Posted Trips</ThemedText> */}

                {/* <MaritimeSummaryCard trip={marineTrips[0]} /> */}

                {/* Transport Tabs */}
                <ThemedView className="flex-row gap-3">
                    {transportTypes.map((transport) => {
                        const isActive = selectedTransportType === transport.type;
                        const IconComponent = transport.IconComponent;

                        return (
                            <>

                                <TouchableOpacity
                                    key={transport.type}
                                    onPress={() => setSelectedTransportType(transport.type)}
                                    className={`flex-1 items-center justify-center py-5 rounded-2xl ${isActive ? 'bg-[#E75B3B]' : 'bg-white'}`}
                                    activeOpacity={isActive ? 0.8 : 1}
                                >
                                    <ThemedView className="items-center">
                                        <IconComponent isActive={isActive} />
                                        <ThemedText className={`mt-2 text-sm capitalize ${isActive ? 'text-white font-medium' : 'text-gray-700'}`}>
                                            {t(`dashboard.transport.${transport.type.toLowerCase()}`)}
                                        </ThemedText>
                                    </ThemedView>
                                </TouchableOpacity>
                            </>
                        );
                    })}
                </ThemedView>
            </ThemedView>

            {/* Posted Trips Content */}
            <ThemedView className="mt-2 flex-row justify-between items-center mb-4 gap-3">
                {transportTypes.map((transport) => {

                    return (
                        <ThemedView className={`px-4 mb-6 ${transport.type === selectedTransportType ? '' : 'hidden'}`} key={transport.type}>
                            {transport.type === 'Ground' ? (
                                <ThemedView className="mb-6">

                                    <ThemedView className="flex-row justify-between items-center gap-2 mb-4">
                                        {['All', 'Accepted', 'Rejected'].map((status) => (
                                            <TouchableOpacity
                                                key={status}
                                                className={`py-2 gap-2 rounded-full flex items-center justify-center ${getTabStyle(status as TripStatus)}`}
                                                style={{ width: '33%' }}
                                                onPress={() => setActiveTab(status as TripStatus)}
                                            >
                                                <ThemedText className={`font-medium text-center ${activeTab === status ? 'text-white' : 'text-gray-600'}`}>
                                                    {status}
                                                </ThemedText>
                                            </TouchableOpacity>
                                        ))}
                                    </ThemedView>

                                    <ThemedView className="bg-white mt-2 mb-3 rounded-xl border-[#F4B4A5] h-[48px] border border-gray-200 flex-row px-3 items-center shadow-sm">
                                        <SearchIcon />
                                        <TextInput
                                            placeholder={t('trips.search.placeholder')}
                                            className="flex-1 ml-3 text-gray-700"
                                            placeholderTextColor="#9CA3AF"
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                        />
                                    </ThemedView>



                                    {renderMyPostedTripContent()}
                                </ThemedView>
                            ) : (
                                <ThemedView className="mb-6">


                                    <ThemedView className="flex-row gap-2 justify-between items-center mb-4">
                                        {['All', 'Concluded', 'Cancelled'].map((status) => (
                                            <TouchableOpacity
                                                key={status}
                                                className={`px-4 py-2 rounded-full flex items-center justify-center ${getTabStyle(status as TripStatus)}`}
                                                style={{ width: '33%' }}
                                                onPress={() => setActiveTab(status as TripStatus)}
                                            >
                                                <ThemedText className={`font-medium text-center ${activeTab === status ? 'text-white' : 'text-gray-600'}`}>
                                                    {status}
                                                </ThemedText>
                                            </TouchableOpacity>
                                        ))}
                                    </ThemedView>

                                    <ThemedView className="bg-white rounded-xl border-[#F4B4A5] h-[48px] border border-gray-200 flex-row px-3 items-center shadow-sm">
                                        <SearchIcon />
                                        <TextInput
                                            placeholder={t('trips.search.placeholder')}
                                            className="flex-1 text-gray-700"
                                            placeholderTextColor="#9CA3AF"
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                        />
                                    </ThemedView>


                                    {/* <TouchableOpacity
                                            className={`px-4 py-2 rounded-full flex items-center justify-center ${getTabStyle('Pending')}`}
                                            style={{ width: '33.33%' }}
                                            onPress={() => setActiveTab('Rejected')}
                                        >
                                            <ThemedText className={`font-medium text-center ${activeTab === 'Pending' ? 'text-white' : 'text-gray-600'}`}>
                                                Rejected
                                            </ThemedText>
                                        </TouchableOpacity> */}

                                    {renderMyPostedTripContent()}
                                </ThemedView>
                            )}

                        </ThemedView>
                    )
                })}
            </ThemedView>

        </ParallaxScrollView>
    );
}