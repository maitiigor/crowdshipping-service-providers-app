'use client';
import { Button, ButtonText } from '@/components/ui/button';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ReportStatus = 'resolved' | 'pending';

interface Report {
    id: string;
    reportId: string;
    type: string;
    description: string;
    status: ReportStatus;
    lastUpdated: string;
    currentStatus: string;
}

const mockReports: Report[] = [
    {
        id: '1',
        reportId: 'ID4927393',
        type: 'Delivery Issue',
        description: 'Package was damaged during transit',
        status: 'pending',
        lastUpdated: 'June 14, 2024 | 09:23PM',
        currentStatus: 'Under Review'
    },
    {
        id: '2',
        reportId: 'ID4927394',
        type: 'Payment Issue',
        description: 'Payment not received for completed delivery',
        status: 'resolved',
        lastUpdated: 'June 13, 2024 | 02:15PM',
        currentStatus: 'Resolved'
    },
    {
        id: '3',
        reportId: 'ID4927395',
        type: 'Customer Complaint',
        description: 'Customer was unsatisfied with delivery time',
        status: 'pending',
        lastUpdated: 'June 12, 2024 | 11:30AM',
        currentStatus: 'Under Review'
    }
];

export default function ReportsScreen() {
    const [reports, setReports] = useState<Report[]>(mockReports);
    const [activeFilter, setActiveFilter] = useState<'all' | ReportStatus>('all');

    const filteredReports = activeFilter === 'all'
        ? reports
        : reports.filter(report => report.status === activeFilter);

    const getStatusColor = (status: ReportStatus) => {
        return status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700';
    };

    const getStatusBadgeColor = (status: ReportStatus) => {
        return status === 'resolved' ? 'bg-green-500' : 'bg-orange-500';
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
                        type: report.type,
                        description: report.description,
                        status: report.status,
                        lastUpdated: report.lastUpdated,
                        currentStatus: report.currentStatus
                    }
                });
            }}
        >
            <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-1">
                        Report ID: {report.reportId}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-1">
                        {report.type}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        {report.description}
                    </Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                    <Text className="text-xs font-medium">
                        {report.status === 'resolved' ? 'Resolved' : 'Pending'}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <Text className="text-xs text-gray-500">
                    Last Updated: {report.lastUpdated}
                </Text>
                <View className="flex-row items-center">
                    <View className={`w-2 h-2 rounded-full mr-2 ${getStatusBadgeColor(report.status)}`} />
                    <Text className="text-xs text-gray-600 font-medium">
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

                <Text className="text-xl font-semibold text-gray-900">Report</Text>

                <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Add New Button */}
                <Button
                    className="bg-[#E75B3B] mb-6"
                    onPress={() => router.push('/screens/reports/new')}
                >
                    <ButtonText className="text-white font-semibold">Add New</ButtonText>
                </Button>

                {/* Filter Buttons */}
                <View className="flex-row mb-6 gap-x-3">
                    <TouchableOpacity
                        className={`px-6 py-3 rounded-xl flex-1 ${activeFilter === 'resolved'
                            ? 'bg-[#E75B3B]'
                            : 'bg-white border border-gray-200'
                            }`}
                        onPress={() => setActiveFilter('resolved')}
                    >
                        <Text className={`text-center font-medium ${activeFilter === 'resolved' ? 'text-white' : 'text-gray-700'
                            }`}>
                            Resolved
                        </Text>
                    </TouchableOpacity>

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
                </View>

                {/* Reports List */}
                {filteredReports.length > 0 ? (
                    <View>
                        {filteredReports.map(renderReportItem)}
                    </View>
                ) : (
                    <View className="flex-1 items-center justify-center py-20">
                        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                            <Text className="text-3xl">📋</Text>
                        </View>
                        <Text className="text-gray-500 text-center text-lg font-medium mb-2">
                            No reports Available
                        </Text>
                        <Text className="text-gray-400 text-center">
                            Create your first report to get started
                        </Text>
                    </View>
                )}

                {/* View Status Button */}
                {reports.length > 0 && (
                    <TouchableOpacity
                        className="bg-white border border-[#E75B3B] py-4 rounded-xl mt-6"
                        onPress={() => router.push('/screens/reports/status')}
                    >
                        <Text className="text-[#E75B3B] font-semibold text-center">
                            View Status of Report
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}