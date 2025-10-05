import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, BellIcon, CalendarDaysIcon, Icon } from '../../../components/ui/icon';
import { Input, InputField } from '../../../components/ui/input';

interface FormData {
    departureCity: string;
    arrivalCity: string;
    airlineName: string;
    flightNumber: string;
    departureDate: string;
    arrivalDate: string;
    availableCapacityPounds: string;
    availableCapacityDimensions: string;
}

export default function PostTripScreen() {
    const [formData, setFormData] = useState<FormData>({
        departureCity: '',
        arrivalCity: '',
        airlineName: '',
        flightNumber: '',
        departureDate: '',
        arrivalDate: '',
        availableCapacityPounds: '',
        availableCapacityDimensions: '',
    });

    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePostTrip = () => {
        console.log('Post trip data:', formData);
        // TODO: Implement trip posting logic
        router.navigate('/screens/dashboard/review-bids')
    };

    const handleDatePress = (field: 'departureDate' | 'arrivalDate') => {
        console.log(`Open date picker for ${field}`);
        // TODO: Implement date picker
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="bg-white h-16 px-4 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="lg" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-gray-900">Post Your Trip</Text>

                <TouchableOpacity className="p-2">
                    <View className="relative">
                        <Icon as={BellIcon} size="lg" className="text-[#E75B3B]" />
                        <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6 space-y-6">
                    {/* Departure City */}
                    <View>
                        <Text className="text-base font-body text-[#131927] mb-2">
                            Departure City
                        </Text>
                        <Input
                            variant="outline"
                            size="lg"
                            className="bg-[#FDF2F0] border-[#FDF2F0] h-[46px] rounded-lg mb-3"
                        >
                            <InputField
                                placeholder="e.g. Lagos (LOS)"
                                value={formData.departureCity}
                                onChangeText={(value) => updateFormData('departureCity', value)}
                                className="text-gray-700 placeholder:text-gray-400"
                            />
                        </Input>
                    </View>

                    {/* Arrival City */}
                    <View>
                        <Text className="text-base font-body text-[#131927] mb-2">
                            Arrival City
                        </Text>
                        <Input
                            variant="outline"
                            size="lg"
                            className="bg-[#FDF2F0] border-[#FDF2F0] h-[46px] rounded-lg mb-3"
                        >
                            <InputField
                                placeholder="e.g. Atlanta (ATL)"
                                value={formData.arrivalCity}
                                onChangeText={(value) => updateFormData('arrivalCity', value)}
                                className="text-gray-700 placeholder:text-gray-400"
                            />
                        </Input>
                    </View>

                    {/* Airline Name */}
                    <View>
                        <Text className="text-base font-body text-[#131927] mb-2">
                            Airline Name
                        </Text>
                        <Input
                            variant="outline"
                            size="lg"
                            className="bg-[#FDF2F0] border-[#FDF2F0] h-[46px] rounded-lg mb-3"
                        >
                            <InputField
                                placeholder="e.g. Atlanta (ATL)"
                                value={formData.airlineName}
                                onChangeText={(value) => updateFormData('airlineName', value)}
                                className="text-gray-700 placeholder:text-gray-400"
                            />
                        </Input>
                    </View>

                    {/* Flight Number */}
                    <View>
                        <Text className="text-base font-body text-[#131927] mb-2">
                            Flight Number
                        </Text>
                        <Input
                            variant="outline"
                            size="lg"
                            className="bg-[#FDF2F0] border-[#FDF2F0] h-[46px] rounded-lg mb-3"
                        >
                            <InputField
                                placeholder="e.g. Atlanta (ATL)"
                                value={formData.flightNumber}
                                onChangeText={(value) => updateFormData('flightNumber', value)}
                                className="text-gray-700 placeholder:text-gray-400"
                            />
                        </Input>
                    </View>

                    {/* Departure Date */}
                    <View>
                        <Text className="text-base font-body text-[#131927] mb-2">
                            Departure Date
                        </Text>
                        <TouchableOpacity onPress={() => handleDatePress('departureDate')}>
                            <Input
                                variant="outline"
                                size="lg"
                                className="bg-[#FDF2F0] border-[#FDF2F0] h-[46px] rounded-lg mb-3"
                                isReadOnly
                            >
                                <InputField
                                    placeholder="DD-MM-YYYY"
                                    value={formData.departureDate}
                                    className="text-gray-700 placeholder:text-gray-400"
                                    editable={false}
                                />
                                <View className="pr-3">
                                    <Icon as={CalendarDaysIcon} size="lg" className="text-gray-400" />
                                </View>
                            </Input>
                        </TouchableOpacity>
                    </View>

                    {/* Arrival Date */}
                    <View>
                        <Text className="text-base font-body text-[#131927] mb-2">
                            Arrival Dates
                        </Text>
                        <TouchableOpacity onPress={() => handleDatePress('arrivalDate')}>
                            <Input
                                variant="outline"
                                size="lg"
                                className="bg-[#FDF2F0] border-[#FDF2F0] h-[46px] rounded-lg mb-3"
                                isReadOnly
                            >
                                <InputField
                                    placeholder="DD-MM-YYYY"
                                    value={formData.arrivalDate}
                                    className="text-gray-700 placeholder:text-gray-400"
                                    editable={false}
                                />
                                <View className="pr-3">
                                    <Icon as={CalendarDaysIcon} size="lg" className="text-gray-400" />
                                </View>
                            </Input>
                        </TouchableOpacity>
                    </View>

                    {/* Available Capacity */}
                    <View>
                        <Text className="text-base font-body text-[#131927] mb-2">
                            Available Capacity
                        </Text>
                        <View className="flex-row space-x-3">
                            <View className="flex-1">
                                <Input
                                    variant="outline"
                                    size="lg"
                                    className="bg-[#FDF2F0] border-[#FDF2F0] h-[46px] rounded-lg mb-3"
                                >
                                    <InputField
                                        placeholder="Pounds (lbs)"
                                        value={formData.availableCapacityPounds}
                                        onChangeText={(value) => updateFormData('availableCapacityPounds', value)}
                                        className="text-gray-700 placeholder:text-gray-400"
                                        keyboardType="numeric"
                                    />
                                </Input>
                            </View>
                            <View className="flex-1">
                                <Input
                                    variant="outline"
                                    size="lg"
                                    className="bg-[#FDF2F0] border-[#FDF2F0] h-[46px] rounded-lg mb-3"
                                >
                                    <InputField
                                        placeholder="Dimension (LxWxH)"
                                        value={formData.availableCapacityDimensions}
                                        onChangeText={(value) => updateFormData('availableCapacityDimensions', value)}
                                        className="text-gray-700 placeholder:text-gray-400"
                                    />
                                </Input>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Post Trip Button */}
            <View className="px-4 pb-6 pt-4 bg-white border-t border-gray-200">
                <Button
                    size="xl"
                    className="bg-[#E75B3B] rounded-lg shadow-sm"
                    onPress={handlePostTrip}
                >
                    <ButtonText className="text-white font-semibold text-lg">
                        + Post Trip
                    </ButtonText>
                </Button>
            </View>
        </SafeAreaView>
    );
}