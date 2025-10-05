'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TransactionType = 'all' | 'payment' | 'withdraw';
type TransactionStatus = 'successful' | 'pending' | 'failed';

interface Transaction {
    id: string;
    type: 'withdraw' | 'payment';
    title: string;
    description: string;
    amount: string;
    timeAgo: string;
    status: TransactionStatus;
    date: string;
    time: string;
    reference: string;
    paymentMethod: string;
    recipientName?: string;
    recipientAccount?: string;
}

const mockTransactions: Transaction[] = [
    {
        id: 'TXN001',
        type: 'withdraw',
        title: 'Withdraw Successful',
        description: 'You successfully withdraw ₦300,000 from wallet.',
        amount: '₦300,000',
        timeAgo: '2 hours ago',
        status: 'successful',
        date: 'June 15, 2025',
        time: '2:30 PM',
        reference: 'REF123456789',
        paymentMethod: 'Bank Transfer'
    },
    {
        id: 'TXN002',
        type: 'payment',
        title: 'Payment successful!',
        description: 'Shipping payment of ₦200,000 successfully paid',
        amount: '₦200,000',
        timeAgo: '4 hours ago',
        status: 'successful',
        date: 'June 15, 2025',
        time: '12:15 PM',
        reference: 'REF987654321',
        paymentMethod: 'Bank Transfer',
        recipientName: 'John Doe',
        recipientAccount: '1234567890'
    },
    {
        id: 'TXN003',
        type: 'withdraw',
        title: 'Withdraw Pending',
        description: 'Withdrawal of ₦150,000 is being processed.',
        amount: '₦150,000',
        timeAgo: '1 day ago',
        status: 'pending',
        date: 'June 14, 2025',
        time: '3:45 PM',
        reference: 'REF456789123',
        paymentMethod: 'Bank Transfer'
    },
    {
        id: 'TXN004',
        type: 'payment',
        title: 'Payment Failed',
        description: 'Shipping payment of ₦100,000 failed due to insufficient funds',
        amount: '₦100,000',
        timeAgo: '2 days ago',
        status: 'failed',
        date: 'June 13, 2025',
        time: '11:20 AM',
        reference: 'REF789123456',
        paymentMethod: 'Bank Transfer',
        recipientName: 'Jane Smith',
        recipientAccount: '0987654321'
    },
    {
        id: 'TXN005',
        type: 'withdraw',
        title: 'Withdraw Successful',
        description: 'You successfully withdraw ₦500,000 from wallet.',
        amount: '₦500,000',
        timeAgo: '3 days ago',
        status: 'successful',
        date: 'June 12, 2025',
        time: '4:10 PM',
        reference: 'REF321654987',
        paymentMethod: 'Bank Transfer'
    },
    {
        id: 'TXN006',
        type: 'payment',
        title: 'Payment successful!',
        description: 'Shipping payment of ₦350,000 successfully paid',
        amount: '₦350,000',
        timeAgo: '5 days ago',
        status: 'successful',
        date: 'June 10, 2025',
        time: '1:25 PM',
        reference: 'REF654987321',
        paymentMethod: 'Bank Transfer',
        recipientName: 'Mike Johnson',
        recipientAccount: '5432167890'
    }
];

export default function TransactionHistoryScreen() {
    const [activeTab, setActiveTab] = useState<TransactionType>('all');

    const filteredTransactions = mockTransactions.filter(transaction => {
        if (activeTab === 'all') return true;
        return transaction.type === activeTab;
    });

    const getTabStyle = (tab: TransactionType) => {
        return activeTab === tab
            ? 'bg-orange-500 text-white'
            : 'bg-transparent text-gray-600 border border-gray-300';
    };

    const getStatusColor = (status: TransactionStatus) => {
        switch (status) {
            case 'successful':
                return 'text-green-600';
            case 'pending':
                return 'text-yellow-600';
            case 'failed':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

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
                date: transaction.date,
                time: transaction.time,
                reference: transaction.reference,
                paymentMethod: transaction.paymentMethod,
                recipientName: transaction.recipientName || '',
                recipientAccount: transaction.recipientAccount || ''
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
                    <Text className="text-white text-xs">
                        {transaction.type === 'withdraw' ? '↑' : '↓'}
                    </Text>
                </View>
            </View>

            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-base font-semibold text-gray-900">
                        {transaction.title}
                    </Text>
                    <Text className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Text>
                </View>
                <Text className="text-sm text-gray-600 mb-1">
                    {transaction.description}
                </Text>
                <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-500">
                        {transaction.timeAgo}
                    </Text>
                    <Text className="text-base font-bold text-gray-900">
                        {transaction.amount}
                    </Text>
                </View>
            </View>

            <View className="ml-2">
                <Text className="text-gray-400 text-lg">›</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Transaction History</Text>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            {/* Tab Navigation */}
            <View className="bg-white px-4 py-4">
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full ${getTabStyle('all')}`}
                        onPress={() => setActiveTab('all')}
                    >
                        <Text className={`font-medium ${activeTab === 'all' ? 'text-white' : 'text-gray-600'}`}>
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full ${getTabStyle('payment')}`}
                        onPress={() => setActiveTab('payment')}
                    >
                        <Text className={`font-medium ${activeTab === 'payment' ? 'text-white' : 'text-gray-600'}`}>
                            Payments
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full ${getTabStyle('withdraw')}`}
                        onPress={() => setActiveTab('withdraw')}
                    >
                        <Text className={`font-medium ${activeTab === 'withdraw' ? 'text-white' : 'text-gray-600'}`}>
                            Withdrawals
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Transaction List */}
            <ScrollView className="flex-1">
                <View className="bg-white mx-4 mt-4 rounded-xl border border-gray-200">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map(renderTransactionItem)
                    ) : (
                        <View className="flex-1 items-center justify-center py-20">
                            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                                <View className="w-10 h-10 bg-gray-300 rounded-lg" />
                            </View>
                            <Text className="text-gray-500 text-center">
                                No {activeTab === 'all' ? '' : activeTab} transactions found
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}