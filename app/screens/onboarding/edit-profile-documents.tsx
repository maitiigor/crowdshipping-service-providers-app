import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Button, ButtonText } from "../../../components/ui/button";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    ActionsheetScrollView,
} from "../../../components/ui/select/select-actionsheet";
import { useEditProfileForm } from "../../../hooks/useRedux";
import { AppDispatch, useAppSelector } from "../../../store";
import { uploadDocument } from "../../../store/slices/profileSlice";


export default function EditProfileDocuments() {

    const dispatch = useDispatch<AppDispatch>();

    const { profile } = useAppSelector((state) => state.profile);

    const { dropdownOptions, closeSheet, activeSheets, editProfile, nextStep } = useEditProfileForm();



    const initialValues = {
        idType: profile.identificationType,
        idNumber: profile.identificationType,
        idFrontImage: profile.identificationPicture,
        idBackImage: profile.proofOfAddress,
        selfieImage: profile.insuranceResidenceProof,
    };
    const handleNext = () => {

        router.push('/screens/onboarding/edit-profile-payment');
    };

    const validationSchema = Yup.object().shape({
        idType: Yup.string().required("Identification type is required"),
        idNumber: Yup.string().required("ID Number is required"),
        idFrontImage: Yup.string().required("ID Front Image is required"),
        idBackImage: Yup.string().required("ID Back Image is required"),
        selfieImage: Yup.string().required("Selfie Image is required"),

    });

    const handleDocumentUpload = async (documentType: 'idFrontImage' | 'idBackImage' | 'selfieImage') => {
        const  result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
           // allowsEditing: true,
           // aspect: [4, 3],
            quality: 0.8,
          });

       //   console.log(result);

        if (!result.canceled) {
            const file = result.assets[0];
            const resultAction = await dispatch(uploadDocument({ documentType, file }));

            if (uploadDocument.fulfilled.match(resultAction)) {
                console.log(`${documentType} uploaded:`, resultAction.payload);
                const uploadedUrl = resultAction.payload.url;
                // setFieldValue(documentType, uploadedUrl);
            }
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleNext}
        >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
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
                            {/* Step 1 - Completed */}
                            <View className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                            <View className="w-4" />
                            {/* Step 2 - Active */}
                            <View className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                            <View className="w-4" />
                            {/* Step 3 - Inactive */}
                            <View className="w-16 h-1 bg-gray-300 rounded-full" />
                        </View>
                    </View>

                    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                        {/* Section Title */}
                        <Text className="text-xl font-semibold text-black mb-6">
                            Document
                        </Text>

                        {/* Identification Type */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Identification Type</Text>
                            <View className="bg-[#FDF2F0] px-1 rounded-lg">
                                <Picker
                                    selectedValue={values.idType}
                                    onValueChange={handleChange("idType")}
                                >
                                    {dropdownOptions.idTypes.map((IdType) => (
                                        <Picker.Item
                                            key={IdType.value}
                                            label={IdType.label}
                                            value={IdType.value}
                                        />
                                    ))}
                                </Picker>

                            </View>
                        </View>

                        {/* ID Number */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">ID Number</Text>
                            <TextInput
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                placeholder="ID Number"
                                value={values.idNumber}
                                onChangeText={handleChange("idNumber")}
                            />
                        </View>

                        {/* ID Front Image */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">ID Front Image</Text>
                            <TouchableOpacity
                                className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 items-center justify-center min-h-[120px]"
                                onPress={() => handleDocumentUpload('idFrontImage')}
                            >
                                <View className="items-center">
                                    <View className="w-12 h-12 bg-[#FDF2F0] rounded-full items-center justify-center mb-3">
                                        <MaterialIcons name="file-upload" size={24} color="#E75B3B" />
                                    </View>
                                    <Text className="text-gray-900 font-medium text-base">
                                        {values.idFrontImage ? 'Change Front Image' : 'Upload Front of ID'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* ID Back Image */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">ID Back Image</Text>
                            <TouchableOpacity
                                className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 items-center justify-center min-h-[120px]"
                                onPress={() => handleDocumentUpload('idBackImage')}
                            >
                                <View className="items-center">
                                    <View className="w-12 h-12 bg-[#FDF2F0] rounded-full items-center justify-center mb-3">
                                        <MaterialIcons name="file-upload" size={24} color="#E75B3B" />
                                    </View>
                                    <Text className="text-gray-900 font-medium text-base">
                                        {values.idBackImage ? 'Change Back Image' : 'Upload Back of ID'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Selfie Image */}
                        <View className="mb-8">
                            <Text className="text-sm text-gray-700 mb-2">Selfie with ID</Text>
                            <TouchableOpacity
                                className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 items-center justify-center min-h-[120px]"
                                onPress={() => handleDocumentUpload('selfieImage')}
                            >
                                <View className="items-center">
                                    <View className="w-12 h-12 bg-[#FDF2F0] rounded-full items-center justify-center mb-3">
                                        <MaterialIcons name="file-upload" size={24} color="#E75B3B" />
                                    </View>
                                    <Text className="text-gray-900 font-medium text-base">
                                        {values.selfieImage ? 'Change Selfie' : 'Upload Selfie with ID'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Next Button */}
                    <View className="px-6 pb-8">
                        <Button
                            size="xl"
                            className="bg-[#E75B3B] rounded-xl"
                            onPress={() => handleSubmit()}
                        >
                            <ButtonText className="text-white font-semibold">
                                Next
                            </ButtonText>
                        </Button>
                    </View>

                    {/* Identification Type ActionSheet */}
                    <Actionsheet isOpen={activeSheets.idType} onClose={() => closeSheet('idType')}>
                        <ActionsheetBackdrop />
                        <ActionsheetContent>
                            <ActionsheetDragIndicatorWrapper>
                                <ActionsheetDragIndicator />
                            </ActionsheetDragIndicatorWrapper>
                            <ActionsheetScrollView>
                                {dropdownOptions.idTypes.map((type) => (
                                    <ActionsheetItem
                                        key={type.value}
                                    // onPress={() => {
                                    //     updateDocumentInfo({ idType: type.value });
                                    //     closeSheet('idType');
                                    // }}
                                    >
                                        <ActionsheetItemText>{type.label}</ActionsheetItemText>
                                    </ActionsheetItem>
                                ))}
                            </ActionsheetScrollView>
                        </ActionsheetContent>
                    </Actionsheet>
                </SafeAreaView>
            )}
        </Formik>
    );
}