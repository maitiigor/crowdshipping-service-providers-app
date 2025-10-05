import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // dropdown select
import * as Location from "expo-location";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useEffect } from "react";
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
import { useEditProfileForm } from "../../../hooks/useRedux";
import { AppDispatch, useAppSelector } from "../../../store";
import { setDocument } from "../../../store/slices/profileSlice";

export default function EditProfile() {

    const { dropdownOptions, editProfile, nextStep } = useEditProfileForm();

    const { profile } = useAppSelector((state) => state.profile);



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
        location: Yup.string().required("Location is required"),
    });

    const formData = userProfile;
    const match = userProfile.phoneNumber.match(/\(\+?(\d+)\)\s*(\d+)/);;
    const initialValues = {
        fullName: userProfile.fullName,
        email: userProfile.email,
        phoneNumber: match && match[2] ? match[2] : "",
        countryCode: match && match[1] ? match[1] : "",
        country: userProfile.profile.country,
        gender: userProfile.profile.gender,
        state: userProfile.profile.state,
        location: userProfile.profile.location,
        city: userProfile.profile.city
    }

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


    const geocodeAddress = async (address: string) => {
        try {
            if (!address || address.trim() === "") return null;

            // Request location permissions
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return { lat: 0, lng: 0 };
            }

            // Convert the address into coordinates
            const geocoded = await Location.geocodeAsync(address);

            if (geocoded.length > 0) {
                const { latitude, longitude } = geocoded[0];
                return { lat: latitude, lng: longitude };
            }

            return null;
        } catch (error) {
            console.log("Geocoding error:", error);
            return { lat: 0, lng: 0 };
        }
    };

    const submitData = async (values: any) => {

        console.log("jjeejejjeje hehe")
        const formData = {
            fullName: values.fullName,
            email: values.email,
            phoneNumber: "(" + values.countryCode + ")" + values.phoneNumber.replace(/\s/g, "").replace(/^0/, ""),
            password: values.password,
            confirmPassword: values.confirmPassword,
            city: values.city,
            state: values.state,
            gender: values.gender,
            country: values.country,
            location: {
                lat: 0,
                lng: 0,
                address: values.location,
            }
        }
        console.log("Form data:", formData);
        const location = await geocodeAddress(values.location);
        formData.location.lat = location?.lat || 0;
        formData.location.lng = location?.lng || 0;
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
                {({ handleChange, handleSubmit, values, errors, touched }) => (
                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text className="text-xl font-semibold text-black mb-6">
                            Personal Information
                        </Text>

                        {/* Full Name */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Your Full Name</Text>
                            <TextInput
                                placeholder="Full Name"
                                value={values.fullName}
                                editable={false}
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
                                editable={false}
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
                            <View className="flex-row bg-[#FDF2F0] rounded-lg items-center">
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
                                <TextInput
                                    placeholder="Phone"
                                    value={values.phoneNumber}
                                    onChangeText={handleChange("phoneNumber")}
                                    className="flex-1 px-4 py-4 text-base"
                                    keyboardType="phone-pad"
                                />
                            </View>
                            {touched.phoneNumber && errors.phoneNumber && (
                                <Text style={{ color: "red", fontSize: 12 }}>{errors.phoneNumber}</Text>
                            )}
                        </View>

                        {/* Country */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Country</Text>
                            <Picker
                                selectedValue={values.country}
                                onValueChange={handleChange("country")}
                                style={{ backgroundColor: "#FDF2F0", borderRadius: 50 }}
                                className="rounded-lg"
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
                        </View>

                        {/* Gender */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">Gender</Text>
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
                        </View>

                        {/* State */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">State</Text>
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
                        </View>

                        {/* City */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-700 mb-2">City</Text>
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
                        </View>

                        {/* Location */}
                        <View className="mb-8">
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
                        </View>
                        {/* Next Button */}
                        <View className="pb-8">
                            <Button
                                size="xl"
                                className="bg-[#E75B3B] rounded-xl"

                                onPress={() => handleSubmit()}
                            >
                                <ButtonText className="text-white font-semibold">Next</ButtonText>
                            </Button>
                        </View>
                    </ScrollView>
                )}
            </Formik>

        </SafeAreaView>


    );
}
