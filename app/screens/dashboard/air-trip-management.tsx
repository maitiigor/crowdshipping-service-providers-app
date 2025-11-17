import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
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
  TouchableOpacity
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationIconComponent from '../../../components/NotificationIconComponent';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Icon } from '../../../components/ui/icon';
import { useShowToast } from '../../../hooks/useShowToast';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAirOrderLocations } from '../../../store/slices/airTripSlice';
import {
  updateTripStatus
} from '../../../store/slices/groundTripSlice';
import { fetchMarineOrderLocations } from '../../../store/slices/marineTripSlice';
import { fetchBookingDetail, resendDeliveryOtp } from '../../../store/slices/tripManagementSlice';

const TRIP_STATUSES = [
  { key: 'IN_PROGRESS', label: 'In Progress', description: 'Trip is yet to start', icon: TruckIcon },
  { key: 'GOING_TO_PICKUP', label: 'Going to Pickup', description: 'On the way to collect packages', icon: TruckIcon },
  { key: 'PICKED_UP', label: 'Picked Up', description: 'Packages collected successfully', icon: PackageIcon },
  { key: 'IN_TRANSIT', label: 'In Transit', description: 'Packages are being transported', icon: TruckIcon },
  { key: 'ARRIVED_DESTINATION', label: 'Arrived at Destination', description: 'Reached the delivery location', icon: MapPinIcon },
  { key: 'DELIVERED', label: 'Delivered', description: 'Packages delivered to recipient', icon: CheckCircleIcon },
  { key: 'TOLL_BILL_PENDING', label: 'Toll Bill Pending', description: 'Awaiting toll payment', icon: ClockIcon },
  { key: 'COMPLETED', label: 'Completed', description: 'Trip completed successfully', icon: CheckCircleIcon }
];

