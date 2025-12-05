'use client';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon, SearchIcon } from '@/components/ui/icon';
import dayjs from 'dayjs';
import { router, useNavigation } from 'expo-router';
import { Box, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import NotificationIcon from '../../../components/Custom/NotificationIcon';
import ParallaxScrollView from '../../../components/Custom/ParallaxScrollView';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { HStack } from '../../../components/ui/hstack';
import { Skeleton, SkeletonText } from '../../../components/ui/skeleton';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Report } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchReports } from '../../../store/slices/reportSlice';




export default function ReportsScreen() {
  //  const [reports, setReports] = useState<Report[]>(mockReports);
    const [activeFilter, setActiveFilter] = useState<'pending' | 'resolved' | string>('pending');

    const { reports, loading } =  useAppSelector((state) => state.report);

    const dispatch = useAppDispatch();


    useEffect(() => {
       dispatch(fetchReports());
    }, [dispatch])
    

    const filteredReports = activeFilter === 'pending'
        ? reports.filter(report => report.status === 'pending')
        : reports.filter(report => report.status === 'resolved');

    const getStatusColor = (status: string) => {
        return status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-primary-500 text-white';
    };

    const navigation = useNavigation();
    const color = useThemeColor({}, 'text');
    const background = useThemeColor({}, 'background');

    const getStatusBadgeColor = (status: string) => {
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
                        id: report.id,
                        reportId: report.reportRef,
                        type: report.reportType,
                        description: report.description,
                        status: report.status,
                        lastUpdated: report.updatedAt,
                        currentStatus: report.status
                    }
                });
            }}
        >
            <ThemedView className="gap-y-3">
                {/* Row 1: Report ID */}
                <HStack className="justify-between items-center">
                    <ThemedText className="text-gray-500 text-sm font-normal" style={{ fontFamily: 'Poppins-Light' }}>
                        Report ID
                    </ThemedText>
                    <ThemedText className="font-semibold text-base text-gray-900">
                        {report.reportRef || `#REP-${report.id.substring(0, 6)}`}
                    </ThemedText>
                </HStack>

                {/* Row 2: Last Updated Date */}
                <HStack className="justify-between items-center">
                    <ThemedText className="text-gray-500 w-1/3 text-xs font-normal" style={{ fontFamily: 'Poppins-Light' }}>
                        Last Updated Date
                    </ThemedText>
                    <ThemedText className="font-semibold text-xs text-gray-900">
                        {dayjs(report.updatedAt).format('MMMM DD, YYYY | hh:mmA')}
                    </ThemedText>
                </HStack>

                {/* Row 3: Current Status */}
                <HStack className="justify-between items-center">
                    <ThemedText className="text-gray-500 text-xs font-normal" style={{ fontFamily: 'Poppins-Light' }}>
                        Current Status
                    </ThemedText>
                    <ThemedView className={`px-3 py-1.5 rounded-full`}>
                        <View className={`w-40 rounded-full ${report.status === 'resolved' ? 'bg-[#CDF5E0]' : 'bg-[#FDEFEB]'} items-center`}>

                            <Text className={` p-2 ${report.status === 'resolved' ? 'text-[#009A49]' : 'text-[#FF5107]'}`} style={{ fontFamily: 'Inter-Regular' }}>
                                {report.status === 'resolved' ? 'Resolved' : 'Under Review'}
                            </Text>
                        </View>
                    </ThemedView>
                </HStack>
            </ThemedView>   
        </TouchableOpacity>
    );

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
                    <ThemedView className="flex-row items-center gap-x-4">
                         <TouchableOpacity>
                            <Icon as={SearchIcon} size="xl" className="text-typography-900" />
                        </TouchableOpacity>
                        <NotificationIcon />
                    </ThemedView>
                ),
            });
        }, [navigation, router]);
    

    return (
      <ParallaxScrollView
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}>
        


                {/* Add New Button */}
                <Button
                    className="bg-[#E75B3B] mb-6 rounded-xl h-12"
                    onPress={() => router.push('/screens/reports/new')}
                >
                    <ButtonText className="text-white font-semibold text-base">Add New</ButtonText>
                </Button>

                {/* Filter Buttons */}
                <ThemedView className="flex-row mb-6 gap-x-4">

                    <TouchableOpacity
                        className={`py-3 rounded-xl flex-1 ${activeFilter === 'pending'
                            ? 'bg-[#FDEFEB]'
                            : 'bg-white border border-[#E75B3B]'
                            }`}
                        onPress={() => setActiveFilter('pending')}
                    >
                        <Text className={`text-center font-medium ${activeFilter === 'pending' ? 'text-[#E75B3B]' : 'text-[#E75B3B]'
                            }`}>
                            Pending
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`py-3 rounded-xl flex-1 ${activeFilter === 'resolved'
                            ? 'bg-[#FDEFEB]'
                            : 'bg-white border border-[#E75B3B]'
                            }`}
                        onPress={() => setActiveFilter('resolved')}
                    >
                        <Text className={`text-center font-medium ${activeFilter === 'resolved' ? 'text-[#E75B3B]' : 'text-[#E75B3B]'
                            }`}>
                            Resolved
                        </Text>
                    </TouchableOpacity>

                </ThemedView>

                {/* Reports List */}
                     <ThemedView className="flex-1 pb-20 overflow-hidden">
                {loading ? (
                    
                    Array.from({ length: 7 }).map((_: any, index: number) => (
                <ThemedView key={index} className="w-full">
                    <Box className="w-full gap-4 p-3 rounded-md ">
                        <SkeletonText _lines={3} className="h-2" />
                        <HStack className="gap-1 align-middle">
                            <Skeleton
                                variant="circular"
                                className="h-[24px] w-[28px] mr-2"
                            />
                            <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
                        </HStack>
                    </Box>
                </ThemedView>
            ))
                ) : filteredReports.length > 0 ? (
                    <ThemedView className="flex-1">
                        {filteredReports.map(renderReportItem)}
                    </ThemedView>
                ) : (
                    <ThemedView className="flex-1 items-center justify-center mt-10">
                        <ThemedText className="text-gray-400 text-center text-lg font-medium">
                            No reports Available
                        </ThemedText>
                    </ThemedView>
                )}
                </ThemedView>

           
        </ParallaxScrollView>
    );
}