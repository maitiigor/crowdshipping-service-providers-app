'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ReportStatus = 'pending' | 'resolved';

interface Report {
    id: string;
    reportId: string;
    lastUpdated: string;
    currentStatus: string;
    status: ReportStatus;
}

const mockReports: Report[] = [
    {
        id: '1',
        reportId: 'ID4927393',
        lastUpdated: 'June 14, 2024 | 09:23PM',
        currentStatus: 'Under Review',
        status: 'pending'
    },
    {
        id: '2',
        reportId: 'ID4927393',
        lastUpdated: 'June 14, 2024 | 09:23PM',
        currentStatus: 'Under Review',
        status: 'pending'
    },
    {
        id: '3',
        reportId: 'ID4927393',
        lastUpdated: 'June 14, 2024 | 09:23PM',
        currentStatus: 'Approved',
        status: 'resolved'
    },
    {
        id: '4',
        reportId: 'ID4927393',
        lastUpdated: 'June 14, 2024 | 09:23PM',
        currentStatus: 'Under Review',
        status: 'pending'
    },
    {
        id: '5',
        reportId: 'ID4927393',
        lastUpdated: 'June 14, 2024 | 09:23PM',
        currentStatus: 'Approved',
        status: 'resolved'
    },
    {
        id: '6',
        reportId: 'ID4927393',
        lastUpdated: 'June 14, 2024 | 09:23PM',
        currentStatus: 'Under Review',
        status: 'pending'
    }
];

export default function ReportStatusScreen() {
    const [activeFilter, setActiveFilter] = useState<ReportStatus>('pending');
    const [reports] = useState<Report[]>(mockReports);

    const filteredReports = reports.filter(report => report.status === activeFilter);

    const getStatusColor = (status: string) => {
        return status === 'Approved' ? 'text-green-600' : 'text-orange-600';
    };

    const getStatusBadgeColor = (status: string) => {
        return status === 'Approved' ? 'bg-green-500' : 'bg-orange-500';
    };

    const renderReportItem = (report: Report) => (
        <TouchableOpacity
            key={report.id}
            className="bg-white p-4 mb-3 rounded-xl border border-gray-100"
            onPress={() => {
                router.push({
                    pathname: '/screens/reports/details',
                    params: {
                        reportId: report.reportId,
                        lastUpdated: report.lastUpdated,
                        currentStatus: report.currentStatus,
                        status: report.status
                    }
                });
            }}
        >
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-semibold text-gray-900">
                    Report ID
                </Text>
                <Text className="text-base font-medium text-gray-700">
                    {report.reportId}
                </Text>
            </View>

            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm text-gray-600">
                    Last Updated Date
                </Text>
                <Text className="text-sm text-gray-700">
                    {report.lastUpdated}
                </Text>
            </View>

            <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">
                    Current Status
                </Text>
                <View className="flex-row items-center">
                    <View className={`w-2 h-2 rounded-full mr-2 ${getStatusBadgeColor(report.currentStatus)}`} />
                    <Text className={`text-sm font-medium ${getStatusColor(report.currentStatus)}`}>
                        {report.currentStatus}
                    </Text>
                </View>
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

                <Text className="text-xl font-semibold text-gray-900">View Status of Report</Text>

                <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <View className="px-4 py-4">
                {/* Filter Buttons */}
                <View className="flex-row gap-x-3 mb-6">
                    <TouchableOpacity
                        className={`px-6 py-3 rounded-xl flex-1 ${activeFilter === 'pending'
                            ? 'bg-[#E75B3B]'
                            : 'bg-white border border-gray-200'
                            }`}
                        onPress={() => setActiveFilter('pending')}
                    >
                        <Text className={`text-center font-medium ${activeFilter === 'pending' ? 'text-white' : 'text-gray-700'
                            }`}>
                            Pending
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`px-6 py-3 rounded-xl flex-1 ${activeFilter === 'resolved'
                            ? 'bg-orange-500'
                            : 'bg-white border border-gray-200'
                            }`}
                        onPress={() => setActiveFilter('resolved')}
                    >
                        <Text className={`text-center font-medium ${activeFilter === 'resolved' ? 'text-white' : 'text-gray-700'
                            }`}>
                            Resolved
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Reports List */}
            <ScrollView className="flex-1 px-4">
                {filteredReports.length > 0 ? (
                    <View className="pb-6">
                        {filteredReports.map(renderReportItem)}
                    </View>
                ) : (
                    <View className="flex-1 items-center justify-center py-20">
                        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                            <Text className="text-3xl">📋</Text>
                        </View>
                        <Text className="text-gray-500 text-center text-lg font-medium mb-2">
                            No {activeFilter} reports
                        </Text>
                        <Text className="text-gray-400 text-center">
                            {activeFilter === 'pending'
                                ? 'All your reports have been resolved'
                                : 'No resolved reports found'
                            }
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}