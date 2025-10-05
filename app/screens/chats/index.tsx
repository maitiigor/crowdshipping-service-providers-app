'use client';
import { ArrowLeftIcon, BellIcon, Icon, PhoneIcon, SearchIcon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChatItem {
    id: string;
    name: string;
    message: string;
    time: string;
    avatar: string;
    unreadCount?: number;
    status?: 'delivered' | 'read' | 'sent';
}

interface CallItem {
    id: string;
    name: string;
    type: 'incoming' | 'outgoing' | 'missed';
    time: string;
    date: string;
    avatar: string;
}

const mockChats: ChatItem[] = [
    {
        id: '1',
        name: 'Segun Johnson',
        message: 'Hi, Good morning sir',
        time: '09:45',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        unreadCount: 2,
    },
    {
        id: '2',
        name: 'Jasion Johan',
        message: 'Exactly as packed',
        time: '09:45',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    {
        id: '3',
        name: 'Femi Branch',
        message: 'Delivered',
        time: '01:45',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        unreadCount: 1,
        status: 'delivered',
    },
    {
        id: '4',
        name: 'Abiola Sulaimon',
        message: 'Reject',
        time: 'Yesterday',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
        id: '5',
        name: 'Daniel Regha',
        message: 'hey, call me Asap',
        time: 'Nov, 23, 2024',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
        id: '6',
        name: 'Biola Kazzeem',
        message: 'Yes, meet me there...',
        time: 'June 23, 2024',
        avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
        unreadCount: 1,
    },
];

const mockCalls: CallItem[] = [
    {
        id: '1',
        name: 'Segun Johnson',
        type: 'outgoing',
        time: 'Jun 10, 2025',
        date: 'Jun 10, 2025',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
        id: '2',
        name: 'Jasion Johan',
        type: 'incoming',
        time: 'Jun 10, 2025',
        date: 'Jun 10, 2025',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    {
        id: '3',
        name: 'Femi Branch',
        type: 'outgoing',
        time: 'Jun 10, 2025',
        date: 'Jun 10, 2025',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
        id: '4',
        name: 'Abiola Sulaimon',
        type: 'outgoing',
        time: 'Jun 10, 2025',
        date: 'Jun 10, 2025',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
        id: '5',
        name: 'Daniel Regha',
        type: 'outgoing',
        time: 'Jun 10, 2025',
        date: 'Jun 10, 2025',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
        id: '6',
        name: 'Biola Kazzeem',
        type: 'outgoing',
        time: 'Jun 10, 2025',
        date: 'Jun 10, 2025',
        avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    },
];

export default function ChatsScreen() {
    const [activeTab, setActiveTab] = useState<'chats' | 'calls'>('chats');

    const renderChatItem = ({ item }: { item: ChatItem }) => (
        <TouchableOpacity
            className="flex-row items-center px-4 py-3 border-b border-gray-100"
            onPress={() => router.push(`/screens/chats/conversation`)}
        >
            <View className="relative">
                <Image
                    source={{ uri: item.avatar }}
                    className="w-12 h-12 rounded-full"
                />
                {item.unreadCount && (
                    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                        <Text className="text-white text-xs font-medium">{item.unreadCount}</Text>
                    </View>
                )}
            </View>

            <View className="flex-1 ml-3">
                <View className="flex-row justify-between items-center">
                    <Text className="font-semibold text-gray-900 text-base">{item.name}</Text>
                    <Text className="text-gray-500 text-sm">{item.time}</Text>
                </View>
                <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>
                    {item.message}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderCallItem = ({ item }: { item: CallItem }) => (
        <TouchableOpacity
            className="flex-row items-center px-4 py-3 border-b border-gray-100"
            onPress={() => router.push(`/screens/chats/call`)}
        >
            <View className="relative">
                <Image
                    source={{ uri: item.avatar }}
                    className="w-12 h-12 rounded-full"
                />
                <View className="absolute -bottom-1 -right-1">
                    <Icon
                        as={item.type === 'incoming' ? ArrowLeftIcon : ArrowLeftIcon}
                        size="sm"
                        className={`${item.type === 'incoming' ? 'text-green-500' : 'text-red-500'
                            } transform ${item.type === 'outgoing' ? 'rotate-180' : ''}`}
                    />
                </View>
            </View>

            <View className="flex-1 ml-3">
                <View className="flex-row justify-between items-center">
                    <Text className="font-semibold text-gray-900 text-base">{item.name}</Text>
                    <TouchableOpacity className="p-2">
                        <Icon as={PhoneIcon} size="sm" className="text-red-500" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center mt-1">
                    <Text className={`text-sm ${item.type === 'incoming' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {item.type === 'incoming' ? '↙' : '↗'} {item.type === 'incoming' ? 'Incoming' : 'Outgoing'}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-2">{item.time}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Inbox</Text>

                <View className="flex-row items-center space-x-4">
                    <TouchableOpacity>
                        <Icon as={SearchIcon} size="md" className="text-gray-700" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon as={BellIcon} size="md" className="text-gray-700" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row mx-4 mt-4 mb-2">
                <TouchableOpacity
                    className={`flex-1 py-3 px-6 rounded-full mr-2 ${activeTab === 'chats'
                        ? 'bg-orange-500'
                        : 'bg-gray-100 border border-orange-500'
                        }`}
                    onPress={() => setActiveTab('chats')}
                >
                    <Text className={`text-center font-medium ${activeTab === 'chats' ? 'text-white' : 'text-orange-500'
                        }`}>
                        Chats
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-1 py-3 px-6 rounded-full ml-2 ${activeTab === 'calls'
                        ? 'bg-orange-500'
                        : 'bg-gray-100 border border-orange-500'
                        }`}
                    onPress={() => setActiveTab('calls')}
                >
                    <Text className={`text-center font-medium ${activeTab === 'calls' ? 'text-white' : 'text-orange-500'
                        }`}>
                        Calls
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="flex-1">
                {activeTab === 'chats' ? (
                    <FlatList
                        data={mockChats}
                        renderItem={renderChatItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <FlatList
                        data={mockCalls}
                        renderItem={renderCallItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Update Button */}
            <View className="px-4 pb-4">
                <TouchableOpacity className="bg-orange-500 py-4 rounded-full flex-row items-center justify-center">
                    <Text className="text-white font-semibold text-base mr-2">Update</Text>
                    <Icon as={ArrowLeftIcon} size="sm" className="text-white transform rotate-180" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}