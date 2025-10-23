import {
    AddressPicker,
    AddressSelection
} from "@/components/Custom/AddressPicker";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // dropdown select
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import CountryDropdown from "../../../components/Custom/CountryDropdown";
import InputLabelText from "../../../components/Custom/InputLabelText";
import PhoneNumberInput from "../../../components/Custom/PhoneNumberInput";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { Button } from "../../../components/ui/button";
import { useEditProfileForm } from "../../../hooks/useRedux";
import { AppDispatch, useAppSelector } from "../../../store";
import { setDocument } from "../../../store/slices/profileSlice";

export default function EditProfile() {

    const { dropdownOptions, editProfile, nextStep } = useEditProfileForm();

    const { profile } = useAppSelector((state) => state.profile);

    const [phone, setPhone] = useState("");


    const phoneInputRef = useRef<any>(null);
    const userProfile = useAppSelector((state) => state.auth.userProfile);

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required("Full name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phoneNumber: Yup.string().required("Phone number is required"),
        //   accountType: Yup.string().required("Account type is required"),
        country: Yup.string().required("Country is required"),
        gender: Yup.string().required("Gender is required"),
        state: Yup.string().required("State is required"),
        city: Yup.string().required("City is required"),
        location: Yup.object().required("Location is required"),
    });

    

    const formData = userProfile;
    const match = userProfile.phoneNumber.match(/\(\+?(\d+)\)\s*(\d+)/);;
    const initialValues = {
        fullName: userProfile.fullName,
        email: userProfile.email,
        phoneNumber: match && match[2] ? match[2] : "",
        countryCode: match && match[1] ? match[1] : "",
        country: userProfile.profile?.country,
        gender: userProfile.profile?.gender,
        state: userProfile.profile?.state,
        location: {
            coordinates: {
                lat: userProfile.profile?.location?.lat ?? 0,
                lng: userProfile.profile?.location?.lng ?? 0,
            },
            address: userProfile.profile?.location?.address ?? ''
        },
        city: userProfile.profile?.city ?? ''
    }

    const [selectedPickupAddress, setSelectedPickupAddress] =
        useState<AddressSelection | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    // inside a component
    const auth = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (auth?.userProfile) {
            dispatch(setDocument(auth.userProfile));
        }
    }, [auth.userProfile, dispatch]);

    const handleNext = () => {
        console.log("Form data:", formData);
        nextStep();
        router.push("/screens/onboarding/edit-profile-documents");
    };

    const  formatPhoneNumber = (phone: string): string  => {
        const match = phone.match(/^\+?(\d{1,3})(\d{6,})$/);
        if (!match) return phone; // if format doesn't match, return original
        const [, countryCode, number] = match;
        return `(+${countryCode})${number}`;
    }


    const submitData = async (values: any) => {

        const formData = {
            fullName: values.fullName,
            email: values.email,
            phoneNumber: formatPhoneNumber(values.phoneNumber),
            city: values.city,
            state: values.state,
            gender: values.gender,
            country: values.country,
            location: {
                lat: values.location.coordinates.lat,
                lng: values.location.coordinates.lng,
                address: values.location.address,
            }
        }
        console.log("Form data:", formData);

        dispatch(setDocument(formData));

        router.push("/screens/onboarding/edit-profile-documents");

    };



    return (

        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="#E75B3B" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-black">
                    Edit Profile
                </Text>

                <TouchableOpacity className="p-2">
                    <MaterialIcons
                        name="notifications-none"
                        size={24}
                        color="#000"
                    />
                </TouchableOpacity>
            </View>

            {/* Progress Indicator */}
            <View className="flex-row items-center justify-center px-6 py-6">
                <View className="flex-row items-center">
                    <View className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                    <View className="w-4" />
                    <View className="w-16 h-1 bg-gray-300 rounded-full" />
                    <View className="w-4" />
                    <View className="w-16 h-1 bg-gray-300 rounded-full" />
                </View>
            </View>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submitData}
            >
                {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text className="text-xl font-semibold text-black mb-6">
                            Personal Information
                        </Text>

                        {/* Full Name */}
                        <ThemedView>
                            <InputLabelText className="">Full Name</InputLabelText>
                            <TextInput
                                placeholder="Full Name"
                                value={values.fullName}
                                onChangeText={handleChange("fullName")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            />
                            {touched.fullName && errors.fullName && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.fullName}</Text>
                            )}
                        </ThemedView>

                        {/* Email */}
                        <ThemedView>
                            <InputLabelText className="">Email Address</InputLabelText>
                            <TextInput
                                placeholder="Email"
                                value={values.email}
                                editable={false}
                                onChangeText={handleChange("email")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                keyboardType="email-address"
                            />
                            {touched.email && errors.email && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.email}</Text>
                            )}
                        </ThemedView>

                        {/* Phone Number */}
                        <ThemedView>
                            <InputLabelText className="">Phone Number</InputLabelText>
                            <PhoneNumberInput
                                ref={phoneInputRef}
                                value={values.phoneNumber}
                                onChangeFormattedText={(t) => {
                                    setPhone(t);
                                    setFieldValue("phoneNumber", t);
                                }}
                            />
                            {errors.phoneNumber && touched.phoneNumber && (
                                <ThemedText type="b4_body" className="text-error-500">
                                    {errors.phoneNumber}
                                </ThemedText>
                            )}
                        </ThemedView>

                        {/* Country */}
                        <ThemedView>
                            <CountryDropdown
                                values={values}
                                errors={errors}
                                touched={touched}
                                handleChange={handleChange("country")}
                            />
                        </ThemedView>


                        {/* Gender */}
                        <ThemedView>
                            <InputLabelText className="">Gender</InputLabelText>
                            <Picker
                                selectedValue={values.gender}
                                onValueChange={handleChange("gender")}
                                style={{ backgroundColor: "#FDF2F0", borderRadius: 50 }}
                                className="rounded-lg"
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
                        </ThemedView>

                        {/* State */}
                        <ThemedView>
                            <InputLabelText className="">State</InputLabelText>
                            <Picker
                                selectedValue={values.state}
                                onValueChange={handleChange("state")}
                                style={{ backgroundColor: "#FDF2F0", borderRadius: 50 }}
                                className="rounded-lg"
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
                        </ThemedView>

                        {/* City */}
                        <ThemedView>
                            <InputLabelText className="">City</InputLabelText>
                            <Picker
                                selectedValue={values.city}
                                onValueChange={handleChange("city")}
                                style={{ backgroundColor: "#FDF2F0", borderRadius: 50 }}
                                className="rounded-lg"
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
                        </ThemedView>

                        {/* Location */}
                        <ThemedView>
                            <InputLabelText className="">Pickup Address</InputLabelText>
                            <AddressPicker
                                value={values.location}
                                onSelect={(sel) => {
                                    setSelectedPickupAddress(sel);
                                    // Reflect selection in Formik values.location
                                    setFieldValue("location", {
                                        coordinates: {
                                            lat: sel.coordinates.lat,
                                            lng: sel.coordinates.lng,
                                        },
                                        address: sel.address,
                                    });
                                }}
                            />
                            {touched.location && errors.location && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.location.address}</Text>
                            )}
                        </ThemedView>

                        <Button
                            variant="solid"
                            size="2xl"
                            isDisabled={false}
                            className="mt-5 rounded-[12px]"
                            onPress={() => handleSubmit()}
                        >
                            <ThemedText type="s1_subtitle" className="text-white">
                                {false ? <ActivityIndicator color="white" /> : "Next"}
                            </ThemedText>
                        </Button>

                    </ScrollView>
                )}
            </Formik>

        </SafeAreaView>


    );
}
