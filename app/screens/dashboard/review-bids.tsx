import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PackageList from '../../../components/Custom/PackageList';
import NotificationIconComponent from '../../../components/NotificationIconComponent';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Box } from '../../../components/ui/box';
import { Button, ButtonText } from '../../../components/ui/button';
import { HStack } from '../../../components/ui/hstack';
import { CheckCircleIcon, ChevronLeftIcon, Icon, Location } from '../../../components/ui/icon';
import { Skeleton, SkeletonText } from '../../../components/ui/skeleton';
import { BidDetail } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAirTripById } from '../../../store/slices/airTripSlice';
import { acceptBid } from '../../../store/slices/bidSlice';
import { fetchMarineById } from '../../../store/slices/marineTripSlice';

interface BidCardProps {
    bid: BidDetail;
    onRenegotiate: (bidId: string) => void;
    onAccept: (bidId: string) => void;
}

const BidCard: React.FC<BidCardProps> = ({ bid, onRenegotiate, onAccept }) => (
    <ThemedView className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
        {/* Bidder Info */}
        <ThemedView className="flex-row items-center mb-3">
            <ThemedView className="w-12 h-12 rounded-full mr-3 bg-[#E75B3B] items-center justify-center">
                <ThemedText className="text-white text-lg font-bold">
                    {bid.sender.fullName.charAt(0)}
                </ThemedText>
            </ThemedView>
            <ThemedView className="flex-1">
                <ThemedText className="text-lg font-semibold text-gray-900 mb-1">
                    {bid.sender.fullName}
                </ThemedText>
                <ThemedView className="flex-row items-center">
                    <Icon as={Location} size="sm" className="text-gray-500 mr-1" />
                    <ThemedText className="text-gray-600 text-sm">{bid.dropOffLocation.address}</ThemedText>
                </ThemedView>
            </ThemedView>
        </ThemedView>

        {/* Bid Details */}
        <ThemedView className="mb-4">
            <ThemedText className="text-gray-700 mb-1">
                <ThemedText className="font-medium">Space:</ThemedText> N/A
            </ThemedText>
            <ThemedText className="text-gray-700">
                <ThemedText className="font-medium">Amount:</ThemedText> ${bid.finalPrice}
            </ThemedText>
        </ThemedView>

        {/* Packages Section */}
        {bid.packages && bid.packages.length > 0 && (
            <ThemedView className="mb-4">
                <ThemedText className="text-lg font-semibold text-gray-900 mb-3">
                    Packages ({bid.packages.length})
                </ThemedText>
                <PackageList
                    packages={bid.packages}
                    showTitle={false}
                />
            </ThemedView>
        )}

        {/* Action Buttons */}
        <ThemedView className="flex-row space-x-3 gap-3">
            <TouchableOpacity
                onPress={() => onRenegotiate(bid._id)}
                className="flex-1 border-[#E75B3B] border-[1.5px] rounded-xl py-3 items-center"
            >
                <ThemedText className="text-[#E75B3B] font-medium">Renegotiate</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onAccept(bid._id)}
                className="flex-1 bg-[#E75B3B] rounded-xl py-3 items-center"
            >
                <ThemedText className="text-white font-medium">Accept</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    </ThemedView>
);

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose }) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
    >
        <ThemedView className="flex-1 bg-black/50 items-center justify-center px-6">
            <ThemedView className="bg-white rounded-2xl p-8 w-full max-w-sm items-center">
                {/* Success Icon */}
                <ThemedView className="w-16 h-16 bg-white rounded-full items-center justify-center mb-6 border-4 border-green-500">
                    <Icon as={CheckCircleIcon} size="xl" className="text-green-500" />
                </ThemedView>

                {/* Success Message */}
                <ThemedText className="text-xl font-semibold text-gray-900 text-center mb-2">
                    Success
                </ThemedText>
                <ThemedText className="text-gray-500 text-center mb-8 text-base">
                    Air booking #ID230297 accepted!
                </ThemedText>

                {/* Close Button */}
                <Button
                    size="xl"
                    className="bg-[#E75B3B] rounded-lg w-full"
                    onPress={onClose}
                >
                    <ButtonText className="text-white font-semibold text-lg">
                        Close
                    </ButtonText>
                </Button>
            </ThemedView>
        </ThemedView>
    </Modal>
);

