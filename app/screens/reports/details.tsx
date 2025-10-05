'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportDetailsScreen() {
    const params = useLocalSearchParams();

    const reportData = {
        reportId: params.reportId as string || 'ID4927393',
        type: params.type as string || 'Delivery Issue',
        description: params.description as string || 'I got to the client late because my tire damaged on my way to deliver.',
        status: params.status as string || 'pending',
        lastUpdated: params.lastUpdated as string || 'June 14, 2024 | 09:23PM',
        currentStatus: params.currentStatus as string || 'Under Review',
        dateSubmitted: 'June 14, 2024 | 09:01PM',
        supportTeam: 'Temi Badenoch'
    };

    const getStatusColor = (status: string) => {
        return status === 'Approved' ? 'text-green-600' : 'text-orange-600';
    };

    const getStatusBadgeColor = (status: string) => {
        return status === 'Approved' ? 'bg-green-500' : 'bg-orange-500';
    };

    const handleLiveChat = () => {
        // Navigate to support live chat
        router.push('/screens/support/live-chat');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">View Status of Report</Text>

                <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Report Frame */}
                <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                    <Text className="text-right text-gray-400 text-sm mb-4">
                        Frame 2087327378
                    </Text>

                    {/* Report ID */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-medium text-gray-700">
                            Report ID
                        </Text>
                        <Text className="text-base font-semibold text-gray-900">
                            {reportData.reportId}
                        </Text>
                    </View>

                    {/* Date Submitted */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-medium text-gray-700">
                            Date Submitted
                        </Text>
                        <Text className="text-base text-gray-900">
                            {reportData.dateSubmitted}
                        </Text>
                    </View>

                    {/* Brief Description */}
                    <View className="mb-4">
                        <Text className="text-base font-medium text-gray-700 mb-2">
                            Brief Description
                        </Text>
                        <Text className="text-base text-gray-900 leading-6">
                            {reportData.description}
                        </Text>
                    </View>

                    {/* Current Status */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-medium text-gray-700">
                            Current Status
                        </Text>
                        <View className="flex-row items-center">
                            <View className={`w-2 h-2 rounded-full mr-2 ${getStatusBadgeColor(reportData.currentStatus)}`} />
                            <Text className={`text-base font-medium ${getStatusColor(reportData.currentStatus)}`}>
                                {reportData.currentStatus}
                            </Text>
                        </View>
                    </View>

                    {/* Last Updated Date */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-medium text-gray-700">
                            Last Updated Date
                        </Text>
                        <Text className="text-base text-gray-900">
                            {reportData.lastUpdated}
                        </Text>
                    </View>

                    {/* Support Team */}
                    <View className="flex-row items-center justify-between">
                        <Text className="text-base font-medium text-gray-700">
                            Support Team
                        </Text>
                        <Text className="text-base text-gray-900">
                            {reportData.supportTeam}
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="gap-y-4">
                    {/* Back Button */}
                    {/* Live Chat Button */}
                    <TouchableOpacity
                        className="border-[#E75B3B] border py-4 rounded-xl flex-row items-center justify-center"
                        onPress={() => { router.back(); }}
                    >
                        <Text className="text-[#E75B3B] font-semibold text-base">
                            Back
                        </Text>
                    </TouchableOpacity>

                    {/* Live Chat Button */}
                    <TouchableOpacity
                        className="bg-[#E75B3B] py-4 rounded-xl flex-row items-center justify-center"
                        onPress={handleLiveChat}
                    >
                        <View className="w-8 h-8 bg-white rounded-xl items-center justify-center mr-3">
                            <Text className="text-[#E75B3B] text-lg">💬</Text>
                        </View>
                        <Text className="text-white font-semibold text-base">
                            Live chat
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Additional Information */}
                <View className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <Text className="text-blue-800 font-medium mb-2">
                        📋 Report Status Information
                    </Text>
                    <Text className="text-blue-700 text-sm leading-5">
                        Your report is currently being reviewed by our support team.
                        You will receive updates via notifications as the status changes.
                        For urgent matters, please use the live chat feature.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}