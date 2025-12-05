import { router, useNavigation } from "expo-router";
import { Formik } from "formik";
import { ChevronDownIcon, ChevronLeft, CircleCheckIcon, HelpCircleIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import ImageUploader from "../../../components/Custom/ImageUploader";
import InputLabelText from "../../../components/Custom/InputLabelText";
import NotificationIconComponent from "../../../components/NotificationIconComponent";
import ParallaxScrollView from "../../../components/ParallaxScrollView";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { Button, ButtonText } from "../../../components/ui/button";
import { Icon } from "../../../components/ui/icon";
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
import { useShowToast } from '../../../hooks/useShowToast';
import { useThemeColor } from "../../../hooks/useThemeColor";
import { AppDispatch, useAppSelector } from "../../../store";
import { uploadDocument } from "../../../store/slices/profileSlice";
import { addVehicle, fetchVehicleCategories } from "../../../store/slices/vechileSlice";


export default function AddvehicleScreen() {

    const dispatch = useDispatch<AppDispatch>();

    const { vehicle, vehicleCategories, loading } = useAppSelector((state) => state.vechile);

    const { dropdownOptions, closeSheet, activeSheets, nextStep } = useEditProfileForm();

    useEffect(() => {
        dispatch(fetchVehicleCategories()).unwrap();
    }, [vehicleCategories.length]);

    const showToast: any = useShowToast();


    const initialValues = {
        categoryId: vehicle.categoryId,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        image: vehicle.image,
        licensePlate: vehicle.licensePlate,
        color: vehicle.color,
        vehicleRegistration: vehicle.vehicleDocuments.filter(doc => doc.name === 'Vehicle Registration')[0]?.document || '',
        insuranceCertificate: vehicle.vehicleDocuments.filter(doc => doc.name === 'Insurance Certificate')[0]?.document || '',

    };
    const handleNext = (values: any) => {

        const formData = {
            categoryId: values.categoryId,
            make: values.make,
            model: values.model,
            year: values.year,
            color: values.color,
            image: values.image,
            type: 'road',
            licensePlate: values.licensePlate,
            vehicleDocuments: [
                { name: 'Vehicle Registration', document: values.vehicleRegistration },
                { name: 'Insurance Certificate', document: values.insuranceCertificate },
            ],
        }


        dispatch(addVehicle(formData)).unwrap().then(() => {
            showToast({
                title: "Success",
                description: "Vehicle added successfully",
                icon: CircleCheckIcon,
                action: "success",
            });
            router.back();

        }).catch((error) => {
            showToast({
                title: "Error",
                description: error.message || "Failed to add vehicle. Please try again.",
                icon: HelpCircleIcon,
                action: "error",
            });
        });




    };

    const validationSchema = Yup.object().shape({
        categoryId: Yup.string().required("Vehicle Category is required"),
        licensePlate: Yup.string().required("License Plate is required"),
        make: Yup.string().required("Make is required"),
        model: Yup.string().required("Model is required"),
        year: Yup.number().required("Year is required").min(1900, "Year must be later than 1900").max(new Date().getFullYear(), `Year cannot be in the future`),
        color: Yup.string().required("Color is required"),
        vehicleRegistration: Yup.string().required("Vehicle Registration document is required"),
        insuranceCertificate: Yup.string().required("Insurance Certificate document is required"),

    });

    const handleDocumentUpload = async (documentType: string, file: string) => {




        try {
            const response = await dispatch(uploadDocument({ documentType, file })).unwrap();
            console.log(response);
            const uploadedUrl = response.url;
            return uploadedUrl;
        } catch (error) {
            console.log("upload error:", error);
            return "";
        }

    };

    const navigation = useNavigation();
    const background = useThemeColor({}, 'background');
    const color = useThemeColor({}, 'text');

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => {
                return (
                    <ThemedText type="s1_subtitle" className="text-center">
                        Add Vechicle
                    </ThemedText>
                );
            },
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 20 }, // Increased font size
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: background,
                elevation: 0, // Android
                shadowOpacity: 0, // iOS
                shadowColor: "transparent", // iOS
                borderBottomWidth: 0,
                color: color
            },
            headerLeft: () => (
                <ThemedView
                    style={{
                        shadowColor: "#FDEFEB1A",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.102,
                        shadowRadius: 3,
                        elevation: 4,
                    }}
                >
                    <ThemedView
                        style={{
                            shadowColor: "#0000001A",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.102,
                            shadowRadius: 2,
                            elevation: 2,

                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="p-2 rounded   flex justify-center items-center"
                        >
                            <Icon
                                as={ChevronLeft}
                                size="3xl"
                                color={color}
                                className="text-typography-900"
                            />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            ),
            headerRight: () => <NotificationIconComponent />,
        });
    }, [navigation, router]);


    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleNext}
        >
            {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (


                <ParallaxScrollView headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}>

                    <ThemedView>
                        <InputLabelText> Vehicle Type</InputLabelText>
                        <Select
                            selectedValue={values.categoryId}
                            onValueChange={handleChange("categoryId")}
                        >
                            <SelectTrigger
                                size="lg"
                                className="h-[55px] rounded-lg mb-2 border-primary-100 bg-rose-50 px-2"
                            >
                                <SelectInput
                                    placeholder="Select Vehicle Type"
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
                                    {vehicleCategories.map((category) => (
                                        <SelectItem key={category._id} label={category.name} value={category._id} />
                                    ))}

                                </SelectContent>
                            </SelectPortal>
                        </Select>
                        {errors.categoryId && touched.categoryId && (
                            <ThemedText type="b4_body" className="text-error-500 mb-4">
                                {errors.categoryId}
                            </ThemedText>
                        )}
                    </ThemedView>

                    <ThemedView>
                        <InputLabelText>Make</InputLabelText>
                        <TextInput
                            className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            placeholder="Make"
                            value={values.make}
                            onChangeText={handleChange("make")}
                        />
                        {touched.make && errors.make && (
                            <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.make}</ThemedText>
                        )}
                    </ThemedView>

                    <ThemedView>
                        <InputLabelText>Model</InputLabelText>
                        <TextInput
                            className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            placeholder="Model"
                            value={values.model}
                            onChangeText={handleChange("model")}
                        />
                        {touched.model && errors.model && (
                            <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.model}</ThemedText>
                        )}
                    </ThemedView>

                    <ThemedView>
                        <InputLabelText>Year</InputLabelText>
                        <TextInput
                            className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            placeholder="Year"
                            keyboardType="numeric"
                            value={values.year ? values.year.toString() : ''}
                            onChangeText={handleChange("year")}
                        />
                        {touched.year && errors.year && (
                            <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.year}</ThemedText>
                        )}
                    </ThemedView>

                    <ThemedView>
                        <InputLabelText>Color</InputLabelText>
                        <TextInput
                            className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            placeholder="Color"
                            value={values.color}
                            onChangeText={handleChange("color")}
                        />
                        {touched.color && errors.color && (
                            <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.color}</ThemedText>
                        )}
                    </ThemedView>



                    <ThemedView>
                        <InputLabelText>License Plate</InputLabelText>
                        <TextInput
                            className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            placeholder="License Plate"
                            value={values.licensePlate}
                            onChangeText={handleChange("licensePlate")}
                        />
                        {touched.color && errors.color && (
                            <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.color}</ThemedText>
                        )}
                    </ThemedView>

                    <ThemedView>
                        <InputLabelText>Vehicle Image</InputLabelText>
                        <ImageUploader
                            uri={values.vehicleRegistration}
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
                                const uploadedUrl = await handleDocumentUpload("Vehicle Image", uri);
                                setFieldValue("image", uploadedUrl ?? "");
                            }}
                            helperText="A picture of Vehicle Registration Document"
                        />
                        {touched.vehicleRegistration && errors.vehicleRegistration && (
                            <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.vehicleRegistration}</ThemedText>
                        )}
                    </ThemedView>

                    {/* Vehicle Registration Document */}

                    <ThemedView>
                        <InputLabelText>Vehicle Registration Document</InputLabelText>
                        <ImageUploader
                            uri={values.vehicleRegistration}
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
                                const uploadedUrl = await handleDocumentUpload("Vehicle Registration", uri);
                                setFieldValue("vehicleRegistration", uploadedUrl ?? "");
                            }}
                            helperText="A picture of Vehicle Registration Document"
                        />
                        {touched.vehicleRegistration && errors.vehicleRegistration && (
                            <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.vehicleRegistration}</ThemedText>
                        )}
                    </ThemedView>

                    {/* Insurance Certificate Document */}

                    <ThemedView>
                        <InputLabelText>Insurance Certificate Document</InputLabelText>
                        <ImageUploader
                            uri={values.insuranceCertificate}
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
                                const uploadedUrl = await handleDocumentUpload("Insurance Certificate", uri);
                                setFieldValue("insuranceCertificate", uploadedUrl ?? "");
                            }}
                            helperText="A picture of Insurance Certificate Document"
                        />
                        {touched.insuranceCertificate && errors.insuranceCertificate && (
                            <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.insuranceCertificate}</ThemedText>
                        )}
                    </ThemedView>

                    {/* Next Button */}
                    <ThemedView className="my-3">
                        <Button
                            size="xl"
                            className="bg-[#E75B3B] rounded-xl"
                            onPress={() => handleSubmit()}
                        >
                            <ButtonText className="text-white font-semibold">
                                {loading ? <ActivityIndicator color="#fff" /> : 'Add Vehicle'}
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
                </ParallaxScrollView>
            )}
        </Formik>
    );
}