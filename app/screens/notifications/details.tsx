import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
    AlarmClock,
    Bell,
    CalendarClock,
    ChevronLeft,
    Info,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchNotifications, markNotificationAsRead } from "../../../store/slices/notificationSlice";

dayjs.extend(relativeTime);

const NotificationDetail = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const { notificationId, title, message, type } = useLocalSearchParams<{
        notificationId: string;
        title: string;
        message: string;
        type: string;
    }>();
    const dispatch = useAppDispatch();
    const { notification, loading } = useAppSelector((state) => state.notification);

    // Use notification from Redux state if available, otherwise use params
    const notif = notification.id === notificationId ? notification : {
        id: notificationId,
        title: title || 'Notification',
        message: message || '',
        type: type || 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRead: false,
        delivered: true,
        channel: 'app',
        data: {},
        userId: '',
        triggeredById: '',
        __v: 0,
        _id: notificationId || ''
    };
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => {
                return (
                    <ThemedText type="s1_subtitle" className="text-center">
                        Notifications
                    </ThemedText>
                );
            },
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 20 }, // Increased font size
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: "#FFFFFF",
                elevation: 0, // Android
                shadowOpacity: 0, // iOS
                shadowColor: "transparent", // iOS
                borderBottomWidth: 0,
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
                            onLongPress={() => router.push("/(tabs)")}
                            onPress={() => navigation.goBack()}
                            className="p-2 rounded   flex justify-center items-center"
                        >
                            <Icon
                                as={ChevronLeft}
                                size="3xl"
                                className="text-typography-900"
                            />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            ),
            headerRight: () => <NotificationIcon />,
        });
    }, [navigation, router]);
    // Fetch all notifications on mount to ensure we have the latest data
    useEffect(() => {
        dispatch(fetchNotifications());
        dispatch(markNotificationAsRead(notificationId));
    }, [dispatch]);

    // Mark notification as read (simplified - would need API endpoint for this)
    useEffect(() => {
        if (notif && !notif.isRead) {
            // TODO: Implement mark as read API call
            console.log('Marking notification as read:', notif.id);
        }
    }, [notif?.isRead]);
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                <ThemedView className="flex-1 gap-4 px-4 mt-3">
                    {/* Hero section */}
                    {loading ? (
                        <Box className="w-full gap-4 p-4 rounded-2xl border border-background-100">
                            <HStack className="items-center gap-3">
                                <Skeleton
                                    variant="circular"
                                    className="h-12 w-12 rounded-full"
                                />
                                <SkeletonText _lines={2} gap={4} className="h-3 w-[85.5%] flex-1" />
                            </HStack>
                            <SkeletonText _lines={3} gap={4} className="h-3" />
                        </Box>
                    ) : (
                        <ThemedView className="w-full p-4 rounded-2xl border border-primary-50 bg-background-0">
                            <HStack className="items-center gap-3 mb-2">
                                <ThemedView className="h-12 w-12 rounded-full bg-primary-50 border border-primary-100 items-center justify-center">
                                    <Icon as={Bell} size="xl" className="text-primary-600" />
                                </ThemedView>
                                <ThemedView className="flex-1 min-w-0">
                                    <ThemedText
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                        type="h5_header"
                                        className="text-typography-900"
                                    >
                                        {notif?.title || "Notification"}
                                    </ThemedText>
                                    <ThemedText type="c2_caption" className="text-typography-600">
                                        {notif
                                            ? dayjs(notif.updatedAt || notif.createdAt).fromNow()
                                            : ""}
                                    </ThemedText>
                                </ThemedView>
                            </HStack>

                            {notif?.message ? (
                                <ThemedText type="b3_body" className="text-typography-700 mt-2">
                                    {notif.message}
                                </ThemedText>
                            ) : null}

                            {/* Status chips */}
                            <HStack className="flex-wrap gap-2 mt-3">
                                {notif?.type ? (
                                    <ThemedView className="px-3 py-1 rounded-full bg-secondary-50 border border-secondary-100">
                                        <ThemedText
                                            type="c2_caption"
                                            className="text-secondary-700"
                                        >
                                            Type: {notif.type}
                                        </ThemedText>
                                    </ThemedView>
                                ) : null}
                                {notif?.channel ? (
                                    <ThemedView className="px-3 py-1 rounded-full bg-primary-50 border border-primary-100">
                                        <ThemedText type="c2_caption" className="text-primary-700">
                                            Channel: {notif.channel}
                                        </ThemedText>
                                    </ThemedView>
                                ) : null}
                                <ThemedView className="px-3 py-1 rounded-full bg-success-50 border border-success-100">
                                    <ThemedText type="c2_caption" className="text-success-700">
                                        {notif?.isRead ? "Read" : "Unread"}
                                    </ThemedText>
                                </ThemedView>
                                <ThemedView className="px-3 py-1 rounded-full bg-warning-50 border border-warning-100">
                                    <ThemedText type="c2_caption" className="text-warning-700">
                                        {notif?.delivered ? "Delivered" : "Not delivered"}
                                    </ThemedText>
                                </ThemedView>
                            </HStack>
                        </ThemedView>
                    )}

                    {/* Meta information */}
                    {loading ? (
                        <Box className="w-full gap-4 p-4 rounded-2xl border border-background-100">
                            <SkeletonText _lines={1} className="h-3 w-1/3" />
                            <SkeletonText _lines={3} gap={4} className="h-3" />
                        </Box>
                    ) : (
                        <ThemedView className="border border-background-100 rounded-2xl p-4 bg-background-0 gap-4">
                            <ThemedText type="btn_giant" className="text-typography-800">
                                Details
                            </ThemedText>
                            <ThemedView className="gap-3">
                                <HStack className="justify-between items-center">
                                    <ThemedText type="btn_medium" className="text-typography-600">
                                        Notification ID
                                    </ThemedText>
                                    <ThemedText type="btn_medium" className="text-typography-900">
                                        {notif?._id ?? notificationId}
                                    </ThemedText>
                                </HStack>
                                {(notif?.data as any)?.bookingId || (notif?.data as any)?.booking ? (
                                    <HStack className="justify-between items-center">
                                        <ThemedText
                                            type="btn_medium"
                                            className="text-typography-600"
                                        >
                                            Related Booking
                                        </ThemedText>
                                        <ThemedText
                                            type="btn_medium"
                                            className="text-typography-900"
                                        >
                                            {(notif?.data as any)?.bookingId || (notif?.data as any)?.booking}
                                        </ThemedText>
                                    </HStack>
                                ) : null}
                                {notif?.triggeredById ? (
                                    <HStack className="justify-between items-center">
                                        <ThemedText
                                            type="btn_medium"
                                            className="text-typography-600"
                                        >
                                            Triggered By
                                        </ThemedText>
                                        <ThemedText
                                            type="btn_medium"
                                            className="text-typography-900"
                                        >
                                            {notif?.triggeredById}
                                        </ThemedText>
                                    </HStack>
                                ) : null}
                                <HStack className="justify-between items-center">
                                    <HStack className="items-center gap-2">
                                        <Icon
                                            as={CalendarClock}
                                            size="md"
                                            className="text-typography-600"
                                        />
                                        <ThemedText
                                            type="btn_medium"
                                            className="text-typography-600"
                                        >
                                            Created
                                        </ThemedText>
                                    </HStack>
                                    <ThemedText type="btn_medium" className="text-typography-900">
                                        {notif
                                            ? dayjs(notif.createdAt).format("MMM D, YYYY h:mm A")
                                            : ""}
                                    </ThemedText>
                                </HStack>
                                <HStack className="justify-between items-center">
                                    <HStack className="items-center gap-2">
                                        <Icon
                                            as={AlarmClock}
                                            size="md"
                                            className="text-typography-600"
                                        />
                                        <ThemedText
                                            type="btn_medium"
                                            className="text-typography-600"
                                        >
                                            Updated
                                        </ThemedText>
                                    </HStack>
                                    <ThemedText type="btn_medium" className="text-typography-900">
                                        {notif
                                            ? dayjs(notif.updatedAt).format("MMM D, YYYY h:mm A")
                                            : ""}
                                    </ThemedText>
                                </HStack>
                            </ThemedView>
                        </ThemedView>
                    )}

                    {/* CTA to Booking (if available) */}
                    {!loading && ((notif?.data as any)?.bookingId || (notif?.data as any)?.booking) ? (
                        <Button
                            action="primary"
                            size="3xl"
                            className="mt-2 rounded-xl"
                            onPress={() => {
                                const bookingId =
                                    (notif?.data as any)?.bookingId || (notif?.data as any)?.booking;
                                if (bookingId) {
                                    router.push({
                                        pathname: "/screens/bookings/booking-detail",
                                        params: { id: bookingId as string },
                                    });
                                }
                            }}
                        >
                            <ButtonIcon as={Info} />
                            <ButtonText size="lg">View booking</ButtonText>
                        </Button>
                    ) : null}

                    {/* Helper note */}
                    {!loading && !notif && (
                        <ThemedView className="p-4 rounded-xl bg-error-50 border border-error-100">
                            <ThemedText type="b3_body" className="text-error-700">
                                Could not load this notification. Please go back and try again.
                            </ThemedText>
                        </ThemedView>
                    )}
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default NotificationDetail;
