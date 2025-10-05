import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, Icon, UploadIcon } from '../../../components/ui/icon';

const { width, height } = Dimensions.get('window');

export default function ConfirmDeliveryScreen() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    // Mock data - in real app this would come from props or API
    const bookingData = {
        id: 'ID2350847391',
        date: 'June 12, 2025 | 10:00 am',
        departureAirport: 'Tangerang City, Banten 138',
        arrivalAirport: 'Tangerang City, Banten 15138',
        airline: 'SkyCargo',
        flight: 'F1315',
        parcel: 'Sensitive Documents',
        fare: '₦13,500',
        status: 'Delivering'
    };

    const handleImageUpload = () => {
        // In a real app, this would open image picker
        console.log('Open image picker');
        // For demo purposes, set a placeholder
        setUploadedImage('placeholder');
    };

    const handleProceedToTollBills = () => {
        router.push('/screens/dashboard/add-tolls-expenses');
    };

    const handleContinue = () => {
        router.push('/screens/dashboard/arrived-location');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                <TouchableOpacity
                    className="w-10 h-10 items-center justify-center"
                    onPress={() => router.back()}
                >
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-[#2A2A2A]">
                    Confirm Delivery
                </Text>

                <View className="w-10 h-10" />
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Booking Details */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Booking ID</Text>
                        <Text className="text-[#2A2A2A] text-xl font-normal">{bookingData.id}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Date of Booking</Text>
                        <Text className="text-[#2A2A2A] font-normal">{bookingData.date}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Departure Airport</Text>
                        <Text className="text-[#2A2A2A] font-normal text-right flex-1 ml-4">
                            {bookingData.departureAirport}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Arrival Airport</Text>
                        <Text className="text-[#2A2A2A] font-normal text-right flex-1 ml-4">
                            {bookingData.arrivalAirport}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Airline</Text>
                        <Text className="text-[#2A2A2A] font-normal">{bookingData.airline}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Flight</Text>
                        <Text className="text-[#2A2A2A] font-normal">{bookingData.flight}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Parcel</Text>
                        <Text className="text-[#2A2A2A] font-normal">{bookingData.parcel}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Fare</Text>
                        <Text className="text-[#2A2A2A] font-normal">{bookingData.fare}</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-gray-400 text-lg">Current Status</Text>
                        <View className="bg-orange-100 px-3 py-1 rounded-full">
                            <Text className="text-orange-600 text-sm font-normal">
                                {bookingData.status}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Upload Photo Section */}
                <View className="mb-6">
                    <TouchableOpacity
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center min-h-[120px]"
                        onPress={handleImageUpload}
                    >
                        {uploadedImage ? (
                            <View className="items-center">
                                <View className="w-16 h-16 bg-gray-200 rounded-lg mb-4 items-center justify-center">
                                    <Text className="text-gray-500 text-xs">Photo</Text>
                                </View>
                                <Text className="text-gray-700 text-sm">Photo uploaded</Text>
                            </View>
                        ) : (
                            <View className="items-center">
                                <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-4">
                                    <Icon as={UploadIcon} size="md" className="text-gray-400" />
                                </View>
                                <Text className="text-gray-700 font-medium mb-1">
                                    Upload Photo of Delivered Parcel
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Package Image */}
                <View className="mb-6 items-center">
                    <View className="w-full h-64 m=b-6 bg-gray-100 rounded-lg items-center justify-center">
                        <View className="w-full h-full rounded items-center justify-center">
                            <View className="w-full h-64 bg-white rounded-2xl items-center justify-center border-2 border-orange-200">
                                <Image
                                    source={require('../../../assets/images/package-sample.png')}
                                    style={{
                                        width: '90%',
                                        height: '90%',
                                        borderRadius: 12,
                                    }}
                                    resizeMode="cover"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bottom Buttons */}
                <View className="px-4 pb-6 gap-y-3">
                    <Button
                        size="xl"
                        className="bg-[#E75B3B] rounded-xl w-full h-[47px]"
                        onPress={handleProceedToTollBills}
                    >
                        <ButtonText className="text-white font-semibold text-lg">
                            Proceed to Toll Bills
                        </ButtonText>
                    </Button>

                    <Button
                        size="xl"
                        variant="outline"
                        className="border-[#E75B3B] rounded-xl w-full h-[47px]"
                        onPress={handleContinue}
                    >
                        <ButtonText className="text-[#E75B3B] font-semibold text-lg">
                            Continue
                        </ButtonText>
                    </Button>
                </View>
            </ScrollView>

        </SafeAreaView>
    );
}