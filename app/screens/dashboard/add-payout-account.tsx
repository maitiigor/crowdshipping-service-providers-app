'use client';
import { ArrowLeftIcon, BellIcon, ChevronDownIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BankData {
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
}

export default function AddPayoutAccountScreen() {
    const [bankData, setBankData] = useState<BankData>({
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
    });

    const [showBankPicker, setShowBankPicker] = useState(false);

    const banks = [
        'First Bank Nigeria',
        'Access Bank',
        'Zenith Bank',
        'GTBank',
        'UBA',
        'Fidelity Bank',
        'Union Bank',
        'Sterling Bank',
        'Stanbic IBTC',
        'Wema Bank'
    ];

    const handleSaveAccount = () => {
        // Validate form
        if (!bankData.bankName || !bankData.accountHolderName || !bankData.accountNumber) {
            alert('Please fill in all fields');
            return;
        }

        // Save account logic here
        console.log('Saving account:', bankData);
        router.back();
    };

    const handleDeleteAccount = () => {
        // Show confirmation dialog
        alert('Are you sure you want to delete this account?');
    };

    const renderInputField = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        placeholder?: string
    ) => (
        <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder || label}
                className="w-full px-4 py-4 bg-gray-50 rounded-lg text-base text-gray-900 border border-gray-200"
                placeholderTextColor="#9CA3AF"
            />
        </View>
    );

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

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Payout Account</Text>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Form Title */}
                <Text className="text-lg font-semibold text-gray-900 mb-6">Manage Payout Account</Text>

                {/* Bank Name */}
                {renderPickerField(
                    'Bank Name',
                    bankData.bankName,
                    () => setShowBankPicker(!showBankPicker),
                    'e.g First bank, Zenith Bank'
                )}

                {showBankPicker && (
                    <View className="mb-4 bg-gray-50 rounded-lg border border-gray-200 max-h-48">
                        <ScrollView>
                            {banks.map((bank) => (
                                <TouchableOpacity
                                    key={bank}
                                    className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                                    onPress={() => {
                                        setBankData({ ...bankData, bankName: bank });
                                        setShowBankPicker(false);
                                    }}
                                >
                                    <Text className="text-base text-gray-900">{bank}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Account Holder Name */}
                {renderInputField(
                    'Account Holder Name',
                    bankData.accountHolderName,
                    (text) => setBankData({ ...bankData, accountHolderName: text }),
                    'Full Name on Account'
                )}

                {/* Account Number */}
                {renderInputField(
                    'Account Number',
                    bankData.accountNumber,
                    (text) => setBankData({ ...bankData, accountNumber: text }),
                    'eg 0123456789'
                )}
            </ScrollView>

            {/* Action Buttons */}
            <View className="px-4 pb-4 gap-y-3">
                {/* Delete Account Button (only show if editing) */}
                <TouchableOpacity
                    className="bg-red-500 py-4 rounded-xl"
                    onPress={handleDeleteAccount}
                >
                    <Text className="text-white font-semibold text-center text-base">
                        Delete Account
                    </Text>
                </TouchableOpacity>

                {/* Save Button */}
                <TouchableOpacity
                    className="bg-blue-500 py-4 rounded-xl"
                    onPress={handleSaveAccount}
                >
                    <Text className="text-white font-semibold text-center text-base">
                        Save Payout Account
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}