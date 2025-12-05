'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';

type TimeFrame = 'Day' | 'Week' | 'Month';

interface EarningsData {
    totalEarnings: string;
    orders: number;
    onlineTime: string;
    chartData: number[];
    recentOrders: {
        id: string;
        orderId: string;
        amount: string;
        date: string;
        status: 'completed' | 'pending';
    }[];
}

const mockEarningsData: Record<TimeFrame, EarningsData> = {
    Day: {
        totalEarnings: '₦913,500',
        orders: 123,
        onlineTime: '18h 23m',
        chartData: [5000, 8000, 12000, 15000, 18000, 22000, 25000],
        recentOrders: [
            { id: '1', orderId: 'Order#HWDFF775G5TG5', amount: '22,400', date: 'June 15, 2024', status: 'completed' },
            { id: '2', orderId: 'Order#HWDFF775G5TG5', amount: '49,500', date: 'June 15, 2024', status: 'completed' },
            { id: '3', orderId: 'Order#HWDFF775G5TG5', amount: '49,500', date: 'June 15, 2024', status: 'completed' },
        ]
    },
    Week: {
        totalEarnings: '₦913,500',
        orders: 123,
        onlineTime: '18h 23m',
        chartData: [10000, 15000, 20000, 25000, 30000, 35000, 40000],
        recentOrders: [
            { id: '1', orderId: 'Order#HWDFF775G5TG5', amount: '22,400', date: 'This Week', status: 'completed' },
            { id: '2', orderId: 'Order#HWDFF775G5TG5', amount: '49,500', date: 'This Week', status: 'completed' },
        ]
    },
    Month: {
        totalEarnings: '₦3,440,000.25',
        orders: 123,
        onlineTime: '18h 23m',
        chartData: [50000, 75000, 100000, 125000, 150000, 175000, 200000],
        recentOrders: [
            { id: '1', orderId: 'Order#HWDFF775G5TG5', amount: '400,000', date: 'This Month', status: 'completed' },
            { id: '2', orderId: 'Order#HWDFF775G5TG5', amount: '400,000', date: 'This Month', status: 'completed' },
            { id: '3', orderId: 'Order#HWDFF775G5TG5', amount: '400,000', date: 'This Month', status: 'completed' },
            { id: '4', orderId: 'Order#HWDFF775G5TG5', amount: '5000', date: 'This Month', status: 'pending' },
        ]
    }
};

