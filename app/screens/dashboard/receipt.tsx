'use client';
import { ArrowLeftIcon, Icon, ShareIcon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReceiptScreen() {
    const params = useLocalSearchParams();

    const receiptData = {
        amount: params.amount as string || '50000',
        bank: params.bank as string || 'Access bank',
        accountNumber: params.accountNumber as string || '37991746791',
        recipient: params.recipient as string || 'John Doe',
        transactionId: params.transactionId as string || '386864n9797kh83',
        date: params.date as string || 'Jun 24, 2024',
        status: 'Approved'
    };

    const handleShare = () => {
        // Implement share functionality
        console.log('Sharing receipt...');
    };

    const renderBarcode = () => (
        <View className="items-center mb-6">
            {/* Barcode representation */}
            <View className="flex-row items-end justify-center mb-2">
                {Array.from({ length: 50 }, (_, i) => (
                    <View
                        key={i}
                        className="bg-black mx-px"
                        style={{
                            width: Math.random() > 0.5 ? 2 : 1,
                            height: Math.random() * 40 + 20
                        }}
                    />
                ))}
            </View>
            <View className="flex-row justify-between w-32">
                <Text className="text-sm font-mono text-gray-700">213868</Text>
                <Text className="text-sm font-mono text-gray-700">4746756</Text>
            </View>
        </View>
    );

    const renderReceiptItem = (label: string, value: string, isStatus?: boolean) => (
        <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600 text-base">{label}</Text>
            <View className="flex-1 items-end">
                {isStatus ? (
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-green-600 font-medium text-sm">{value}</Text>
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
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Receipts</Text>

                <TouchableOpacity onPress={handleShare}>
                    <Icon as={ShareIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Receipt Card */}
                <View className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    {/* Barcode */}
                    {renderBarcode()}

                    {/* Receipt Details */}
                    <View className="space-y-0">
                        {renderReceiptItem('Recipient', receiptData.recipient)}
                        {renderReceiptItem('Account Number', receiptData.accountNumber)}
                        {renderReceiptItem('Bank Name', receiptData.bank)}
                        {renderReceiptItem('Transaction ID', receiptData.transactionId)}
                        {renderReceiptItem('Date', receiptData.date)}
                        {renderReceiptItem('Status', receiptData.status, true)}
                    </View>

                    {/* Amount Section */}
                    <View className="mt-6 pt-6 border-t border-gray-200">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg font-semibold text-gray-900">Total Amount</Text>
                            <Text className="text-2xl font-bold text-orange-500">
                                ₦{parseInt(receiptData.amount).toLocaleString()}
                            </Text>
                        </View>
                    </View>

                    {/* Transaction Type */}
                    <View className="mt-4 bg-orange-50 rounded-xl p-4">
                        <Text className="text-orange-800 font-medium text-center">
                            Withdrawal Transaction
                        </Text>
                    </View>
                </View>

                {/* Additional Info */}
                <View className="mt-6 bg-gray-50 rounded-xl p-4">
                    <Text className="text-gray-700 text-sm leading-5">
                        <Text className="font-medium">Note:</Text> This receipt serves as proof of your withdrawal transaction.
                        Keep it for your records. If you have any questions about this transaction,
                        please contact our support team with the transaction ID.
                    </Text>
                </View>

                {/* Action Buttons */}
                <View className="mt-6 gap-y-3">
                    <TouchableOpacity
                        className="bg-orange-500 py-4 rounded-xl"
                        onPress={handleShare}
                    >
                        <Text className="text-white font-semibold text-center">
                            Share Receipt
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="border border-gray-300 py-4 rounded-xl"
                        onPress={() => router.push('/screens/payments/history')}
                    >
                        <Text className="text-gray-700 font-semibold text-center">
                            View All Transactions
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}