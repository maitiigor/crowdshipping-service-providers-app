import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import { HelpCircleIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StatusBar,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from "yup";
import InputLabelText from '../../../components/Custom/InputLabelText';
import PackageList from '../../../components/Custom/PackageList';
import { ThemedView } from '../../../components/ThemedView';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, BellIcon, CheckCircleIcon, Icon } from '../../../components/ui/icon';
import { useShowToast } from '../../../hooks/useShowToast';
import { ApiError } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { negotiateBid } from '../../../store/slices/bidSlice';

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose }) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
    >
        <ThemedView className="flex-1 bg-black/50 items-center justify-center px-6">
            <ThemedView className="bg-white rounded-2xl p-8 w-full max-w-sm items-center">
                {/* Success Icon with Animation */}
                <ThemedView className="relative mb-6">
                    {/* Outer circles for animation effect */}
                    <ThemedView className="absolute w-20 h-20 rounded-full bg-orange-100 opacity-30 animate-pulse" />
                    <ThemedView className="absolute w-16 h-16 top-2 left-2 rounded-full bg-orange-200 opacity-50 animate-pulse" />

                    {/* Main success icon */}
                    <ThemedView className="w-12 h-12 top-4 left-4 bg-[#E75B3B] rounded-full items-center justify-center">
                        <Icon as={CheckCircleIcon} size="lg" className="text-white" />
                    </ThemedView>
                </ThemedView>

                {/* Success Message */}
                <ThemedText className="text-xl font-semibold text-gray-900 text-center mb-2">
                    Price sent
                </ThemedText>
                <ThemedText className="text-gray-500 text-center mb-8 text-base px-4">
                    Offer sent to User, you will see a notification when they accept th price
                </ThemedText>

                {/* Close Button */}
                <Button
                    size="xl"
                    className="bg-[#E75B3B] rounded-lg w-full"
                    onPress={onClose}
                >
                    <ButtonText className="text-white font-semibold text-lg">
                        Okay
                    </ButtonText>
                </Button>
            </ThemedView>
        </ThemedView>
    </Modal>
);

