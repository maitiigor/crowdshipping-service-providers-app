import {
    AddressPicker,
    AddressSelection
} from "@/components/Custom/AddressPicker";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // dropdown select
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    TextInput,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import CountryDropdown from "../../../components/Custom/CountryDropdown";
import InputLabelText from "../../../components/Custom/InputLabelText";
import PhoneNumberInput from "../../../components/Custom/PhoneNumberInput";
import ParallaxScrollView from "../../../components/ParallaxScrollView";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { Button } from "../../../components/ui/button";
import { useEditProfileForm } from "../../../hooks/useRedux";
import { AppDispatch, useAppSelector } from "../../../store";
import { setDocument } from "../../../store/slices/profileSlice";

export default function EditProfile() {
    const { t } = useTranslation();
    const { dropdownOptions, editProfile, nextStep } = useEditProfileForm();

    const { profile } = useAppSelector((state) => state.profile);

    const [phone, setPhone] = useState("");


    const phoneInputRef = useRef<any>(null);
    const userProfile = useAppSelector((state) => state.auth.userProfile);

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required(t('edit-profile.errors.fullNameRequired')),
        email: Yup.string().email(t('edit-profile.errors.invalidEmail')).required(t('edit-profile.errors.emailRequired')),
        phoneNumber: Yup.string().required(t('edit-profile.errors.phoneRequired')),
        country: Yup.string().required(t('edit-profile.errors.countryRequired')),
        gender: Yup.string().required(t('edit-profile.errors.genderRequired')),
        state: Yup.string().required(t('edit-profile.errors.stateRequired')),
        city: Yup.string().required(t('edit-profile.errors.cityRequired')),
        location: Yup.object().required(t('edit-profile.errors.locationRequired')),
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

    const formatPhoneNumber = (phone: string): string => {
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
            <ThemedView className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="#E75B3B" />
                </TouchableOpacity>

                <ThemedText className="text-lg font-semibold text-black">
                    {t('edit-profile.header.editProfile')}
                </ThemedText>

                <TouchableOpacity className="p-2">
                    <MaterialIcons
                        name="notifications-none"
                        size={24}
                        color="#000"
                    />
                </TouchableOpacity>
            </ThemedView>

            {/* Progress Indicator */}
            <ThemedView className="flex-row items-center justify-center px-6 py-6">
                <ThemedView className="flex-row items-center">
                    <ThemedView className="w-16 h-1 bg-[#E75B3B] rounded-full" />
                    <ThemedView className="w-4" />
                    <ThemedView className="w-16 h-1 bg-gray-300 rounded-full" />
                    <ThemedView className="w-4" />
                    <ThemedView className="w-16 h-1 bg-gray-300 rounded-full" />
                </ThemedView>
            </ThemedView>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submitData}
            >
                {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <ParallaxScrollView
                        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
                    >
                        <ThemedText className="text-xl font-semibold text-black mb-6">
                            {t('edit-profile.titles.personalInformation')}
                        </ThemedText>

                        {/* Full Name */}
                        <ThemedView>
                            <InputLabelText className="">{t('edit-profile.fields.fullName')}</InputLabelText>
                            <TextInput
                                placeholder={t('edit-profile.placeholders.fullName')}
                                value={values.fullName}
                                onChangeText={handleChange("fullName")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                            />
                            {touched.fullName && errors.fullName && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.fullName}</ThemedText>
                            )}
                        </ThemedView>

                        {/* Email */}
                        <ThemedView>
                            <InputLabelText className="">{t('edit-profile.fields.emailAddress')}</InputLabelText>
                            <TextInput
                                placeholder={t('edit-profile.placeholders.email')}
                                value={values.email}
                                editable={false}
                                onChangeText={handleChange("email")}
                                className="bg-[#FDF2F0] rounded-lg px-4 py-4 text-base"
                                keyboardType="email-address"
                            />
                            {touched.email && errors.email && (
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.email}</ThemedText>
                            )}
                        </ThemedView>

                        {/* Phone Number */}
                        <ThemedView>
                            <InputLabelText className="">{t('edit-profile.fields.phoneNumber')}</InputLabelText>
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
                            <InputLabelText className="">{t('edit-profile.fields.gender')}</InputLabelText>
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
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.gender}</ThemedText>
                            )}
                        </ThemedView>

                        {/* State */}
                        <ThemedView>
                            <InputLabelText className="">{t('edit-profile.fields.state')}</InputLabelText>
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
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.state}</ThemedText>
                            )}
                        </ThemedView>

                        {/* City */}
                        <ThemedView>
                            <InputLabelText className="">{t('edit-profile.fields.city')}</InputLabelText>
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
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.city}</ThemedText>
                            )}
                        </ThemedView>

                        {/* Location */}
                        <ThemedView>
                            <InputLabelText className="">{t('edit-profile.fields.pickupAddress')}</InputLabelText>
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
                                <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.location.address}</ThemedText>
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
                                {false ? <ActivityIndicator color="white" /> : t('edit-profile.buttons.next')}
                            </ThemedText>
                        </Button>

                    </ParallaxScrollView>
                )}
            </Formik>

        </SafeAreaView>


    );
}
