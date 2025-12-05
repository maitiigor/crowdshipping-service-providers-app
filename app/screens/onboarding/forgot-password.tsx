import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { useToast } from '../../../components/ui/toast';
import { ApiError } from '../../../models';
import { AppDispatch, useAppSelector } from '../../../store';
import { forgotPassword } from '../../../store/slices/authSlice';



interface ForgotPasswordFormValues {
    email: string;
}

export default function ForgotPasswordScreen() {
    const { t } = useTranslation();
    const { loading } = useAppSelector((state) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const toast = useToast();
    
    const forgotPasswordSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('forget-password.validation.invalid_email'))
            .required(t('forget-password.validation.email_required')),
    });
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
                    title: t('forget-password.toast.success_title'),
                    description: t('forget-password.toast.success_description'),
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
                    title: t('forget-password.toast.failed_title'),
                    description: errorMessage.message,
                    icon: HelpCircleIcon,
                    action: "error",
                    variant: "solid",
                });
            }

        } catch (error) {
            showNewToast({
                title: t('forget-password.toast.unexpected_error_title'),
                description: t('forget-password.toast.unexpected_error_description'),
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
                        {t('forget-password.header_title')}
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
                            {t('forget-password.title')}
                        </ThemedText>
                        <ThemedText className="text-base text-gray-600 leading-6 text-center px-4">
                            {t('forget-password.subtitle')}
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
                                        {t('forget-password.email_label')}
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
                                            placeholder={t('forget-password.email_placeholder')}
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
                                        {loading ? <ActivityIndicator /> : t('forget-password.send_button')}
                                    </ButtonText>
                                </Button>
                            </ThemedView>
                        )}
                    </Formik>
                </ThemedView>


                {/* Bottom Login Link */}
                <ThemedView className="px-6 py-6">
                    <ThemedView className="flex-row justify-center items-center">
                        <ThemedText className="text-gray-600">{t('forget-password.remember_password')} </ThemedText>
                        <TouchableOpacity
                            onPress={() => router.back()}
                        >
                            <ThemedText className="text-[#E75B3B] font-semibold">{t('forget-password.login_link')}</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            </KeyboardAvoidingView >
        </ParallaxScrollView >
    );
}