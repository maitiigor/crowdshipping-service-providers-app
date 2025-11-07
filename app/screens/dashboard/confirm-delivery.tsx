import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, CheckCircleIcon, Icon, UploadIcon } from '../../../components/ui/icon';
import { useShowToast } from '../../../hooks/useShowToast';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateTripStatus } from '../../../store/slices/groundTripSlice';
import { uploadDocument } from '../../../store/slices/profileSlice';

const { width, height } = Dimensions.get('window');

export default function ConfirmDeliveryScreen() {
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const [uploadedImage, setUploadedImage] = useState<string | null>(null); // Local image URI
    const [deliveryImageUrl, setDeliveryImageUrl] = useState<string | null>(null); // Uploaded URL
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const dispatch = useAppDispatch();
    const showToast = useShowToast();
    const { groundTrip } = useAppSelector((state) => state.groundTrip);

    // Use actual trip data or fallback
    const bookingData = {
        id: groundTrip?.trackingId || 'ID2350847391',
        date: groundTrip?.dateOfBooking || 'June 12, 2025 | 10:00 am',
        departureAirport: groundTrip?.pickUpLocation || 'Tangerang City, Banten 138',
        arrivalAirport: groundTrip?.dropOffLocation || 'Tangerang City, Banten 15138',
        airline: 'Ground Transport', // For ground trips, this would be transport type
        flight: groundTrip?.trackingId || 'GT1315', // Use tracking ID as reference
        parcel: groundTrip?.packages?.[0]?.productType || 'Sensitive Documents',
        fare: `₦${groundTrip?.price?.toLocaleString() || '13,500'}`,
        status: groundTrip?.status || 'Delivering'
    };

    const handleImageUpload = async () => {
        // Show action sheet to choose between camera and gallery
        Alert.alert(
            'Select Photo',
            'Choose how you want to add the delivery photo',
            [
                { text: 'Camera', onPress: () => takePhoto() },
                { text: 'Gallery', onPress: () => pickFromGallery() },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const takePhoto = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow camera access to take delivery photos');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                await uploadImage(result.assets[0]);
            }
        } catch (error) {
            console.log('Camera error:', error);
            Alert.alert('Error', 'Failed to open camera');
        }
    };

    const pickFromGallery = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow access to your photo library to upload delivery photos');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                await uploadImage(result.assets[0]);
            }
        } catch (error) {
            console.log('Gallery error:', error);
            Alert.alert('Error', 'Failed to open gallery');
        }
    };

    const uploadImage = async (asset: ImagePicker.ImagePickerAsset) => {
        setUploadedImage(asset.uri);

        // Upload image to server
        setIsUploading(true);
        try {
            const uploadResult = await dispatch(uploadDocument({
                documentType: 'Delivery Photo',
                file: asset.uri
            })).unwrap();

            setDeliveryImageUrl(uploadResult.url);
            showToast({
                title: "Image Uploaded",
                description: "Delivery photo uploaded successfully",
                icon: CheckCircleIcon,
                action: "success"
            });
        } catch (uploadError: any) {
            showToast({
                title: "Upload Failed",
                description: uploadError.message || "Failed to upload delivery photo",
                icon: ArrowLeftIcon,
                action: "error"
            });
            // Reset the image if upload failed
            setUploadedImage(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleProceedToTollBills = async () => {
        if (!deliveryImageUrl) {
            Alert.alert('Image Required', 'Please upload a delivery photo before proceeding');
            return;
        }

        if (!tripId) {
            Alert.alert('Error', 'Trip ID is missing');
            return;
        }

        try {
            setIsUpdating(true);

            // Update trip status to DELIVERED with delivery image URL
            await dispatch(updateTripStatus({
                id: tripId,
                status: 'DELIVERED',
                deliveryImage: deliveryImageUrl
            })).unwrap();

            showToast({
                title: "Status Updated",
                description: "Trip marked as delivered successfully",
                icon: CheckCircleIcon,
                action: "success"
            });

            // Navigate to toll expenses screen
            router.push({
                pathname: '/screens/dashboard/add-tolls-expenses',
                params: { tripId: tripId }
            });
        } catch (error: any) {
            showToast({
                title: "Update Failed",
                description: error.message || "Failed to update delivery status",
                icon: ArrowLeftIcon,
                action: "error"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleContinue = async () => {
        if (!deliveryImageUrl) {
            Alert.alert('Image Required', 'Please upload a delivery photo before proceeding');
            return;
        }

        if (!tripId) {
            Alert.alert('Error', 'Trip ID is missing');
            return;
        }

        try {
            setIsUpdating(true);

            // Update trip status to DELIVERED with delivery image URL
            await dispatch(updateTripStatus({
                id: tripId,
                status: 'DELIVERED',
                deliveryImage: deliveryImageUrl
            })).unwrap();

            showToast({
                title: "Delivery Confirmed",
                description: "Trip marked as delivered successfully",
                icon: CheckCircleIcon,
                action: "success"
            });

            // Skip toll expenses and go directly to OTP
            router.push({
                pathname: '/screens/dashboard/complete-delivery-otp',
                params: { tripId: tripId }
            });
        } catch (error: any) {
            showToast({
                title: "Update Failed",
                description: error.message || "Failed to confirm delivery",
                icon: ArrowLeftIcon,
                action: "error"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                <TouchableOpacity
                    className="w-10 h-10 items-center justify-center"
                    onPress={() => router.back()}
                >
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-[#2A2A2A]">
                    Confirm Delivery
                </Text>

                <View className="w-10 h-10" />
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Booking Details */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Booking ID</Text>
                        <Text className="text-[#2A2A2A] text-xl font-normal">{bookingData.id}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Date of Booking</Text>
                        <Text className="text-[#2A2A2A] font-normal">{bookingData.date}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Departure Airport</Text>
                        <Text className="text-[#2A2A2A] font-normal text-right flex-1 ml-4">
                            {bookingData.departureAirport}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Arrival Airport</Text>
                        <Text className="text-[#2A2A2A] font-normal text-right flex-1 ml-4">
                            {bookingData.arrivalAirport}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Airline</Text>
                        <Text className="text-[#2A2A2A] font-normal">{bookingData.airline}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Flight</Text>
                        <Text className="text-[#2A2A2A] font-normal">{bookingData.flight}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Parcel</Text>
                        <Text className="text-[#2A2A2A] font-normal">{bookingData.parcel}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-400 text-lg">Fare</Text>
                        <Text className="text-[#2A2A2A] font-normal">{bookingData.fare}</Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-gray-400 text-lg">Current Status</Text>
                        <View className="bg-orange-100 px-3 py-1 rounded-full">
                            <Text className="text-orange-600 text-sm font-normal">
                                {bookingData.status}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Upload Photo Section */}
                <View className="mb-6">
                    <TouchableOpacity
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center min-h-[120px]"
                        onPress={handleImageUpload}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <View className="items-center">
                                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-4">
                                    <Text className="text-blue-600 text-xs">...</Text>
                                </View>
                                <Text className="text-blue-600 font-medium mb-1">
                                    Uploading Photo...
                                </Text>
                                <Text className="text-gray-500 text-sm">
                                    Please wait
                                </Text>
                            </View>
                        ) : uploadedImage && deliveryImageUrl ? (
                            <View className="items-center">
                                <Image
                                    source={{ uri: uploadedImage }}
                                    className="w-16 h-16 rounded-lg mb-4"
                                    resizeMode="cover"
                                />
                                <Text className="text-green-700 text-sm font-medium">✓ Photo uploaded successfully</Text>
                                <Text className="text-gray-500 text-xs mt-1">Tap to change photo</Text>
                            </View>
                        ) : (
                            <View className="items-center">
                                <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-4">
                                    <Icon as={UploadIcon} size="md" className="text-gray-400" />
                                </View>
                                <Text className="text-gray-700 font-medium mb-1">
                                    Upload Photo of Delivered Parcel
                                </Text>
                                <Text className="text-gray-500 text-sm">
                                    Take a photo or select from gallery
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Package Image */}
                <View className="mb-6 items-center">
                    <View className="w-full h-64 m=b-6 bg-gray-100 rounded-lg items-center justify-center">
                        <View className="w-full h-full rounded items-center justify-center">
                            <View className="w-full h-64 bg-white rounded-2xl items-center justify-center border-2 border-orange-200">
                                <Image
                                    source={require('../../../assets/images/package-sample.png')}
                                    style={{
                                        width: '90%',
                                        height: '90%',
                                        borderRadius: 12,
                                    }}
                                    resizeMode="cover"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bottom Buttons */}
                <View className="px-4 pb-6 gap-y-3">
                    <Button
                        size="xl"
                        className="bg-[#E75B3B] rounded-xl w-full h-[47px]"
                        onPress={handleProceedToTollBills}
                        disabled={isUpdating || isUploading || !deliveryImageUrl}
                    >
                        <ButtonText className="text-white font-semibold text-lg">
                            {isUpdating ? 'Updating...' : isUploading ? 'Uploading...' : 'Proceed to Toll Bills'}
                        </ButtonText>
                    </Button>

                    <Button
                        size="xl"
                        variant="outline"
                        className="border-[#E75B3B] rounded-xl w-full h-[47px]"
                        onPress={handleContinue}
                        disabled={isUpdating || isUploading || !deliveryImageUrl}
                    >
                        <ButtonText className="text-[#E75B3B] font-semibold text-lg">
                            {isUpdating ? 'Updating...' : isUploading ? 'Uploading...' : 'Continue'}
                        </ButtonText>
                    </Button>
                </View>
            </ScrollView>

        </SafeAreaView>
    );
}