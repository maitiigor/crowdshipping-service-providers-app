'use client';
import { ArrowLeftIcon, BellIcon, EditIcon, Icon, StarIcon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    rating: number;
    totalTrips: number;
    joinDate: string;
    vehicleInfo: string;
    status: 'online' | 'offline';
}

export default function ProfileScreen() {
    const [profileData] = useState<ProfileData>({
        name: 'Gbemisola',
        email: 'gbemisola@example.com',
        phone: '+234 813 0193 794',
        rating: 4.8,
        totalTrips: 247,
        joinDate: 'January 2023',
        vehicleInfo: 'Toyota Camry 2020',
        status: 'online'
    });

    const handleViewVehicle = () => {
        Alert.alert('Vehicle Info', 'Toyota Camry 2020\nPlate: ABC-123-XY\nColor: Silver');
    };

    const handleReviewsAndRatings = () => {
        router.push('/screens/dashboard/reviews');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Profile</Text>

                <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
                {/* Profile Header */}
                <View className="bg-white mx-4 mt-4 rounded-2xl p-6">
                    <View className="items-center mb-6">
                        {/* Profile Avatar */}
                        <View className="relative mb-4">
                            <View className="w-24 h-24 bg-[#E75B3B] rounded-full items-center justify-center">
                                <Text className="text-white text-3xl font-bold">G</Text>
                            </View>
                            {/* Online Status Indicator */}
                            <View className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${profileData.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                        </View>

                        {/* Name and Basic Info */}
                        <Text className="text-gray-900 font-bold text-2xl mb-2">{profileData.name}</Text>
                        <Text className="text-gray-500 text-base mb-4">{profileData.email}</Text>

                        {/* Rating */}
                        <View className="flex-row items-center mb-4">
                            <Icon as={StarIcon} size="sm" className="text-yellow-500 mr-1" />
                            <Text className="text-gray-900 font-semibold text-lg mr-2">{profileData.rating}</Text>
                            <Text className="text-gray-500">({profileData.totalTrips} trips)</Text>
                        </View>

                        {/* Edit Profile Button */}
                        <TouchableOpacity
                            className="bg-[#E75B3B] px-6 py-3 rounded-full flex-row items-center"
                            onPress={() => router.push('/screens/profile/edit')}
                        >
                            <Icon as={EditIcon} size="sm" className="text-white mr-2" />
                            <Text className="text-white font-semibold">Edit Profile</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quick Stats */}
                    <View className="flex-row justify-around pt-6 border-t border-gray-100">
                        <View className="items-center">
                            <Icon as={StarIcon} size='lg' className='text-[#E75B3B]' ></Icon>
                            <Text className="text-gray-900 font-bold text-xl">{profileData.totalTrips}</Text>
                            <Text className="text-gray-500 text-sm">Total Trips</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-900 font-bold text-xl">{profileData.rating}</Text>
                            <Text className="text-gray-500 text-sm">Rating</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-900 font-bold text-xl">2+</Text>
                            <Text className="text-gray-500 text-sm">Years</Text>
                        </View>
                    </View>
                </View>



                {/* Account Info */}
                <View className="bg-white mx-4 mt-4 mb-6 rounded-2xl p-6">
                    <Text className="text-gray-900 font-semibold text-lg mb-4">Account Information</Text>

                    <View className="space-y-3">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-500">Phone Number</Text>
                            <Text className="text-gray-900 font-medium">{profileData.phone}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-500">Member Since</Text>
                            <Text className="text-gray-900 font-medium">{profileData.joinDate}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-500">Status</Text>
                            <View className="flex-row items-center">
                                <View className={`w-2 h-2 rounded-full mr-2 ${profileData.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                                <Text className={`font-medium capitalize ${profileData.status === 'online' ? 'text-green-600' : 'text-gray-600'
                                    }`}>
                                    {profileData.status}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}