import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import {
    ActivityIndicator,
    Image,
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
import { CircleCheckIcon, HelpCircleIcon, LucideIcon } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import CustomToast from '../../../components/Custom/CustomToast';
import InputLabelText from '../../../components/Custom/InputLabelText';
import { useToast } from '../../../components/ui/toast';
import { ApiError } from '../../../models';
import { AppDispatch, useAppSelector } from '../../../store';
import { forgotPassword } from '../../../store/slices/authSlice';

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
                            <Image
                                alt="Lock"
                                source={require("@/assets/images/onboarding/lock.png")}
                                className="w-auto h-[100px]"
                                resizeMode="contain"
                            />
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
                                        disabled={loading}
                                    >
                                        <ButtonText className="text-white font-semibold text-base">
                                            {loading ? <ActivityIndicator /> : 'Send'}
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