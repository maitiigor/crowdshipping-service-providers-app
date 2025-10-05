'use client';
import { ArrowLeftIcon, BellIcon, ChevronDownIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: 'general' | 'account' | 'subscription';
}

const faqData: FAQItem[] = [
    {
        id: '1',
        question: 'What is Crowdshipping',
        answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,',
        category: 'general'
    },
    {
        id: '2',
        question: 'How do I create an account',
        answer: 'To create an account, download the app and tap "Sign Up". Fill in your personal information, verify your email, and complete the onboarding process.',
        category: 'account'
    },
    {
        id: '3',
        question: 'update my profile information ?',
        answer: 'You can update your profile information by going to Settings > Profile. From there you can edit your personal details, contact information, and preferences.',
        category: 'account'
    },
    {
        id: '4',
        question: 'Can i change my location',
        answer: 'Yes, you can change your location in the app settings. Go to Profile > Location Settings to update your current location or service area.',
        category: 'account'
    },
    {
        id: '5',
        question: 'How do I add a new vehicle?',
        answer: 'To add a new vehicle, go to Profile > Vehicle Management > Add Vehicle. You\'ll need to provide vehicle details, registration, and insurance information.',
        category: 'account'
    },
    {
        id: '6',
        question: 'When will earnings be paid out?',
        answer: 'Earnings are typically paid out weekly on Fridays. You can set up direct deposit in your payment settings for faster transfers.',
        category: 'general'
    },
    {
        id: '7',
        question: 'How do I report a user or profile',
        answer: 'To report a user, go to their profile and tap the three dots menu. Select "Report User" and choose the appropriate reason for reporting.',
        category: 'general'
    }
];

export default function FAQScreen() {
    const [activeCategory, setActiveCategory] = useState<'general' | 'account' | 'subscription'>('general');
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpanded = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const filteredFAQs = faqData.filter(item => item.category === activeCategory);

    const renderFAQItem = (item: FAQItem) => {
        const isExpanded = expandedItems.includes(item.id);

        return (
            <View key={item.id} className="border-b border-gray-100">
                <TouchableOpacity
                    className="flex-row items-center justify-between py-4 px-6"
                    onPress={() => toggleExpanded(item.id)}
                >
                    <Text className="flex-1 text-gray-900 font-medium text-base pr-4">
                        {item.question}
                    </Text>
                    <Icon
                        as={ChevronDownIcon}
                        size="sm"
                        className={`text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''
                            }`}
                    />
                </TouchableOpacity>

                {isExpanded && (
                    <View className="px-6 pb-4">
                        <Text className="text-gray-600 text-sm leading-6">
                            {item.answer}
                        </Text>
                    </View>
                )}
            </View>
        );
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

            <View className="flex-1">
                {/* Category Tabs */}
                <View className="bg-white px-4 py-4">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="flex-row"
                        contentContainerStyle={{ paddingHorizontal: 0 }}
                    >
                        <TouchableOpacity
                            className={`px-6 py-3 rounded-full mr-3 ${activeCategory === 'general'
                                    ? 'bg-[#E75B3B]'
                                    : 'bg-white border border-gray-200'
                                }`}
                            onPress={() => setActiveCategory('general')}
                        >
                            <Text className={`font-medium ${activeCategory === 'general' ? 'text-white' : 'text-gray-700'
                                }`}>
                                General
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`px-6 py-3 rounded-full mr-3 ${activeCategory === 'account'
                                    ? 'bg-[#E75B3B]'
                                    : 'bg-white border border-gray-200'
                                }`}
                            onPress={() => setActiveCategory('account')}
                        >
                            <Text className={`font-medium ${activeCategory === 'account' ? 'text-white' : 'text-gray-700'
                                }`}>
                                Account
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`px-6 py-3 rounded-full ${activeCategory === 'subscription'
                                    ? 'bg-[#E75B3B]'
                                    : 'bg-white border border-gray-200'
                                }`}
                            onPress={() => setActiveCategory('subscription')}
                        >
                            <Text className={`font-medium ${activeCategory === 'subscription' ? 'text-white' : 'text-gray-700'
                                }`}>
                                Subscription
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* FAQ List */}
                <ScrollView className="flex-1 bg-white mx-4 mt-4 rounded-2xl">
                    {filteredFAQs.map(renderFAQItem)}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}