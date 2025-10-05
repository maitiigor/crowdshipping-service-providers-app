'use client';
import { AddIcon, ArrowLeftIcon, Icon, MicIcon, PhoneIcon, SendIcon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
    id: string;
    text: string;
    time: string;
    isOwn: boolean;
    status?: 'sent' | 'delivered' | 'read';
}

const mockMessages: Message[] = [
    {
        id: '1',
        text: 'Hi, good morning',
        time: '10:02 AM',
        isOwn: true,
        status: 'read',
    },
    {
        id: '2',
        text: 'I have place an order for shipping goods for today',
        time: '10:02 AM',
        isOwn: true,
        status: 'read',
    },
    {
        id: '3',
        text: 'Hi, good morning too! 😊',
        time: '11:10 AM',
        isOwn: false,
    },
    {
        id: '4',
        text: 'Alright, I\'m currently on my way to pick up your package',
        time: '11:16 AM',
        isOwn: false,
    },
];

export default function ConversationScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(mockMessages);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: message.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: true,
                status: 'sent',
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View className={`mb-4 ${item.isOwn ? 'items-end' : 'items-start'}`}>
            <View
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${item.isOwn
                    ? 'bg-orange-500 rounded-br-md'
                    : 'bg-gray-100 rounded-bl-md'
                    }`}
            >
                <Text className={`text-base ${item.isOwn ? 'text-white' : 'text-gray-900'}`}>
                    {item.text}
                </Text>
            </View>
            <View className={`flex-row items-center mt-1 ${item.isOwn ? 'flex-row-reverse' : ''}`}>
                <Text className="text-xs text-gray-500">{item.time}</Text>
                {item.isOwn && item.status && (
                    <View className="ml-2">
                        <Text className="text-xs text-gray-500">
                            {item.status === 'read' ? '✓✓' : item.status === 'delivered' ? '✓✓' : '✓'}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                    </TouchableOpacity>

                    <Text className="text-xl font-semibold text-gray-900">{name || 'Chat'}</Text>

                    <TouchableOpacity onPress={() => router.push(`./call?id=${id}&name=${name}`)}>
                        <Icon as={PhoneIcon} size="md" className="text-gray-700" />
                    </TouchableOpacity>
                </View>

                {/* Date Header */}
                <View className="items-center py-2">
                    <Text className="text-sm text-gray-500">Today</Text>
                </View>

                {/* Messages */}
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    className="flex-1 px-4"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />

                {/* Message Input */}
                <View className="flex-row items-center px-4 py-3 border-t border-gray-100">
                    <TouchableOpacity className="mr-3">
                        <Icon as={AddIcon} size="md" className="text-gray-500" />
                    </TouchableOpacity>

                    <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Send message"
                            className="flex-1 text-base"
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity className="ml-2">
                            <Icon as={MicIcon} size="sm" className="text-gray-500" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className="ml-3 bg-orange-500 w-10 h-10 rounded-full items-center justify-center"
                        onPress={sendMessage}
                    >
                        <Icon as={SendIcon} size="sm" className="text-white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}