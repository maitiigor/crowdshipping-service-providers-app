import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ChevronLeft,
    ClockIcon,
    InfoIcon,
    MapPinIcon,
    PackageIcon,
    TruckIcon
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import PackageList from '../../../components/Custom/PackageList';
import NotificationIconComponent from '../../../components/NotificationIconComponent';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Icon } from '../../../components/ui/icon';
import { useShowToast } from '../../../hooks/useShowToast';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
    fetchDeliveryBookingDetail,
    updateTripStatus
} from '../../../store/slices/groundTripSlice';
import { fetchBookingDetail, resendDeliveryOtp, updateOrderLocation } from '../../../store/slices/tripManagementSlice';
import { fetchAirOrderLocations } from '../../../store/slices/airTripSlice';
import { fetchMarineOrderLocations } from '../../../store/slices/marineTripSlice';

const TRIP_STATUSES = [
    { key: 'IN_PROGRESS', label: 'In Progress', description: 'Trip is yet to start', icon: TruckIcon },
    { key: 'GOING_TO_PICKUP', label: 'Going to Pickup', description: 'On the way to collect packages', icon: TruckIcon },
    { key: 'PICKED_UP', label: 'Picked Up', description: 'Packages collected successfully', icon: PackageIcon },
    { key: 'IN_TRANSIT', label: 'In Transit', description: 'Packages are being transported', icon: TruckIcon },
    { key: 'ARRIVED_DESTINATION', label: 'Arrived at Destination', description: 'Reached the delivery location', icon: MapPinIcon },
    { key: 'DELIVERED', label: 'Delivered', description: 'Packages delivered to recipient', icon: CheckCircleIcon },
    { key: 'TOLL_BILL_PENDING', label: 'Toll Bill Pending', description: 'Awaiting toll payment', icon: ClockIcon },
    //  { key: 'TOLL_BILL_PAID', label: 'Toll Bill Paid', description: 'Toll payment completed', icon: CheckCircleIcon },
    { key: 'COMPLETED', label: 'Completed', description: 'Trip completed successfully', icon: CheckCircleIcon }
];

