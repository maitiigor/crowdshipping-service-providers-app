'use client';
import { AddIcon, ArrowLeftIcon, Icon, MicIcon, PhoneIcon, SendIcon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';

interface Message {
    id: string;
    text: string;
    time: string;
    isOwn: boolean;
    status?: 'sent' | 'delivered' | 'read';
}

const mockSupportMessages: Message[] = [
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

export default function LiveChatScreen() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(mockSupportMessages);

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

            // Simulate support response after a delay
            setTimeout(() => {
                const supportResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'Thank you for contacting support. How can I help you today?',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: false,
                };
                setMessages(prev => [...prev, supportResponse]);
            }, 2000);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <ThemedView className={`mb-4 ${item.isOwn ? 'items-end' : 'items-start'}`}>
            <ThemedView
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${item.isOwn
                    ? 'bg-[#E75B3B] rounded-br-md'
                    : 'bg-gray-100 rounded-bl-md'
                    }`}
            >
                <ThemedText className={`text-base ${item.isOwn ? 'text-white' : 'text-gray-900'}`}>
                    {item.text}
                </ThemedText>
            </ThemedView>
            <ThemedView className={`flex-row items-center mt-1 ${item.isOwn ? 'flex-row-reverse' : ''}`}>
                <ThemedText className="text-xs text-gray-500">{item.time}</ThemedText>
                {item.isOwn && item.status && (
                    <ThemedView className="ml-2">
                        <ThemedText className="text-xs text-gray-500">
                            {item.status === 'read' ? '✓✓' : item.status === 'delivered' ? '✓✓' : '✓'}
                        </ThemedText>
                    </ThemedView>
                )}
            </ThemedView>
        </ThemedView >
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                    </TouchableOpacity>

                    <ThemedText className="text-xl font-semibold text-gray-900">Support</ThemedText>

                    <TouchableOpacity onPress={() => {
                        // Could implement voice call to support
                        console.log('Call support');
                    }}>
                        <Icon as={PhoneIcon} size="md" className="text-gray-700" />
                    </TouchableOpacity>
                </ThemedView>

                {/* Date Header */}
                <ThemedView className="items-center py-2">
                    <ThemedText className="text-sm text-gray-500">Today</ThemedText>
                </ThemedView>

                {/* Support Info Banner */}
                <ThemedView className="mx-4 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <ThemedText className="text-blue-800 font-medium text-sm mb-1">
                        🎧 Live Support Chat
                    </ThemedText>
                    <ThemedText className="text-blue-700 text-xs">
                        You're connected to our support team. Average response time: 2-3 minutes
                    </ThemedText>
                </ThemedView>

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
                <ThemedView className="flex-row items-center px-4 py-3 border-t border-gray-100">
                    <TouchableOpacity className="mr-3">
                        <Icon as={AddIcon} size="md" className="text-gray-500" />
                    </TouchableOpacity>

                    <ThemedView className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
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
                    </ThemedView>

                    <TouchableOpacity
                        className="ml-3 bg-[#E75B3B] w-10 h-10 rounded-full items-center justify-center"
                        onPress={sendMessage}
                    >
                        <Icon as={SendIcon} size="sm" className="text-white" />
                    </TouchableOpacity>
                </ThemedView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}