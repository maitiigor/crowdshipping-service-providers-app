'use client';
import { ArrowLeftIcon, ArrowRightIcon, BellIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SupportScreen() {
    const handleEmailSupport = () => {
        Linking.openURL('mailto:support@crowdshipping.com');
    };

    const handleFAQ = () => {
        router.push('/screens/support/faq');
    };

    const handleLiveChat = () => {
        router.push('/screens/support/live-chat');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Support</Text>

                <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Email Support Section */}
                <View className="bg-white rounded-2xl p-6 mb-6 items-center">
                    <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
                        <Text className="text-4xl">📧</Text>
                    </View>
                    
                    <Text className="text-gray-600 text-center text-base mb-4 leading-6">
                        Shoot us your complain through email
                    </Text>
                    
                    <TouchableOpacity 
                        onPress={handleEmailSupport}
                        className="bg-gray-100 px-6 py-3 rounded-xl"
                    >
                        <Text className="text-gray-800 font-medium text-base">
                            Support@crowdshipping.com
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Support Options */}
                <View className="bg-white rounded-2xl overflow-hidden">
                    {/* FAQ */}
                    <TouchableOpacity
                        className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100"
                        onPress={handleFAQ}
                    >
                        <Text className="text-gray-900 font-medium text-base">FAQ</Text>
                        <Icon as={ArrowRightIcon} size="sm" className="text-gray-400" />
                    </TouchableOpacity>

                    {/* Support Live Chat */}
                    <TouchableOpacity
                        className="flex-row items-center justify-between px-6 py-4"
                        onPress={handleLiveChat}
                    >
                        <Text className="text-gray-900 font-medium text-base">Support Live chat</Text>
                        <Icon as={ArrowRightIcon} size="sm" className="text-gray-400" />
                    </TouchableOpacity>
                </View>

                {/* Additional Help Section */}
                <View className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <Text className="text-blue-800 font-medium mb-2">
                        💡 Need Quick Help?
                    </Text>
                    <Text className="text-blue-700 text-sm leading-5">
                        For immediate assistance, try our live chat feature. Our support team is available 24/7 to help you with any questions or issues.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}