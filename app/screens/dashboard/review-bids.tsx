import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
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
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
        {/* Bidder Info */}
        <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-full mr-3 bg-[#E75B3B] items-center justify-center">
                <Text className="text-white text-lg font-bold">
                    {bid.sender.fullName.charAt(0)}
                </Text>
            </View>
            <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {bid.sender.fullName}
                </Text>
                <View className="flex-row items-center">
                    <Icon as={Location} size="sm" className="text-gray-500 mr-1" />
                    <Text className="text-gray-600 text-sm">{bid.dropOffLocation.address}</Text>
                </View>
            </View>
        </View>

        {/* Bid Details */}
        <View className="mb-4">
            <Text className="text-gray-700 mb-1">
                <Text className="font-medium">Space:</Text> N/A
            </Text>
            <Text className="text-gray-700">
                <Text className="font-medium">Amount:</Text> ${bid.finalPrice}
            </Text>
        </View>

        {/* Packages Section */}
        {bid.packages && bid.packages.length > 0 && (
            <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-900 mb-3">
                    Packages ({bid.packages.length})
                </Text>
                <PackageList
                    packages={bid.packages}
                    showTitle={false}
                />
            </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row space-x-3 gap-3">
            <TouchableOpacity
                onPress={() => onRenegotiate(bid._id)}
                className="flex-1 border-[#E75B3B] border-[1.5px] rounded-xl py-3 items-center"
            >
                <Text className="text-[#E75B3B] font-medium">Renegotiate</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onAccept(bid._id)}
                className="flex-1 bg-[#E75B3B] rounded-xl py-3 items-center"
            >
                <Text className="text-white font-medium">Accept</Text>
            </TouchableOpacity>
        </View>
    </View>
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
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
            <View className="bg-white rounded-2xl p-8 w-full max-w-sm items-center">
                {/* Success Icon */}
                <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-6 border-4 border-green-500">
                    <Icon as={CheckCircleIcon} size="xl" className="text-green-500" />
                </View>

                {/* Success Message */}
                <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
                    Success
                </Text>
                <Text className="text-gray-500 text-center mb-8 text-base">
                    Air booking #ID230297 accepted!
                </Text>

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
            </View>
        </View>
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
                <View className="mx-4 mt-4 mb-6">
                    <View className="bg-[#FDEFEB] rounded-2xl my-3 p-5 shadow-sm border border-[#FDEFEB]">
                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                            {`${airTrip.departureAirport.city} (${airTrip.departureAirport.iata}) → ${airTrip.arrivalAirport.city} (${airTrip.arrivalAirport.iata})`}
                        </Text>
                        <Text className="text-gray-700">
                            Date: {new Date(airTrip.departureDate).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                {/* Bids List */}
                <View className="px-4">
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
                </View>

                {/* Empty State - Show when no bids */}
                {Array.isArray(bids) && bids.length === 0 && (
                    <View className="flex-1 items-center justify-center px-4 py-20">
                        <Text className="text-gray-500 text-center text-lg mb-2">
                            No bids received yet
                        </Text>
                        <Text className="text-gray-400 text-center">
                            Bids will appear here when travelers are interested in your trip
                        </Text>
                    </View>
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
                <View className="mx-4 mt-4 mb-6">
                    <View className="bg-[#FEF7E6] rounded-lg p-4 border border-[#F5E6A3]">
                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                            {marineTrip.containerNumber}  {marineTrip.departurePort} → {marineTrip.arrivalPort}
                        </Text>
                        <Text className="text-gray-700">
                            Date: {new Date(marineTrip.departureDate).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                {/* Bids List */}
                <View className="px-4">
                    {bids.map((bid) => (
                        <BidCard
                            key={bid._id}
                            bid={bid}
                            onRenegotiate={handleRenegotiate}
                            onAccept={handleAccept}
                        />
                    ))}
                </View>

                {/* Empty State - Show when no bids */}
                {bids.length === 0 && (
                    <View className="flex-1 items-center justify-center px-4 py-20">
                        <Text className="text-gray-500 text-center text-lg mb-2">
                            No bids received yet
                        </Text>
                        <Text className="text-gray-400 text-center">
                            Bids will appear here when travelers are interested in your trip
                        </Text>
                    </View>
                )}
            </ScrollView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="white" />


            {type === 'Air' ? renderAirTripDetails() : type === 'Maritime' ? renderMarineTripDetails() : (
                <View className="flex-1 items-center justify-center px-4 py-20">
                    <Text className="text-gray-500 text-center text-lg mb-2">
                        No bids available for this trip type
                    </Text>
                </View>
            )}

            {/* Success Modal */}
            <SuccessModal
                visible={showSuccessModal}
                onClose={reloadBidData}
            />
        </SafeAreaView>
    );
}