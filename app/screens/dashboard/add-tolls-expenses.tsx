import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '../../../components/ui/button';
import { AlertCircleIcon, ArrowLeftIcon, Icon, UploadIcon } from '../../../components/ui/icon';
import { Input, InputField } from '../../../components/ui/input';

const { width, height } = Dimensions.get('window');

interface TollEntry {
    id: string;
    amount: string;
    receipt?: string;
}

export default function AddTollsExpensesScreen() {
    const [tollEntries, setTollEntries] = useState<TollEntry[]>([
        { id: '1', amount: '50.00' }
    ]);

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

    const calculateTotal = () => {
        const tollTotal = tollEntries.reduce((sum, entry) => {
            return sum + (parseFloat(entry.amount) || 0);
        }, 0);

        const baseFare = parseFloat(bookingData.fare.replace('₦', '').replace(',', '')) || 0;
        return baseFare + tollTotal;
    };

    const handleTollAmountChange = (id: string, amount: string) => {
        setTollEntries(prev =>
            prev.map(entry =>
                entry.id === id ? { ...entry, amount } : entry
            )
        );
    };

    const handleAddReceipt = (id: string) => {
        // In a real app, this would open image picker
        console.log('Add receipt for toll:', id);
        Alert.alert('Receipt', 'Image picker would open here');
    };

    const handleAddAnotherToll = () => {
        const newId = (tollEntries.length + 1).toString();
        setTollEntries(prev => [...prev, { id: newId, amount: '0.00' }]);
    };

    const handleSkip = () => {
        router.push('/screens/dashboard/complete-delivery-otp');
    };

    const handleSaveCharges = () => {
        router.push('/screens/dashboard/complete-delivery-otp');
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

                <Text className="text-lg font-semibold text-gray-900">
                    Add Tolls & Expenses
                </Text>

                <View className="w-10 h-10" />
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Booking Summary */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">
                        Booking Summary:
                    </Text>

                    <View className="space-y-2">
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
                </View>

                {/* Toll Entries */}
                <View className="mb-6">
                    {tollEntries.map((entry, index) => (
                        <View key={entry.id} className="mb-4">
                            <Text className="text-gray-700 font-medium mb-2">
                                Toll Amount
                            </Text>

                            <View className="flex-row items-center mb-3">
                                <Input className="flex-1 mr-3 h-[50px] rounded-lg">
                                    <InputField
                                        placeholder="0.00"
                                        value={entry.amount}
                                        onChangeText={(text) => handleTollAmountChange(entry.id, text)}
                                        keyboardType="numeric"
                                    />
                                </Input>
                                <Text className="text-gray-700 absolute right-8">₦</Text>
                            </View>

                            {/* Add Receipt */}
                            <TouchableOpacity
                                className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center mb-4"
                                onPress={() => handleAddReceipt(entry.id)}
                            >
                                <View className="items-center">
                                    <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mb-2">
                                        <Icon as={UploadIcon} size="sm" className="text-gray-400" />
                                    </View>
                                    <Text className="text-gray-700 font-medium">
                                        Add Receipt
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add Another Toll Button */}
                    <Button
                        variant="outline"
                        className="border-[#E75B3B] rounded-xl w-full h-[47px] mb-6"
                        onPress={handleAddAnotherToll}
                    >
                        <ButtonText className="text-[#E75B3B] font-semibold text-lg">
                            Add Another Toll
                        </ButtonText>
                    </Button>
                </View>

                {/* Total Additional Charges */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">
                        Total Additional Charges
                    </Text>

                    <View className="space-y-2">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-600">Xyz Charges</Text>
                            <Text className="text-gray-900 font-medium">
                                ₦{tollEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0).toLocaleString()}
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-600">Xyz Charges</Text>
                            <Text className="text-gray-900 font-medium">
                                ₦{tollEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0).toLocaleString()}
                            </Text>
                        </View>

                        <View className="border-t border-gray-200 pt-2 mt-2">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg font-semibold text-gray-900">
                                    Calculated Total
                                </Text>
                                <Text className="text-lg font-semibold text-[#E75B3B]">
                                    ₦{calculateTotal().toLocaleString()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Warning Notice */}
                <View className="mb-6">
                    <View className="bg-red-50 border border-red-200 rounded-lg p-4 flex-row items-start">
                        <View className="mr-3 mt-0.5">
                            <Icon as={AlertCircleIcon} size="lg" className="text-red-500" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-red-600 text-sm leading-normal font-medium">
                                Please note: These charges will be added to the customer's final bill
                            </Text>
                        </View>
                    </View>
                </View>
                {/* Bottom Buttons */}
                <View className="px-4 pb-6 flex-row gap-x-3">
                    <Button
                        variant="outline"
                        className="border-[#E75B3B] rounded-xl flex-1 h-[47px]"
                        onPress={handleSkip}
                    >
                        <ButtonText className="text-[#E75B3B] font-semibold text-lg">
                            Skip
                        </ButtonText>
                    </Button>

                    <Button
                        size="xl"
                        className="bg-[#E75B3B] rounded-xl flex-1 h-[47px]"
                        onPress={handleSaveCharges}
                    >
                        <ButtonText className="text-white font-semibold text-lg">
                            Save Charges
                        </ButtonText>
                    </Button>
                </View>
            </ScrollView>


        </SafeAreaView>
    );
}