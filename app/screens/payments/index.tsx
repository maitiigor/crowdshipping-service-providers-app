'use client';
import { ArrowLeftIcon, BellIcon, EyeIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Transaction {
    id: string;
    type: 'withdraw' | 'payment';
    title: string;
    description: string;
    amount: string;
    timeAgo: string;
    status: 'successful' | 'pending' | 'failed';
}

export default function PaymentLogsScreen() {
    const [showBalance, setShowBalance] = useState(false);
    const [activeTab, setActiveTab] = useState<'payout' | 'withdrawal'>('payout');

    const transactions: Transaction[] = [
        {
            id: '1',
            type: 'withdraw',
            title: 'Withdraw Successful',
            description: 'You successfully withdraw ₦300,000 from wallet.',
            amount: '₦300,000',
            timeAgo: '2 hour ago',
            status: 'successful'
        },
        {
            id: '2',
            type: 'payment',
            title: 'Payment successful!',
            description: 'Shipping payment of ₦200,000 successfully paid',
            amount: '₦200,000',
            timeAgo: '4 hour ago',
            status: 'successful'
        },
        {
            id: '3',
            type: 'withdraw',
            title: 'Withdraw Successful',
            description: 'You successfully withdraw ₦300,000 from wallet.',
            amount: '₦300,000',
            timeAgo: '2 hour ago',
            status: 'successful'
        },
        {
            id: '4',
            type: 'withdraw',
            title: 'Withdraw Successful',
            description: 'You successfully withdraw ₦300,000 from wallet.',
            amount: '₦300,000',
            timeAgo: '2 hour ago',
            status: 'successful'
        },
        {
            id: '5',
            type: 'payment',
            title: 'Payment successful!',
            description: 'Shipping payment of ₦200,000 successfully paid',
            amount: '₦200,000',
            timeAgo: '4 hour ago',
            status: 'successful'
        }
    ];

    const handleTransactionPress = (transaction: Transaction) => {
        router.push({
            pathname: '/screens/payments/transaction-details',
            params: {
                transactionId: transaction.id,
                type: transaction.type,
                title: transaction.title,
                description: transaction.description,
                amount: transaction.amount,
                timeAgo: transaction.timeAgo,
                status: transaction.status,
                date: 'June 15, 2025',
                time: '2:30 PM',
                reference: `REF${transaction.id}`,
                paymentMethod: 'Bank Transfer',
                recipientName: transaction.type === 'payment' ? 'John Doe' : '',
                recipientAccount: transaction.type === 'payment' ? '1234567890' : ''
            }
        });
    };

    const renderTransactionItem = (transaction: Transaction) => (
        <TouchableOpacity
            key={transaction.id}
            className="flex-row items-center px-4 py-4 border-b border-gray-100"
            onPress={() => handleTransactionPress(transaction)}
        >
            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-3">
                <View className="w-6 h-6 bg-orange-500 rounded items-center justify-center">
                    <Text className="text-white text-xs">₦</Text>
                </View>
            </View>

            <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                    {transaction.title}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                    {transaction.description}
                </Text>
                <Text className="text-xs text-gray-500">
                    {transaction.timeAgo}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Payment logs</Text>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
                {/* Balance Card */}
                <View className="mx-4 mt-6 mb-6">
                    <View className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 relative overflow-hidden">
                        {/* Background Pattern */}
                        <View className="absolute inset-0 opacity-20">
                            <View className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
                            <View className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full" />
                            <View className="absolute top-1/2 left-1/3 w-12 h-12 bg-white/10 rounded-full" />
                        </View>

                        <View className="relative">
                            <Text className="text-white text-sm mb-2">Total Balance</Text>
                            <View className="flex-row items-center mb-4">
                                <Text className="text-white text-2xl font-bold mr-2">
                                    {showBalance ? '₦913,500' : '****'}
                                </Text>
                                <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                                    <Icon as={EyeIcon} size="sm" className="text-white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row mx-4 mb-6 gap-3">
                    <TouchableOpacity
                        className={`flex-1 py-3 px-4 rounded-xl border ${activeTab === 'payout' ? 'bg-orange-500 border-orange-500' : 'bg-white border-orange-500'}`}
                        onPress={() => {
                            setActiveTab('payout');
                            router.push('/screens/dashboard/payout-account');
                        }}
                    >
                        <Text className={`text-center font-medium ${activeTab === 'payout' ? 'text-white' : 'text-orange-500'}`}>
                            Payout Account
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-1 py-3 px-4 rounded-xl border ${activeTab === 'withdrawal' ? 'bg-orange-500 border-orange-500' : 'bg-white border-orange-500'}`}
                        onPress={() => {
                            setActiveTab('withdrawal');
                            router.push('/screens/dashboard/withdraw-funds');
                        }}
                    >
                        <Text className={`text-center font-medium ${activeTab === 'withdrawal' ? 'text-white' : 'text-orange-500'}`}>
                            Withdrawal
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Transaction History */}
                <View className="mx-4 mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-semibold text-gray-900">Transaction History</Text>
                        <TouchableOpacity onPress={() => router.push('/screens/payments/history')}>
                            <Text className="text-orange-500 font-medium">See all</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="bg-white rounded-xl border border-gray-200">
                        {transactions.map(renderTransactionItem)}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}