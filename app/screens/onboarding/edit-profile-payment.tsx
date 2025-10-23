import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { CustomModal } from "../../../components/Custom/CustomModal";
import InputLabelText from "../../../components/Custom/InputLabelText";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { Button } from "../../../components/ui/button";
import { Input, InputField } from "../../../components/ui/input";
import { Toast, ToastDescription, ToastTitle, useToast } from "../../../components/ui/toast";
import { useEditProfileForm } from "../../../hooks/useRedux";
import { ApiError, Bank, CompleteProfilePayload } from "../../../models";
import { AppDispatch, useAppSelector } from "../../../store";
import { completeProfile, setDocument } from "../../../store/slices/profileSlice";
import BankDropdown from "../../../components/Custom/BankDropdown";

export default function EditProfilePayment() {
    const [showModal, setShowModal] = React.useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { profile, loading } = useAppSelector((state) => state.profile);
    const { nextStep } = useEditProfileForm();
    const [bank, setBank] = useState<Bank>();

    // ✅ Define initial form values
    const initialValues = {
        bankName: profile.bankName || "",
        accountName: profile.accountName || "",
        accountNumber: profile.accountNumber || "",
    };
    const toast = useToast();

    const validationSchema = Yup.object().shape({
        bankName: Yup.string().required("Bank name is required"),
        accountName: Yup.string().required("Account name is required"),
        accountNumber: Yup.string()
            .matches(/^\d{10}$/, "Account number must be 10 digits")
            .required("Account number is required"),
    });


    const handleNext = async (values: any) => {
        const formData = {
            bankName: values.bankName,
            accountName: values.accountName,
            accountNumber: values.accountNumber,
        };


        const prof: CompleteProfilePayload = {
            accountType: "pathfinder",
            fullName: profile.fullName,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
            country: profile.country,
            gender: profile.gender,
            state: profile.state,
            city: profile.city,
            location: profile.location,
            identificationType: profile.identificationType,
            licenseNumber: profile.licenseNumber,
            identificationPicture: profile.identificationPicture,
            proofOfAddress: profile.proofOfAddress,
            insuranceResidenceProof: profile.insuranceResidenceProof,
            driverPassport: profile.driverPassport,
            bankName: values.bankName,
            accountName: values.accountName,
            accountNumber: values.accountNumber,
        };
        dispatch(setDocument(formData));


        console.log("Form data:", prof);
        try {
            const resultAction = await dispatch(completeProfile(prof));
            if (completeProfile.fulfilled.match(resultAction)) {

                setShowModal(true);
            } else {
                const errorMessage =
                    (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;

                toast.show({
                    placement: "top",
                    duration: 3000,
                    render: ({ id }) => {
                        return (
                            <Toast nativeID={id}>
                                <ToastTitle>Profile Update Failed</ToastTitle>
                                <ToastDescription>{errorMessage.message}</ToastDescription>
                            </Toast>
                        );
                    },
                });
            }

        } catch (error) {
            console.log("complete profile error:", error);

            toast.show({
                placement: "top",
                duration: 3000,
                render: ({ id }) => {
                    return (
                        <Toast nativeID={id}>
                            <ToastTitle>Profile Update Failed</ToastTitle>
                            <ToastDescription>Something went wrong</ToastDescription>
                        </Toast>
                    );
                },
            });
        }




    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleNext}
        >
            {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue
            }) => (
                <SafeAreaView className="flex-1 bg-white">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 py-4">
                        <TouchableOpacity className="p-2" onPress={() => router.back()}>
                            <AntDesign name="arrowleft" size={24} color="#000" />
                        </TouchableOpacity>

                        <Text className="text-lg font-semibold text-black">
                            Edit Profile
                        </Text>

                        <TouchableOpacity className="p-2">
                            <MaterialIcons name="notifications-none" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Progress Indicator */}
                    <View className="flex-row items-center justify-center px-6 py-6">
                        <View className="flex-row items-center">
                            <View className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                            <View className="w-4" />
                            <View className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                            <View className="w-4" />
                            <View className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                        </View>
                    </View>

                    {/* Form */}
                    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                        <Text className="text-xl font-semibold text-black mb-6">
                            Payment Information
                        </Text>

                        {/* Bank Name */}
                        {/* <BankDropdown values={values} errors={errors} touched={touched} handleChange={ () => setFieldValue} handleBankChange={setBank} > 

                        </BankDropdown> */}

                        {/* Bank Name */}
                        <ThemedView>
                            <InputLabelText className="text-sm text-gray-700 mb-2">Bank Name</InputLabelText>

                            <Input
                                size="xl"
                                className="bg-rose-50 border-0 rounded-lg px-4 py-4 mb-3 min-h-[54px]"
                                variant="outline"
                                isInvalid={!!(errors.bankName && touched.bankName)}
                            >
                                <InputField
                                    className=""
                                    placeholder="Enter Bank Name"
                                    value={values.bankName}
                                    onChangeText={handleChange("bankName")}
                                    //   onBlur={handleBlur("bankName")}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                />
                            </Input>

                            {touched.bankName && errors.bankName && (
                                <ThemedText type="b4_body" className="text-error-500 mb-4">
                                    {errors.bankName}
                                </ThemedText>

                            )}
                        </ThemedView>


                        {/* Account Name */}
                        <ThemedView>
                            <InputLabelText>Account Holder Name</InputLabelText>
                            <Input
                                size="xl"
                                className="bg-rose-50 border-0 rounded-lg px-4 py-4 mb-3 min-h-[54px]"
                                variant="outline"
                                isInvalid={!!(errors.accountName && touched.accountName)}
                            >
                                <InputField
                                    className=""
                                    placeholder="Enter Account Name"
                                    value={values.accountName}
                                    onChangeText={handleChange("accountName")}
                                    //   onBlur={handleBlur("bankName")}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                />
                            </Input>
                        </ThemedView>
                        {touched.accountNumber && errors.accountNumber && (
                            <ThemedText type="b4_body" className="text-error-500 mb-4">
                                {errors.accountNumber}
                            </ThemedText>
                        )}


                        {/* Account Number */}
                        <ThemedView>
                            <InputLabelText>Account Number</InputLabelText>
                            <Input
                                size="xl"
                                className="bg-rose-50 border-0 rounded-lg px-4 py-4 mb-3 min-h-[54px]"
                                variant="outline"
                                isInvalid={!!(errors.accountNumber && touched.accountNumber)}
                            >
                                <InputField
                                    className=""
                                    placeholder="Enter Account Number"
                                    value={values.accountNumber}
                                    onChangeText={handleChange("accountNumber")}
                                    //   onBlur={handleBlur("bankName")}
                                    maxLength={10}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                />
                            </Input>
                        </ThemedView>
                        {touched.accountName && errors.accountName && (
                            <ThemedText type="b4_body" className="text-error-500 mb-4">
                                {errors.accountName}
                            </ThemedText>
                        )}

                    </ScrollView>

                    {/* Submit Button */}
                    <View className="px-6 pb-8">
                        <Button
                            size="xl"
                            className="bg-[#E75B3B] rounded-xl"
                            onPress={() => handleSubmit()}
                        >
                            <ThemedText type="s1_subtitle" className="text-white" style={{ color: 'white' }}>
                                {loading ? <ActivityIndicator color="white" /> : "Update"}
                            </ThemedText>
                        </Button>
                    </View>

                    {/* Success Modal */}
                    <CustomModal
                        description="Welcome to Crowdshipping! You're ready to start sending or receiving packages."
                        title="Profile Setup Successful!"
                        img={require("@/assets/images/onboarding/modal-success.png")}
                        firstBtnLink={"/screens/dashboard"}
                        firstBtnText="Close"
                        setShowModal={setShowModal}
                        showModal={showModal}
                        size="lg"
                    />
                </SafeAreaView>
            )
            }
        </Formik >
    );
}
