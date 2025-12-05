'use client';
import { ArrowLeftIcon, BellIcon, EyeIcon, Icon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';

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
            <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-xl font-semibold text-gray-900">Withdraw Funds</ThemedText>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Available Balance */}
                <ThemedView className="mb-6">
                    <ThemedText className="text-sm text-gray-600 mb-2">Available for withdrawal</ThemedText>
                    <ThemedView className="flex-row items-center">
                        <ThemedText className="text-3xl font-bold text-orange-500 mr-2">
                            {showBalance ? `₦${availableBalance.toLocaleString()}` : '****'}
                        </ThemedText>
                        <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                            <Icon as={EyeIcon} size="sm" className="text-gray-500" />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>

                {/* Bank Details Card */}
                <ThemedView className="bg-gray-50 rounded-xl p-4 mb-6">
                    <ThemedView className="flex-row items-center justify-between mb-4">
                        <ThemedText className="text-lg font-semibold text-gray-900">Bank Details</ThemedText>
                        <TouchableOpacity onPress={handleBankSelection}>
                            <ThemedText className="text-orange-500 font-medium">Change</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    <ThemedView className="space-y-3">
                        <ThemedView>
                            <ThemedText className="text-sm text-gray-500 mb-1">Bank</ThemedText>
                            <ThemedText className="text-base text-gray-900 font-medium">{bank}</ThemedText>
                        </ThemedView>

                        <ThemedView>
                            <ThemedText className="text-sm text-gray-500 mb-1">Bank Account</ThemedText>
                            <ThemedText className="text-base text-gray-900 font-medium">{accountNumber}</ThemedText>
                        </ThemedView>

                        <ThemedView>
                            <ThemedText className="text-sm text-gray-500 mb-1">Account Holder Name</ThemedText>
                            <ThemedText className="text-base text-gray-900 font-medium">{accountHolderName}</ThemedText>
                        </ThemedView>

                        <ThemedView>
                            <ThemedText className="text-sm text-gray-500 mb-1">Amount</ThemedText>
                            <ThemedText className="text-xl text-orange-500 font-bold">{amount}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                {/* Transaction Summary */}
                <ThemedView className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                    <ThemedText className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary</ThemedText>

                    <ThemedView className="space-y-3">
                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-600">Withdrawal Amount</ThemedText>
                            <ThemedText className="text-gray-900 font-medium">{amount}</ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-600">Processing Fee</ThemedText>
                            <ThemedText className="text-green-600 font-medium">Free</ThemedText>
                        </ThemedView>

                        <ThemedView className="border-t border-gray-200 pt-3">
                            <ThemedView className="flex-row justify-between">
                                <ThemedText className="text-gray-900 font-semibold">Total Amount</ThemedText>
                                <ThemedText className="text-orange-500 font-bold text-lg">{amount}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                {/* Important Notice */}
                <ThemedView className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <ThemedText className="text-yellow-800 font-medium mb-2">⚠️ Important Notice</ThemedText>
                    <ThemedText className="text-yellow-700 text-sm leading-5">
                        Please ensure your bank account details are correct. Withdrawals cannot be reversed once processed. Processing time is 1-3 business days.
                    </ThemedText>
                </ThemedView>
            </ScrollView >

            {/* Action Buttons */}
            < ThemedView className="px-4 pb-4 flex-row gap-x-3" >
                {/* Bank Button */}
                < TouchableOpacity
                    className="flex-1 py-4 border border-orange-500 rounded-xl"
                    onPress={handleBankSelection}
                >
                    <ThemedText className="text-orange-500 font-semibold text-center text-base">
                        Bank
                    </ThemedText>
                </TouchableOpacity >

                {/* Confirm Button */}
                < TouchableOpacity
                    className="flex-1 py-4 bg-orange-500 rounded-xl"
                    onPress={handleConfirm}
                >
                    <ThemedText className="text-white font-semibold text-center text-base">
                        Confirm
                    </ThemedText>
                </TouchableOpacity >
            </ThemedView >
        </SafeAreaView >
    );
}