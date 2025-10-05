'use client';
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Button, ButtonText } from "./button";

interface OTPVerificationProps {
    title: string;
    subtitle: string;
    pinLength?: number;
    onVerify: (pin: string) => void;
    onResend?: () => void;
    buttonText?: string;
    showResend?: boolean;
    resendCountdown?: number;
    onBack?: () => void;
}

export default function OTPVerification({
    title,
    subtitle,
    pinLength = 4,
    onVerify,
    onResend,
    buttonText = "Verify",
    showResend = true,
    resendCountdown = 0,
    onBack
}: OTPVerificationProps) {
    const [pin, setPin] = useState('');
    const [countdown, setCountdown] = useState(resendCountdown);

    // Countdown timer effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Initialize countdown
    useEffect(() => {
        setCountdown(resendCountdown);
    }, [resendCountdown]);

    const handleNumberPress = (number: string) => {
        if (pin.length < pinLength) {
            const newPin = pin + number;
            setPin(newPin);

            // Auto-submit for 4-digit PINs (payment flow)
            if (pinLength === 4 && newPin.length === 4) {
                setTimeout(() => {
                    onVerify(newPin);
                }, 300);
            }
        }
    };

    const handleBackspace = () => {
        setPin(pin.slice(0, -1));
    };

    const handleVerify = () => {
        if (pin.length === pinLength) {
            onVerify(pin);
        }
    };

    const handleResendCode = () => {
        if (countdown === 0 && onResend) {
            setCountdown(20);
            onResend();
        }
    };

    const renderPinBoxes = () => {
        return (
            <View className="flex-row justify-center items-center mb-8 gap-4">
                {Array.from({ length: pinLength }, (_, index) => (
                    <View
                        key={index}
                        className={`${pinLength === 4
                            ? 'w-16 h-16 rounded-2xl border-2'
                            : 'w-20 h-24 rounded-2xl border-2'
                            } ${pin[index]
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-300 bg-white'
                            } items-center justify-center`}
                    >
                        {pinLength === 4 ? (
                            // For payment PIN - show filled dots
                            <View className={`w-4 h-4 rounded-full ${pin[index] ? 'bg-orange-500' : 'bg-transparent'
                                }`} />
                        ) : (
                            // For OTP - show numbers
                            <Text className="text-2xl font-semibold text-black">
                                {pin[index] || ''}
                            </Text>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const renderKeypadButton = (number: string, letters?: string) => (
        <TouchableOpacity
            className="w-1/3 h-16 bg-white border border-gray-200 items-center justify-center rounded-lg"
            onPress={() => handleNumberPress(number)}
        >
            <Text className="text-2xl font-semibold text-black">{number}</Text>
            {letters && (
                <Text className="text-xs text-gray-500 mt-1">{letters}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View className="flex-1">
            {/* Title and Instructions */}
            <View className="px-6 mb-8 mt-8">
                <Text className="text-xl font-semibold text-black text-center mb-2">
                    {title}
                </Text>
                <Text className="text-gray-600 text-center">
                    {subtitle}
                </Text>
            </View>

            {/* PIN Input Boxes */}
            <View className="px-6">
                {renderPinBoxes()}
            </View>

            {/* Verify Button - Only show for OTP (5-digit), not for PIN (4-digit) */}
            {pinLength !== 4 && (
                <View className="px-6 mb-8">
                    <Button
                        size="xl"
                        className="bg-[#E75B3B] rounded-xl"
                        onPress={handleVerify}
                        disabled={pin.length !== pinLength}
                    >
                        <ButtonText className="text-white font-semibold">
                            {buttonText}
                        </ButtonText>
                    </Button>
                </View>
            )}

            {/* Continue Button for PIN (4-digit) */}
            {pinLength === 4 && (
                <View className="px-6 mb-8">
                    <TouchableOpacity
                        className={`py-4 rounded-xl ${pin.length === 4 ? 'bg-orange-500' : 'bg-gray-300'
                            }`}
                        onPress={handleVerify}
                        disabled={pin.length !== 4}
                    >
                        <Text className={`text-center font-semibold ${pin.length === 4 ? 'text-white' : 'text-gray-500'
                            }`}>
                            Continue →
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Resend Code */}
            {showResend && (
                <View className="items-center mb-8 px-6">
                    <TouchableOpacity onPress={handleResendCode} disabled={countdown > 0}>
                        <Text className={`text-base ${countdown > 0 ? 'text-gray-400' : 'text-black'}`}>
                            Send code again {countdown > 0 && `00:${countdown.toString().padStart(2, '0')}`}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Keypad */}
            <View className="flex-1 justify-end pb-8">
                <View className="bg-gray-50 p-4 rounded-t-3xl">
                    {/* Row 1 */}
                    <View className="flex-row gap-1 justify-between mb-2">
                        {renderKeypadButton("1")}
                        {renderKeypadButton("2", "ABC")}
                        {renderKeypadButton("3", "DEF")}
                    </View>

                    {/* Row 2 */}
                    <View className="flex-row gap-1 justify-between mb-2">
                        {renderKeypadButton("4", "GHI")}
                        {renderKeypadButton("5", "JKL")}
                        {renderKeypadButton("6", "MNO")}
                    </View>

                    {/* Row 3 */}
                    <View className="flex-row gap-1 justify-between mb-2">
                        {renderKeypadButton("7", "PQRS")}
                        {renderKeypadButton("8", "TUV")}
                        {renderKeypadButton("9", "WXYZ")}
                    </View>

                    {/* Row 4 */}
                    <View className="flex-row gap-1 justify-between">
                        <View className="w-1/3 h-16" />
                        {renderKeypadButton("0")}
                        <TouchableOpacity
                            className="w-1/3 h-16 bg-white border border-gray-200 items-center justify-center rounded-lg"
                            onPress={handleBackspace}
                        >
                            <AntDesign name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}