export default function AirTripManagementScreen() {
  const { tripId, bookingId, type } = useLocalSearchParams<{ tripId?: string, bookingId?: string, type?: string }>();
  const dispatch = useAppDispatch();
  const showToast = useShowToast();
  const navigation = useNavigation();

  // local state
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingRoute, setLoadingRoute] = useState(false);

  // selectors
  const { airTrip, loading: airTripLoading, orderLocations: airOrderLocations = [], loadingOrderLocation: loadingAirOrderLocation } = useAppSelector((s) => s.airTrip);
  const { marineTrip, loading: marineTripLoading, orderLocations: marineOrderLocations = [], loadingOrderLocation: loadingMarineOrderLocation } = useAppSelector((s) => s.marineTrip ?? {});
  const { bookingDetail } = useAppSelector((s) => s.tripManagement ?? {});

  // bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const handleSheetChanges = useCallback((index: number) => { }, []);

  // detect mode
  const tripType = (type || '').toLowerCase();
  const isAir = tripType === 'air';
  const isMarine = tripType === 'maritime' || tripType === 'marine';

  // select correct trip and locations
  const trip = airTrip;
  const locations = airOrderLocations;
  const mapRef = useRef<MapView>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  // ---- coordinate helpers ----
  // backend coordinates are [lon, lat] — convert to { latitude, longitude }
  const routeCoordinates = useMemo(() => {
    if (!Array.isArray(locations)) return [];
    return locations
      .map((loc: any) => {
        const coords = loc?.coords?.coordinates;
        if (!Array.isArray(coords) || coords.length < 2) return null;
        return {
          latitude: coords[1],
          longitude: coords[0],
          createdAt: loc.createdAt,
          raw: loc
        };
      })
      .filter(Boolean) as { latitude: number; longitude: number; createdAt?: string; raw?: any }[];
  }, [locations]);

  // pickup/dropoff coordinates — airTrip has departureAirport/arrivalAirport with lat/lon fields in your earlier model
  const pickupCoords = useMemo(() => {
    if (!trip) return null;
    // airTrip sample had departureAirport.latitude and .longitude
    if (isAir && trip?.departureAirport && (trip?.departureAirport?.latitude || trip?.departureAirport?.longitude)) {
      const lat = Number(trip.departureAirport.latitude || trip.departureAirport.latitude === 0 ? trip.departureAirport.latitude : null);
      const lon = Number(trip.departureAirport.longitude || trip.departureAirport.longitude === 0 ? trip.departureAirport.longitude : null);
      if (!Number.isNaN(lat) && !Number.isNaN(lon)) return [lat, lon];
    }

    return null;
  }, [trip, isAir]);

  const dropoffCoords = useMemo(() => {
    if (!trip) return null;
    if (isAir && trip.arrivalAirport && (trip.arrivalAirport.latitude || trip.arrivalAirport.longitude)) {
      const lat = Number(trip.arrivalAirport.latitude || trip.arrivalAirport.latitude === 0 ? trip.arrivalAirport.latitude : null);
      const lon = Number(trip.arrivalAirport.longitude || trip.arrivalAirport.longitude === 0 ? trip.arrivalAirport.longitude : null);
      if (!Number.isNaN(lat) && !Number.isNaN(lon)) return [lat, lon];
    }
    return null;
  }, [trip, isAir]);

  const hasCoords = Array.isArray(pickupCoords) && pickupCoords.length === 2 && Array.isArray(dropoffCoords) && dropoffCoords.length === 2;

  // ---- fetch booking & initial locations once ----
  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingDetail(bookingId));
    }

    if (bookingId && isAir) {
      dispatch(fetchAirOrderLocations(bookingId));
    } else if (bookingId && isMarine) {
      dispatch(fetchMarineOrderLocations(bookingId));
    }
    // only on mount / bookingId/type changes
  }, [bookingId, dispatch, isAir, isMarine]);

  // ---- polling for updates for Air / Marine ----
  useEffect(() => {
    if (!bookingId) return;
    if (!(isAir || isMarine)) return;
    fetchAirOrderLocations(bookingId)
    // initial fetch already executed above — set up polling
    const intervalMs = 15_000; // 15s
    // const interval = setInterval(() => {
    //   // if (isAir) dispatch(fetchAirOrderLocations(bookingId));
    //   // if (isMarine) dispatch(fetchMarineOrderLocations(bookingId));
    // }, intervalMs);

    // return () => clearInterval(interval);
  }, [bookingId, dispatch, isAir, isMarine]);

  const moveToLocation = (lat: number, lon: number, id: string) => {
    setSelectedLocationId(id);

    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      },
      350
    );
  };

  // ---- header navigation options ----
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <ThemedText type="s1_subtitle" className="text-center">
          Trip Tracking
        </ThemedText>
      ),
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 },
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "#FFFFFF",
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
        borderBottomWidth: 0,
      },
      headerLeft: () => (
        <ThemedView style={{ shadowColor: "#FDEFEB1A", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.102, shadowRadius: 3, elevation: 4 }}>
          <ThemedView style={{ shadowColor: "#0000001A", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.102, shadowRadius: 2, elevation: 2 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded flex justify-center items-center">
              <Icon as={ChevronLeft} size="3xl" className="text-typography-900" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      ),
      headerRight: () => <NotificationIconComponent />,
    });
  }, [navigation]);

  // ---- helpers ----
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
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

  const handleStatusUpdate = async (statusKey: string) => {
    if (!tripId) return;
    setIsUpdating(true);

    if (statusKey === 'DELIVERED') {
      router.push({ pathname: '/screens/dashboard/confirm-delivery', params: { tripId } });
      setIsUpdating(false);
      return;
    } else if (statusKey === 'TOLL_BILL_PENDING') {
      router.push({ pathname: '/screens/dashboard/add-tolls-expenses', params: { tripId } });
      setIsUpdating(false);
      return;
    } else if (statusKey === 'COMPLETED') {
      try {
        await dispatch(resendDeliveryOtp({ tripId })).unwrap();
        router.push({ pathname: '/screens/dashboard/complete-delivery-otp', params: { tripId } });
      } catch (error: any) {
        showToast({
          title: "Error",
          description: error?.message || "Something went wrong while completing this trip.",
          icon: InfoIcon,
          action: 'error'
        });
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
        description: error?.message || "Failed to update trip status",
        icon: ArrowLeftIcon,
        action: "error"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // ---- booking/details renderer ----
  const renderBookingDetails = () => {
    if (!bookingDetail || !bookingDetail._id) return null;
    return (
      <ThemedView className="px-4 mb-6">
        <ThemedView className="space-y-3">
          <ThemedView className="flex-row my-1 justify-between">
            <ThemedText className="text-gray-500 w-1/3">Booking ID</ThemedText>
            <ThemedText className="font-semibold text-gray-900">{bookingDetail._id}</ThemedText>
          </ThemedView>

          <ThemedView className="flex-row my-1 justify-between">
            <ThemedText className="text-gray-500 w-1/3">Pickup Location</ThemedText>
            <ThemedText className="font-semibold text-gray-900">{bookingDetail.parcelGroup?.pickUpLocation?.address}</ThemedText>
          </ThemedView>

          <ThemedView className="flex-row my-1 justify-between">
            <ThemedText className="text-gray-500 w-1/3">Drop-off Location</ThemedText>
            <ThemedText className="font-semibold text-gray-900 w-2/3 text-right">{bookingDetail.parcelGroup?.dropOffLocation?.address}</ThemedText>
          </ThemedView>

          <ThemedView className="flex-row my-1 justify-between">
            <ThemedText className="text-gray-500 w-1/3">Parcels</ThemedText>
            <ThemedText className="font-semibold text-gray-900">{bookingDetail.parcels?.length ?? 0}</ThemedText>
          </ThemedView>

          {bookingDetail.parcels?.map((parcel: any, i: number) => (
            <ThemedView className="flex-row my-1 justify-between" key={i}>
              <ThemedText className="text-gray-500 w-1/3">Parcel</ThemedText>
              <ThemedText className="font-semibold text-gray-900">{parcel.productType}</ThemedText>
              <ThemedText className="font-semibold text-gray-900">{parcel.productWeight} {parcel.productUnit}</ThemedText>
            </ThemedView>
          ))}

          <ThemedView className="flex-row my-1 justify-between">
            <ThemedText className="text-gray-500">Sender</ThemedText>
            <ThemedText className="font-semibold text-gray-900">{bookingDetail.sender?.fullName}</ThemedText>
          </ThemedView>

          <ThemedView className="flex-row justify-between">
            <ThemedText className="text-gray-500">Current Status</ThemedText>
            <ThemedView className="bg-orange-100 px-2 py-1 rounded">
              <ThemedText className="text-orange-800 font-medium text-sm">{bookingDetail.status}</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView className="px-4 mb-4">
            {routeCoordinates.length > 0 && (
              <ThemedText className="text-lg font-semibold text-gray-900 mb-2">
                Tracking Locations:
              </ThemedText>
            )}

            {routeCoordinates.length === 0 && (
              <ThemedText className="text-lg text-center font-semibold text-gray-900 mb-2">
                No tracking locations available.
              </ThemedText>
            )}

            {routeCoordinates.map((point, index) => {
              const isSelected = selectedLocationId === point.raw._id;
              return (
                <TouchableOpacity
                  key={point.raw._id}
                  onPress={() =>
                    moveToLocation(point.latitude, point.longitude, point.raw._id)
                  }
                  className={`p-3 rounded-lg mb-2 border ${isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200"
                    }`}
                >
                  <ThemedText className="font-semibold text-gray-900">
                    #{index + 1} — Address : {point.raw.coords.address.length > 0 ? point.raw.coords.address.slice(0, 20) + '...' : 'N/A'} {point.raw.coords.address} lat {point.latitude.toFixed(5)}, lon {point.longitude.toFixed(5)} heading  {point.raw.heading}
                  </ThemedText>

                  <ThemedText className="text-gray-500 text-sm">
                    {formatDate(point.createdAt)}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  // ---- map center and fallback ----
  const defaultRegion = {
    latitude: routeCoordinates[0]?.latitude || pickupCoords?.[0] || 6.5244, // Lagos lat as fallback
    longitude: routeCoordinates[0]?.longitude || pickupCoords?.[1] || 3.3792, // Lagos lon fallback
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  const latestPoint = routeCoordinates.length ? routeCoordinates[routeCoordinates.length - 1] : null;

  // ---- render ----
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-white">
        <ThemedView className="flex-1">
          <MapView
            style={{ flex: 1 }}
            showsUserLocation={false}
            initialRegion={defaultRegion}
            zoomEnabled={true}
            zoomControlEnabled={true}   // Android only
            scrollEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
          >
            <UrlTile
              urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />

            {routeCoordinates.map((point, idx) => {
              const isSelected = selectedLocationId === point.raw._id;

              return (
                <Marker
                  key={point.raw._id}
                  coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                  title={point.raw.coords.address}
                  description={point.raw.coords.address}
                  pinColor={isSelected ? "orange" : "red"}   // highlight selected marker
                  onPress={() =>
                    moveToLocation(point.latitude, point.longitude, point.raw._id)
                  }
                />
              );
            })}

            {/* Pickup marker (if available) */}
            {Array.isArray(pickupCoords) && pickupCoords.length === 2 && (
              <Marker
                coordinate={{ latitude: pickupCoords[0], longitude: pickupCoords[1] }}
                title="Pickup Point"
                description={trip?.departureAirport.name}
                pinColor="blue"
              />
            )}

            {/* Dropoff marker (if available) */}
            {Array.isArray(dropoffCoords) && dropoffCoords.length === 2 && (
              <Marker
                coordinate={{ latitude: dropoffCoords[0], longitude: dropoffCoords[1] }}
                title="Drop-off Point"
                description={trip?.arrivalAirport.name}
                pinColor="green"
              />
            )}

            {/* Route polyline from backend locations */}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates.map(p => ({ latitude: p.latitude, longitude: p.longitude }))}
                strokeColor="#E75B3B"
                strokeWidth={4}
              />
            )}

            {/* Latest reported location */}
            {latestPoint && (
              <Marker
                coordinate={{ latitude: latestPoint.latitude, longitude: latestPoint.longitude }}
                title="Current Position"
                description={latestPoint.createdAt ? `Last seen: ${formatDate(latestPoint.createdAt)}` : undefined}
              />
            )}
          </MapView>
        </ThemedView>

        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={false}
          backgroundStyle={{ backgroundColor: 'white' }}
          handleIndicatorStyle={{ backgroundColor: '#E5E7EB' }}
        >
          <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            <ThemedView className="px-4 mb-6">
              <ThemedText className="text-lg font-semibold text-gray-900 mb-4">Booking Summary:</ThemedText>
            </ThemedView>

            {renderBookingDetails()}

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