export default function NegotiateBidScreen() {
    const { bidId, tripId, type } = useLocalSearchParams<{
        bidId: string;
        tripId: string;
        type: string;
    }>();

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useAppDispatch();
    const { airTrip } = useAppSelector((state) => state.airTrip);
    const { marineTrip } = useAppSelector((state) => state.marineTrip);





    const renderAirTripDetailsCard = () => {

        const bids =
            typeof airTrip.bids_recieved === 'number'
                ? []
                : airTrip.bids_recieved || [];
        const bid = bids.find(b => b._id === bidId);

        return (<ThemedView className="bg-white my-4 rounded-xl mb-3 shadow-lg px-4">
            <ThemedText className="text-lg font-semibold text-gray-900 mb-3">Bid Summary</ThemedText>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-600 text-lg flex-1 w-1/3" >Trip ID</ThemedText>
                <ThemedText className="text-gray-600 font-bold ml-1 text-lg w-2/3 text-right ">{airTrip.tripId}</ThemedText>
            </ThemedView>


            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg w-1/3">Date of Trip</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg w-2/3 text-right ">{airTrip.departureDate}</ThemedText>
            </ThemedView>


            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg w-1/3">Pickup Location</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg  w-2/3 text-right">{bid?.pickUpLocation.address}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg w-1/3">Drop-off Location</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg w-2/3 text-right ">{bid?.dropOffLocation.address}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg w-1/3">Aiport</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg w-2/3 text-right ">{airTrip.arrivalAirport.city}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg flex-1 w-1/3">Flight Number</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg w-2/3 text-right ">{airTrip.flightNumber}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg w-1/3">Weight</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg w-2/3 text-right ">{marineTrip.capacity.dimension}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg w-1/3">Fare</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg w-2/3 text-right ">${bid?.finalPrice}</ThemedText>
            </ThemedView>

        </ThemedView>);
    }

    const renderAirTripPackages = () => {
        const bids =
            typeof airTrip.bids_recieved === 'number'
                ? []
                : airTrip.bids_recieved || [];
        const bid = bids.find(b => b._id === bidId);

        if (!bid || !bid.packages || bid.packages.length === 0) {
            return null;
        }

        return (
            <PackageList
                packages={bid.packages}
                title="Packages in this Bid"
                showTitle={true}
            />
        );
    }

    const renderMarineTripDetailsCard = () => {

        const bids =
            typeof marineTrip.bids_recieved === 'number'
                ? []
                : marineTrip.bids_recieved || [];
        const bid = bids.find(b => b._id === bidId);

        return (<ThemedView className="bg-white my-4 rounded-xl mb-3 shadow-lg px-4">
            <ThemedText className="text-lg font-semibold text-gray-900 mb-3">Bid Summary</ThemedText>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-600 text-lg flex-1">Trip ID</ThemedText>
                <ThemedText className="text-gray-600 font-bold ml-1 text-lg ">{marineTrip.tripId}</ThemedText>
            </ThemedView>


            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg flex-1">Date of Trip</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg ">{marineTrip.departureDate}</ThemedText>
            </ThemedView>


            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg flex-1">Pickup Location</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg ">{bid?.pickUpLocation.address}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg flex-1">Drop-off Location</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg ">{bid?.dropOffLocation.address}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg flex-1">Vessel</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg ">{marineTrip.vesselName}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg flex-1">Container</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg ">{marineTrip.containerNumber}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg flex-1">Weight</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg ">{marineTrip.capacity.dimension}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row space-between items-center mb-3">
                <ThemedText className="text-gray-500 text-lg flex-1">Fare</ThemedText>
                <ThemedText className="text-gray-700 font-bold ml-1 text-lg ">${bid?.finalPrice}</ThemedText>
            </ThemedView>

        </ThemedView>);
    }

    const renderMarineTripPackages = () => {
        const bids =
            typeof marineTrip.bids_recieved === 'number'
                ? []
                : marineTrip.bids_recieved || [];
        const bid = bids.find(b => b._id === bidId);

        if (!bid || !bid.packages || bid.packages.length === 0) {
            return null;
        }

        return (
            <PackageList
                packages={bid.packages}
                title="Packages in this Bid"
                showTitle={true}
            />
        );
    }




    const handleGoBack = () => {
        router.back();
    };

    const handleNotificationPress = () => {
        // TODO: Navigate to notifications
        console.log('Navigate to notifications');
    };


    const handleSuccessModalClose = (type: string, tripId: string) => {
        setShowSuccessModal(false);
        // Navigate back to review bids screen

        router.push({
            pathname: '/screens/dashboard/review-bids',
            params: {
                tripId: tripId,
                type: type
            }
        })
    };

    const showToast: any = useShowToast();

    const initialValues = {
        bidId,
        tripId,
        type,
        amount: "",
        note: "",
    };

    const validationSchema = Yup.object().shape({
        amount: Yup.number().min(1, 'Bid amount must be at least 1').required('Bid amount is required'),
        note: Yup.string().required('Note field is required'),

    });


    const subbmitBid = (values: any) => {
        console.log("submitting bid with values:", values);
        // TODO: Implement actual bid negotiation API call
        setIsSubmitting(true);

        dispatch(negotiateBid({
            amount: values.amount,
            note: values.note,
            bidId: bidId as string,
        }))
            .unwrap()
            .then((response: any) => {
                console.log("bid negotiation response:", response);
                setShowSuccessModal(true);

            })
            .catch((error: ApiError) => {
                console.log("bid negotiation error:", error);
                showToast({
                    title: "Bid Negotiation Failed",
                    description: error.message || "An error occurred while negotiating the bid.",
                    icon: HelpCircleIcon,
                    action: "error",
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }


    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <ThemedView className="bg-white h-16 px-4 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity className="p-2" onPress={handleGoBack}>
                    <Icon as={ArrowLeftIcon} size="lg" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-lg font-semibold text-gray-900">Renegotiate Bid</ThemedText>

                <TouchableOpacity className="p-2" onPress={handleNotificationPress}>
                    <ThemedView className="relative">
                        <Icon as={BellIcon} size="lg" className="text-[#E75B3B]" />
                        <ThemedView className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </ThemedView>
                </TouchableOpacity>
            </ThemedView>

            <ScrollView className="flex-1 px-4 bg-white " showsVerticalScrollIndicator={false}>
                {/* Trip Details Card */}
                {type === 'Air' ? renderAirTripDetailsCard() : renderMarineTripDetailsCard()}

                {/* Packages Section */}
                {type === 'Air' ? renderAirTripPackages() : renderMarineTripPackages()}

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={subbmitBid}>
                    {({ handleChange, handleSubmit, values, errors, touched }) => (

                        <ThemedView className="mt-4">

                            {/* Bid Form */}
                            <ThemedView>
                                <InputLabelText>Your Bid Amount (NGN)</InputLabelText>
                                <TextInput
                                    placeholder="$ 5000"
                                    value={values.amount}
                                    onChangeText={handleChange('amount')}
                                    keyboardType="numeric"
                                    className="bg-[#FDF2F0] rounded-lg h-[55px] mb-2 px-4 py-4 text-base"
                                />
                                {touched.note && errors.amount && (
                                    <ThemedText style={{ color: "red", fontSize: 12 }}>
                                        {errors.amount}
                                    </ThemedText>
                                )}
                            </ThemedView>

                            {/* Estimated Time */}
                            <ThemedView>
                                <InputLabelText>   Note </InputLabelText>
                                <TextInput
                                    placeholder="$ 5000"
                                    value={values.note}
                                    onChangeText={handleChange('note')}
                                    className="bg-[#FDF2F0] rounded-lg h-[55px] mb-3 px-4 py-4 text-base"
                                />
                                {touched.note && errors.note && (
                                    <ThemedText style={{ color: "red", fontSize: 12 }}>
                                        {errors.note}
                                    </ThemedText>
                                )}
                            </ThemedView>
                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={() => handleSubmit()}
                                disabled={isSubmitting}
                                className={`rounded-lg py-4 mt-3 items-center ${isSubmitting ? 'bg-gray-400' : 'bg-[#E75B3B]'
                                    }`}
                            >
                                <ThemedText className="text-white font-semibold text-lg">
                                    {isSubmitting ? 'Submitting...' : 'Submit Bid'}
                                </ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    )}
                </Formik>




                {/* Bottom spacing */}
                <ThemedView className="h-20" />
            </ScrollView >

            {/* Success Modal */}
            < SuccessModal
                visible={showSuccessModal}
                onClose={() => handleSuccessModalClose(type, tripId)}
            />
        </SafeAreaView >
    );
}