'use client';
import {
    ArrowLeftIcon,
    BellIcon,
    Icon
} from '@/components/ui/icon';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { CheckCircleIcon } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import AddressPicker, { AddressSelection } from '../../../components/Custom/AddressPicker';
import CountryDropdown from '../../../components/Custom/CountryDropdown';
import ImageUploader from '../../../components/Custom/ImageUploader';
import InputLabelText from '../../../components/Custom/InputLabelText';
import PhoneNumberInput from '../../../components/Custom/PhoneNumberInput';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Button } from "../../../components/ui/button";
import { useEditProfileForm } from '../../../hooks/useRedux';
import { useShowToast } from '../../../hooks/useShowToast';
import { ApiError } from '../../../models';
import { AppDispatch, useAppSelector } from '../../../store';
import { getUserProfile, updateProfile, uploadDocument } from '../../../store/slices/profileSlice';

interface ProfileData {
    fullName: string;
    firstName: string;
    dateOfBirth: string;
    email: string;
    country: string;
    phoneNumber: string;
    gender: string;
    profilePicUrl: string;
    address: string;
    city: string;
    state: string;
    location: {
        coordinates: {
            lat: number;
            lng: number;
        },
        address: string;
    }
}



export default function EditProfileScreen() {


    const { profile, loading } = useAppSelector((state) => state.profile);
    const phoneInputRef = useRef<any>(null);
    const [phone, setPhone] = useState("");
    const userProfile = useAppSelector((state) => state.auth.userProfile);
    const dispatch = useDispatch<AppDispatch>();

    const match = userProfile.phoneNumber.match(/\(\+?(\d+)\)\s*(\d+)/);;
    const initialValues = {
        fullName: userProfile.fullName,
        email: userProfile.email,
        phoneNumber: match && match[2] ? match[2] : "",
        countryCode: match && match[1] ? match[1] : "",
        country: userProfile.profile?.country,
        gender: userProfile.profile?.gender,
        profilePicUrl: userProfile.profile?.profilePicUrl ?? "",
        dob: '',
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



    const { dropdownOptions } = useEditProfileForm();
    const [selectedPickupAddress, setSelectedPickupAddress] =
        useState<AddressSelection | null>(null);


    // ✅ Correct way
    useEffect(() => {
        setSelectedPickupAddress({
            address: userProfile.profile?.location?.address ?? '',
            coordinates: {
                lat: userProfile.profile?.location?.lat ?? 0,
                lng: userProfile.profile?.location?.lng ?? 0,
            }
        });
    }, [userProfile]);

    const validationSchema = Yup.object().shape({
        //fullName: Yup.string().required('Required'),
        //email: Yup.string().email('Invalid Email').required('Required'),
        // dateOfBirth: Yup.string().required('Required'),
        //country: Yup.string(),
        // gender: Yup.string(),
        //   phoneNumber: Yup.string(),
        //  address: Yup.string(),
    });

    const handleDocumentUpload = async (documentType: string, file: string) => {




        try {
            const response = await dispatch(uploadDocument({ documentType, file })).unwrap();
            const uploadedUrl = response.url;
            return uploadedUrl;
        } catch (error) {
            console.log("upload error:", error);
            return "";
        }

    };

       const showToast = useShowToast();   

      const submitData = async (values: any) => {
        console.log("form data:", values);
        const formData = {
            fullName: values.fullName,
         //   email: values.email,
            phoneNumber: formatPhoneNumber(values.phoneNumber),
            city: values.city,
            state: values.state,
            gender: values.gender,
            country: values.country,
            profilePicUrl: values.profilePicUrl,
            location: {
                lat: values.location.coordinates.lat,
                lng: values.location.coordinates.lng,
                address: values.location.address,
            }
        }

        dispatch(updateProfile(formData)).unwrap().then(() => {
            showToast({
                title: "Profile Updated",
                description: "Your profile has been updated",
                icon: CheckCircleIcon,
                action: "success",
            });

            router.back();

        }).catch((err: ApiError) => {
            showToast({
                title: "Something went wrong",
                description: err.message,
                icon: CheckCircleIcon,
                action: "error",
            });

        }).finally(() => {
            dispatch(getUserProfile());
        });




    }


    const formatPhoneNumber = (phone: string): string => {
        const match = phone.match(/^\+?(\d{1,3})(\d{6,})$/);
        if (!match) return phone; // if format doesn't match, return original
        const [, countryCode, number] = match;
        return `(+${countryCode})${number}`;
    }








    return (
        <SafeAreaView className="flex-1">
            {/* HEADER */}
            <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-xl font-semibold text-gray-900">
                    Edit Profile
                </ThemedText>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView className="flex-1 px-4 py-6">

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={submitData}
                >
                    {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
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
                                    <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.fullName}</ThemedText>
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
                                    <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.email}</ThemedText>
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
                                    <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.gender}</ThemedText>
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
                                    <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.state}</ThemedText>
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
                                    <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.city}</ThemedText>
                                )}
                            </ThemedView>

                            {/* Location */}
                            <ThemedView>
                                <InputLabelText className="">Address</InputLabelText>
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

                            <ThemedView>
                                <InputLabelText>Profile Picture</InputLabelText>
                                {/* ID Back Image */}
                                <ImageUploader
                                    uri={userProfile.profile?.profilePicUrl}
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
                                        const uploadedUrl = await handleDocumentUpload("profilePicUrl", uri);
                                        setFieldValue("profilePicUrl", uploadedUrl ?? "");
                                    }}
                                    helperText="A picture of proof of address"
                                />
                                {touched.profilePicUrl && errors.profilePicUrl && (
                                    <ThemedText style={{ color: "red", fontSize: 12 }}>{errors.profilePicUrl}
                                    </ThemedText>
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
                                    {loading ? <ActivityIndicator
                                        color="white" /> : "Update Profile"}
                                </ThemedText>
                            </Button>
                            <ThemedView className="h-10" />
                        </>
                    )}
                </Formik>
            </ScrollView >

        </SafeAreaView >
    );
}
