import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

// UI Components
import { Button, ButtonText } from '@/components/ui/button';
import { ArrowLeftIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';

// Validation Schema
const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
});

interface ForgotPasswordFormValues {
    email: string;
}

export default function ForgotPasswordScreen() {
    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPassword = async (values: ForgotPasswordFormValues) => {
        setIsLoading(true);
        try {
            // TODO: Implement actual forgot password logic
            console.log('Forgot password values:', values);
                //  router.replace({
                //                     pathname: '/screens/onboarding/create-pin',
                //                     params: {
                //                       type: "sign-up",        // could be "sign-up" | "reset-password" | "change-email"
                //                       email: values.email,      // pass email dynamically
                //                     }
                //                   });
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Navigate to success screen or show success message
            // router.push('/screens/onboarding/forgot-password-success');
        } catch (error) {
            console.error('Forgot password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 py-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="p-2 -ml-2"
                        >
                            <Icon as={ArrowLeftIcon} size="lg" className="text-gray-700" />
                        </TouchableOpacity>

                        <Text className="text-lg font-semibold text-gray-900">
                            Forgot Password
                        </Text>

                        <View className="w-8" />
                    </View>

                    {/* Content */}
                    <View className="flex-1 px-6 pt-8">
                        {/* Icon */}
                        <View className="items-center mb-8">
                            <View className="w-20 h-20 bg-[#E75B3B] rounded-2xl items-center justify-center mb-6 relative">
                                <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                                    <Text className="text-[#E75B3B] text-2xl">🔑</Text>
                                </View>
                                {/* Question mark indicator */}
                                <View className="absolute -top-1 -right-1 w-6 h-6 bg-[#E75B3B] rounded-full items-center justify-center border-2 border-white">
                                    <Text className="text-white text-xs font-bold">?</Text>
                                </View>
                            </View>
                        </View>

                        {/* Title and Description */}
                        <View className="mb-8">
                            <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
                                Forgot your password?
                            </Text>
                            <Text className="text-base text-gray-600 leading-6 text-center px-4">
                                Enter your registered email below to receive password reset instruction
                            </Text>
                        </View>

                        {/* Forgot Password Form */}
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={forgotPasswordSchema}
                            onSubmit={handleForgotPassword}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View className="space-y-6">
                                    {/* Email Input */}
                                    <View>
                                        <Text className="text-sm font-medium text-gray-700 mb-2">
                                            Email address
                                        </Text>
                                        <Input
                                            variant="outline"
                                            size="lg"
                                            className={`${errors.email && touched.email
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                } bg-rose-50 border-0 min-h-[54px]`}
                                        >
                                            <InputField
                                                placeholder="user@gmail.com"
                                                value={values.email}
                                                onChangeText={handleChange('email')}
                                                onBlur={handleBlur('email')}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                className="text-gray-80"
                                            />
                                        </Input>
                                        {errors.email && touched.email && (
                                            <Text className="text-red-500 text-sm mt-1">
                                                {errors.email}
                                            </Text>
                                        )}
                                    </View>

                                    {/* Send Button */}
                                    <Button
                                        size="lg"
                                        className="bg-[#E75B3B] mt-12 h-[48px] rounded-xl"
                                        onPress={() => handleSubmit()}
                                        disabled={isLoading}
                                    >
                                        <ButtonText className="text-white font-semibold text-base">
                                            {isLoading ? 'Sending...' : 'Send'}
                                        </ButtonText>
                                    </Button>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>

                {/* Bottom Login Link */}
                <View className="px-6 py-6">
                    <View className="flex-row justify-center items-center">
                        <Text className="text-gray-600">You remember your password? </Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                        >
                            <Text className="text-[#E75B3B] font-semibold">Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}