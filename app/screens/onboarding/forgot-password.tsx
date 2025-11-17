import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import * as Yup from 'yup';

// UI Components
import { Button, ButtonText } from '@/components/ui/button';
import { ArrowLeftIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { CircleCheckIcon, HelpCircleIcon, LucideIcon } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import CustomToast from '../../../components/Custom/CustomToast';
import InputLabelText from '../../../components/Custom/InputLabelText';
import ParallaxScrollView from '../../../components/ParallaxScrollView';
import { ThemedView } from '../../../components/ThemedView';
import { useToast } from '../../../components/ui/toast';
import { ApiError } from '../../../models';
import { AppDispatch, useAppSelector } from '../../../store';
import { forgotPassword } from '../../../store/slices/authSlice';
import { ThemedText } from '../../../components/ThemedText';

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
    const { loading } = useAppSelector((state) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const toast = useToast();
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
    const handleForgotPassword = async (values: ForgotPasswordFormValues) => {

        const formData = {
            email: values.email,
        }

        try {
            const resultAction = await dispatch(forgotPassword(formData));

            if (forgotPassword.fulfilled.match(resultAction)) {
                console.log("Forgot password success:", resultAction.payload);

                showNewToast({
                    title: "Password Reset Email Sent",
                    description: "Please check your email for the reset link",
                    icon: CircleCheckIcon,
                    action: "success",
                    variant: "solid",
                });

                setTimeout(() => {
                    router.push({
                        pathname: '/screens/onboarding/create-pin',
                        params: {
                            type: "password-reset",        // could be "sign-up" | "password-reset" | "change-email"
                            email: values.email,      // pass email dynamically
                        }
                    });
                }, 2000);
            } else {
                const errorMessage =
                    (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;
                showNewToast({
                    title: "Password Reset Failed",
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

    return (
        <ParallaxScrollView headerBackgroundColor={{ light: "white", dark: "#353636" }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >

                {/* Header */}
                <ThemedView className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2 -ml-2"
                    >
                        <Icon as={ArrowLeftIcon} size="lg" className="text-gray-700" />
                    </TouchableOpacity>

                    <ThemedText className="text-lg font-semibold text-gray-900">
                        Forgot Password
                    </ThemedText>

                    <ThemedView className="w-8" />
                </ThemedView>

                {/* Content */}
                <ThemedView className="flex-1 px-6 pt-8">
                    {/* Icon */}
                    <ThemedView className="items-center mb-8">
                        <Image
                            alt="Lock"
                            source={require("@/assets/images/onboarding/lock.png")}
                            className="w-auto h-[100px]"
                            resizeMode="contain"
                        />
                    </ThemedView>

                    {/* Title and Description */}
                    <ThemedView className="mb-8">
                        <ThemedText className="text-2xl font-bold text-gray-900 mb-4 text-center">
                            Forgot your password?
                        </ThemedText>
                        <ThemedText className="text-base text-gray-600 leading-6 text-center px-4">
                            Enter your registered email below to receive password reset instruction
                        </ThemedText>
                    </ThemedView>

                    {/* Forgot Password Form */}
                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={forgotPasswordSchema}
                        onSubmit={handleForgotPassword}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <ThemedView className="space-y-6">
                                {/* Email Input */}
                                <ThemedView>
                                    <InputLabelText>
                                        Email address
                                    </InputLabelText>
                                    <Input
                                        variant="outline"
                                        size="lg"
                                        className={`${errors.email && touched.email
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                            } bg-rose-50 rounded-lg border-0 min-h-[54px]`}
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
                                        <ThemedText className="text-red-500 text-sm mt-1">
                                            {errors.email}
                                        </ThemedText>
                                    )}
                                </ThemedView>

                                {/* Send Button */}
                                <Button
                                    size="lg"
                                    className="bg-[#E75B3B] mt-12 h-[48px] rounded-xl"
                                    onPress={() => handleSubmit()}
                                    disabled={loading}
                                >
                                    <ButtonText className="text-white font-semibold text-base">
                                        {loading ? <ActivityIndicator /> : 'Send'}
                                    </ButtonText>
                                </Button>
                            </ThemedView>
                        )}
                    </Formik>
                </ThemedView>


                {/* Bottom Login Link */}
                <ThemedView className="px-6 py-6">
                    <ThemedView className="flex-row justify-center items-center">
                        <ThemedText className="text-gray-600">You remember your password? </ThemedText>
                        <TouchableOpacity
                            onPress={() => router.back()}
                        >
                            <ThemedText className="text-[#E75B3B] font-semibold">Login</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            </KeyboardAvoidingView >
        </ParallaxScrollView >
    );
}