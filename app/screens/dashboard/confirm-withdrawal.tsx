'use client';
import { ArrowLeftIcon, BellIcon, EyeIcon, Icon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfirmWithdrawalScreen() {
    const params = useLocalSearchParams();
    const [showBalance, setShowBalance] = useState(true);

    const availableBalance = 913500;
    const bank = params.bank as string || 'Access Bank';
    const accountNumber = params.accountNumber as string || '31363462375';
    const accountHolderName = 'Gbemisola Mercy Asake';
    const amount = params.amount as string || '₦200,000';

    const handleConfirm = () => {
        // Navigate to PIN confirmation
        router.push({
            pathname: '/screens/dashboard/confirm-pin',
            params: {
                bank,
                accountNumber,
                amount
            }
        });
    };

    const handleBankSelection = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Withdraw Funds</Text>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Available Balance */}
                <View className="mb-6">
                    <Text className="text-sm text-gray-600 mb-2">Available for withdrawal</Text>
                    <View className="flex-row items-center">
                        <Text className="text-3xl font-bold text-orange-500 mr-2">
                            {showBalance ? `₦${availableBalance.toLocaleString()}` : '****'}
                        </Text>
                        <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                            <Icon as={EyeIcon} size="sm" className="text-gray-500" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bank Details Card */}
                <View className="bg-gray-50 rounded-xl p-4 mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-semibold text-gray-900">Bank Details</Text>
                        <TouchableOpacity onPress={handleBankSelection}>
                            <Text className="text-orange-500 font-medium">Change</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="space-y-3">
                        <View>
                            <Text className="text-sm text-gray-500 mb-1">Bank</Text>
                            <Text className="text-base text-gray-900 font-medium">{bank}</Text>
                        </View>

                        <View>
                            <Text className="text-sm text-gray-500 mb-1">Bank Account</Text>
                            <Text className="text-base text-gray-900 font-medium">{accountNumber}</Text>
                        </View>

                        <View>
                            <Text className="text-sm text-gray-500 mb-1">Account Holder Name</Text>
                            <Text className="text-base text-gray-900 font-medium">{accountHolderName}</Text>
                        </View>

                        <View>
                            <Text className="text-sm text-gray-500 mb-1">Amount</Text>
                            <Text className="text-xl text-orange-500 font-bold">{amount}</Text>
                        </View>
                    </View>
                </View>

                {/* Transaction Summary */}
                <View className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary</Text>

                    <View className="space-y-3">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Withdrawal Amount</Text>
                            <Text className="text-gray-900 font-medium">{amount}</Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Processing Fee</Text>
                            <Text className="text-green-600 font-medium">Free</Text>
                        </View>

                        <View className="border-t border-gray-200 pt-3">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-900 font-semibold">Total Amount</Text>
                                <Text className="text-orange-500 font-bold text-lg">{amount}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Important Notice */}
                <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <Text className="text-yellow-800 font-medium mb-2">⚠️ Important Notice</Text>
                    <Text className="text-yellow-700 text-sm leading-5">
                        Please ensure your bank account details are correct. Withdrawals cannot be reversed once processed. Processing time is 1-3 business days.
                    </Text>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="px-4 pb-4 flex-row gap-x-3">
                {/* Bank Button */}
                <TouchableOpacity
                    className="flex-1 py-4 border border-orange-500 rounded-xl"
                    onPress={handleBankSelection}
                >
                    <Text className="text-orange-500 font-semibold text-center text-base">
                        Bank
                    </Text>
                </TouchableOpacity>

                {/* Confirm Button */}
                <TouchableOpacity
                    className="flex-1 py-4 bg-orange-500 rounded-xl"
                    onPress={handleConfirm}
                >
                    <Text className="text-white font-semibold text-center text-base">
                        Confirm
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}