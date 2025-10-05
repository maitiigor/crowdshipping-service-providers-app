import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '../../../components/ui/button';
import DeliveryCompleteModal from '../../../components/ui/delivery-complete-modal';
import { ArrowLeftIcon, Icon } from '../../../components/ui/icon';
import { Input, InputField } from '../../../components/ui/input';

const { width, height } = Dimensions.get('window');

export default function CompleteDeliveryOTPScreen() {
    const [otp, setOtp] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [rating, setRating] = useState(0);

    // Mock data - in real app this would come from props or API
    const bookingId = 'ID2350847391';

    const handleResendOTP = () => {
        Alert.alert('OTP Sent', 'A new OTP has been sent to the recipient');
    };

    const handleSubmitOTP = () => {
        if (otp.length < 4) {
            Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
            return;
        }

        // In a real app, this would verify the OTP with the backend
        console.log('Submitting OTP:', otp);
        // Show success modal for rating + review
        setShowSuccess(true);
    };

    const handleWriteReview = (selectedRating: number) => {
        setRating(selectedRating);
        setShowSuccess(false);
        router.push({
            pathname: '/screens/dashboard/driver-feedback',
            params: { rating: String(selectedRating) }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                <TouchableOpacity
                    className="w-10 h-10 items-center justify-center"
                    onPress={() => router.back()}
                >
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-gray-900">
                    Complete Delivery (OTP)
                </Text>

                <View className="w-10 h-10" />
            </View>

            {/* Content */}
            <View className="flex-1 px-4 py-8 justify-center">
                <View className="items-center mb-8">
                    {/* OTP Icon/Illustration */}
                    <View className="w-20 h-20 bg-[#E75B3B] rounded-full items-center justify-center mb-6">
                        <Text className="text-white text-2xl font-bold">OTP</Text>
                    </View>

                    <Text className="text-xl font-medium text-gray-900 text-center mb-2">
                        Enter OTP provided by recipient for
                    </Text>
                    <Text className="text-xl font-medium text-gray-900 text-center mb-6">
                        booking: {bookingId}
                    </Text>
                </View>

                {/* OTP Input */}
                <View className="mb-8">
                    <Input className="mb-4 h-[48px] rounded-lg">
                        <InputField
                            placeholder="Enter OTP"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                            maxLength={6}
                            textAlign="center"
                            className="text-2xl font-bold tracking-widest"
                        />
                    </Input>
                </View>

                {/* Action Buttons */}
                <View className="flex flex-row justify-center gap-4 w-100">
                    <Button
                        variant="outline"
                        className="border-[#E75B3B] rounded-xl h-[47px] w-1/2"
                        onPress={handleResendOTP}
                    >
                        <ButtonText className="text-[#E75B3B] font-semibold text-lg">
                            Resend OTP
                        </ButtonText>
                    </Button>

                    <Button
                        size="xl"
                        className="bg-[#E75B3B] rounded-xl h-[47px] w-1/2"
                        onPress={handleSubmitOTP}
                    >
                        <ButtonText className="text-white font-semibold text-lg">
                            Submit OTP
                        </ButtonText>
                    </Button>
                </View>
            </View>

            {/* Bottom spacing */}
            <View className="h-20" />

            {/* Delivery completion modal */}
            <DeliveryCompleteModal
                isVisible={showSuccess}
                onPrimaryPress={handleWriteReview}
                onSecondaryPress={() => setShowSuccess(false)}
                onClose={() => setShowSuccess(false)}
                onRatingChange={(r) => setRating(r)}
            />
        </SafeAreaView>
    );
}