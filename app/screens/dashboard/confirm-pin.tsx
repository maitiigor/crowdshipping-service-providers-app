'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import OTPVerification from '@/components/ui/otp-verification';
import SuccessModal from '@/components/ui/success-modal';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';

export default function ConfirmPinScreen() {
    const params = useLocalSearchParams();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const amount = params.amount as string || '50000';
    const bank = params.bank as string || 'Access Bank';
    const accountNumber = params.accountNumber as string || '37991746791';

    const handleVerifyPin = (pin: string) => {
        // Simulate PIN verification
        console.log('Verifying PIN:', pin);

        // Show success modal after verification
        setTimeout(() => {
            setShowSuccessModal(true);
        }, 500);
    };

    const handleViewReceipt = () => {
        router.push({
            pathname: '/screens/dashboard/receipt',
            params: {
                amount,
                bank,
                accountNumber,
                transactionId: '386864n9797kh83',
                date: 'Jun 24, 2024',
                recipient: 'John Doe'
            }
        });
    };

    const handleGoHome = () => {
        router.push('/screens/dashboard');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-xl font-semibold text-gray-900">Confirm Pin</ThemedText>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            {/* OTP Verification Component */}
            <OTPVerification
                title="Confirm Payment"
                subtitle="Enter your Pin to confirm payment"
                pinLength={4}
                onVerify={handleVerifyPin}
                showResend={false}
            />

            {/* Success Modal */}
            <SuccessModal
                isVisible={showSuccessModal}
                title="withdraw Successful!"
                message={`You have withdraw ${amount} from your account`}
                primaryButtonText="View Receipt"
                secondaryButtonText="Home"
                onPrimaryPress={handleViewReceipt}
                onSecondaryPress={handleGoHome}
                onClose={() => setShowSuccessModal(false)}
            />
        </SafeAreaView>
    );
}