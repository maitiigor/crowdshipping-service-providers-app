import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { CircleCheckIcon, HelpCircleIcon, LucideIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import CustomToast from "../../../components/Custom/CustomToast";
import OTPVerification from "../../../components/ui/otp-verification";
import RegistrationSuccessModal from "../../../components/ui/registration-success-modal";
import { useToast } from "../../../components/ui/toast";
import { useAuth } from "../../../hooks/useRedux";
import { ApiError, OTPVerificationRequest, ResendOTPRequest } from "../../../models";
import { AppDispatch, useAppSelector } from "../../../store";
import { resendOTP, verifyOTP } from "../../../store/slices/authSlice";
import ParallaxScrollView from "../../../components/ParallaxScrollView";

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

    const showNewToast = ({
        title,
        description,
        icon,
        action = "error",
        variant = "solid",
    }: {
        title: string;
        description: string;
        icon: LucideIcon;
        action: "error" | "success" | "info" | "muted" | "warning";
        variant: "solid" | "outline";
    }) => {
        const newId = Math.random();
        toast.show({
            id: newId.toString(),
            placement: "top",
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                    <CustomToast
                        uniqueToastId={uniqueToastId}
                        icon={icon}
                        action={action}
                        title={title}
                        variant={variant}
                        description={description}
                    />
                );
            },
        });
    };

    const handleVerifyOTP = async (otp: string) => {
        const payload: OTPVerificationRequest = {
            type: type as "password-reset" | "sign-up",
            otp,
            email: email,
        };
        try {
            const resultAction = await dispatch(verifyOTP(payload));

            if (verifyOTP.fulfilled.match(resultAction)) {
                console.log("Verification success:", resultAction.payload);
                if (resultAction.payload.data.user?.isVerified && type == "sign-up") {
                    showNewToast({
                        title: "Email Verified",
                        description: "Your email has been verified",
                        icon: CircleCheckIcon,
                        action: "success",
                        variant: "solid",
                    });

                    setTimeout(() => {
                        if (type == "sign-up") {

                            router.push('/screens/onboarding/edit-profile');
                        } else {
                            router.push('/screens/dashboard');
                        }
                    }, 2000);
                } else if (type == "password-reset") {
                    router.push('/screens/onboarding/reset-password');
                }


            } else if (verifyOTP.rejected.match(resultAction)) {
                console.log("Verification failed:", resultAction.payload);

                const errorMessage =
                    (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;
                showNewToast({
                    title: "Verification Failed",
                    description: errorMessage.message,
                    icon: HelpCircleIcon,
                    action: "error",
                    variant: "solid",
                });
            }

        } catch (error) {

            showNewToast({
                title: "Unexpected Error 🚨",
                description: "Please try again later",
                icon: HelpCircleIcon,
                action: "error",
                variant: "solid",
            });
        }

    };

    const handleResendCode = async () => {
        if (verificationCountdown === 0) {
            startCountdown(20);
            // Here you would typically resend the verification code
            const payload: ResendOTPRequest = {
                type: "sign-up",
                email: email,
            };

            try {

                const resultAction = await dispatch(resendOTP(payload));

                if (resendOTP.fulfilled.match(resultAction)) {
                    console.log("Resend success:", resultAction.payload);

                    showNewToast({
                        title: "OTP Resent",
                        description: "A new OTP has been sent to your email",
                        icon: CircleCheckIcon,
                        action: "success",
                        variant: "solid",
                    });
                }
            } catch (error) {
                console.log("Resend failed:", error);
            }
        }
    };

    const handleCloseApp = () => {
        setShowSuccessModal(false);
        // Navigate to main screen or close app
        router.push('/screens/onboarding/login');
    };

    return (
        <ParallaxScrollView headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}>
          

            {/* OTP Verification Component */}
            <OTPVerification
                title="OTP Verification"
                subtitle={`Enter the 5-digit code sent to your email at ${email}`}
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
        </ParallaxScrollView>
    );
}