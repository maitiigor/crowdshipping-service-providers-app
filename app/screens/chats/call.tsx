'use client';
import { ArrowLeftIcon, Icon, MicIcon, PhoneOffIcon, SpeakerIcon } from '@/components/ui/icon';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');

export default function CallScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const [callDuration, setCallDuration] = useState(0);
    const [isCallActive, setIsCallActive] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCallActive) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCallActive]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} minutes`;
    };

    const endCall = () => {
        setIsCallActive(false);
        router.back();
    };

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 bg-gray-900">
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon as={ArrowLeftIcon} size="md" className="text-white" />
                    </TouchableOpacity>

                    <Text className="text-lg font-medium text-white">In Chats</Text>

                    <View className="w-6" />
                </View>

                {/* Call Info */}
                <View className="flex-1 items-center justify-center px-8">
                    {/* Profile Image */}
                    <View className="items-center mb-8">
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
                            }}
                            className="w-48 h-48 rounded-full mb-6"
                        />

                        <Text className="text-3xl font-semibold text-white mb-2">
                            {name || 'Segun Johnson'}
                        </Text>

                        <Text className="text-lg text-gray-300">
                            {formatDuration(callDuration)}
                        </Text>
                    </View>
                </View>

                {/* Call Controls */}
                <View className="px-8 pb-12">
                    <View className="flex-row justify-center items-center space-x-8">
                        {/* Speaker Button */}
                        <TouchableOpacity className="w-16 h-16 bg-gray-600 rounded-full items-center justify-center">
                            <Icon as={SpeakerIcon} size="lg" className="text-white" />
                        </TouchableOpacity>

                        {/* Microphone Button */}
                        <TouchableOpacity className="w-16 h-16 bg-green-500 rounded-full items-center justify-center">
                            <Icon as={MicIcon} size="lg" className="text-white" />
                        </TouchableOpacity>

                        {/* End Call Button */}
                        <TouchableOpacity
                            className="w-16 h-16 bg-red-500 rounded-full items-center justify-center"
                            onPress={endCall}
                        >
                            <Icon as={PhoneOffIcon} size="lg" className="text-white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}