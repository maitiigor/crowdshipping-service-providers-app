import { Apple, Facebook, Google, Icon } from '@/components/ui/icon'; // icons
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // dropdown select
import { router } from "expo-router";
import { Formik } from "formik";
import { HelpCircleIcon, LucideIcon } from 'lucide-react-native';
import React from "react";
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    TextInput,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import CustomToast from '../../../components/Custom/CustomToast';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Button, ButtonText } from "../../../components/ui/button";
import { Toast, ToastDescription, ToastTitle, useToast } from "../../../components/ui/toast";
import { useEditProfileForm } from "../../../hooks/useRedux";
import { ApiError } from "../../../models";
import { AppDispatch, useAppSelector } from "../../../store";
import { register } from "../../../store/slices/authSlice";


export default function Registration() {
    const { t } = useTranslation();
    const { dropdownOptions, editProfile, nextStep } = useEditProfileForm();

    const toast = useToast();
    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required(t('signup.full_name_required')),
        email: Yup.string().email(t('signup.validation.invalid_email')).required(t('signup.validation.email_required')),
        phoneNumber: Yup.string().matches(/^\d{10,12}$/, t('signup.invalid_phone')).required(t('signup.phone_required')),
        password: Yup.string()
            .required(t('signup.validation.password_required'))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                t('signup.password_complex')
            ),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], t('signup.validation.confirm_password_match'))
            .required(t('signup.validation.confirm_password_required')),
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



    const dispatch = useDispatch<AppDispatch>();

    const loading = useAppSelector((state) => state.auth.loading);


    const onSubmit = async (values: any) => {
        try {

            const formData = {
                fullName: values.fullName,
                email: values.email,
                phoneNumber: "(" + values.countryCode + ")" + values.phoneNumber.replace(/\s/g, "").replace(/^0/, ""),
                password: values.password,
                confirmPassword: values.confirmPassword,
                accountType: values.accountType,
            }


            const resultAction = await dispatch(register(formData));
            if (register.fulfilled.match(resultAction)) {
                toast.show({
                    placement: "top", // or "bottom"
                    duration: 3000,
                    render: ({ id }) => {
                        return (
                            <Toast nativeID={id} action="success">
                                <ToastTitle>{t('signup.toast.success_title')}</ToastTitle>
                                <ToastDescription>{t('signup.toast.success_description')}</ToastDescription>
                            </Toast>
                        );
                    },
                });

                setTimeout(() => {
                    router.push({
                        pathname: '/screens/onboarding/create-pin',
                        params: {
                            type: "sign-up",        // could be "sign-up" | "password-reset" | "change-email"
                            email: values.email,      // pass email dynamically
                        }
                    });
                }, 3000);

            } else {
                const errorMessage =
                    (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;

                showNewToast({
                    title: t('signup.toast.failed_title'),
                    description: errorMessage.message,
                    icon: HelpCircleIcon,
                    action: "success",
                    variant: "solid",
                });

            }
        } catch (error) {
            console.error("🚨 Error dispatching register:", error);
            showNewToast({
                title: t('signup.toast.unexpected_error_title'),
                description: t('signup.toast.unexpected_error_description'),
                icon: HelpCircleIcon,
                action: "error",
                variant: "solid",
            });
        }
    };

    const handleLogin = async (values: any) => {

    };

    const handleSocialLogin = (provider: 'facebook' | 'google' | 'apple') => {
        console.log(`Login with ${provider}`);
        // TODO: Implement social login
    };
    return (
        <Formik
            initialValues={{
                fullName: "",
                email: "",
                phoneNumber: "",
                password: "",
                confirmPassword: "",
                accountType: "pathfinder",
                country: "",
                gender: "",
                state: "",
                city: "",
                location: "",
                countryCode: "+234",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
                <SafeAreaView className="flex-1 bg-white">
                    {/* Header */}
                    <ThemedView className="flex-row items-center justify-between px-6 py-4">
                        <TouchableOpacity className="p-2" onPress={() => router.back()}>
                            <MaterialIcons name="chevron-left" size={48} color="#E75B3B" />

                        </TouchableOpacity>

                        <ThemedText className="text-lg font-semibold text-black">
                            {t('signup.header_title')}
                        </ThemedText>

                        <TouchableOpacity className="p-2">
                            <MaterialIcons
                                name="notifications-none"
                                size={24}
                                color="#000"
                            />
                        </TouchableOpacity>
                    </ThemedView>

                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                    >
                        <ThemedText className="text-xl font-semibold text-black mb-6">
                            {t('signup.driver_registration')}
                        </ThemedText>

                        {/* Full Name */}
                        <ThemedView className="mb-4">
                            <ThemedText className="text-sm text-gray-700 mb-2">{t('signup.full_name_label')}</ThemedText>
                            <TextInput
                                placeholder={t('signup.full_name_placeholder')}
                                value={values.fullName}
                                onChangeText={handleChange("fullName")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            />
                            {touched.fullName && errors.fullName && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.fullName}</ThemedText>
                            )}
                        </ThemedView>

                        {/* Email */}
                        <ThemedView className="mb-4">
                            <ThemedText className="text-sm text-gray-700 mb-2">{t('signup.email_label')}</ThemedText>
                            <TextInput
                                placeholder={t('signup.email_placeholder')}
                                value={values.email}
                                onChangeText={handleChange("email")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                keyboardType="email-address"
                            />
                            {touched.email && errors.email && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.email}</ThemedText>
                            )}
                        </ThemedView>

                        {/* Phone Number */}
                        <ThemedView className="mb-4">
                            <ThemedText className="text-sm text-gray-700 mb-2">{t('signup.phone_label')}</ThemedText>
                            <ThemedView className="flex-row gap-3  items-center">
                                <ThemedView className="w-1/4 bg-[#FDF2F0] px-1 rounded-lg">
                                    <Picker
                                        selectedValue={values.countryCode}
                                        style={{ width: 100 }}
                                        onValueChange={handleChange("countryCode")}
                                    >
                                        {dropdownOptions.countryCodes.map((code) => (
                                            <Picker.Item
                                                key={code.value}
                                                label={code.label}
                                                value={code.value}
                                            />
                                        ))}
                                    </Picker>

                                </ThemedView>
                                <TextInput
                                    value={values.phoneNumber}
                                    onChangeText={handleChange("phoneNumber")}
                                    className="bg-[#FDF2F0] rounded-lg flex-1 w-3/4 px-4 py-4 text-base"
                                    keyboardType="phone-pad"
                                />
                            </ThemedView>
                            {touched.phoneNumber && errors.phoneNumber && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.phoneNumber}</ThemedText>
                            )}
                        </ThemedView>

                        <ThemedView className="mb-4">
                            <ThemedText className="text-sm text-gray-700 mb-2">{t('signup.password_label')}</ThemedText>
                            <TextInput
                                placeholder="********"
                                value={values.password}
                                onChangeText={handleChange("password")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                secureTextEntry
                            />
                            {touched.password && errors.password && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.password}</ThemedText>
                            )}
                        </ThemedView>

                        <ThemedView className="mb-4">
                            <ThemedText className="text-sm text-gray-700 mb-2">{t('signup.confirm_password_label')}</ThemedText>
                            <TextInput
                                placeholder={t('signup.confirm_password_placeholder')}
                                value={values.confirmPassword}
                                onChangeText={handleChange("confirmPassword")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                secureTextEntry
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.confirmPassword}</ThemedText>
                            )}
                        </ThemedView>

                        <ThemedView className="pb-8">
                            <Button
                                size="xl"
                                className="bg-[#E75B3B] rounded-xl"
                                onPress={() => loading == false ? handleSubmit() : null}
                            >
                                <ButtonText className="text-white font-semibold">{loading ? t('signup.submitting') : t('signup.register_button')}</ButtonText>
                            </Button>
                        </ThemedView>

                        {/* Divider */}
                        <ThemedView className="flex-row items-center my-6">
                            <ThemedView className="flex-1 h-px bg-gray-300" />
                            <ThemedText className="px-4 text-gray-500 text-sm" style={{ fontFamily: 'Inter-Regular' }}>{t('signup.or_divider')}</ThemedText>
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

                        {/* Country */}
                        {/* <ThemedView className="mb-4">
                            <ThemedText className="text-sm text-gray-700 mb-2">Country</ThemedText>
                            <Picker
                                selectedValue={values.country}
                                onValueChange={handleChange("country")}
                                style={{ backgroundColor: "#FDF2F0", borderRadius: 50 }}
                            >
                                {dropdownOptions.countries.map((country) => (
                                    <Picker.Item
                                        key={country.value}
                                        label={country.label}
                                        value={country.value}
                                    />
                                ))}
                            </Picker>
                            {touched.country && errors.country && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.country}</ThemedText>
                            )}
                        </ThemedView> */}

                        {/* Gender */}
                        {/* <ThemedView className="mb-4">
                            <ThemedText className="text-sm text-gray-700 mb-2">Gender</ThemedText>
                            <Picker
                                selectedValue={values.gender}
                                onValueChange={handleChange("gender")}
                                style={{ backgroundColor: "#FDF2F0", borderRadius: 50 }}
                            >
                                {dropdownOptions.genders.map((gender) => (
                                    <Picker.Item
                                        key={gender.value}
                                        label={gender.label}
                                        value={gender.value}
                                    />
                                ))}
                            </Picker>
                            {touched.gender && errors.gender && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.gender}</ThemedText>
                            )}
                        </ThemedView> */}

                        {/* State */}
                        {/* <ThemedView className="mb-4">
                            <ThemedText className="text-sm text-gray-700 mb-2">State</ThemedText>
                            <Picker
                                selectedValue={values.state}
                                onValueChange={handleChange("state")}
                                style={{ backgroundColor: "#FDF2F0", borderRadius: 50 }}
                            >
                                {dropdownOptions.states.map((state) => (
                                    <Picker.Item
                                        key={state.value}
                                        label={state.label}
                                        value={state.value}
                                    />
                                ))}
                            </Picker>
                            {touched.state && errors.state && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.state}</ThemedText>
                            )}
                        </ThemedView> */}

                        {/* City */}
                        {/* <ThemedView className="mb-4">
                            <ThemedText className="text-sm text-gray-700 mb-2">City</ThemedText>
                            <Picker
                                selectedValue={values.city}
                                onValueChange={handleChange("city")}
                                style={{ backgroundColor: "#FDF2F0", borderRadius: 50 }}
                            >
                                {dropdownOptions.cities.map((city) => (
                                    <Picker.Item
                                        key={city.value}
                                        label={city.label}
                                        value={city.value}
                                    />
                                ))}
                            </Picker>
                            {touched.city && errors.city && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.city}</ThemedText>
                            )}
                        </ThemedView> */}

                        {/* Location */}
                        {/* <ThemedView className="mb-8">
                            <ThemedText className="text-sm text-gray-700 mb-2">Location</ThemedText>
                            <TextInput
                                placeholder="Enter Location"
                                value={values.location}
                                onChangeText={handleChange("location")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            />
                            {touched.location && errors.location && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.location}</ThemedText>
                            )}
                        </ThemedView> */}
                    </ScrollView>

                    {/* Next Button */}

                </SafeAreaView>
            )}
        </Formik>

    );
}
