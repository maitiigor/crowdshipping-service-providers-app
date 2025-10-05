import { Apple, Facebook, Google, Icon } from '@/components/ui/icon'; // icons
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // dropdown select
import { router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Button, ButtonText } from "../../../components/ui/button";
import { Toast, ToastDescription, ToastTitle, useToast } from "../../../components/ui/toast";
import { useEditProfileForm } from "../../../hooks/useRedux";
import { ApiError } from "../../../models";
import { AppDispatch, useAppSelector } from "../../../store";
import { register } from "../../../store/slices/authSlice";


export default function Registration() {

    const { dropdownOptions, editProfile, nextStep } = useEditProfileForm();

    const toast = useToast();
    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required("Full name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phoneNumber: Yup.string().matches(/^\d{10,12}$/, "Invalid phone number").required("Phone number is required"),
        password: Yup.string()
            .required("Password is required")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                "Password must be at least 8 characters and include upper case, lower case, a number and a special character (!@#$%^&*)"
            ),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm password is required"),
    });



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
                                <ToastTitle>Registration Successful 🎉</ToastTitle>
                                <ToastDescription>Welcome onboard!</ToastDescription>
                            </Toast>
                        );
                    },
                });

                setTimeout(() => {
                    router.replace({
                        pathname: '/screens/onboarding/create-pin',
                        params: {
                          type: "sign-up",        // could be "sign-up" | "reset-password" | "change-email"
                          email: values.email,      // pass email dynamically
                        }
                      });
                }, 3000);

            } else {
                const errorMessage =
                    (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;

                toast.show({
                    placement: "top",
                    duration: 3000,
                    render: ({ id }) => {
                        return (
                            <Toast nativeID={id}>
                                <ToastTitle>Registration Failed</ToastTitle>
                                <ToastDescription>{errorMessage.message}</ToastDescription>
                            </Toast>
                        );
                    },
                });
            }
        } catch (error) {
            console.error("🚨 Error dispatching register:", error);
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
                    <View className="flex-row items-center justify-between px-6 py-4">
                        <TouchableOpacity className="p-2" onPress={() => router.back()}>
                            <MaterialIcons name="chevron-left" size={48} color="#E75B3B" />

                        </TouchableOpacity>

                        <Text className="text-lg font-semibold text-black">
                            SignUp
                        </Text>

                        <TouchableOpacity className="p-2">
                            <MaterialIcons
                                name="notifications-none"
                                size={24}
                                color="#000"
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text className="text-xl font-semibold text-black mb-6">
                            Driver Registration
                        </Text>

                        {/* Full Name */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Your Full Name</Text>
                            <TextInput
                                placeholder="Full Name"
                                value={values.fullName}
                                onChangeText={handleChange("fullName")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            />
                            {touched.fullName && errors.fullName && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.fullName}</Text>
                            )}
                        </View>

                        {/* Email */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Email Address</Text>
                            <TextInput
                                placeholder="Email"
                                value={values.email}
                                onChangeText={handleChange("email")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                keyboardType="email-address"
                            />
                            {touched.email && errors.email && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.email}</Text>
                            )}
                        </View>

                        {/* Phone Number */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Phone Number</Text>
                            <View className="flex-row gap-3  items-center">
                                <View className="w-1/4 bg-[#FDF2F0] px-1 rounded-lg">
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

                                </View>
                                <TextInput
                                    value={values.phoneNumber}
                                    onChangeText={handleChange("phoneNumber")}
                                    className="bg-[#FDF2F0] rounded-lg flex-1 w-3/4 px-4 py-4 text-base"
                                    keyboardType="phone-pad"
                                />
                            </View>
                            {touched.phoneNumber && errors.phoneNumber && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.phoneNumber}</Text>
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Password</Text>
                            <TextInput
                                placeholder="********"
                                value={values.password}
                                onChangeText={handleChange("password")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                secureTextEntry
                            />
                            {touched.password && errors.password && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.password}</Text>
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Confirm password</Text>
                            <TextInput
                                placeholder="********"
                                value={values.confirmPassword}
                                onChangeText={handleChange("confirmPassword")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                secureTextEntry
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.confirmPassword}</Text>
                            )}
                        </View>

                        <View className="pb-8">
                            <Button
                                size="xl"
                                className="bg-[#E75B3B] rounded-xl"
                                onPress={() => loading == false ? handleSubmit() : null}
                            >
                                <ButtonText className="text-white font-semibold">{loading ? 'Submitting...' : 'Register'}</ButtonText>
                            </Button>
                        </View>

                        {/* Divider */}
                        <View className="flex-row items-center my-6">
                            <View className="flex-1 h-px bg-gray-300" />
                            <Text className="px-4 text-gray-500 text-sm" style={{ fontFamily: 'Inter-Regular' }}>or</Text>
                            <View className="flex-1 h-px bg-gray-300" />
                        </View>

                        {/* Social Login Buttons */}
                        <View className="flex-row justify-between gap-4">
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
                        </View>

                        {/* Country */}
                        {/* <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Country</Text>
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
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.country}</Text>
                            )}
                        </View> */}

                        {/* Gender */}
                        {/* <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Gender</Text>
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
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.gender}</Text>
                            )}
                        </View> */}

                        {/* State */}
                        {/* <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">State</Text>
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
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.state}</Text>
                            )}
                        </View> */}

                        {/* City */}
                        {/* <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">City</Text>
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
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.city}</Text>
                            )}
                        </View> */}

                        {/* Location */}
                        {/* <View className="mb-8">
                            <Text className="text-sm text-gray-700 mb-2">Location</Text>
                            <TextInput
                                placeholder="Enter Location"
                                value={values.location}
                                onChangeText={handleChange("location")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            />
                            {touched.location && errors.location && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.location}</Text>
                            )}
                        </View> */}
                    </ScrollView>

                    {/* Next Button */}

                </SafeAreaView>
            )}
        </Formik>

    );
}
