'use client';
import { Icon } from '@/components/ui/icon';
import dayjs from 'dayjs';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ChevronLeft, MessageCircleCode, MessageCircleMore } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationIcon from '../../../components/Custom/NotificationIcon';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { useThemeColor } from '../../../hooks/useThemeColor';

export default function ReportDetailsScreen() {
    const params = useLocalSearchParams();

    const reportData = {
        id: params.id as string || '1',
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

    const navigation = useNavigation();
    const color = useThemeColor({},'text');
    const background = useThemeColor({},'background');

     useEffect(() => {
                navigation.setOptions({
                    headerShown: true,
                    headerTitle: () => {
                        return (
                            <ThemedText type="s1_subtitle" className="text-center font-bold text-xl">
                                Report
                            </ThemedText>
                        );
                    },
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontSize: 20 }, // Increased font size
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: background,
                        elevation: 0, // Android
                        shadowOpacity: 0, // iOS
                        shadowColor: "transparent", // iOS
                        borderBottomWidth: 0,
                        color: color
                    },
                    headerLeft: () => (
                        <ThemedView
                            style={{
                                shadowColor: "#FDEFEB1A",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.102,
                                shadowRadius: 3,
                                elevation: 4,
                            }}
                        >
                            <ThemedView
                                style={{
                                    shadowColor: "#0000001A",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.102,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    className="p-2 rounded   flex justify-center items-center"
                                >
                                    <Icon
                                        as={ChevronLeft}
                                        size="3xl"
                                        color={color}
                                        className="text-typography-900"
                                    />
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>
                    ),
                    headerRight: () => (
                        
                        
                        <NotificationIcon />
                     
                    ),
                });
            }, [navigation, router]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
           

            <ScrollView className="flex-1 px-4 py-6">
                {/* Report Frame */}
                <ThemedView className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                 
                    {/* Report ID */}
                    <ThemedView className="flex-row items-center justify-between mb-4">
                        <ThemedText className="label_text">
                            Report ID
                        </ThemedText>
                        <ThemedText className="b2_body font-semibold">
                            {reportData.reportId}
                        </ThemedText>
                    </ThemedView>

                    {/* Date Submitted */}
                    <ThemedView className="flex-row items-center justify-between mb-4">
                        <ThemedText className="label_text">
                            Date Submitted
                        </ThemedText>
                        <ThemedText className="b2_body font-semibold">
                            {dayjs(reportData.lastUpdated).format('DD/MM/YYYY')}
                        </ThemedText>
                    </ThemedView>

                    {/* Brief Description */}
                    <ThemedView className="mb-4">
                        <ThemedText className="label_text mb-2">
                            Brief Description
                        </ThemedText>
                        <ThemedText className="b2_body font-semibold">
                            {reportData.description}
                        </ThemedText>
                    </ThemedView>

                    {/* Current Status */}
                    <ThemedView className="flex-row items-center justify-between mb-4">
                        <ThemedText className="label_text">
                            Current Status
                        </ThemedText>
                        <ThemedView className="flex-row items-center">
                            <ThemedView className={`w-2 h-2 rounded-full mr-2 ${getStatusBadgeColor(reportData.currentStatus)}`} />
                            <ThemedText className={`b2_body font-semibold ${getStatusColor(reportData.currentStatus)}`}>
                                {reportData.currentStatus}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    {/* Last Updated Date */}
                    <ThemedView className="flex-row items-center justify-between mb-4">
                        <ThemedText className="label_text">
                            Last Updated Date
                        </ThemedText>
                        <ThemedText className="b2_body">
                            {dayjs(reportData.lastUpdated).format('DD/MM/YYYY')}
                        </ThemedText>
                    </ThemedView>

                    {/* Support Team */}
                    <ThemedView className="flex-row items-center justify-between">
                        <ThemedText className="label_text">
                            Support Team
                        </ThemedText>
                        <ThemedText className="b2_body font-semibold">
                            {reportData.supportTeam}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Action Buttons */}
                <ThemedView className="flex flex-row justify-between">
                    {/* Back Button */}
                    {/* Live Chat Button */}
                    <TouchableOpacity
                        className="border-[#E75B3B] px-6 w-40 border py-4 rounded-xl flex-row items-center justify-center"
                        onPress={() => { router.back(); }}
                    >
                        <ThemedText className="text-[#E75B3B] font-semibold text-base">
                            Back
                        </ThemedText>
                    </TouchableOpacity>

                    {/* Live Chat Button */}
                    {
                        reportData.currentStatus === "pending" ? (
                    <TouchableOpacity
                        className="bg-[#E75B3B] py-4 w-16 rounded-full flex-row items-center justify-center"
                        onPress={handleLiveChat}
                    >
                        {
                           (
                                <Icon
                                    as={MessageCircleMore}
                                    size="xl"
                                    color="white"
                                />                           
                               
                            ) 
                        }
                    </TouchableOpacity>
                        ) : null
                    }
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}