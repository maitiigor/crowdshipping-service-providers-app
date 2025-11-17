import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import { CircleCheckIcon, HelpCircleIcon, LucideIcon } from 'lucide-react-native';
import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    TextInput,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import CustomToast from '../../../components/Custom/CustomToast';
import InputLabelText from '../../../components/Custom/InputLabelText';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Button, ButtonText } from "../../../components/ui/button";
import { useToast } from "../../../components/ui/toast";
import { useEditProfileForm } from "../../../hooks/useRedux";
import { ApiError } from "../../../models";
import { AppDispatch, useAppSelector } from "../../../store";
import { resetPassword } from "../../../store/slices/authSlice";


export default function ResetPassword() {

    const { dropdownOptions, editProfile, nextStep } = useEditProfileForm();

    const toast = useToast();
    const validationSchema = Yup.object().shape({
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

    const { loading } = useAppSelector((state) => state.auth);


    const onSubmit = async (values: any) => {
        try {

            const formData = {
                confirmPassword: values.confirmPassword,
                password: values.password,
            }


            const resultAction = await dispatch(resetPassword(formData));
            if (resetPassword.fulfilled.match(resultAction)) {
                showNewToast({
                    title: "Password Reset Successful",
                    description: "Your password has been reset",
                    icon: CircleCheckIcon,
                    action: "success",
                    variant: "solid",
                });

                router.replace('/screens/onboarding/login');


            } else {
                const errorMessage =
                    (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;
                console.log("Registration failed:", errorMessage);
                showNewToast({
                    title: "Registration Failed",
                    description: errorMessage.message,
                    icon: HelpCircleIcon,
                    action: "error",
                    variant: "solid",
                });

            }
        } catch (error) {
            console.error("🚨 Error dispatching register:", error);
            showNewToast({
                title: "Unexpected Error 🚨",
                description: "Please try again later",
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
                password: "",
                confirmPassword: "",
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
                            Reset Password
                        </ThemedText>

                    </ThemedView>

                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                    >
                        <ThemedView className="flex-1 ">
                            <ThemedText type="h4_header" className="my-2">
                                Reset Account
                            </ThemedText>
                        </ThemedView>


                        <ThemedView className="mb-4">
                            <ThemedText className="text-sm text-gray-700 mb-2">Password</ThemedText>
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
                            <InputLabelText>Confirm password</InputLabelText>

                            <TextInput
                                placeholder="********"
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
                                <ButtonText className="text-white font-semibold">{loading ? <ActivityIndicator /> : 'Change Password'}</ButtonText>
                            </Button>
                        </ThemedView>

                    </ScrollView>

                    {/* Next Button */}

                </SafeAreaView>
            )}
        </Formik>

    );
}
