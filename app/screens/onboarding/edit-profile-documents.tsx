import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import { ChevronDownIcon } from "lucide-react-native";
import React from "react";
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import ImageUploader from "../../../components/Custom/ImageUploader";
import InputLabelText from "../../../components/Custom/InputLabelText";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { Button, ButtonText } from "../../../components/ui/button";
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger
} from "../../../components/ui/select";

import { useEditProfileForm } from "../../../hooks/useRedux";
import { AppDispatch, useAppSelector } from "../../../store";
import { setDocument, uploadDocument } from "../../../store/slices/profileSlice";

export default function EditProfileDocuments() {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { profile } = useAppSelector((state) => state.profile);

    const { dropdownOptions, nextStep } = useEditProfileForm();

    const initialValues = {
        identificationType: profile.identificationType,
        licenseNumber: profile.licenseNumber,
        identificationPicture: profile.identificationPicture,
        proofOfAddress: profile.proofOfAddress,
        insuranceResidenceProof: profile.insuranceResidenceProof,
        driverPassport: profile.driverPassport,
    };

    const validationSchema = Yup.object().shape({
        identificationType: Yup.string().required(t('edit-document.identificationType.error')),
        licenseNumber: Yup.string().required(t('edit-document.idNumber.error')),
        identificationPicture: Yup.string().required(t('edit-document.idFrontImage.error')),
        proofOfAddress: Yup.string().required(t('edit-document.proofOfAddress.error')),
        insuranceResidenceProof: Yup.string().required(t('edit-document.insuranceResidenceProof.error')),
    });

    const handleDocumentUpload = async (
        documentType: "identificationPicture" | "proofOfAddress" | "insuranceResidenceProof" | "driverPassport",
        file: string
    ) => {
        try {
            const resultAction = await dispatch(uploadDocument({ documentType, file }));

            if (uploadDocument.fulfilled.match(resultAction)) {
                return resultAction.payload.url;
            }
        } catch (error) {
            console.log("Upload error:", error);
        }
        return "";
    };

    /** A small helper to avoid repeating ImageUploader blocks */
    const UploadField = ({ label, value, fieldName, error, touched, setFieldValue }: any) => (
        <ThemedView className="mb-4">
            <InputLabelText>{label}</InputLabelText>

            <ImageUploader
                uri={value}
                editIconClassName="bottom-0 right-0"
                allowsEditing
                size={80}
                aspect={[4, 3]}
                className="border-2 flex justify-center bg-rose-50 border-typography-300 items-center py-4 rounded border-dotted"
                shape="circle"
                onChange={async (uri) => {
                    if (!uri) return;
                    const url = await handleDocumentUpload(fieldName, uri);
                    setFieldValue(fieldName, url);
                }}
                helperText={`Upload ${label}`}
            />

            {touched && error && (
                <ThemedText className="text-error-500 text-xs mt-1">{error}</ThemedText>
            )}
        </ThemedView>
    );

    const handleNext = (values: any) => {
        dispatch(setDocument(values));
        nextStep();
        router.push('/screens/onboarding/edit-profile-payment');
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleNext}>
            {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                <SafeAreaView className="flex-1 bg-white">
                    
                    {/* Header */}
                    <ThemedView className="flex-row items-center justify-between px-6 py-4">
                        <TouchableOpacity className="p-2" onPress={() => router.back()}>
                            <AntDesign name="arrowleft" size={24} color="#000" />
                        </TouchableOpacity>

                        <ThemedText className="text-lg font-semibold text-black">
                            {t('edit-document.header.title')}
                        </ThemedText>

                        <TouchableOpacity className="p-2">
                            <MaterialIcons name="notifications-none" size={24} color="#000" />
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Progress */}
                    <ThemedView className="flex-row items-center justify-center px-6 py-6">
                        <ThemedView className="flex-row items-center">
                            <ThemedView className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                            <ThemedView className="w-4" />
                            <ThemedView className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                            <ThemedView className="w-4" />
                            <ThemedView className="w-16 h-1 bg-gray-300 rounded-full" />
                        </ThemedView>
                    </ThemedView>

                    <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

                        {/* Identification Type */}
                        <ThemedView className="mb-4">
                            <InputLabelText>{t('edit-document.identificationType.label')}</InputLabelText>

                            <Select
                                selectedValue={values.identificationType}
                                onValueChange={(v) => setFieldValue("identificationType", v)}
                            >
                                <SelectTrigger
                                    size="xl"
                                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-rose-50 px-2"
                                >
                                    <SelectInput placeholder={t('edit-document.identificationType.placeholder')} />
                                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                </SelectTrigger>

                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>

                                        {dropdownOptions.idTypes.map((id) => (
                                            <SelectItem key={id.value} label={id.label} value={id.value} />
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>

                            {touched.identificationType && errors.identificationType && (
                                <ThemedText className="text-error-500 text-xs mt-1">
                                    {errors.identificationType}
                                </ThemedText>
                            )}
                        </ThemedView>

                        {/* ID Number */}
                        <ThemedView className="mb-4">
                            <InputLabelText>{t('edit-document.idNumber.label')}</InputLabelText>

                            <TextInput
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                placeholder={t('edit-document.idNumber.placeholder')}
                                value={values.licenseNumber}
                                onChangeText={handleChange("licenseNumber")}
                            />

                            {touched.licenseNumber && errors.licenseNumber && (
                                <ThemedText className="text-error-500 text-xs">
                                    {errors.licenseNumber}
                                </ThemedText>
                            )}
                        </ThemedView>

                        {/* Upload Fields */}
                        <UploadField
                            label={t('edit-document.idFrontImage.label')}
                            value={values.identificationPicture}
                            fieldName="identificationPicture"
                            error={errors.identificationPicture}
                            touched={touched.identificationPicture}
                            setFieldValue={setFieldValue}
                        />

                        <UploadField
                            label={t('edit-document.proofOfAddress.label')}
                            value={values.proofOfAddress}
                            fieldName="proofOfAddress"
                            error={errors.proofOfAddress}
                            touched={touched.proofOfAddress}
                            setFieldValue={setFieldValue}
                        />

                        <UploadField
                            label={t('edit-document.insuranceResidenceProof.label')}
                            value={values.insuranceResidenceProof}
                            fieldName="insuranceResidenceProof"
                            error={errors.insuranceResidenceProof}
                            touched={touched.insuranceResidenceProof}
                            setFieldValue={setFieldValue}
                        />

                        <UploadField
                            label={t('edit-document.driverPassport.label')}
                            value={values.driverPassport}
                            fieldName="driverPassport"
                            error={errors.driverPassport}
                            touched={touched.driverPassport}
                            setFieldValue={setFieldValue}
                        />

                    </ScrollView>

                    {/* Next Button */}
                    <ThemedView className="p-6">
                        <Button size="xl" className="bg-[#E75B3B] rounded-xl" onPress={() => handleSubmit()}>
                            <ButtonText className="text-white font-semibold">{t('edit-document.buttons.next')}</ButtonText>
                        </Button>
                    </ThemedView>
                </SafeAreaView>
            )}
        </Formik>
    );
}
