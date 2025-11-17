'use client';
import { ArrowLeftIcon, Icon, ShareIcon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
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
        <ThemedView className="items-center mb-6">
            {/* Barcode representation */}
            <ThemedView className="flex-row items-end justify-center mb-2">
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
            </ThemedView>
            <ThemedView className="flex-row justify-between w-32">
                <ThemedText className="text-sm font-mono text-gray-700">213868</ThemedText>
                <ThemedText className="text-sm font-mono text-gray-700">4746756</ThemedText>
            </ThemedView>
        </ThemedView>
    );

    const renderReceiptItem = (label: string, value: string, isStatus?: boolean) => (
        <ThemedView className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <ThemedText className="text-gray-600 text-base">{label}</ThemedText>
            <ThemedView className="flex-1 items-end">
                {isStatus ? (
                    <ThemedView className="bg-green-100 px-3 py-1 rounded-full">
                        <ThemedText className="text-green-600 font-medium text-sm">{value}</ThemedText>
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
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-xl font-semibold text-gray-900">Receipts</ThemedText>

                <TouchableOpacity onPress={handleShare}>
                    <Icon as={ShareIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Receipt Card */}
                <ThemedView className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    {/* Barcode */}
                    {renderBarcode()}

                    {/* Receipt Details */}
                    <ThemedView className="space-y-0">
                        {renderReceiptItem('Recipient', receiptData.recipient)}
                        {renderReceiptItem('Account Number', receiptData.accountNumber)}
                        {renderReceiptItem('Bank Name', receiptData.bank)}
                        {renderReceiptItem('Transaction ID', receiptData.transactionId)}
                        {renderReceiptItem('Date', receiptData.date)}
                        {renderReceiptItem('Status', receiptData.status, true)}
                    </ThemedView>

                    {/* Amount Section */}
                    <ThemedView className="mt-6 pt-6 border-t border-gray-200">
                        <ThemedView className="flex-row justify-between items-center">
                            <ThemedText className="text-lg font-semibold text-gray-900">Total Amount</ThemedText>
                            <ThemedText className="text-2xl font-bold text-orange-500">
                                ₦{parseInt(receiptData.amount).toLocaleString()}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    {/* Transaction Type */}
                    <ThemedView className="mt-4 bg-orange-50 rounded-xl p-4">
                        <ThemedText className="text-orange-800 font-medium text-center">
                            Withdrawal Transaction
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Additional Info */}
                <ThemedView className="mt-6 bg-gray-50 rounded-xl p-4">
                    <ThemedText className="text-gray-700 text-sm leading-5">
                        <ThemedText className="font-medium">Note:</ThemedText> This receipt serves as proof of your withdrawal transaction.
                        Keep it for your records. If you have any questions about this transaction,
                        please contact our support team with the transaction ID.
                    </ThemedText>
                </ThemedView>

                {/* Action Buttons */}
                <ThemedView className="mt-6 gap-y-3">
                    <TouchableOpacity
                        className="bg-orange-500 py-4 rounded-xl"
                        onPress={handleShare}
                    >
                        <ThemedText className="text-white font-semibold text-center">
                            Share Receipt
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="border border-gray-300 py-4 rounded-xl"
                        onPress={() => router.push('/screens/payments/history')}
                    >
                        <ThemedText className="text-gray-700 font-semibold text-center">
                            View All Transactions
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}