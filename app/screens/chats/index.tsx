import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { EmptyState } from "@/components/Custom/EmptyState";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
    Avatar,
    AvatarFallbackText,
    AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChevronLeft, MessageCircle, Phone } from "lucide-react-native";
import NotificationIconComponent from "../../../components/NotificationIconComponent";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchConversations } from "../../../store/slices/conversationSlice";

// dayjs fromNow plugin
dayjs.extend(relativeTime);

// Mock calls data - replace with actual API data later
const mockCalls = [
    {
        id: "1",
        name: "John Doe",
        type: "incoming",
        duration: "2:34",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
        id: "2",
        name: "Jane Smith",
        type: "outgoing",
        duration: "1:45",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
        id: "3",
        name: "Mike Johnson",
        type: "missed",
        duration: "0:00",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
];

// CallsList component
const CallsList = () => {
    const router = useRouter();

    const getCallIcon = (type: string) => {
        switch (type) {
            case "incoming":
                return Phone;
            case "outgoing":
                return Phone;
            case "missed":
                return Phone;
            default:
                return Phone;
        }
    };

    const getCallIconColor = (type: string) => {
        switch (type) {
            case "incoming":
                return "text-green-600";
            case "outgoing":
                return "text-blue-600";
            case "missed":
                return "text-red-600";
            default:
                return "text-typography-600";
        }
    };

    return (
        <FlatList
            data={mockCalls}
            ListEmptyComponent={
                <EmptyState
                    title="No calls"
                    description="You have no call history at the moment."
                    icon={Phone}
                    className="mt-10"
                />
            }
            contentContainerClassName="pb-20"
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => {
                        router.push({
                            pathname: "/screens/chats/call",
                            params: {
                                id: item.id,
                                name: item.name,
                            },
                        });
                    }}
                    className="flex-row justify-between items-center p-4"
                >
                    <ThemedView className="flex-row items-center gap-2 flex-1 min-w-0">
                        <Avatar size="lg">
                            <AvatarFallbackText>
                                {item.name}
                            </AvatarFallbackText>
                            <AvatarImage
                                source={{
                                    uri: item.profileImage,
                                }}
                            />
                        </Avatar>
                        <ThemedView className="flex-1 min-w-0">
                            <ThemedView className="flex-row gap-5 justify-between items-center">
                                <ThemedText
                                    type="b2_body"
                                    className="flex-wrap"
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {item.name}
                                </ThemedText>
                                <ThemedText type="btn_medium" className="">
                                    {dayjs(item.timestamp)
                                        .fromNow()
                                        .replace(/\bminutes\b/g, "mins")
                                        .replace(/\bminute\b/g, "min")
                                        .replace(/\bseconds\b/g, "secs")
                                        .replace(/\bsecond\b/g, "sec")}
                                </ThemedText>
                            </ThemedView>
                            <ThemedView className="flex-row pt-1 gap-5 items-center justify-between">
                                <ThemedView className="flex-row items-center gap-2">
                                    <Icon
                                        as={getCallIcon(item.type)}
                                        size="sm"
                                        className={getCallIconColor(item.type)}
                                    />
                                    <ThemedText
                                        type="default"
                                        className={`capitalize ${item.type === "missed" ? "text-red-600" : "text-typography-700"
                                            }`}
                                    >
                                        {item.type} • {item.duration}
                                    </ThemedText>
                                </ThemedView>
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push({
                                            pathname: "/screens/chats/call",
                                            params: {
                                                id: item.id,
                                                name: item.name,
                                            },
                                        });
                                    }}
                                >
                                    <Icon
                                        as={Phone}
                                        size="lg"
                                        className="text-primary-500"
                                    />
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
        />
    );
};
export default function ChatScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState("chats");
    const dispatch = useAppDispatch();
    const { conversations, loading: isLoading, isRefetching: refetch, isFetching } = useAppSelector((state) => state.conversation);
    useEffect(() => {
        dispatch(fetchConversations());
    }, [dispatch]);
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => {
                return (
                    <ThemedText type="s1_subtitle" className="text-center">
                        Inbox
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
            headerRight: () => <NotificationIconComponent />,
        });
    }, [navigation, router]);
    useEffect(() => {
        // Ensure "chats" is active when the screen mounts and every time it gains focus
        setSelectedFilter("chats");
        const unsubscribe = navigation.addListener("focus", () => {
            setSelectedFilter("chats");
        });
        return unsubscribe;
    }, [navigation]);
    // i want to refetch the notifications when the user comes back to this screen
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            // The screen is focused
            // Call any action
            // refetch();
        });

        return unsubscribe;
    }, [navigation, refetch]);
    const filterList = [
        {
            label: "Chats",
            value: "chats",
            onPress: () => {
                setSelectedFilter("chats");
            },
        },
        {
            label: "Calls",
            value: "calls",
            onPress: () => {
                setSelectedFilter("calls");
            },
        },
    ];
    return (
        <ThemedView className="flex-1 bg-white pt-3">
            <ThemedView className="flex-1 pb-20 px-[18px] overflow-hidden">
                <ThemedView className="mt-5 flex-row gap-3">
                    {filterList.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setSelectedFilter(item.value as string);
                                item.onPress();
                            }}
                            className={`border-2 flex-1 p-3 border-primary-500 rounded-xl ${selectedFilter === item.value ? "bg-primary-500" : ""
                                }`}
                        >
                            <ThemedText
                                type="s2_subtitle"
                                className={` text-center ${selectedFilter === item.value
                                    ? "text-white"
                                    : "text-primary-500"
                                    }`}
                            >
                                {item.label}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </ThemedView>
                <ThemedView className="mt-5">
                    {selectedFilter === "chats" ? (
                        // Chats Content
                        isLoading ? (
                            Array.from({ length: 10 }).map((_: any, index: number) => {
                                console.log("render item", index);
                                return (
                                    <ThemedView key={index} className="w-full">
                                        <Box className="w-full gap-4 py-3 rounded-md ">
                                            <HStack className="gap-1 align-middle">
                                                <Skeleton
                                                    variant="circular"
                                                    className="h-[44px] w-[45px] mr-2"
                                                />
                                                <SkeletonText
                                                    _lines={2}
                                                    gap={4}
                                                    className="h-2 w-[82%] flex-1"
                                                />
                                                <SkeletonText _lines={1} className="h-2" />
                                            </HStack>
                                        </Box>
                                    </ThemedView>
                                );
                            })
                        ) : (
                            <FlatList
                                data={conversations}
                                refreshing={isFetching}
                                onRefresh={() => {
                                    //  refetch();
                                }}
                                ListEmptyComponent={
                                    <EmptyState
                                        title="No chats"
                                        description="You have no chats at the moment. Start a conversation to get started."
                                        icon={MessageCircle}
                                        className="mt-10"
                                    />
                                }
                                contentContainerClassName="pb-20"
                                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            router.push({
                                                pathname: "/screens/chats/chat-detail",
                                                params: {
                                                    id: item?.conversationId,
                                                    participantName: item.participant.fullName,
                                                },
                                            });
                                        }}
                                        className={` flex-row justify-between items-center p-4`}
                                    >
                                        {/* Make this container flexible and allow children to shrink */}
                                        <ThemedView className="flex-row items-center gap-2 flex-1 min-w-0">
                                            <Avatar size="lg">
                                                <AvatarFallbackText>
                                                    {item.participant.fullName}
                                                </AvatarFallbackText>
                                                <AvatarImage
                                                    source={{
                                                        uri: item?.participant.profileImage,
                                                    }}
                                                />
                                            </Avatar>
                                            {/* Ensure the text area can wrap/shrink */}
                                            <ThemedView className="flex-1 min-w-0">
                                                <ThemedView className="flex-row gap-5 justify-between items-center">
                                                    <ThemedText
                                                        type="b2_body"
                                                        className="flex-wrap"
                                                        numberOfLines={2}
                                                        ellipsizeMode="tail"
                                                    >
                                                        {item.participant.fullName}
                                                    </ThemedText>
                                                    <ThemedText type="btn_medium" className="">
                                                        {dayjs(item.lastMessageAt)
                                                            .fromNow()
                                                            .replace(/\bminutes\b/g, "mins")
                                                            .replace(/\bminute\b/g, "min")
                                                            .replace(/\bseconds\b/g, "secs")
                                                            .replace(/\bsecond\b/g, "sec")}
                                                    </ThemedText>
                                                </ThemedView>
                                                <ThemedView className="flex-row pt-1 gap-5 items-center justify-between">
                                                    <ThemedText
                                                        type="default"
                                                        className="text-typography-700 flex-1 capitalize"
                                                    >
                                                        {item.lastMessage.length > 30
                                                            ? item.lastMessage.substring(0, 30) + "..."
                                                            : item.lastMessage || "No messages yet"}
                                                    </ThemedText>

                                                    {item.unreadCount > 0 && (
                                                        <ThemedView className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                                            <ThemedText type="btn_tiny" className="text-white">
                                                                {item.unreadCount}
                                                            </ThemedText>
                                                        </ThemedView>
                                                    )}
                                                </ThemedView>
                                            </ThemedView>
                                        </ThemedView>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item?.conversationId.toString()}
                            />
                        )
                    ) : (
                        // Calls Content
                        <CallsList />
                    )}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}
