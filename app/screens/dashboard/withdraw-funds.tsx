'use client';
import { ArrowLeftIcon, BellIcon, ChevronDownIcon, EyeIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WithdrawalData {
    bank: string;
    accountNumber: string;
    amount: string;
}

export default function WithdrawFundsScreen() {
    const [withdrawalData, setWithdrawalData] = useState<WithdrawalData>({
        bank: '',
        accountNumber: '',
        amount: '',
    });

    const [showBankPicker, setShowBankPicker] = useState(false);
    const [showBalance, setShowBalance] = useState(true);

    const availableBalance = 913500;
    const banks = ['Access Bank', 'First Bank Nigeria', 'GTBank', 'Zenith Bank', 'UBA'];

    const handleConfirm = () => {
        // Validate form
        if (!withdrawalData.bank || !withdrawalData.accountNumber || !withdrawalData.amount) {
            alert('Please fill in all fields');
            return;
        }

        const amount = parseFloat(withdrawalData.amount.replace(/[₦,]/g, ''));
        if (amount > availableBalance) {
            alert('Insufficient balance');
            return;
        }

        // Navigate to confirmation screen
        router.push({
            pathname: '/screens/dashboard/confirm-withdrawal',
            params: {
                bank: withdrawalData.bank,
                accountNumber: withdrawalData.accountNumber,
                amount: withdrawalData.amount
            }
        });
    };

    const formatAmount = (text: string) => {
        // Remove all non-numeric characters
        const numericValue = text.replace(/[^0-9]/g, '');

        if (numericValue === '') return '';

        // Format with commas
        const formatted = parseInt(numericValue).toLocaleString();
        return `₦${formatted}`;
    };

    const handleAmountChange = (text: string) => {
        const formatted = formatAmount(text);
        setWithdrawalData({ ...withdrawalData, amount: formatted });
    };

    const renderPickerField = (
        label: string,
        value: string,
        onPress: () => void,
        placeholder?: string
    ) => (
        <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            <TouchableOpacity
                className="w-full px-4 py-4 bg-gray-50 rounded-lg border border-gray-200 flex-row items-center justify-between"
                onPress={onPress}
            >
                <Text className={`text-base ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                    {value || placeholder || label}
                </Text>
                <Icon as={ChevronDownIcon} size="sm" className="text-gray-500" />
            </TouchableOpacity>
        </View>
    );

    const renderInputField = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        placeholder?: string,
        keyboardType?: 'default' | 'numeric'
    ) => (
        <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder || label}
                keyboardType={keyboardType || 'default'}
                className="w-full px-4 py-4 bg-gray-50 rounded-lg text-base text-gray-900 border border-gray-200"
                placeholderTextColor="#9CA3AF"
            />
        </View>
    );

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

                {/* Bank Selection */}
                {renderPickerField(
                    'Bank',
                    withdrawalData.bank,
                    () => setShowBankPicker(!showBankPicker),
                    'Select Bank'
                )}

                {showBankPicker && (
                    <View className="mb-4 bg-gray-50 rounded-lg border border-gray-200">
                        {banks.map((bank) => (
                            <TouchableOpacity
                                key={bank}
                                className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                                onPress={() => {
                                    setWithdrawalData({ ...withdrawalData, bank });
                                    setShowBankPicker(false);
                                }}
                            >
                                <Text className="text-base text-gray-900">{bank}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Account Number */}
                {renderInputField(
                    'Account Number',
                    withdrawalData.accountNumber,
                    (text) => setWithdrawalData({ ...withdrawalData, accountNumber: text }),
                    'eg 0123456789',
                    'numeric'
                )}

                {/* Amount */}
                {renderInputField(
                    'Amount',
                    withdrawalData.amount,
                    handleAmountChange,
                    'eg 200,000',
                    'numeric'
                )}

                {/* Quick Amount Buttons */}
                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-3">Quick amounts</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {[50000, 100000, 200000, 500000].map((amount) => (
                            <TouchableOpacity
                                key={amount}
                                className="bg-gray-100 px-4 py-2 rounded-lg"
                                onPress={() => setWithdrawalData({
                                    ...withdrawalData,
                                    amount: `₦${amount.toLocaleString()}`
                                })}
                            >
                                <Text className="text-gray-700 font-medium">
                                    ₦{amount.toLocaleString()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Withdrawal Info */}
                <View className="bg-blue-50 rounded-xl p-4 mb-6">
                    <Text className="text-blue-800 font-medium mb-2">Withdrawal Information</Text>
                    <Text className="text-blue-700 text-sm leading-5">
                        • Minimum withdrawal amount: ₦1,000{'\n'}
                        • Processing time: 1-3 business days{'\n'}
                        • No withdrawal fees for amounts above ₦10,000
                    </Text>
                </View>
            </ScrollView>

            {/* Confirm Button */}
            <View className="px-4 pb-4">
                <TouchableOpacity
                    className="bg-orange-500 py-4 rounded-xl"
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