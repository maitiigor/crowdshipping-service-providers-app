'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
        <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600 text-base">{label}</Text>
            <View className="flex-1 items-end">
                {isStatus ? (
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(value)}`}>
                        <Text className={`font-medium text-sm ${getStatusColor(value).split(' ')[0]}`}>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                        </Text>
                    </View>
                ) : (
                    <Text className="text-gray-900 font-medium text-base text-right">
                        {value}
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Transaction Details</Text>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Transaction Status Card */}
                <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm items-center">
                    <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${getStatusColor(transactionData.status)}`}>
                        <Text className="text-3xl">
                            {getStatusIcon(transactionData.status)}
                        </Text>
                    </View>

                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        {transactionData.amount}
                    </Text>

                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                        {transactionData.title}
                    </Text>

                    <Text className="text-gray-600 text-center">
                        {transactionData.description}
                    </Text>
                </View>

                {/* Transaction Details */}
                <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">
                        Transaction Details
                    </Text>

                    <View className="space-y-0">
                        {renderDetailRow('Transaction ID', transactionData.id)}
                        {renderDetailRow('Date', transactionData.date)}
                        {renderDetailRow('Time', transactionData.time)}
                        {renderDetailRow('Reference', transactionData.reference)}
                        {renderDetailRow('Payment Method', transactionData.paymentMethod)}
                        {renderDetailRow('Status', transactionData.status, true)}
                    </View>
                </View>

                {/* Recipient Information (for payments) */}
                {transactionData.type === 'payment' && (
                    <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 mb-4">
                            Recipient Information
                        </Text>

                        <View className="space-y-0">
                            {renderDetailRow('Name', transactionData.recipientName)}
                            {renderDetailRow('Account Number', transactionData.recipientAccount)}
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                <View className="space-y-3">
                    <TouchableOpacity
                        className="border border-orange-500 py-4 rounded-xl"
                        onPress={() => {
                            // Handle download receipt
                            console.log('Download receipt');
                        }}
                    >
                        <Text className="text-orange-500 font-semibold text-center">
                            Download Receipt
                        </Text>
                    </TouchableOpacity>

                    {transactionData.status === 'failed' && (
                        <TouchableOpacity
                            className="bg-orange-500 py-4 rounded-xl"
                            onPress={() => {
                                // Handle retry transaction
                                console.log('Retry transaction');
                            }}
                        >
                            <Text className="text-white font-semibold text-center">
                                Retry Transaction
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        className="border border-gray-300 py-4 rounded-xl"
                        onPress={() => {
                            // Handle report issue
                            console.log('Report issue');
                        }}
                    >
                        <Text className="text-gray-700 font-semibold text-center">
                            Report an Issue
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}