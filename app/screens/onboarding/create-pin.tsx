import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import OTPVerification from "../../../components/ui/otp-verification";
import RegistrationSuccessModal from "../../../components/ui/registration-success-modal";
import { Toast, ToastDescription, ToastTitle, useToast } from "../../../components/ui/toast";
import { useAuth } from "../../../hooks/useRedux";
import { ApiError, OTPVerificationRequest } from "../../../models";
import { AppDispatch, useAppSelector } from "../../../store";
import { resendOTP, verifyOTP } from "../../../store/slices/authSlice";
import { useLocalSearchParams } from "expo-router";

export default function CreatePin() {
    const { verificationCountdown, startCountdown } = useAuth();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const toast = useToast();
    const userProfile = useAppSelector((state) => state.auth.userProfile);
    const loading = useAppSelector((state) => state.auth.loading);
    const dispatch = useDispatch<AppDispatch>();

    const { type, email } = useLocalSearchParams<{ type: string; email: string }>();

    // Initialize countdown on component mount
    useEffect(() => {
        if (verificationCountdown === 0) {
            startCountdown(20);
        }
    }, []);

    const handleVerifyOTP = async (otp: string) => {
        const payload: OTPVerificationRequest = {
            type: type,
            otp,
            email: userProfile.email,
        };
        try {
            const resultAction = await dispatch(verifyOTP(payload));

            if (verifyOTP.fulfilled.match(resultAction)) {
                console.log("Verification success:", resultAction.payload);
                if (resultAction.payload.data.status === "approved") {
                    toast.show({
                        placement: "top",
                        duration: 2000,
                        render: ({ id }) => {
                            return (
                                <Toast nativeID={id} action="success">
                                    <ToastTitle>Email Verified</ToastTitle>
                                    <ToastDescription>Your email has been verified</ToastDescription>
                                </Toast>
                            );
                        },
                    });

                    setTimeout(() => {
                        if (type == "sign-up") {
                            
                            router.push('/screens/onboarding/edit-profile');
                        }else{
                            router.push('/screens/dashboard');
                        }
                    }, 2000);
                }


            } else if (verifyOTP.rejected.match(resultAction)) {
                console.log("Verification failed:", resultAction.payload);

                const errorMessage =
                    (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;
                toast.show({
                    placement: "top",
                    duration: 3000,
                    render: ({ id }) => {
                        return (
                            <Toast nativeID={id} action="error">
                                <ToastTitle>Registration Failed</ToastTitle>
                                <ToastDescription>{errorMessage.message}</ToastDescription>
                            </Toast>
                        );
                    },
                });
            }

        } catch (error) {

            toast.show({
                placement: "top",
                duration: 3000,
                render: ({ id }) => {
                    return (
                        <Toast nativeID={id} action="error">
                            <ToastTitle>Unexpected Error 🚨</ToastTitle>
                            <ToastDescription>Please try again later</ToastDescription>
                        </Toast>
                    );
                },
            });
        }

    };

    const handleResendCode = async () => {
        if (verificationCountdown === 0) {
            startCountdown(20);
            // Here you would typically resend the verification code
            const payload: OTPVerificationRequest = {
                type: "sign-up",
                otp: "",
                email: userProfile.email,
            };

            try {

                const resultAction = await dispatch(resendOTP(payload));

                if (resendOTP.fulfilled.match(resultAction)) {
                    console.log("Resend success:", resultAction.payload);

                    toast.show({
                        placement: "top",
                        duration: 2000,
                        render: ({ id }) => {
                            return (
                                <Toast nativeID={id} action="success">
                                    <ToastTitle>OTP Resent</ToastTitle>
                                    <ToastDescription>Check your email for the new code</ToastDescription>
                                </Toast>
                            );
                        },
                    });
                } else if (resendOTP.rejected.match(resultAction)) {
                    console.log("Resend failed:", resultAction.payload);
                    const errorMessage =
                        (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;
                    toast.show({
                        placement: "top",
                        duration: 3000,
                        render: ({ id }) => {
                            return (
                                <Toast nativeID={id} action="error">
                                    <ToastTitle>Resend Failed</ToastTitle>
                                    <ToastDescription>{errorMessage.message}</ToastDescription>
                                </Toast>
                            );
                        },
                    });
                }
            } catch (error) {

                toast.show({
                    placement: "top",
                    duration: 3000,
                    render: ({ id }) => {
                        return (
                            <Toast nativeID={id} action="error">
                                <ToastTitle>Resend Failed</ToastTitle>
                                <ToastDescription>Something went wrong</ToastDescription>
                            </Toast>
                        );
                    },
                });

            }
        }
    };

    const handleCloseApp = () => {
        setShowSuccessModal(false);
        // Navigate to main screen or close app
        router.push('/screens/onboarding/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="#E75B3B" />
                </TouchableOpacity>
                <View className="flex-1 items-center">
                    <Text className="text-lg font-semibold text-black">SignUp</Text>
                </View>
            </View>

            {/* OTP Verification Component */}
            <OTPVerification
                title="OTP Verification"
                subtitle={`Enter the 5-digit code sent to your email at ${userProfile.email}`}
                pinLength={5}
                onVerify={handleVerifyOTP}
                onResend={handleResendCode}
                buttonText={loading ? "Verifying..." : "Verify"}
                showResend={true}
                resendCountdown={verificationCountdown}
            />

            {/* Success Modal */}
            <RegistrationSuccessModal
                isVisible={showSuccessModal}
                onClose={handleCloseApp}
            />
        </SafeAreaView>
    );
}