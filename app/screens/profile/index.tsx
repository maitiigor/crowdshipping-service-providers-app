'use client';
import { EditIcon, Icon, StarIcon } from '@/components/ui/icon';
import { Image } from 'expo-image';
import { router, useNavigation } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationIcon from '../../../components/Custom/NotificationIcon';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { useAppSelector } from '../../../store';

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
    const { t } = useTranslation();

    const { userProfile } = useAppSelector((state) => state.auth);
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

    const navigation = useNavigation();

    const background = useThemeColor({}, "background");
    const color = useThemeColor({}, "text");

    const handleViewVehicle = () => {
        Alert.alert('Vehicle Info', 'Toyota Camry 2020\nPlate: ABC-123-XY\nColor: Silver');
    };


        useEffect(() => {
            navigation.setOptions({
                headerShown: true,
                headerTitle: () => {
                    return (
                        <ThemedText type="s1_subtitle" className="text-center">
                            {t('sidebar.menu.profile')}
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
                                className="p-2 rounded flex justify-center items-center"
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
                headerRight: () => <NotificationIcon />,
            });
        }, [navigation, router]);

    const handleReviewsAndRatings = () => {
        router.push('/screens/dashboard/reviews');
    };

    return (
        <SafeAreaView className="flex-1">

            <ScrollView className="flex-1">
                {/* Profile Header */}
                <ThemedView className="mx-4 mt-4 rounded-2xl p-6">
                    <ThemedView className="items-center mb-6">
                        {/* Profile Avatar */}
                        <ThemedView className="relative mb-4">
                            {
                                true === true ? (
                                    <ThemedView style={{ width: 96, height: 96 }} className="rounded-full">
                                        <Image
                                            source={{ uri: userProfile.profile?.profilePicUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" }}
                                            className="w-full h-full"
                                            onError={(err) => console.log(err)}
                                        />
                                    </ThemedView>
                                ) : <ThemedView className="w-24 h-24 bg-[#E75B3B] rounded-full items-center justify-center">
                                    <ThemedText className="text-3xl font-bold">{userProfile.fullName.charAt(0)}</ThemedText>
                                </ThemedView>
                            }

                            {/* Online Status Indicator */}
                            <ThemedView className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${profileData.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                        </ThemedView>

                        {/* Name and Basic Info */}
                        <ThemedText className="font-bold text-2xl mb-2">{userProfile.fullName}</ThemedText>
                        <ThemedText className="text-base mb-4">{userProfile.email}</ThemedText>
                        {/* <ThemedText className="text-base mb-4">{userProfile.phoneNumber}</ThemedText> */}


                        {/* Rating */}
                        <ThemedView className="flex-row items-center mb-4">
                            <Icon as={StarIcon} size="sm" className="text-yellow-500 mr-1" />
                            <ThemedText className="text-gray-900 font-semibold text-lg mr-2">{userProfile.profile?.rating?.avg ?? 0}</ThemedText>
                            <ThemedText className="text-gray-500">({userProfile.profile.rating?.count ?? 0} trips)</ThemedText>
                        </ThemedView>

                        {/* Edit Profile Button */}
                        <TouchableOpacity
                            className="bg-[#E75B3B] px-6 py-3 rounded-full flex-row items-center"
                            onPress={() => router.push('/screens/profile/edit')}
                        >
                            <Icon as={EditIcon} size="sm" className="text-white mr-2" />
                            <ThemedText className="text-white font-semibold">{t('edit-profile.edit_profile')}</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Quick Stats */}
                    {/* <ThemedView className="flex-row justify-around pt-6 border-t border-gray-100">
                        <ThemedView className="items-center">
                            <Icon as={StarIcon} size='lg' className='text-[#E75B3B]' ></Icon>
                            <ThemedText className="text-gray-900 font-bold text-xl">{profileData.totalTrips}</ThemedText>
                            <ThemedText className="text-gray-500 text-sm">Total Trips</ThemedText>
                        </ThemedView>
                        <ThemedView className="items-center">
                            <ThemedText className="text-gray-900 font-bold text-xl">{profileData.rating}</ThemedText>
                            <ThemedText className="text-gray-500 text-sm">Rating</ThemedText>
                        </ThemedView>
                        <ThemedView className="items-center">
                            <ThemedText className="text-gray-900 font-bold text-xl">2+</ThemedText>
                            <ThemedText className="text-gray-500 text-sm">Years</ThemedText>
                        </ThemedView>
                    </ThemedView> */}
                </ThemedView>



                {/* Account Info */}
                <ThemedView className="mx-4 mt-4 mb-6 rounded-2xl p-6">
                    <ThemedText className="text-gray-900 font-semibold text-lg mb-4">{t('edit-profile.account_information')}</ThemedText>

                    <ThemedView className="space-y-3">
                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500">{t('edit-profile.phone_number')}</ThemedText>
                            <ThemedText className="text-gray-900 font-medium">{userProfile.phoneNumber}</ThemedText>
                        </ThemedView>
                        {/* <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500">Member Since</ThemedText>
                            <ThemedText className="text-gray-900 font-medium">{profileData.joinDate}</ThemedText>
                        </ThemedView> */}
                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500">KYC Status</ThemedText>
                            <ThemedView className="flex-row items-center">
                                <ThemedView className={`w-2 h-2 rounded-full mr-2 ${userProfile.kycStatus === 'pending' ? 'bg-orange-500' : userProfile.kycStatus === 'completed' ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                                <ThemedText className={`font-medium capitalize ${userProfile.kycStatus === 'completed' ? 'text-green-600' : 'text-gray-600'
                                    }`}>
                                    {userProfile.kycStatus}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>

                          <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500">Verification Status</ThemedText>
                            <ThemedView className="flex-row items-center">
                                <ThemedView className={`w-2 h-2 rounded-full mr-2 ${userProfile.isVerfied ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                                <ThemedText className={`font-medium capitalize ${userProfile.isVerfied ? 'text-green-600' : 'text-gray-600'
                                    }`}>
                                    {userProfile.isVerfied ? 'Verified' : 'Verified'}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500">{t('edit-profile.country')}</ThemedText>
                            <ThemedView className="flex-row items-center">
                                <ThemedText className="text-gray-900 font-medium">{userProfile.profile?.country}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500">{t('edit-profile.state')}</ThemedText>
                            <ThemedView className="flex-row items-center">
                                <ThemedText className="text-gray-900 font-medium">{userProfile.profile?.state}</ThemedText>
                            </ThemedView>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500">{t('edit-profile.city')}</ThemedText>
                            <ThemedView className="flex-row items-center">
                                <ThemedText className="text-gray-900 font-medium">{userProfile.profile?.city}</ThemedText>
                            </ThemedView>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500">{t('edit-profile.gender')}</ThemedText>
                            <ThemedView className="flex-row items-center">
                                <ThemedText className="text-gray-900 font-medium">{userProfile.profile?.gender}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500 w-1/3">{t('edit-profile.address')}</ThemedText>

                            <ThemedView className="flex-row justify-end w-2/3">
                                <ThemedText className="text-gray-900 font-medium text-right">
                                    {userProfile.profile.address}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>
                        <ThemedView className="flex-row justify-between">
                            <ThemedText className="text-gray-500">Available Balance</ThemedText>
                            <ThemedView className="flex-row items-center">
                                <ThemedText className="text-gray-900 font-medium">{userProfile.wallet?.availableBalance}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}