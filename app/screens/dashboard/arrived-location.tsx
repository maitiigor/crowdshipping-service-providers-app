import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, Icon, MessageCircleIcon, PhoneIcon, StarIcon, WarningCircle } from '../../../components/ui/icon';

const { width, height } = Dimensions.get('window');

interface LocationPoint {
    id: string;
    address: string;
    time: string;
    isCompleted: boolean;
}

export default function ArivedLocationScreen() {
    const [currentLocation, setCurrentLocation] = useState(0);

    // Bottom sheet ref
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Bottom sheet snap points
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    // Bottom sheet callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    // Mock data - in real app this would come from props or API
    const tripData = {
        title: "On Your Way to sender",
        status: "On the way",
        date: "June 24",
        amount: "₦13,500",
        driver: {
            name: "Jimoh Dada",
            rating: 4.8,
            reviews: 345,
            image: "" // Will use initials
        }
    };

    const locations: LocationPoint[] = [
        {
            id: '1',
            address: '54rd, Indiana town, Alabama',
            time: 'June 12, 2026 | 10:30 AM',
            isCompleted: true
        },
        {
            id: '2',
            address: 'T463, Maryland City, Kualalupo',
            time: 'June 12, 2026 | 10:30 AM',
            isCompleted: false
        }
    ];

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" backgroundColor="white" />

                {/* Full Screen Map */}
                <ThemedView className="flex-1 relative">
                    {/* Placeholder for map - in real app, use react-native-maps */}
                    <ThemedView className="flex-1 bg-gray-200 items-center justify-center">
                        <ThemedText className="text-gray-500 text-lg">Map View</ThemedText>
                        <ThemedText className="text-gray-400 text-sm mt-2">
                            Route tracking will be displayed here
                        </ThemedText>
                    </ThemedView>

                    {/* Back Button */}
                    <TouchableOpacity
                        className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full items-center justify-center shadow-md z-10"
                        onPress={() => router.back()}
                    >
                        <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                    </TouchableOpacity>
                </ThemedView>

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
                        {/* Trip Info */}
                        <ThemedView className="px-4 py-6">
                            <ThemedText className="text-xl text-center font-medium font-poppins text-gray-900 mb-2">
                                {tripData.title}
                            </ThemedText>
                            <ThemedView className="flex-row items-center justify-center mb-4">
                                <ThemedText className="text-gray-600  text-center">
                                    {tripData.status} • {tripData.date}
                                </ThemedText>
                            </ThemedView>
                            <ThemedText className="text-xl font-semibold text-center text-[#E75B3B]">
                                {tripData.amount}
                            </ThemedText>
                        </ThemedView>

                        {/* Warning Notice */}
                        <ThemedView className="mx-4 mb-6">
                            <ThemedView className="bg-red-50 border border-red-200 rounded-lg p-4 flex-row items-start">
                                <ThemedView className="w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5">
                                    <Icon as={WarningCircle} size="xl" fill='#FF0004' className='h-12' />
                                </ThemedView>
                                <ThemedView className="flex-1">
                                    <ThemedText className="text-[#FF0004] text-sm px-5 leading-normal  font-medium" style={{ fontFamily: 'Inter-Regular' }}>
                                        Please note: the goods is a perishable goods, goods are insured for safety sake.
                                    </ThemedText>
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>

                        {/* Driver Info */}
                        <ThemedView className="mx-4 mb-6">
                            <ThemedView className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <ThemedView className="flex-row items-center justify-between">
                                    <ThemedView className="flex-row items-center flex-1">
                                        <ThemedView className="w-12 h-12 rounded-full bg-[#E75B3B] items-center justify-center mr-3">
                                            <ThemedText className="text-white text-lg font-bold">
                                                {tripData.driver.name.charAt(0)}
                                            </ThemedText>
                                        </ThemedView>
                                        <ThemedView className="flex-1">
                                            <ThemedText className="text-md font-medium text-[#131927]">
                                                {tripData.driver.name}
                                            </ThemedText>
                                            <ThemedView className="flex-row items-center">
                                                <Icon as={StarIcon} size="xs" fill="#DFD600" className="mr-1" />
                                                <ThemedText className="text-gray-600">
                                                    {tripData.driver.rating} ({tripData.driver.reviews})
                                                </ThemedText>
                                            </ThemedView>
                                        </ThemedView>
                                    </ThemedView>

                                    {/* Action Buttons */}
                                    <ThemedView className="flex-row space-x-2">
                                        <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                            <Icon as={MessageCircleIcon} size="sm" className="text-[#E75B3B]" />
                                        </TouchableOpacity>
                                        <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                            <Icon as={PhoneIcon} size="sm" className="text-[#E75B3B]" />
                                        </TouchableOpacity>
                                    </ThemedView>
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>

                        {/* Location Timeline */}
                        <ThemedView className="px-4 mb-6">
                            {locations.map((location, index) => (
                                <View key={location.id} className="flex-row mb-4">
                                    {/* Timeline Indicator */}
                                    <ThemedView className="items-center mr-4">
                                        <View
                                            className={`w-4 h-4 rounded-full border-2 ${location.isCompleted
                                                ? 'bg-[#E75B3B] border-[#E75B3B]'
                                                : 'bg-white border-[#E75B3B]'
                                                }`}
                                        />
                                        {index < locations.length - 1 && (
                                            <ThemedView className="w-0.5 h-12 bg-gray-300 mt-2" />
                                        )}
                                    </ThemedView>

                                    {/* Location Info */}
                                    < ThemedView className="flex-1" >
                                        <ThemedText className="text-lg font-medium text-[#131927] mb-1">
                                            {location.address}
                                        </ThemedText>
                                        <ThemedText className="text-gray-500 text-sm">
                                            {location.time}
                                        </ThemedText>
                                    </ThemedView>
                                </ThemedView>
                            ))}
                        </ThemedView>

                        {/* Action Buttons */}
                        <ThemedView className="px-4 gap-y-6 space-y-3">
                            <Button
                                size="xl"
                                className="bg-[#FF9500] rounded-xl w-full h-[47px]"
                                onPress={() => {
                                    console.log('Confirm Delivery');
                                    router.push('/screens/dashboard/confirm-delivery');
                                }}
                            >
                                <ButtonText className="text-white font-semibold text-lg">
                                    Confirm Delivery
                                </ButtonText>
                            </Button>


                        </ThemedView>
                    </BottomSheetScrollView>
                </BottomSheet>
            </SafeAreaView >
        </GestureHandlerRootView >
    );
}