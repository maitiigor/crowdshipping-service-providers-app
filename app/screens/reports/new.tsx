'use client';
import { Button, ButtonText } from '@/components/ui/button';
import { ArrowLeftIcon, BellIcon, ChevronDownIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectScrollView, SelectTrigger } from '@/components/ui/select';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewReportScreen() {
    const [formData, setFormData] = useState({
        reportType: '',
        natureOfReport: '',
        otherOptions: '',
        reportAmount: '',
        trackingId: '',
        detailedDescription: ''
    });

    const reportTypes = [
        'Delivery Issue',
        'Payment Issue',
        'Customer Complaint',
        'Damaged Package',
        'Lost Package',
        'Other'
    ];

    const natureOptions = [
        'Schedule',
        'Urgent',
        'Follow-up',
        'Complaint',
        'Inquiry'
    ];

    const handleSubmit = () => {
        if (!formData.reportType || !formData.detailedDescription) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Here you would typically submit to your API
        Alert.alert(
            'Success',
            'Your report has been submitted successfully!',
            [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]
        );
    };

    const handleCancel = () => {
        Alert.alert(
            'Cancel Report',
            'Are you sure you want to cancel? All entered data will be lost.',
            [
                {
                    text: 'Continue Editing',
                    style: 'cancel'
                },
                {
                    text: 'Cancel Report',
                    style: 'destructive',
                    onPress: () => router.back()
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">New Report</Text>

                <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Report Type */}
                <View className="mb-6">
                    <Text className="text-base font-medium text-gray-900 mb-2">
                        Report Type <Text className="text-red-500">*</Text>
                    </Text>
                    <Select
                        selectedValue={formData.reportType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, reportType: value }))}
                    >
                        <SelectTrigger className="h-12">
                            <SelectInput
                                placeholder="Select Type"
                                value={formData.reportType}
                                className="text-gray-900"
                            />
                            <SelectIcon as={ChevronDownIcon} className="mr-3" />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                <SelectScrollView>
                                    {reportTypes.map((type) => (
                                        <SelectItem key={type} label={type} value={type} />
                                    ))}
                                </SelectScrollView>
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </View>

                {/* Nature of Report */}
                <View className="mb-6">
                    <Text className="text-base font-medium text-gray-900 mb-2">
                        Nature of Report:
                    </Text>
                    <Select
                        selectedValue={formData.natureOfReport}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, natureOfReport: value }))}
                    >
                        <SelectTrigger className="h-12">
                            <SelectInput
                                placeholder="Schedule"
                                value={formData.natureOfReport}
                                className="text-gray-900"
                            />
                            <SelectIcon as={ChevronDownIcon} className="mr-3" />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                <SelectScrollView>
                                    {natureOptions.map((option) => (
                                        <SelectItem key={option} label={option} value={option} />
                                    ))}
                                </SelectScrollView>
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </View>

                {/* Other Options */}
                <View className="mb-6">
                    <Text className="text-base font-medium text-gray-900 mb-2">
                        Other Options
                    </Text>
                    <Input>
                        <InputField
                            placeholder="Enter Option"
                            value={formData.otherOptions}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, otherOptions: text }))}
                        />
                    </Input>
                </View>

                {/* Report Amount */}
                <View className="mb-6">
                    <Text className="text-base font-medium text-gray-900 mb-2">
                        Report Amount
                    </Text>
                    <Input>
                        <InputField
                            placeholder="Enter Amount"
                            value={formData.reportAmount}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, reportAmount: text }))}
                            keyboardType="numeric"
                        />
                    </Input>
                </View>

                {/* Tracking ID */}
                <View className="mb-6">
                    <Text className="text-base font-medium text-gray-900 mb-2">
                        Tracking ID
                    </Text>
                    <Input>
                        <InputField
                            placeholder="Enter Tracking ID"
                            value={formData.trackingId}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, trackingId: text }))}
                        />
                    </Input>
                </View>

                {/* Detailed Description */}
                <View className="mb-6">
                    <Text className="text-base font-medium text-gray-900 mb-2">
                        Detailed Description: <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="border border-gray-300 rounded-lg p-3 bg-white">
                        <TextInput
                            placeholder="Enter Description"
                            value={formData.detailedDescription}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, detailedDescription: text }))}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            className="text-gray-900 text-base"
                            style={{ minHeight: 120 }}
                        />
                        <Text className="text-xs text-gray-400 text-right mt-2">
                            0/500
                        </Text>
                    </View>
                </View>

                {/* File Upload Section */}
                <View className="mb-8">
                    <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-lg p-8 items-center justify-center bg-white">
                        <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-3">
                            <Text className="text-[#E75B3B] text-xl">📎</Text>
                        </View>
                        <Text className="text-gray-600 text-center font-medium mb-1">
                            Upload photos, videos, receipts, or
                        </Text>
                        <Text className="text-gray-600 text-center">
                            other relevant files.
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-x-4 mb-6">
                    <Button
                        variant="outline"
                        className="flex-1 border-[#E75B3B]"
                        onPress={handleCancel}
                    >
                        <ButtonText className="text-[#E75B3B]">Cancel</ButtonText>
                    </Button>

                    <Button
                        className="flex-1 bg-[#E75B3B]"
                        onPress={handleSubmit}
                    >
                        <ButtonText className="text-white">Submit Report</ButtonText>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}