export default function ReviewBidsScreen() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const routParams = useLocalSearchParams<{ tripId?: string; type?: string }>();
    const { tripId, type } = routParams;
    const { airTrip, loading: airTripLoading } = useAppSelector((state) => state.airTrip);
    const { marineTrip, loading: marineTripLoading } = useAppSelector((state) => state.marineTrip);
    const dispatch = useAppDispatch();




    const reloadBidData = () => {
        setShowSuccessModal(false);
        if (type == 'Air' && tripId) {
            dispatch(fetchAirTripById(tripId));
        } else if (type == 'Maritime' && tripId) {
            dispatch(fetchMarineById(tripId));
        }
    }

    if (type == 'Air' && tripId) {

        useEffect(() => {
            dispatch(fetchAirTripById(tripId));
        }, [dispatch]);
    }


    if (type == 'Maritime' && tripId) {
        useEffect(() => {
            dispatch(fetchMarineById(tripId));
        }, [dispatch]);
    }
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => {
                return (
                    <ThemedText type="s1_subtitle" className="text-center">
                        Review Bids
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
                            onLongPress={() => router.push("/(tabs)")}
                            onPress={() => navigation.goBack()}
                            className="p-2 rounded   flex justify-center items-center"
                        >
                            <Icon
                                as={ChevronLeftIcon}
                                size="3xl"
                                className="text-typography-900"
                            />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            ),
            headerRight: () => (
                <NotificationIconComponent />
            ),
        });
    }, [navigation, router]);




    const handleRenegotiate = (bidId: string) => {
        router.push({
            pathname: '/screens/dashboard/negotiate-bid',
            params: {
                bidId: bidId,
                tripId: tripId || '',
                type: type || ''
            }
        });
    };

    const handleAccept = (bidId: string) => {

        dispatch(acceptBid({ bidId }))
            .then((res) => {
                console.log("🚀 ~ handleAccept ~ res:", res);
                setShowSuccessModal(true);

            })
            .catch((err) => {
                console.error("Error accepting bid:", err);
            });
    };

    const renderAirTripDetails = () => {
        if (airTripLoading) return (
            Array.from({ length: 7 }).map((_: any, index: number) => (
                <ThemedView key={index} className="w-full">
                    <Box className="w-full gap-4 p-3 rounded-md ">
                        <SkeletonText _lines={3} className="h-2" />
                        <HStack className="gap-1 align-middle">
                            <Skeleton
                                variant="circular"
                                className="h-[24px] w-[28px] mr-2"
                            />
                            <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
                        </HStack>
                    </Box>
                </ThemedView>
            ))
        );
        const bids = airTrip.bids_recieved || [];

        return (

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Trip Info Card */}
                <ThemedView className="mx-4 mt-4 mb-6">
                    <ThemedView className="bg-[#FDEFEB] rounded-2xl my-3 p-5 shadow-sm border border-[#FDEFEB]">
                        <ThemedText className="text-lg font-semibold text-gray-900 mb-1">
                            {`${airTrip.departureAirport.city} (${airTrip.departureAirport.iata}) → ${airTrip.arrivalAirport.city} (${airTrip.arrivalAirport.iata})`}
                        </ThemedText>
                        <ThemedText className="text-gray-700">
                            Date: {new Date(airTrip.departureDate).toLocaleDateString()}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Bids List */}
                <ThemedView className="px-4">
                    {Array.isArray(bids) && bids.length > 0 ? (
                        bids.map((bid) => (
                            <BidCard
                                key={bid._id}
                                bid={bid}
                                onRenegotiate={handleRenegotiate}
                                onAccept={handleAccept}
                            />
                        ))
                    ) : null}
                </ThemedView>

                {/* Empty State - Show when no bids */}
                {Array.isArray(bids) && bids.length === 0 && (
                    <ThemedView className="flex-1 items-center justify-center px-4 py-20">
                        <ThemedText className="text-gray-500 text-center text-lg mb-2">
                            No bids received yet
                        </ThemedText>
                        <ThemedText className="text-gray-400 text-center">
                            Bids will appear here when travelers are interested in your trip
                        </ThemedText>
                    </ThemedView>
                )}
            </ScrollView>
        );
    }



    const renderMarineTripDetails = () => {
        if (marineTripLoading) return (Array.from({ length: 7 }).map((_: any, index: number) => (
            <ThemedView key={index} className="w-full">
                <Box className="w-full gap-4 p-3 rounded-md ">
                    <SkeletonText _lines={3} className="h-2" />
                    <HStack className="gap-1 align-middle">
                        <Skeleton
                            variant="circular"
                            className="h-[24px] w-[28px] mr-2"
                        />
                        <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
                    </HStack>
                </Box>
            </ThemedView>
        )));
        const bids =
            typeof marineTrip.bids_recieved === 'number'
                ? []
                : marineTrip.bids_recieved || [];

        return (

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Trip Info Card */}
                <ThemedView className="mx-4 mt-4 mb-6">
                    <ThemedView className="bg-[#FEF7E6] rounded-lg p-4 border border-[#F5E6A3]">
                        <ThemedText className="text-lg font-semibold text-gray-900 mb-1">
                            {marineTrip.containerNumber}  {marineTrip.departurePort} → {marineTrip.arrivalPort}
                        </ThemedText>
                        <ThemedText className="text-gray-700">
                            Date: {new Date(marineTrip.departureDate).toLocaleDateString()}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Bids List */}
                <ThemedView className="px-4">
                    {bids.map((bid) => (
                        <BidCard
                            key={bid._id}
                            bid={bid}
                            onRenegotiate={handleRenegotiate}
                            onAccept={handleAccept}
                        />
                    ))}
                </ThemedView>

                {/* Empty State - Show when no bids */}
                {bids.length === 0 && (
                    <ThemedView className="flex-1 items-center justify-center px-4 py-20">
                        <ThemedText className="text-gray-500 text-center text-lg mb-2">
                            No bids received yet
                        </ThemedText>
                        <ThemedText className="text-gray-400 text-center">
                            Bids will appear here when travelers are interested in your trip
                        </ThemedText>
                    </ThemedView>
                )}
            </ScrollView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="white" />


            {type === 'Air' ? renderAirTripDetails() : type === 'Maritime' ? renderMarineTripDetails() : (
                <ThemedView className="flex-1 items-center justify-center px-4 py-20">
                    <ThemedText className="text-gray-500 text-center text-lg mb-2">
                        No bids available for this trip type
                    </ThemedText>
                </ThemedView>
            )}

            {/* Success Modal */}
            <SuccessModal
                visible={showSuccessModal}
                onClose={reloadBidData}
            />
        </SafeAreaView>
    );
}