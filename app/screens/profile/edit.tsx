'use client';
import { ArrowLeftIcon, BellIcon, CalendarDaysIcon, ChevronDownIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileData {
    fullName: string;
    firstName: string;
    dateOfBirth: string;
    email: string;
    country: string;
    phoneNumber: string;
    gender: string;
    address: string;
}

export default function EditProfileScreen() {
    const [profileData, setProfileData] = useState<ProfileData>({
        fullName: 'Gbemisola Doe',
        firstName: 'Gbemisola',
        dateOfBirth: '07/12/1990',
        email: 'gbemisoladoe@gmail.com',
        country: 'Nigeria',
        phoneNumber: '+234 813 0193 794',
        gender: 'Male',
        address: 'gbemisoladoe@gmail.com',
    });

    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    const countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt'];
    const genders = ['Male', 'Female', 'Other'];

    const updateProfile = () => {
        // Handle profile update logic here
        console.log('Profile updated:', profileData);
        router.back();
    };

    const renderInputField = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        placeholder?: string,
        rightIcon?: React.ReactNode,
        onRightIconPress?: () => void
    ) => (
        <View className="mb-4">
            <View className="relative">
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder || label}
                    className="w-full h-[48px] px-4 py-4 bg-gray-50 rounded-lg text-base text-gray-900 border border-gray-200"
                    placeholderTextColor="#9CA3AF"
                />
                {rightIcon && (
                    <TouchableOpacity
                        className="absolute right-4 top-4"
                        onPress={onRightIconPress}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderPickerField = (
        value: string,
        onPress: () => void,
        leftIcon?: React.ReactNode
    ) => (
        <View className="mb-4">
            <TouchableOpacity
                className="w-full px-4 py-4 bg-gray-50 rounded-lg border border-gray-200 flex-row items-center justify-between"
                onPress={onPress}
            >
                <View className="flex-row items-center">
                    {leftIcon && <View className="mr-3">{leftIcon}</View>}
                    <Text className="text-base text-gray-900">{value}</Text>
                </View>
                <Icon as={ChevronDownIcon} size="sm" className="text-gray-500" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">Edit Profile</Text>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Full Name */}
                {renderInputField(
                    'Full Name',
                    profileData.fullName,
                    (text) => setProfileData({ ...profileData, fullName: text })
                )}

                {/* First Name */}
                {renderInputField(
                    'First Name',
                    profileData.firstName,
                    (text) => setProfileData({ ...profileData, firstName: text })
                )}

                {/* Date of Birth */}
                {renderInputField(
                    'Date of Birth',
                    profileData.dateOfBirth,
                    (text) => setProfileData({ ...profileData, dateOfBirth: text }),
                    'DD/MM/YYYY',
                    <Icon as={CalendarDaysIcon} size="sm" className="text-gray-500" />
                )}

                {/* Email */}
                {renderInputField(
                    'Email',
                    profileData.email,
                    (text) => setProfileData({ ...profileData, email: text }),
                    'Enter your email',
                    <View className="w-5 h-5 bg-gray-300 rounded" />
                )}

                {/* Country */}
                {renderPickerField(
                    profileData.country,
                    () => setShowCountryPicker(!showCountryPicker)
                )}

                {showCountryPicker && (
                    <View className="mb-4 bg-gray-50 rounded-lg border border-gray-200">
                        {countries.map((country) => (
                            <TouchableOpacity
                                key={country}
                                className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                                onPress={() => {
                                    setProfileData({ ...profileData, country });
                                    setShowCountryPicker(false);
                                }}
                            >
                                <Text className="text-base text-gray-900">{country}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Phone Number */}
                {renderPickerField(
                    profileData.phoneNumber,
                    () => { },
                    <View className="flex-row items-center">
                        <View className="w-6 h-4 bg-green-500 mr-1" />
                        <View className="w-6 h-4 bg-white mr-1" />
                        <View className="w-6 h-4 bg-green-500" />
                    </View>
                )}

                {/* Gender */}
                {renderPickerField(
                    profileData.gender,
                    () => setShowGenderPicker(!showGenderPicker)
                )}

                {showGenderPicker && (
                    <View className="mb-4 bg-gray-50 rounded-lg border border-gray-200">
                        {genders.map((gender) => (
                            <TouchableOpacity
                                key={gender}
                                className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                                onPress={() => {
                                    setProfileData({ ...profileData, gender });
                                    setShowGenderPicker(false);
                                }}
                            >
                                <Text className="text-base text-gray-900">{gender}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Address */}
                {renderPickerField(
                    profileData.address,
                    () => { },
                    <Icon as={ArrowLeftIcon} size="sm" className="text-gray-500 transform rotate-90" />
                )}
            </ScrollView>

            {/* Update Button */}
            <View className="px-4 pb-4">
                <TouchableOpacity
                    className="bg-orange-500 py-4 rounded-full flex-row items-center justify-center"
                    onPress={updateProfile}
                >
                    <Text className="text-white font-semibold text-base mr-2">Update</Text>
                    <View className="w-5 h-5 bg-white rounded-full items-center justify-center">
                        <Text className="text-orange-500 text-xs">✓</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}