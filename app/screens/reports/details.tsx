'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
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
            <ThemedView className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-xl font-semibold text-gray-900">View Status of Report</ThemedText>

                <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Report Frame */}
                <ThemedView className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                    <ThemedText className="text-right text-gray-400 text-sm mb-4">
                        Frame 2087327378
                    </ThemedText>

                    {/* Report ID */}
                    <ThemedView className="flex-row items-center justify-between mb-4">
                        <ThemedText className="text-base font-medium text-gray-700">
                            Report ID
                        </ThemedText>
                        <ThemedText className="text-base font-semibold text-gray-900">
                            {reportData.reportId}
                        </ThemedText>
                    </ThemedView>

                    {/* Date Submitted */}
                    <ThemedView className="flex-row items-center justify-between mb-4">
                        <ThemedText className="text-base font-medium text-gray-700">
                            Date Submitted
                        </ThemedText>
                        <ThemedText className="text-base text-gray-900">
                            {reportData.dateSubmitted}
                        </ThemedText>
                    </ThemedView>

                    {/* Brief Description */}
                    <ThemedView className="mb-4">
                        <ThemedText className="text-base font-medium text-gray-700 mb-2">
                            Brief Description
                        </ThemedText>
                        <ThemedText className="text-base text-gray-900 leading-6">
                            {reportData.description}
                        </ThemedText>
                    </ThemedView>

                    {/* Current Status */}
                    <ThemedView className="flex-row items-center justify-between mb-4">
                        <ThemedText className="text-base font-medium text-gray-700">
                            Current Status
                        </ThemedText>
                        <ThemedView className="flex-row items-center">
                            <ThemedView className={`w-2 h-2 rounded-full mr-2 ${getStatusBadgeColor(reportData.currentStatus)}`} />
                            <ThemedText className={`text-base font-medium ${getStatusColor(reportData.currentStatus)}`}>
                                {reportData.currentStatus}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    {/* Last Updated Date */}
                    <ThemedView className="flex-row items-center justify-between mb-4">
                        <ThemedText className="text-base font-medium text-gray-700">
                            Last Updated Date
                        </ThemedText>
                        <ThemedText className="text-base text-gray-900">
                            {reportData.lastUpdated}
                        </ThemedText>
                    </ThemedView>

                    {/* Support Team */}
                    <ThemedView className="flex-row items-center justify-between">
                        <ThemedText className="text-base font-medium text-gray-700">
                            Support Team
                        </ThemedText>
                        <ThemedText className="text-base text-gray-900">
                            {reportData.supportTeam}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Action Buttons */}
                <ThemedView className="gap-y-4">
                    {/* Back Button */}
                    {/* Live Chat Button */}
                    <TouchableOpacity
                        className="border-[#E75B3B] border py-4 rounded-xl flex-row items-center justify-center"
                        onPress={() => { router.back(); }}
                    >
                        <ThemedText className="text-[#E75B3B] font-semibold text-base">
                            Back
                        </ThemedText>
                    </TouchableOpacity>

                    {/* Live Chat Button */}
                    <TouchableOpacity
                        className="bg-[#E75B3B] py-4 rounded-xl flex-row items-center justify-center"
                        onPress={handleLiveChat}
                    >
                        <ThemedView className="w-8 h-8 bg-white rounded-xl items-center justify-center mr-3">
                            <ThemedText className="text-[#E75B3B] text-lg">💬</ThemedText>
                        </ThemedView>
                        <ThemedText className="text-white font-semibold text-base">
                            Live chat
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {/* Additional Information */}
                <ThemedView className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <ThemedText className="text-blue-800 font-medium mb-2">
                        📋 Report Status Information
                    </ThemedText>
                    <ThemedText className="text-blue-700 text-sm leading-5">
                        Your report is currently being reviewed by our support team.
                        You will receive updates via notifications as the status changes.
                        For urgent matters, please use the live chat feature.
                    </ThemedText>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}