export default function TripStatusManagementScreen() {
    const { tripId, bookingId, type } = useLocalSearchParams<{ tripId: string, bookingId: string, type: string }>();
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [location, setLocation] = useState<any>(null);
    const [routeCoords, setRouteCoords] = useState<any[]>([]);
    const [loadingRoute, setLoadingRoute] = useState(false);

    const dispatch = useAppDispatch();
    const showToast = useShowToast();
    const { groundTrip, loading } = useAppSelector((state) => state.groundTrip);
    const { bookingDetail } = useAppSelector((state) => state.tripManagement);
    const { orderLocations: airOrderLocations, loadingOrderLocation: loadingAirOrderLocation } = useAppSelector((state) => state.airTrip);
    const { orderLocations: marineOrderLocations, loadingOrderLocation: loadingMarineOrderLocation } = useAppSelector((state) => state.marineTrip);



    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
    const handleSheetChanges = useCallback((index: number) => { }, []);

    if (type == 'Air' || type == 'Maritime') {
        useEffect(() => {
            if (bookingId) {
                dispatch(fetchBookingDetail(bookingId));

            }
            if (bookingId && type == 'Air') {
                dispatch(fetchAirOrderLocations(bookingId));
            }
            if (bookingId && type == 'Maritime') {
                dispatch(fetchMarineOrderLocations(bookingId));
            }

        }, [bookingId, dispatch]);

        // console.log("Booking Detail", bookingDetail, type, bookingId);



    }

    // useFocusEffect(
    //     useCallback(() => {
    //         let locationSubscription: Location.LocationSubscription | null = null;
    //         (async () => {
    //             let { status } = await Location.requestForegroundPermissionsAsync();
    //             if (status !== 'granted') {
    //                 setErrorMsg('Permission to access location was denied');
    //                 return;
    //             }

    //             const current = await Location.getCurrentPositionAsync({});
    //             setLocation(current.coords);

    //             locationSubscription = await Location.watchPositionAsync(
    //                 {
    //                     accuracy: Location.Accuracy.High,
    //                     timeInterval: 5000,
    //                     distanceInterval: 10,
    //                 },
    //                 (loc) => {
    //                     setLocation(loc.coords);
    //                     sendLocationToBackend(loc.coords);
    //                 }
    //             );
    //         })();
    //         return () => locationSubscription?.remove();
    //     }, [tripId])
    // );

    useFocusEffect(
        useCallback(() => {
            let locationSubscription: Location.LocationSubscription | null = null;
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                const current = await Location.getCurrentPositionAsync({});
                setLocation(current.coords);

                // draw route first time
                if (hasCoords && current.coords) {
                    const destination =
                        groundTrip.status === 'PICKED_UP' || groundTrip.status === 'IN_TRANSIT'
                            ? dropoffCoords
                            : pickupCoords;
                    fetchORSRoute(
                        [current.coords.latitude, current.coords.longitude],
                        destination
                    );
                }

                // continuous tracking
                locationSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 10000, // every 10 seconds
                        distanceInterval: 20, // or 20 meters
                    },
                    (loc) => {
                        setLocation(loc.coords);


                        // re-draw route dynamically
                        if (hasCoords && loc.coords) {
                            const destination =
                                groundTrip.status === 'GOING_TO_PICKUP' || groundTrip.status === 'IN_TRANSIT'
                                    ? dropoffCoords
                                    : pickupCoords;
                            fetchORSRoute(
                                [loc.coords.latitude, loc.coords.longitude],
                                destination
                            );
                            sendLocationToBackend(loc.coords);
                        }
                    }
                );
            })();
            return () => locationSubscription?.remove();
        }, [tripId, groundTrip.status])
    );




    const sendLocationToBackend = async (coords: any) => {
        try {
            console.log("Sending location:", coords, groundTrip);
            await dispatch(updateOrderLocation({
                tripId: groundTrip.id,
                currentLocation: {
                    lat: coords.latitude,
                    lng: coords.longitude,
                    address: 'N/A'
                },
                speed: coords.speed,
                heading: coords.heading
            })).unwrap().then(() => {
                console.log('Location sent successfully');
            });
        } catch (error: any) {
            console.log('Failed to send location:', error.message);
        }
    };

    useEffect(() => {
        if (tripId && !groundTrip?.id) {
            dispatch(fetchDeliveryBookingDetail(tripId));
        }
    }, [tripId, dispatch]);

    useEffect(() => {
        if (groundTrip.status) {
            const statusIndex = TRIP_STATUSES.findIndex(s => s.key === groundTrip.status);
            if (statusIndex !== -1) setCurrentStatusIndex(statusIndex);
        }
    }, [groundTrip.status]);

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

    const handleStatusUpdate = async (statusKey: string) => {
        if (!tripId) return;
        setIsUpdating(true);

        if (statusKey === 'DELIVERED') {
            router.push({ pathname: '/screens/dashboard/confirm-delivery', params: { tripId: tripId } });
            return;
        } else if (statusKey === 'TOLL_BILL_PENDING') {
            router.push({ pathname: '/screens/dashboard/add-tolls-expenses', params: { tripId } })
            return;
        } else if (statusKey === 'COMPLETED') {
            try {
                const response = await dispatch(resendDeliveryOtp({ tripId })).unwrap();
                setIsUpdating(false);

                router.push({ pathname: '/screens/dashboard/complete-delivery-otp', params: { tripId } });
                return;
            } catch (error: any) {
                showToast({
                    title: "Error",
                    description: error.message || "Something went wrong while completing this trip.",
                    icon: InfoIcon,
                    action: 'error'
                })
            } finally {
                setIsUpdating(false);
            }

            return;
        }


        try {

            await dispatch(updateTripStatus({ id: tripId, status: statusKey })).unwrap();
            showToast({
                title: "Status Updated",
                description: `Trip status updated to ${TRIP_STATUSES.find(s => s.key === statusKey)?.label}`,
                icon: CheckCircleIcon,
                action: "success"
            });

            const newIndex = TRIP_STATUSES.findIndex(s => s.key === statusKey);
            if (newIndex !== -1) setCurrentStatusIndex(newIndex);
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

    const nextStatus =
        currentStatusIndex < TRIP_STATUSES.length - 1
            ? TRIP_STATUSES[currentStatusIndex + 1]
            : null;

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

    const pickupCoords = groundTrip?.pickUpLocation?.coordinates;
    const dropoffCoords = groundTrip?.dropOffLocation?.coordinates;
    const hasCoords = pickupCoords?.length === 2 && dropoffCoords?.length === 2;

    // ✅ Fetch OpenRouteService route (road-following route)
    useEffect(() => {
        // const fetchRoute = async () => {
        //     if (!hasCoords) return;
        //     setLoadingRoute(true);
        //     try {
        //         const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFmOGM4ZTZjYTA3MzQwNDE5NTEzMGE3NmMzNjI0ZjYwIiwiaCI6Im11cm11cjY0In0='; // replace with your free ORS key
        //         const response = await fetch(
        //             `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickupCoords[1]},${pickupCoords[0]}&end=${dropoffCoords[1]},${dropoffCoords[0]}`
        //         );
        //         const data = await response.json();
        //         const coords = data.features[0].geometry.coordinates.map(([lon, lat]: [number, number]) => ({
        //             latitude: lat,
        //             longitude: lon,
        //         }));
        //         setRouteCoords(coords);
        //     } catch (err) {
        //         console.log('Failed to fetch route:', err);
        //     } finally {
        //         setLoadingRoute(false);
        //     }
        // };
        //fetchRoute();
        fetchORSRoute(pickupCoords!, dropoffCoords!);
    }, [pickupCoords, dropoffCoords]);



    const fetchORSRoute = async (start: [number, number], end: [number, number]) => {
        try {

            const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFmOGM4ZTZjYTA3MzQwNDE5NTEzMGE3NmMzNjI0ZjYwIiwiaCI6Im11cm11cjY0In0='; // replace with your free ORS key

            const response = await fetch(
                `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`
            );
            const data = await response.json();

            if (data?.features?.[0]?.geometry?.coordinates) {
                const coords = data.features[0].geometry.coordinates.map(([lon, lat]: [number, number]) => ({
                    latitude: lat,
                    longitude: lon,
                }));
                setRouteCoords(coords);
            }
        } catch (err) {
            console.log('Failed to fetch route:', err);
        }
    };


    const renderGroundBookingDetails = () => {
        if (!groundTrip) return null;

        return (
            <>
                {/* Booking Details Grid */}
                <ThemedView className="space-y-3 px-4 mb-6">
                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500">Booking ID</ThemedText>
                        <ThemedText className="font-semibold text-gray-900">
                            {groundTrip?.trackingId}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500">Date of Booking</ThemedText>
                        <ThemedText className="font-semibold text-gray-900">
                            {formatDate(groundTrip?.dateOfBooking || '')}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500">Current Status</ThemedText>
                        <ThemedView className="bg-orange-100 px-2 py-1 rounded">
                            <ThemedText className="text-orange-800 font-medium text-sm">
                                {TRIP_STATUSES[currentStatusIndex]?.label ||
                                    groundTrip?.status ||
                                    'Unknown'}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500">Pickup Location</ThemedText>
                        <Text
                            className="font-semibold text-gray-900 flex-1 text-right"
                            numberOfLines={1}
                        >
                            {groundTrip?.pickUpLocation?.address}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500">Drop-off Location</ThemedText>
                        <Text
                            className="font-semibold text-gray-900 flex-1 text-right"
                            numberOfLines={1}
                        >
                            {groundTrip?.dropOffLocation?.address}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500">Weight</ThemedText>
                        <ThemedText className="font-semibold text-gray-900">
                            {groundTrip?.weight} kg
                        </ThemedText>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500">Price</ThemedText>
                        <ThemedText className="font-semibold text-gray-900">
                            ₦{groundTrip?.price?.toLocaleString()}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Receiver Information */}
                {groundTrip?.receiver && (
                    <ThemedView className="px-4 mb-6">
                        <ThemedText className="text-lg font-semibold text-gray-900 mb-4">
                            Receiver Information:
                        </ThemedText>
                        <ThemedView className="space-y-3">
                            <ThemedView className="flex-row justify-between">
                                <ThemedText className="text-gray-500">Name</ThemedText>
                                <ThemedText className="font-semibold text-gray-900">
                                    {groundTrip.receiver.name || 'N/A'}
                                </ThemedText>
                            </ThemedView>
                            <ThemedView className="flex-row justify-between">
                                <ThemedText className="text-gray-500">Phone Number</ThemedText>
                                <ThemedText className="font-semibold text-gray-900">
                                    {groundTrip.receiver.phone || 'N/A'}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                )}

                {/* Sender Information */}
                {groundTrip?.sender && (
                    <ThemedView className="px-4 mb-6">
                        <ThemedText className="text-lg font-semibold text-gray-900 mb-4">
                            Sender Information:
                        </ThemedText>
                        <ThemedView className="space-y-3">
                            <ThemedView className="flex-row justify-between">
                                <ThemedText className="text-gray-500">Name</ThemedText>
                                <ThemedText className="font-semibold text-gray-900">
                                    {groundTrip.sender.name || 'N/A'}
                                </ThemedText>
                            </ThemedView>
                            <ThemedView className="flex-row justify-between">
                                <ThemedText className="text-gray-500">Phone Number</ThemedText>
                                <ThemedText className="font-semibold text-gray-900">
                                    {groundTrip.sender.phoneNumber || 'N/A'}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                )}

                {/* Packages Section */}
                {groundTrip?.packages && groundTrip.packages.length > 0 && (
                    <ThemedView className="mb-6 px-4">
                        <ThemedText className="text-lg font-semibold text-gray-900 mb-4">
                            Packages
                        </ThemedText>
                        <PackageList packages={groundTrip.packages} />
                    </ThemedView>
                )}

                {/* Status Progress */}
                <ThemedView className="px-4 mb-6">
                    <ThemedText className="text-lg font-semibold text-[#131927] mb-4">
                        Trip Progress
                    </ThemedText>
                    <ThemedView className="space-y-3">
                        {TRIP_STATUSES.slice(0, currentStatusIndex + 2).map((status, index) => {
                            const isCompleted = index <= currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;
                            const StatusIcon = status.icon;

                            return (
                                <View key={status.key} className="flex-row items-center">
                                    <View
                                        className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${isCompleted ? 'bg-[#E75B3B]' : 'bg-gray-200'
                                            }`}
                                    >
                                        <StatusIcon
                                            size={20}
                                            color={isCompleted ? 'white' : '#E75B3B'}
                                        />
                                    </ThemedView>
                                    <ThemedView className="flex-1">
                                        <Text
                                            className={`font-medium ${isCurrent ? 'text-[#E75B3B]' : 'text-gray-900'
                                                }`}
                                        >
                                            {status.label}
                                        </ThemedText>
                                        <ThemedText className="text-gray-500 text-sm">
                                            {status.description}
                                        </ThemedText>
                                    </ThemedView>
                                </ThemedView>
                            );
                        })}
                    </ThemedView>
                </View >
            </>
        );
    };

    const renderBookingDetails = () => {
        // console.log('render booking details', bookingDetail, type);
        if (!bookingDetail._id) return null;
        return (
            <ThemedView className="px-4 mb-6">
                <ThemedView className="space-y-3">
                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500 w-1/3">Booking ID</ThemedText>
                        <ThemedText className="font-semibold text-gray-900">
                            {bookingDetail._id}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500 w-1/3">Pickup Location</ThemedText>
                        <ThemedText className="font-semibold text-gray-900">
                            {bookingDetail.parcelGroup.pickUpLocation.address}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500 w-1/3">Drop-off Location</ThemedText>
                        <ThemedText className="font-semibold text-gray-900 w-2/3 text-right">
                            {bookingDetail.parcelGroup.dropOffLocation.address}
                        </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500 w-1/3">Parcels</ThemedText>
                        <ThemedText className="font-semibold text-gray-900">
                            {bookingDetail.parcels.length}
                        </ThemedText>
                    </ThemedView>
                    {bookingDetail.parcels.map((parcel) => (
                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500 w-1/3">Parcel</ThemedText>
                            <ThemedText className="font-semibold text-gray-900">
                                {parcel.productType}
                            </ThemedText>
                            <ThemedText className="font-semibold text-gray-900">
                                {parcel.productWeight} {parcel.productUnit}
                            </ThemedText>
                        </ThemedView>
                    ))}



                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500">Sender</ThemedText>
                        <ThemedText className="font-semibold text-gray-900">
                            {bookingDetail.sender.fullName}
                        </ThemedText>
                    </ThemedView>


                    <ThemedView className="flex-row justify-between">
                        <ThemedText className="text-gray-500">Current Status</ThemedText>
                        <ThemedView className="bg-orange-100 px-2 py-1 rounded">
                            <ThemedText className="text-orange-800 font-medium text-sm">
                                {bookingDetail.status}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        );
    }

    const locations = type == 'Air' ? airOrderLocations : marineOrderLocations;

    const cordinatePoints = locations.map(location => ({
        latitude: location.coords.coordinates[0],
        longitude: location.coords.coordinates[1],
    }));




    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1 bg-white">



                {/* ✅ Map View */}
                <ThemedView className="flex-1">
                    {hasCoords ? (
                        <MapView
                            style={{ flex: 1 }}
                            showsUserLocation
                            followsUserLocation
                            initialRegion={{
                                latitude: pickupCoords[0],
                                longitude: pickupCoords[1],
                                latitudeDelta: 0.08,
                                longitudeDelta: 0.08,
                            }}
                        >
                            {/* OpenStreetMap Tile Layer */}
                            <UrlTile
                                urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                maximumZ={19}
                                flipY={false}
                            />

                            {/* Pickup Marker */}
                            <Marker
                                coordinate={{
                                    latitude: pickupCoords[0],
                                    longitude: pickupCoords[1],
                                }}
                                title="Pickup Point"
                                description={groundTrip.pickUpLocation.address}
                                pinColor="blue"
                            />

                            {/* Dropoff Marker */}
                            <Marker
                                coordinate={{
                                    latitude: dropoffCoords[0],
                                    longitude: dropoffCoords[1],
                                }}
                                title="Drop-off Point"
                                description={groundTrip.dropOffLocation.address}
                                pinColor="green"
                            />

                            {/* Route Line */}
                            {loadingRoute ? (
                                <></>
                            ) : (
                                <Polyline
                                    coordinates={type == 'Ground' ? routeCoords.length ? routeCoords : [
                                        { latitude: pickupCoords[0], longitude: pickupCoords[1] },
                                        { latitude: dropoffCoords[0], longitude: dropoffCoords[1] },
                                    ] : cordinatePoints}
                                    strokeColor="#E75B3B"
                                    strokeWidth={4}
                                />
                                // <Polyline coordinates={routeCoords} strokeColor="#E75B3B" strokeWidth={4} />

                            )}
                        </MapView>
                    ) : (
                        <ThemedView className="flex-1 items-center justify-center bg-gray-50">
                            <ActivityIndicator size="large" color="#E75B3B" />
                            <ThemedText className="text-gray-500 mt-2">Loading map...</ThemedText>
                        </ThemedView>
                    )}
                </ThemedView>

                {/* ✅ Bottom Sheet */}
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
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >
                        {/* Action Buttons */}
                        <ThemedView className="px-4 mb-6">
                            {nextStatus ? (
                                <TouchableOpacity
                                    className="bg-[#E75B3B] rounded-lg py-4 items-center mb-3"
                                    onPress={() => handleStatusUpdate(nextStatus.key)}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <ThemedText className="text-white font-semibold text-lg">
                                            {nextStatus.label}
                                        </ThemedText>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <ThemedView className="bg-green-50 rounded-xl p-4 mb-3">
                                    <ThemedText className="text-green-800 font-semibold text-center">
                                        🎉 Trip Completed Successfully!
                                    </ThemedText>
                                </ThemedView>
                            )}
                        </ThemedView>

                        {/* Booking Summary */}
                        {/* Booking Summary Header */}
                        <ThemedView className="px-4 mb-6">
                            <ThemedText className="text-lg font-semibold text-gray-900 mb-4">Booking Summary:</ThemedText>

                        </ThemedView>
                        {type == 'Ground' ? renderGroundBookingDetails() : renderBookingDetails()}

                        {/* Secondary Actions - Only visible when expanded */}
                        <ThemedView className="px-4 flex-row space-x-3 mb-4">
                            <TouchableOpacity
                                className="flex-1 border border-gray-300 rounded-lg py-3 items-center"
                                onPress={() => {
                                    showToast({
                                        title: "Cancel Booking",
                                        description: "Booking cancellation feature coming soon",
                                        icon: InfoIcon,
                                        action: "info"
                                    });
                                }}
                            >
                                <ThemedText className="text-gray-700 font-medium">Cancel Booking</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 bg-orange-500 rounded-lg py-3 items-center"
                                onPress={() => {
                                    showToast({
                                        title: "Change Request",
                                        description: "Change request feature coming soon",
                                        icon: InfoIcon,
                                        action: "info"
                                    });
                                }}
                            >
                                <ThemedText className="text-white font-medium">Decline Change Request</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    </BottomSheetScrollView>
                </BottomSheet>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
