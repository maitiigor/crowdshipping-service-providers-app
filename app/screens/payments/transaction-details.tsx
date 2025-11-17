'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionDetailsScreen() {
    const params = useLocalSearchParams();

    const transactionData = {
        id: params.transactionId as string || 'TXN123456789',
        type: params.type as string || 'payment',
        title: params.title as string || 'Payment successful!',
        description: params.description as string || 'Shipping payment successfully processed',
        amount: params.amount as string || '₦200,000',
        timeAgo: params.timeAgo as string || '4 hours ago',
        status: params.status as string || 'successful',
        date: params.date as string || 'June 15, 2025',
        time: params.time as string || '2:30 PM',
        reference: params.reference as string || 'REF123456789',
        paymentMethod: params.paymentMethod as string || 'Bank Transfer',
        recipientName: params.recipientName as string || 'John Doe',
        recipientAccount: params.recipientAccount as string || '1234567890'
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'successful':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'failed':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'successful':
                return '✓';
            case 'pending':
                return '⏳';
            case 'failed':
                return '✗';
            default:
                return '?';
        }
    };

    const renderDetailRow = (label: string, value: string, isStatus?: boolean) => (
        <ThemedView className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <ThemedText className="text-gray-600 text-base">{label}</ThemedText>
            <ThemedView className="flex-1 items-end">
                {isStatus ? (
                    <ThemedView className={`px-3 py-1 rounded-full ${getStatusColor(value)}`}>
                        <ThemedText className={`font-medium text-sm ${getStatusColor(value).split(' ')[0]}`}>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                        </ThemedText>
                    </ThemedView>
                ) : (
                    <ThemedText className="text-gray-900 font-medium text-base text-right">
                        {value}
                    </ThemedText>
                )}
            </ThemedView>
        </ThemedView>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <ThemedView className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-xl font-semibold text-gray-900">Transaction Details</ThemedText>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Transaction Status Card */}
                <ThemedView className="bg-white rounded-2xl p-6 mb-6 shadow-sm items-center">
                    <ThemedView className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${getStatusColor(transactionData.status)}`}>
                        <ThemedText className="text-3xl">
                            {getStatusIcon(transactionData.status)}
                        </ThemedText>
                    </ThemedView>

                    <ThemedText className="text-2xl font-bold text-gray-900 mb-2">
                        {transactionData.amount}
                    </ThemedText>

                    <ThemedText className="text-lg font-semibold text-gray-900 mb-1">
                        {transactionData.title}
                    </ThemedText>

                    <ThemedText className="text-gray-600 text-center">
                        {transactionData.description}
                    </ThemedText>
                </ThemedView>

                {/* Transaction Details */}
                <ThemedView className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                    <ThemedText className="text-lg font-semibold text-gray-900 mb-4">
                        Transaction Details
                    </ThemedText>

                    <ThemedView className="space-y-0">
                        {renderDetailRow('Transaction ID', transactionData.id)}
                        {renderDetailRow('Date', transactionData.date)}
                        {renderDetailRow('Time', transactionData.time)}
                        {renderDetailRow('Reference', transactionData.reference)}
                        {renderDetailRow('Payment Method', transactionData.paymentMethod)}
                        {renderDetailRow('Status', transactionData.status, true)}
                    </ThemedView>
                </ThemedView>

                {/* Recipient Information (for payments) */}
                {transactionData.type === 'payment' && (
                    <ThemedView className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                        <ThemedText className="text-lg font-semibold text-gray-900 mb-4">
                            Recipient Information
                        </ThemedText>

                        <ThemedView className="space-y-0">
                            {renderDetailRow('Name', transactionData.recipientName)}
                            {renderDetailRow('Account Number', transactionData.recipientAccount)}
                        </ThemedView>
                    </ThemedView>
                )}

                {/* Action Buttons */}
                <ThemedView className="space-y-3">
                    <TouchableOpacity
                        className="border border-orange-500 py-4 rounded-xl"
                        onPress={() => {
                            // Handle download receipt
                            console.log('Download receipt');
                        }}
                    >
                        <ThemedText className="text-orange-500 font-semibold text-center">
                            Download Receipt
                        </ThemedText>
                    </TouchableOpacity>

                    {transactionData.status === 'failed' && (
                        <TouchableOpacity
                            className="bg-orange-500 py-4 rounded-xl"
                            onPress={() => {
                                // Handle retry transaction
                                console.log('Retry transaction');
                            }}
                        >
                            <ThemedText className="text-white font-semibold text-center">
                                Retry Transaction
                            </ThemedText>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        className="border border-gray-300 py-4 rounded-xl"
                        onPress={() => {
                            // Handle report issue
                            console.log('Report issue');
                        }}
                    >
                        <ThemedText className="text-gray-700 font-semibold text-center">
                            Report an Issue
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}