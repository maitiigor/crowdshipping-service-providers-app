import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '../../../components/ui/button';
import DeliveryCompleteModal from '../../../components/ui/delivery-complete-modal';
import { ArrowLeftIcon, CheckCircleIcon, Icon } from '../../../components/ui/icon';
import { Input, InputField } from '../../../components/ui/input';
import { useShowToast } from '../../../hooks/useShowToast';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateTripStatus } from '../../../store/slices/groundTripSlice';
import { resendDeliveryOtp } from '../../../store/slices/tripManagementSlice';

const { width, height } = Dimensions.get('window');

export default function CompleteDeliveryOTPScreen() {
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const [otp, setOtp] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [rating, setRating] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);

    const dispatch = useAppDispatch();
    const showToast = useShowToast();
    const { groundTrip } = useAppSelector((state) => state.groundTrip);

    // Use actual booking ID from trip data or fallback
    const bookingId = groundTrip?.trackingId || groundTrip?.bookingRef || 'ID2350847391';

    const handleResendOTP = async () => {
        if (!tripId) {
            Alert.alert('Error', 'Trip ID is missing');
            return;
        }
        try {
            await dispatch(resendDeliveryOtp({ tripId })).unwrap();

            showToast({
                title: "OTP Sent",
                description: "OTP has been resent successfully",
                icon: CheckCircleIcon,
                action: "success"
            });

        } catch (error: any) {
            showToast({
                title: "OTP Send Failed",
                description: error.message || "Failed to send OTP",
                icon: ArrowLeftIcon,
                action: "error"
            });
        }

    };

    const handleSubmitOTP = async () => {
        if (otp.length < 4) {
            Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
            return;
        }

        if (!tripId) {
            Alert.alert('Error', 'Trip ID is missing');
            return;
        }

        try {
            setIsVerifying(true);


            // For now, we'll assume OTP is valid and complete the trip
            await dispatch(updateTripStatus({ id: tripId, status: 'COMPLETED', otp: otp })).unwrap();

            showToast({
                title: "Trip Completed!",
                description: "Delivery has been completed successfully",
                icon: CheckCircleIcon,
                action: "success"
            });

            // Show success modal for rating + review
            setShowSuccess(true);
        } catch (error: any) {
            showToast({
                title: "Completion Failed",
                description: error.message || "Failed to complete trip",
                icon: ArrowLeftIcon,
                action: "error"
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleWriteReview = (selectedRating: number) => {
        setRating(selectedRating);
        setShowSuccess(false);
        // Navigate to feedback screen or back to dashboard
        router.push('/screens/dashboard');
    };

    const handleSkipReview = () => {
        setShowSuccess(false);
        // Navigate back to dashboard
        router.push('/screens/dashboard');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <ThemedView className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                <TouchableOpacity
                    className="w-10 h-10 items-center justify-center"
                    onPress={() => router.back()}
                >
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-lg font-semibold text-gray-900">
                    Complete Delivery (OTP)
                </ThemedText>

                <ThemedView className="w-10 h-10" />
            </ThemedView>

            {/* Content */}
            <ThemedView className="flex-1 px-4 py-8 justify-center">
                <ThemedView className="items-center mb-8">
                    {/* OTP Icon/Illustration */}
                    <ThemedView className="w-20 h-20 bg-[#E75B3B] rounded-full items-center justify-center mb-6">
                        <ThemedText className="text-white text-2xl font-bold">OTP</ThemedText>
                    </ThemedView>

                    <ThemedText className="text-xl font-medium text-gray-900 text-center mb-2">
                        Enter OTP provided by recipient for
                    </ThemedText>
                    <ThemedText className="text-xl font-medium text-gray-900 text-center mb-6">
                        booking: {bookingId}
                    </ThemedText>
                </ThemedView>

                {/* OTP Input */}
                <ThemedView className="mb-8">
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
                </ThemedView>

                {/* Action Buttons */}
                <ThemedView className="flex flex-row justify-center gap-4 w-100">
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
                        disabled={isVerifying || otp.length < 4}
                    >
                        <ButtonText className="text-white font-semibold text-lg">
                            {isVerifying ? 'Verifying...' : 'Submit OTP'}
                        </ButtonText>
                    </Button>
                </ThemedView>
            </ThemedView>

            {/* Bottom spacing */}
            <ThemedView className="h-20" />

            {/* Delivery completion modal */}
            <DeliveryCompleteModal
                isVisible={showSuccess}
                onPrimaryPress={handleWriteReview}
                onSecondaryPress={handleSkipReview}
                onClose={handleSkipReview}
                onRatingChange={(r) => setRating(r)}
            />
        </SafeAreaView>
    );
}