export default function EarningsScreen() {
    const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('Day');
    const currentData = mockEarningsData[activeTimeFrame];

    const renderChart = () => {
        const maxValue = Math.max(...currentData.chartData);

        return (
            <ThemedView className="bg-white rounded-2xl p-6 mx-4 mb-4">
                <ThemedView className="flex-row items-center justify-between mb-6">
                    <ThemedText className="text-gray-900 font-semibold text-lg">Earnings Chart</ThemedText>
                    <ThemedText className="text-gray-500 text-sm">June 15, 2024</ThemedText>
                </ThemedView>

                <ThemedView className="flex-row items-end justify-between h-32 mb-4">
                    {currentData.chartData.map((value, index) => {
                        const height = (value / maxValue) * 100;
                        const days = ['Mo', 'Tu', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

                        return (
                            <ThemedView key={index} className="items-center flex-1">
                                <View
                                    className="bg-orange-500 rounded-t-md w-8 mb-2"
                                    style={{ height: `${height}%` }}
                                />
                                <ThemedText className="text-gray-500 text-xs">
                                    {activeTimeFrame === 'Day' ? days[index] : index + 1}
                                </ThemedText>
                            </ThemedView>
                        );
                    })}
                </ThemedView>

                <ThemedView className="flex-row justify-between text-xs text-gray-400">
                    <ThemedText className="text-gray-400 text-xs">0</ThemedText>
                    <ThemedText className="text-gray-400 text-xs">5000</ThemedText>
                    <ThemedText className="text-gray-400 text-xs">10000</ThemedText>
                    <ThemedText className="text-gray-400 text-xs">15000</ThemedText>
                    <ThemedText className="text-gray-400 text-xs">20000</ThemedText>
                </ThemedView>
            </ThemedView>
        );
    };

    const renderOrderItem = (order: typeof currentData.recentOrders[0]) => (
        <View key={order.id} className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <ThemedView className="flex-1">
                <ThemedText className="text-gray-900 font-medium text-base mb-1">{order.orderId}</ThemedText>
                <ThemedText className="text-gray-500 text-sm">{order.date}</ThemedText>
            </ThemedView>
            <ThemedView className="items-end">
                <ThemedText className="text-gray-900 font-semibold text-base mb-1">₦{order.amount}</ThemedText>
                <ThemedView className={`px-2 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                    <ThemedText className={`text-xs font-medium ${order.status === 'completed' ? 'text-green-700' : 'text-orange-700'
                        }`}>
                        {order.status === 'completed' ? 'Completed' : 'Pending'}
                    </ThemedText>
                </ThemedView>
            </ThemedView>
        </View >
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <ThemedView className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-xl font-semibold text-gray-900">Earnings</ThemedText>

                <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView className="flex-1">
                {/* Time Frame Tabs */}
                <ThemedView className="flex-row mx-4 mt-4 mb-4 bg-white rounded-2xl p-1">
                    {(['Day', 'Week', 'Month'] as TimeFrame[]).map((timeFrame) => (
                        <TouchableOpacity
                            key={timeFrame}
                            className={`flex-1 py-3 px-4 rounded-xl ${activeTimeFrame === timeFrame
                                ? 'bg-orange-500'
                                : 'bg-transparent'
                                }`}
                            onPress={() => setActiveTimeFrame(timeFrame)}
                        >
                            <ThemedText className={`text-center font-medium ${activeTimeFrame === timeFrame ? 'text-white' : 'text-gray-700'
                                }`}>
                                {timeFrame}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </ThemedView>

                {/* Earnings Summary */}
                <ThemedView className="bg-white rounded-2xl p-6 mx-4 mb-4">
                    <ThemedView className="items-center mb-6">
                        <ThemedText className="text-gray-500 text-sm mb-2">
                            Jun 15 - Jun 21
                        </ThemedText>
                        <ThemedText className="text-gray-900 font-bold text-3xl mb-4">
                            {currentData.totalEarnings}
                        </ThemedText>
                        <ThemedView className="flex-row items-center">
                            <ThemedText className="text-green-500 text-sm">👁️</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                        <ThemedView className="items-center">
                            <ThemedText className="text-gray-500 text-sm mb-1">Orders</ThemedText>
                            <ThemedText className="text-gray-900 font-semibold text-lg">{currentData.orders}</ThemedText>
                        </ThemedView>
                        <ThemedView className="items-center">
                            <ThemedText className="text-gray-500 text-sm mb-1">Online</ThemedText>
                            <ThemedText className="text-gray-900 font-semibold text-lg">{currentData.onlineTime}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                {/* Chart */}
                {renderChart()}

                {/* Recent Orders */}
                <ThemedView className="bg-white rounded-2xl mx-4 mb-6">
                    <ThemedView className="flex-row items-center justify-between p-6 border-b border-gray-100">
                        <ThemedText className="text-gray-900 font-semibold text-lg">Recent Order</ThemedText>
                        <TouchableOpacity onPress={() => router.push('/screens/bookings/history')}>
                            <ThemedText className="text-orange-500 font-medium text-sm">View All</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    <ThemedView className="px-6">
                        {currentData.recentOrders.map(renderOrderItem)}
                    </ThemedView>

                    {/* Total Earnings Footer */}
                    <ThemedView className="p-6 border-t border-gray-100 bg-orange-50">
                        <ThemedView className="flex-row items-center justify-between">
                            <ThemedText className="text-gray-900 font-semibold text-base">Total Earnings</ThemedText>
                            <ThemedText className="text-orange-500 font-bold text-xl">
                                {activeTimeFrame === 'Month' ? '₦3,440,000.25' : currentData.totalEarnings}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                {/* Details Button */}
                <ThemedView className="mx-4 mb-6">
                    <TouchableOpacity
                        className="bg-orange-500 py-4 rounded-2xl flex-row items-center justify-center"
                        onPress={() => router.push('/screens/payments/history')}
                    >
                        <ThemedText className="text-white font-semibold text-base mr-2">Details</ThemedText>
                        <Icon as={ArrowLeftIcon} size="sm" className="text-white transform rotate-180" />
                    </TouchableOpacity>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}