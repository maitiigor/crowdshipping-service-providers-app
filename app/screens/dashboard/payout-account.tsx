'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BankAccount {
    id: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    isDefault?: boolean;
}

export default function PayoutAccountScreen() {
    const [accounts, setAccounts] = useState<BankAccount[]>([
        {
            id: '1',
            bankName: 'First bank Nigeria',
            accountName: 'Isegun Johnson',
            accountNumber: '0123456789',
            isDefault: true
        }
    ]);

    const handleEditAccount = (accountId: string) => {
        router.push(`/screens/dashboard/add-payout-account?edit=${accountId}`);
    };

    const handleAddAccount = () => {
        router.push('/screens/dashboard/add-payout-account');
    };

    const renderAccountCard = (account: BankAccount) => (
        <View key={account.id} className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <ThemedView className="flex-row items-center justify-between mb-4">
                <ThemedText className="text-lg font-semibold text-gray-900">{account.bankName}</ThemedText>
                {account.isDefault && (
                    <ThemedView className="bg-green-100 px-2 py-1 rounded-full">
                        <ThemedText className="text-green-600 text-xs font-medium">Default</ThemedText>
                    </ThemedView>
                )}
            </ThemedView>

            <ThemedView className="mb-3">
                <ThemedText className="text-sm text-gray-500 mb-1">Name on Account</ThemedText>
                <ThemedText className="text-base text-gray-900 font-medium">{account.accountName}</ThemedText>
            </ThemedView>

            <ThemedView className="mb-4">
                <ThemedText className="text-sm text-gray-500 mb-1">Account Number</ThemedText>
                <ThemedText className="text-base text-gray-900 font-medium">{account.accountNumber}</ThemedText>
            </ThemedView>

            <TouchableOpacity
                className="bg-blue-500 py-3 px-6 rounded-lg"
                onPress={() => handleEditAccount(account.id)}
            >
                <ThemedText className="text-white font-medium text-center">Edit</ThemedText>
            </TouchableOpacity>
        </View >
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-xl font-semibold text-gray-900">Payout Account</ThemedText>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Account Cards */}
                {accounts.map(renderAccountCard)}

                {/* Add Account Button */}
                <TouchableOpacity
                    className="bg-orange-500 py-4 px-6 rounded-xl mb-6"
                    onPress={handleAddAccount}
                >
                    <ThemedText className="text-white font-semibold text-center text-base">
                        + Add New Account
                    </ThemedText>
                </TouchableOpacity>

                {/* Info Section */}
                <ThemedView className="bg-blue-50 rounded-xl p-4">
                    <ThemedText className="text-blue-800 font-medium mb-2">Important Information</ThemedText>
                    <ThemedText className="text-blue-700 text-sm leading-5">
                        • Ensure your account details are correct to avoid payment delays{'\n'}
                        • Only Nigerian bank accounts are supported{'\n'}
                        • Payouts are processed within 24 hours on business days
                    </ThemedText>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}