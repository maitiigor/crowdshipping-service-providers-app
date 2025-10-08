import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import { ChevronDownIcon } from "lucide-react-native";
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
import ImageUploader from "../../../components/Custom/ImageUploader";
import InputLabelText from "../../../components/Custom/InputLabelText";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { Button, ButtonText } from "../../../components/ui/button";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../../../components/ui/select";
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
import { setDocument, uploadDocument } from "../../../store/slices/profileSlice";


export default function EditProfileDocuments() {

    const dispatch = useDispatch<AppDispatch>();

    const { profile } = useAppSelector((state) => state.profile);

    const { dropdownOptions, closeSheet, activeSheets, nextStep } = useEditProfileForm();



    const initialValues = {
        identificationType: profile.identificationType,
        licenseNumber: profile.licenseNumber,
        identificationPicture: profile.identificationPicture,
        proofOfAddress: profile.proofOfAddress,
        insuranceResidenceProof: profile.insuranceResidenceProof,
        driverPassport: profile.driverPassport,
    };
    const handleNext = (values: any) => {

        const formData = {
            identificationType: values.identificationType,
            licenseNumber: values.licenseNumber,
            proofOfAddress: values.proofOfAddress,
            identificationPicture: values.identificationPicture,
            insuranceResidenceProof: values.insuranceResidenceProof,
            driverPassport: values.driverPassport,
        }

        dispatch(setDocument(formData))
        nextStep();
        router.push('/screens/onboarding/edit-profile-payment');
    };

    const validationSchema = Yup.object().shape({
        identificationType: Yup.string().required("Identification type is required"),
        licenseNumber: Yup.string().required("ID Number is required"),
        identificationPicture: Yup.string().required("ID Front Image is required"),
        proofOfAddress: Yup.string().required("ID Proof of Address is required"),
        insuranceResidenceProof: Yup.string().required("ID proof of Insurance Residence is required"),

    });

    const handleDocumentUpload = async (documentType: "identificationPicture" | "proofOfAddress" | "insuranceResidenceProof" | "driverPassport", file: string) => {




        try {

            const resultAction = await dispatch(uploadDocument({ documentType, file }));

            if (uploadDocument.fulfilled.match(resultAction)) {
                console.log(`${documentType} uploaded:`, resultAction.payload);
                const uploadedUrl = resultAction.payload.url;
                return uploadedUrl;
            }
        } catch (error) {
            console.log("upload error:", error);
            return "";
        }

    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleNext}
        >
            {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
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

                        <ThemedView>
                            <InputLabelText>Identification Type</InputLabelText>
                            <Select
                                selectedValue={values.identificationType}
                                onValueChange={handleChange("identificationType")}
                            >
                                <SelectTrigger
                                    size="xl"
                                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-rose-50 px-2"
                                >
                                    <SelectInput
                                        placeholder="Select Identification Type"
                                        className="flex-1"
                                    />
                                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {dropdownOptions.idTypes.map((IdType) => (
                                            <SelectItem label={IdType.label} value={IdType.value} />
                                        ))}

                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                            {errors.identificationType && touched.identificationType && (
                                <ThemedText type="b4_body" className="text-error-500 mb-4">
                                    {errors.identificationType}
                                </ThemedText>
                            )}
                        </ThemedView>


                        {/* ID Number */}

                        <ThemedView>
                            <InputLabelText>ID Number</InputLabelText>
                            <TextInput
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                placeholder="ID Number"
                                value={values.licenseNumber}
                                onChangeText={handleChange("licenseNumber")}
                            />
                            {touched.licenseNumber && errors.licenseNumber && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.licenseNumber}</Text>
                            )}
                        </ThemedView>

                        {/* ID Front Image */}
                        <ThemedView>
                            <InputLabelText className="text-sm text-gray-700 mb-2">ID Front Image</InputLabelText>
                            <ImageUploader
                                uri={profile.identificationPicture}
                                editIconClassName="bottom-0 right-0"
                                allowsEditing
                                size={80}
                                label=""
                                aspect={[4, 3]}
                                className=" border-2 flex justify-center bg-rose-50 border-typography-300 items-center py-4 rounded border-dotted"
                                shape="circle"
                                onChange={async (uri) => {
                                    //setPickedImage(uri);
                                    if (!uri) return;
                                    const uploadedUrl = await handleDocumentUpload("identificationPicture", uri);
                                    setFieldValue("identificationPicture", uploadedUrl ?? "");
                                }}
                                helperText="A picture of identification Document"
                            />
                            {touched.licenseNumber && errors.licenseNumber && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.licenseNumber}</Text>
                            )}
                        </ThemedView>
                        <ThemedView>
                            <InputLabelText>Proof of Address</InputLabelText>
                            {/* ID Back Image */}
                            <ImageUploader
                                uri={profile.proofOfAddress}
                                editIconClassName="bottom-0 right-0"
                                allowsEditing
                                size={80}
                                label=""
                                aspect={[4, 3]}
                                className=" border-2 flex justify-center bg-rose-50 border-typography-300 items-center py-4 rounded border-dotted"
                                shape="circle"
                                onChange={async (uri) => {
                                    //setPickedImage(uri);
                                    if (!uri) return;
                                    const uploadedUrl = await handleDocumentUpload("proofOfAddress", uri);
                                    setFieldValue("proofOfAddress", uploadedUrl ?? "");
                                }}
                                helperText="A picture of proof of address"
                            />
                            {touched.proofOfAddress && errors.proofOfAddress && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.proofOfAddress}</Text>
                            )}
                        </ThemedView>


                        <ThemedView>
                            <InputLabelText>Insurance Residence Proof</InputLabelText>
                            <ImageUploader
                                uri={profile.insuranceResidenceProof}
                                editIconClassName="bottom-0 right-0"
                                allowsEditing
                                size={80}
                                label=""
                                aspect={[4, 3]}
                                className=" border-2 flex justify-center bg-rose-50 border-typography-300 items-center py-4 rounded border-dotted"
                                shape="circle"
                                onChange={async (uri) => {
                                    //setPickedImage(uri);
                                    if (!uri) return;
                                    const url = await handleDocumentUpload('insuranceResidenceProof', uri ?? "");
                                    setFieldValue("insuranceResidenceProof", url ?? "");
                                }}
                                helperText="A Picture of your Insurance Proof"
                            />
                            {touched.insuranceResidenceProof && errors.insuranceResidenceProof && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.insuranceResidenceProof}</Text>
                            )}
                        </ThemedView>

                        <ThemedView>
                            <InputLabelText>Drivers Passport</InputLabelText>
                            <ImageUploader
                                uri={profile.driverPassport}
                                editIconClassName="bottom-0 right-0"
                                allowsEditing
                                size={80}
                                label=""
                                aspect={[4, 3]}
                                className=" border-2 flex justify-center bg-rose-50 border-typography-300 items-center py-4 rounded border-dotted"
                                shape="circle"
                                onChange={async (uri) => {
                                    //setPickedImage(uri);
                                    if (!uri) return;
                                    const url = await handleDocumentUpload('driverPassport', uri ?? "");
                                    setFieldValue("driverPassport", url ?? "");
                                }}
                                helperText="A Picture of your Insurance Proof"
                            />
                            {touched.insuranceResidenceProof && errors.insuranceResidenceProof && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.insuranceResidenceProof}</Text>
                            )}
                        </ThemedView>
                    </ScrollView>

                    {/* Next Button */}
                    <ThemedView>
                        <Button
                            size="xl"
                            className="bg-[#E75B3B] rounded-xl"
                            onPress={() => handleSubmit()}
                        >
                            <ButtonText className="text-white font-semibold">
                                Next
                            </ButtonText>
                        </Button>
                    </ThemedView>

                    {/* Identification Type ActionSheet */}
                    <Actionsheet isOpen={activeSheets.identificationType} onClose={() => closeSheet('identificationType')}>
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