import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

// UI Components
import { Button, ButtonText } from '@/components/ui/button';
import { Apple, ArrowLeftIcon, EyeIcon, EyeOffIcon, Facebook, Google, Icon } from '@/components/ui/icon';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CircleCheckIcon, HelpCircleIcon, LucideIcon } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import CustomToast from '../../../components/Custom/CustomToast';
import ParallaxScrollView from '../../../components/ParallaxScrollView';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { useToast } from '../../../components/ui/toast';
import { ApiError, LoginFormValues } from '../../../models';
import { AppDispatch, useAppSelector } from '../../../store';
import { login, setHasLaunched, setRestoring } from '../../../store/slices/authSlice';
import { getUserProfile } from '../../../store/slices/profileSlice';


// Validation Schema
const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
});

export default function LoginScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const loading = useAppSelector((state) => state.auth.loading);
    const toast = useToast();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        AsyncStorage.setItem("hasLaunched", "true");
        dispatch(setHasLaunched(true));
        dispatch(setRestoring(false));
    }, [dispatch]);

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

    const handleLogin = async (values: LoginFormValues) => {
        console.log(values);
        const resultAction = await dispatch(login(values));


        try {
            if (login.fulfilled.match(resultAction)) {
                console.log(resultAction.payload.data)
                if (resultAction.payload.data.status === "pending") {
                    router.replace({
                        pathname: '/screens/onboarding/create-pin',
                        params: {
                            type: "sign-up",        // could be "sign-up" | "password-reset" | "change-email"
                            email: values.email,      // pass email dynamically
                        }
                    });
                } else if (resultAction.payload.data.user.kycStatus === "pending") {

                    showNewToast({
                        title: "Login Successful",
                        description: "Welcome back!",
                        icon: CircleCheckIcon,
                        action: "success",
                        variant: "solid",
                    });
                    router.replace('/screens/onboarding/edit-profile');

                } else {
                    showNewToast({
                        title: "Login Successful",
                        description: "Welcome back!",
                        icon: CircleCheckIcon,
                        action: "success",
                        variant: "solid",
                    });

                    dispatch(getUserProfile());

                    setTimeout(() => {
                        router.replace('/screens/dashboard');
                    }, 2000);

                }
            } else {

                const errorMessage =
                    (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;
                console.log("Login failed:", errorMessage);

                showNewToast({
                    title: "Login Failed",
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

    const handleSocialLogin = (provider: 'facebook' | 'google' | 'apple') => {
        console.log(`Login with ${provider}`);
        // TODO: Implement social login
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ParallaxScrollView
                    headerBackgroundColor={{ light: "white", dark: "#353636" }}
                >
                    {/* Header */}
                    <ThemedView className="flex-row items-center justify-between px-6 py-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="p-2 -ml-2"
                        >
                            <Icon as={ArrowLeftIcon} size="lg" className="text-gray-700" />
                        </TouchableOpacity>

                        <ThemedText className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Poppins-SemiBold' }}>
                            Login
                        </ThemedText>

                        <ThemedView className="w-8" />
                    </ThemedView>

                    {/* Content */}
                    <ThemedView className="flex-1 px-6 pt-8">
                        {/* Welcome Text */}
                        <ThemedView className="mb-8">
                            <ThemedText className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins-Bold' }}>
                                Welcome Back
                            </ThemedText>
                            <ThemedText className="text-base text-gray-600 leading-6" style={{ fontFamily: 'Inter-Regular' }}>
                                Sign in to your account to accept and track deliveries
                            </ThemedText>
                        </ThemedView>

                        {/* Login Form */}
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={loginSchema}
                            onSubmit={handleLogin}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <ThemedView className="space-y-6">
                                    {/* Email Input */}
                                    <ThemedView>
                                        <ThemedText className="text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Inter-Regular' }}>
                                            Email address
                                        </ThemedText>
                                        <Input
                                            variant="outline"
                                            size="lg"
                                            className={`${errors.email && touched.email
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                } bg-rose-50 border-0 rounded-lg px-4 py mb-3-6 min-h-[54px]`}
                                        >
                                            <InputField
                                                placeholder="user@gmail.com"
                                                value={values.email}
                                                onChangeText={handleChange('email')}
                                                onBlur={handleBlur('email')}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                className="text-gray-800"
                                            />
                                        </Input>
                                        {errors.email && touched.email && (
                                            <ThemedText className="text-red-500 text-sm mt-1">
                                                {errors.email}
                                            </ThemedText>
                                        )}
                                    </ThemedView>

                                    {/* Password Input */}
                                    <ThemedView>
                                        <ThemedText className="text-sm font-medium text-gray-700  mt-8 mb-3" style={{ fontFamily: 'Inter-Regular' }}>
                                            Password
                                        </ThemedText>
                                        <Input
                                            variant="outline"
                                            size="lg"
                                            className={`${errors.password && touched.password
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                } bg-rose-50 border-0 rounded-lg px-4 min-h-[54px]`}
                                        >
                                            <InputField
                                                placeholder="••••••••"
                                                value={values.password}
                                                onChangeText={handleChange('password')}
                                                onBlur={handleBlur('password')}
                                                secureTextEntry={!showPassword}
                                                autoComplete="password"
                                                className="text-gray-800"
                                            />
                                            {touched.password && errors.password && (
                                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.password}</ThemedText>
                                            )}
                                            <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                                                <Icon
                                                    as={showPassword ? EyeOffIcon : EyeIcon}
                                                    size="md"
                                                    className="text-gray-500"
                                                />
                                            </InputSlot>
                                        </Input>
                                        {touched.password && errors.password && (
                                            <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.password}</ThemedText>
                                        )}
                                    </ThemedView>

                                    {/* Login Button */}
                                    <Button
                                        size="lg"
                                        className="bg-[#E75B3B] h-[48px] mt-8 mb-3 rounded-xl"
                                        onPress={() => handleSubmit()}
                                        disabled={loading}
                                    >
                                        <ButtonText className="text-white font-semibold text-base" style={{ fontFamily: 'Poppins-SemiBold' }}>
                                            {loading ? <ActivityIndicator color="white" /> : 'Login'}
                                        </ButtonText>
                                    </Button>

                                    {/* Forgot Password */}
                                    <TouchableOpacity
                                        onPress={() => router.push('/screens/onboarding/forgot-password')}
                                        className="items-center py-2"
                                    >
                                        <ThemedText className="text-[#E75B3B] mt-3 font-medium" style={{ fontFamily: 'Inter-Regular' }}>
                                            Forgot Password?
                                        </ThemedText>
                                    </TouchableOpacity>

                                    {/* Divider */}
                                    <ThemedView className="flex-row items-center my-6">
                                        <ThemedView className="flex-1 h-px bg-gray-300" />
                                        <ThemedText className="px-4 text-gray-500 text-sm" style={{ fontFamily: 'Inter-Regular' }}>or</ThemedText>
                                        <ThemedView className="flex-1 h-px bg-gray-300" />
                                    </ThemedView>

                                    {/* Social Login Buttons */}
                                    <ThemedView className="flex-row justify-between gap-4">
                                        {/* Facebook */}
                                        <TouchableOpacity
                                            onPress={() => handleSocialLogin('facebook')}
                                            className="flex-1 bg-white border border-gray-300 rounded-xl py-4 items-center justify-center shadow-sm"
                                        >
                                            <Icon as={Facebook} size='xl'></Icon>
                                        </TouchableOpacity>

                                        {/* Google */}
                                        <TouchableOpacity
                                            onPress={() => handleSocialLogin('google')}
                                            className="flex-1 bg-white border border-gray-300 rounded-xl py-4 items-center justify-center shadow-sm"
                                        >
                                            <Icon as={Google} size='xl'></Icon>
                                        </TouchableOpacity>

                                        {/* Apple */}
                                        <TouchableOpacity
                                            onPress={() => handleSocialLogin('apple')}
                                            className="flex-1 bg-white border border-gray-300 rounded-xl py-4 items-center justify-center shadow-sm"
                                        >
                                            <Icon as={Apple} size='xl'></Icon>
                                        </TouchableOpacity>
                                    </ThemedView>
                                </ThemedView>
                            )}
                        </Formik>
                    </ThemedView>
                </ParallaxScrollView>

                {/* Bottom Sign Up Link */}
                <ThemedView className="px-6 py-6 border-t border-gray-200">
                    <ThemedView className="flex-row justify-center items-center">
                        <ThemedText className="text-gray-600" style={{ fontFamily: 'Inter-Regular' }}>You don't have an account? </ThemedText>
                        <TouchableOpacity
                            onPress={() => router.push('/screens/onboarding/welcome')}
                        >
                            <ThemedText className="text-[#E75B3B] font-semibold" style={{ fontFamily: 'Inter-Regular' }}>Sign up</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}