import { router, useLocalSearchParams } from 'expo-router';
import { FieldArray, Formik } from 'formik';
import { CheckCircleIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import ImageUploader from '../../../components/Custom/ImageUploader';
import InputLabelText from '../../../components/Custom/InputLabelText';
import { ThemedView } from '../../../components/ThemedView';
import { Button, ButtonText } from '../../../components/ui/button';
import { AlertCircleIcon, ArrowLeftIcon, Icon } from '../../../components/ui/icon';
import { Input, InputField } from '../../../components/ui/input';
import { useShowToast } from '../../../hooks/useShowToast';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateTripStatus } from '../../../store/slices/groundTripSlice';
import { uploadDocument } from '../../../store/slices/profileSlice';
import { resendDeliveryOtp } from '../../../store/slices/tripManagementSlice';

const { width, height } = Dimensions.get('window');

interface TollEntry {
    id: string;
    description?: string;
    amount: string;
    receipt?: string;
}

export default function AddTollsExpensesScreen() {
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    const [tollEntries, setTollEntries] = useState<TollEntry[]>([
        { id: '1', amount: '50.00' }
    ]);
    const dispatch = useAppDispatch();
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const { groundTrip } = useAppSelector((state) => state.groundTrip);
    const showToast = useShowToast();
    const [isUploading, setIsUploading] = useState(false);


    // Use actual trip data or fallback
    const bookingData = {
        id: groundTrip?.trackingId || 'ID2350847391',
        date: groundTrip?.dateOfBooking || 'June 12, 2025 | 10:00 am',
        departureAirport: groundTrip.pickUpLocation.address || 'Tangerang City, Banten 138',
        arrivalAirport: groundTrip?.dropOffLocation.address || 'Tangerang City, Banten 15138',
        airline: 'Ground Transport', // For ground trips, this would be transport type
        flight: groundTrip?.trackingId || 'GT1315', // Use tracking ID as reference
        parcel: groundTrip?.packages?.[0]?.productType || 'Sensitive Documents',
        fare: `₦${groundTrip?.price?.toLocaleString() || '13,500'}`,
        status: groundTrip?.status || 'Delivering'
    };

    const calculateTotal = () => {
        const tollTotal = tollEntries.reduce((sum, entry) => {
            return sum + (parseFloat(entry.amount) || 0);
        }, 0);

        const baseFare = parseFloat(bookingData.fare.replace('₦', '').replace(',', '')) || 0;
        return baseFare + tollTotal;
    };

    const handleTollAmountChange = (id: string, amount: string) => {
        setTollEntries(prev =>
            prev.map(entry =>
                entry.id === id ? { ...entry, amount } : entry
            )
        );
    };

    const handleAddReceipt = (id: string) => {
        // In a real app, this would open image picker
        console.log('Add receipt for toll:', id);
        Alert.alert('Receipt', 'Image picker would open here');
    };

    const handleAddAnotherToll = () => {
        const newId = (tollEntries.length + 1).toString();
        setTollEntries(prev => [...prev, { id: newId, amount: '0.00' }]);
    };

    const handleSkip = async () => {
        // Navigate directly to OTP screen without saving charges
        setIsUpdating(true);

        try {
            await dispatch(resendDeliveryOtp({
                tripId
            })).unwrap();

            showToast({
                title: "OTP Sent",
                description: "OTP has been sent to recipient to complete delivery",
                icon: CheckCircleIcon,
                action: "success"
            });

            router.push({
                pathname: '/screens/dashboard/complete-delivery-otp',
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

    const handleRecieptUpload = async (file: string) => {

        // Upload image to server
        setIsUploading(true);
        try {

            const resultAction = await dispatch(uploadDocument({ documentType: 'Toll Reciept', file }));

            if (uploadDocument.fulfilled.match(resultAction)) {
                const uploadedUrl = resultAction.payload.url;
                return uploadedUrl;
            }
        } catch (error) {
            console.log("upload error:", error);
            return "";
        }
    }

    const handleSaveCharges = async (values: any) => {
        // In real app, save toll charges to backend first
        try {
            setIsUpdating(true);

            await dispatch(updateTripStatus({
                id: tripId,
                status: 'TOLL_BILL_PENDING',
                expenses: values.tolls.map((toll: any) => ({
                    amount: parseFloat(toll.amount),
                    receipt: toll.receipt || '',
                    description: toll.description || ''


                }))

            })).unwrap();
            showToast({
                title: "Status Updated",
                description: "Trip marked as toll bill paid successfully",
                icon: CheckCircleIcon,
                action: "success"
            });

            // Navigate to toll expenses screen
            router.push({
                pathname: '/screens/dashboard/complete-delivery-otp',
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

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <ThemedView className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                <TouchableOpacity
                    className="w-10 h-10 items-center justify-center"
                    onPress={() => router.back()}
                >
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-lg font-semibold text-gray-900">
                    Add Tolls & Expenses
                </ThemedText>

                <ThemedView className="w-10 h-10" />
            </ThemedView>

            {/* Content */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Booking Summary */}
                <ThemedView className="mb-6">
                    <ThemedText className="text-lg font-semibold text-gray-900 mb-4">
                        Booking Summary:
                    </ThemedText>

                    <ThemedView className="space-y-2">
                        <ThemedView className="flex-row justify-between items-center mb-4">
                            <ThemedText className="text-gray-400 text-lg">Booking ID</ThemedText>
                            <ThemedText className="text-[#2A2A2A] text-xl font-normal">{bookingData.id}</ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between items-center mb-4">
                            <ThemedText className="text-gray-400 text-lg">Date of Booking</ThemedText>
                            <ThemedText className="text-[#2A2A2A] font-normal">{bookingData.date}</ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between items-center mb-4">
                            <ThemedText className="text-gray-400 text-lg">Departure Airport</ThemedText>
                            <ThemedText className="text-[#2A2A2A] font-normal text-right flex-1 ml-4">
                                {bookingData.departureAirport}
                            </ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between items-center mb-4">
                            <ThemedText className="text-gray-400 text-lg">Arrival Airport</ThemedText>
                            <ThemedText className="text-[#2A2A2A] font-normal text-right flex-1 ml-4">
                                {bookingData.arrivalAirport}
                            </ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between items-center mb-4">
                            <ThemedText className="text-gray-400 text-lg">Airline</ThemedText>
                            <ThemedText className="text-[#2A2A2A] font-normal">{bookingData.airline}</ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between items-center mb-4">
                            <ThemedText className="text-gray-400 text-lg">Flight</ThemedText>
                            <ThemedText className="text-[#2A2A2A] font-normal">{bookingData.flight}</ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between items-center mb-4">
                            <ThemedText className="text-gray-400 text-lg">Parcel</ThemedText>
                            <ThemedText className="text-[#2A2A2A] font-normal">{bookingData.parcel}</ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between items-center mb-4">
                            <ThemedText className="text-gray-400 text-lg">Fare</ThemedText>
                            <ThemedText className="text-[#2A2A2A] font-normal">{bookingData.fare}</ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row justify-between items-center">
                            <ThemedText className="text-gray-400 text-lg">Current Status</ThemedText>
                            <ThemedView className="bg-orange-100 px-3 py-1 rounded-full">
                                <ThemedText className="text-orange-600 text-sm font-normal">
                                    {bookingData.status}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                {/* Toll Entries */}
                <Formik
                    initialValues={{ tolls: tollEntries }}
                    validationSchema={Yup.object().shape({
                        tolls: Yup.array().of(
                            Yup.object().shape({
                                amount: Yup.number()
                                    .typeError('Amount must be a number')
                                    .positive('Amount must be positive')
                                    .required('Amount is required'),
                                receipt: Yup.string().required('Receipt is required'),
                            })
                        ),
                    })}
                    onSubmit={handleSaveCharges}
                >
                    {({ values, errors, touched, setFieldValue, handleSubmit }) => (
                        <>
                            <FieldArray name="tolls">
                                {({ push }) => (
                                    <>
                                        {values.tolls.map((entry, index) => (
                                            <View key={entry.id} className="mb-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                <ThemedText className="text-gray-700 font-medium mb-2">
                                                    Toll Amount
                                                </ThemedText>

                                                <ThemedView className="flex-row items-center mb-3">
                                                    <Input className="flex-1 mr-3 h-[50px] rounded-lg">
                                                        <InputField
                                                            placeholder="0.00"
                                                            value={entry.amount}
                                                            onChangeText={(text) =>
                                                                setFieldValue(`tolls[${index}].amount`, text)
                                                            }
                                                            keyboardType="numeric"
                                                        />
                                                    </Input>
                                                    <ThemedText className="text-gray-700 absolute right-8">₦</ThemedText>
                                                </ThemedView>

                                                {/* TS-safe Amount Error */}
                                                {
                                                    errors.tolls?.[index] &&
                                                    typeof errors.tolls[index] === 'object' &&
                                                    'amount' in errors.tolls[index] &&
                                                    touched.tolls?.[index]?.amount && (
                                                        <ThemedText className="text-red-500">
                                                            {(errors.tolls[index] as any).amount}
                                                        </ThemedText>
                                                    )
                                                }

                                                < ThemedView >
                                                    <InputLabelText className="text-sm text-gray-700 mb-2">
                                                        Toll Receipt
                                                    </InputLabelText>
                                                    <ImageUploader
                                                        uri={entry.receipt}
                                                        allowsEditing
                                                        size={80}
                                                        aspect={[4, 3]}
                                                        label='Upload Receipt'
                                                        className="border-2 flex justify-center bg-rose-50 border-typography-300 items-center py-4 rounded border-dotted"
                                                        shape="circle"
                                                        onChange={async (uri) => {
                                                            if (!uri) return;
                                                            const uploadedUrl = await handleRecieptUpload(uri);
                                                            setFieldValue(
                                                                `tolls[${index}].receipt`,
                                                                uploadedUrl
                                                            );
                                                        }}
                                                        helperText="Toll Receipt Image"
                                                    />
                                                    {/* TS-safe Receipt Error */}
                                                    {
                                                        errors.tolls?.[index] &&
                                                        typeof errors.tolls[index] === 'object' &&
                                                        'receipt' in errors.tolls[index] &&
                                                        touched.tolls?.[index]?.receipt && (
                                                            <ThemedText className="text-red-500">
                                                                {(errors.tolls[index] as any).receipt}
                                                            </ThemedText>
                                                        )
                                                    }
                                                </ThemedView>
                                                <ThemedText className="text-gray-700 font-medium mb-2">
                                                    Description
                                                </ThemedText>

                                                <Input className="flex-1 mr-3 h-[50px] rounded-lg">
                                                    <InputField
                                                        placeholder="Description"
                                                        value={entry.description}
                                                        onChangeText={(text) =>
                                                            setFieldValue(`tolls[${index}].description`, text)
                                                        }
                                                    />
                                                </Input>

                                            </ThemedView>
                                        ))}

                                        {/* Add Another Toll Button */}
                                        <Button
                                            variant="outline"
                                            className="border-[#E75B3B] rounded-xl w-full h-[47px] mb-6"
                                            onPress={() =>

                                                push({ id: `${values.tolls.length + 1}`, amount: '', receipt: '' })

                                            }
                                        >
                                            <ButtonText className="text-[#E75B3B] font-semibold text-lg">
                                                Add Another Toll
                                            </ButtonText>
                                        </Button>
                                    </>
                                )}
                            </FieldArray>

                            {/* Submit Button (kept in your Bottom Buttons section) */}
                            <Button
                                size="xl"
                                className="bg-[#E75B3B] rounded-xl flex-1 h-[47px]"
                                onPress={() => handleSubmit()}
                            >
                                <ButtonText className="text-white font-semibold text-lg">
                                    {isUpdating ? <ActivityIndicator></ActivityIndicator> : 'Save Charges'}
                                </ButtonText>
                            </Button>

                            {/* Total Additional Charges */}
                            <ThemedView className="my-6">
                                <ThemedText className="text-lg font-semibold text-gray-900 mb-4">
                                    Total Additional Charges
                                </ThemedText>
                                <ThemedView className="space-y-2">
                                    {values.tolls.map((entry, index) => (
                                        <View key={entry.id} className="flex-row justify-between items-center">
                                            <ThemedText className="text-gray-600">Toll {index + 1}</ThemedText>
                                            <ThemedText className="text-gray-900 font-medium">
                                                ₦{parseFloat(entry.amount || '0').toLocaleString()}
                                            </ThemedText>
                                        </ThemedView>
                                    ))}


                                    <ThemedView className="border-t border-gray-200 pt-2 mt-2">
                                        <ThemedView className="flex-row justify-between items-center">
                                            <ThemedText className="text-lg font-semibold text-gray-900">
                                                Calculated Total
                                            </ThemedText>
                                            <ThemedText className="text-lg font-semibold text-[#E75B3B]">
                                                ₦{values.tolls.reduce((total, entry) => total + parseFloat(entry.amount), 0) + parseFloat(bookingData.fare.replace('₦', '').replace(',', ''))}
                                            </ThemedText>
                                        </ThemedView>
                                    </ThemedView>
                                </ThemedView>
                            </ThemedView>
                        </>
                    )}
                </Formik>




                {/* Warning Notice */}
                <ThemedView className="mb-6">
                    <ThemedView className="bg-red-50 border border-red-200 rounded-lg p-4 flex-row items-start">
                        <ThemedView className="mr-3 mt-0.5">
                            <Icon as={AlertCircleIcon} size="lg" className="text-red-500" />
                        </ThemedView>
                        <ThemedView className="flex-1">
                            <ThemedText className="text-red-600 text-sm leading-normal font-medium">
                                Please note: These charges will be added to the customer's final bill
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
                {/* Bottom Buttons */}
                <ThemedView className="px-4 pb-6 flex-row gap-x-3">
                    <Button
                        variant="outline"
                        className="border-[#E75B3B] rounded-xl flex-1 h-[47px]"
                        onPress={handleSkip}
                    >
                        <ButtonText className="text-[#E75B3B] font-semibold text-lg">
                            Skip
                        </ButtonText>
                    </Button>

                    <Button
                        size="xl"
                        className="bg-[#E75B3B] rounded-xl flex-1 h-[47px]"
                        onPress={handleSaveCharges}
                    >
                        <ButtonText className="text-white font-semibold text-lg">
                            {isUpdating ? <ActivityIndicator></ActivityIndicator> : 'Save Charges'}
                        </ButtonText>
                    </Button>
                </ThemedView>
            </ScrollView >


        </SafeAreaView >
    );
}