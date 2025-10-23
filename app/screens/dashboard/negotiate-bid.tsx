import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import { HelpCircleIcon, LucideIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from "yup";
import CustomToast from "../../../components/Custom/CustomToast";
import InputLabelText from '../../../components/Custom/InputLabelText';
import { ThemedView } from '../../../components/ThemedView';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, BellIcon, CheckCircleIcon, Icon } from '../../../components/ui/icon';
import { useToast } from "../../../components/ui/toast";
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
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
            <View className="bg-white rounded-2xl p-8 w-full max-w-sm items-center">
                {/* Success Icon with Animation */}
                <View className="relative mb-6">
                    {/* Outer circles for animation effect */}
                    <View className="absolute w-20 h-20 rounded-full bg-orange-100 opacity-30 animate-pulse" />
                    <View className="absolute w-16 h-16 top-2 left-2 rounded-full bg-orange-200 opacity-50 animate-pulse" />

                    {/* Main success icon */}
                    <View className="w-12 h-12 top-4 left-4 bg-[#E75B3B] rounded-full items-center justify-center">
                        <Icon as={CheckCircleIcon} size="lg" className="text-white" />
                    </View>
                </View>

                {/* Success Message */}
                <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
                    Price sent
                </Text>
                <Text className="text-gray-500 text-center mb-8 text-base px-4">
                    Offer sent to User, you will see a notification when they accept th price
                </Text>

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
            </View>
        </View>
    </Modal>
);

export default function NegotiateBidScreen() {
    const { bidId, tripId, type } = useLocalSearchParams<{
        bidId: string;
        tripId: string;
        type: string;
    }>();

    const [bidAmount, setBidAmount] = useState('5000');
    const [estimatedTime, setEstimatedTime] = useState('2 hours');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useAppDispatch();
    const { airTrip } = useAppSelector((state) => state.airTrip);
    const { marineTrip } = useAppSelector((state) => state.marineTrip);


    if (type === 'Air') {
        const bids =
            typeof airTrip.bids_recieved === 'number'
                ? []
                : airTrip.bids_recieved || [];
    }


    if (type === 'Marine') {
        const bids =
            typeof marineTrip.bids_recieved === 'number'
                ? []
                : marineTrip.bids_recieved || [];
    }


    const renderAirTripDetailsCard = () => {

        const bids =
            typeof airTrip.bids_recieved === 'number'
                ? []
                : airTrip.bids_recieved || [];
        const bid = bids.find(b => b._id === bidId);

        return (<View className="bg-white my-4 rounded-xl mb-3 shadow-lg px-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Bid Summary</Text>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-600 text-lg flex-1">Trip ID</Text>
                <Text className="text-gray-600 font-bold ml-1 text-lg ">{airTrip.tripId}</Text>
            </View>


            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Date of Trip</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{airTrip.departureDate}</Text>
            </View>


            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Pickup Location</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{bid?.pickUpLocation.address}</Text>
            </View>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Drop-off Location</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{bid?.dropOffLocation.address}</Text>
            </View>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Aiport</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{airTrip.arrivalAirport.city}</Text>
            </View>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Container</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{marineTrip.containerNumber}</Text>
            </View>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Weight</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{marineTrip.capacity.dimension}</Text>
            </View>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Fare</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{bid?.finalPrice}</Text>
            </View>

        </View>);
    }

    const renderMarineTripDetailsCard = () => {

        const bids =
            typeof marineTrip.bids_recieved === 'number'
                ? []
                : marineTrip.bids_recieved || [];
        const bid = bids.find(b => b._id === bidId);

        return (<View className="bg-white my-4 rounded-xl mb-3 shadow-lg px-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Bid Summary</Text>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-600 text-lg flex-1">Trip ID</Text>
                <Text className="text-gray-600 font-bold ml-1 text-lg ">{marineTrip.tripId}</Text>
            </View>


            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Date of Trip</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{marineTrip.departureDate}</Text>
            </View>


            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Pickup Location</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{bid?.pickUpLocation.address}</Text>
            </View>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Drop-off Location</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{bid?.dropOffLocation.address}</Text>
            </View>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Vessel</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{marineTrip.vesselName}</Text>
            </View>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Container</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{marineTrip.containerNumber}</Text>
            </View>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Weight</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{marineTrip.capacity.dimension}</Text>
            </View>

            <View className="flex-row space-between items-center mb-3">
                <Text className="text-gray-500 text-lg flex-1">Fare</Text>
                <Text className="text-gray-700 font-bold ml-1 text-lg ">{bid?.finalPrice}</Text>
            </View>

        </View>);
    }


    // Mock trip data based on the screenshot
    const mockTripData = {
        title: "Urgent Documents to VI",
        location: "Lagos - Canada",
        weight: "0.5kg",
        dimension: "30x20x2cm",
        sender: "John Doe",
        postedBy: "Amina Bello",
        timeAgo: "35m ago"
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleNotificationPress = () => {
        // TODO: Navigate to notifications
        console.log('Navigate to notifications');
    };


    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        // Navigate back to review bids screen
        router.push({
            pathname: '/screens/dashboard/review-bids',
            params: { tripId: tripId }
        })
    };

    const toast = useToast();

    const showNewToast = ({
        title,
        description,
        icon,
        action = "error",
        variant = "solid",
    }: {
        title: string;
        description: string;
        icon: LucideIcon;
        action: "error" | "success" | "info" | "muted" | "warning";
        variant: "solid" | "outline";
    }) => {
        toast.show({
            id: Math.random().toString(),
            placement: "top",
            duration: 3000,
            render: ({ id }) => (
                <CustomToast
                    uniqueToastId={"toast-" + id}
                    icon={icon}
                    action={action}
                    title={title}
                    variant={variant}
                    description={description}
                />
            ),
        });
    };

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
                showNewToast({
                    title: "Bid Negotiation Failed",
                    description: error.message || "An error occurred while negotiating the bid.",
                    icon: HelpCircleIcon,
                    action: "error",
                    variant: "solid",
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
            <View className="bg-white h-16 px-4 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity className="p-2" onPress={handleGoBack}>
                    <Icon as={ArrowLeftIcon} size="lg" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-gray-900">Renegotiate Bid</Text>

                <TouchableOpacity className="p-2" onPress={handleNotificationPress}>
                    <View className="relative">
                        <Icon as={BellIcon} size="lg" className="text-[#E75B3B]" />
                        <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 bg-white " showsVerticalScrollIndicator={false}>
                {/* Trip Details Card */}
                {type === 'Air' ? renderAirTripDetailsCard() : renderMarineTripDetailsCard()}

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={subbmitBid}>
                    {({ handleChange, handleSubmit, values, errors, touched }) => (

                        <View className="mt-4">

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
                                    <Text style={{ color: "red", fontSize: 12 }}>
                                        {errors.amount}
                                    </Text>
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
                                    <Text style={{ color: "red", fontSize: 12 }}>
                                        {errors.note}
                                    </Text>
                                )}
                            </ThemedView>
                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={() => handleSubmit()}
                                disabled={isSubmitting}
                                className={`rounded-lg py-4 mt-3 items-center ${isSubmitting ? 'bg-gray-400' : 'bg-[#E75B3B]'
                                    }`}
                            >
                                <Text className="text-white font-semibold text-lg">
                                    {isSubmitting ? 'Submitting...' : 'Submit Bid'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>




                {/* Bottom spacing */}
                <View className="h-20" />
            </ScrollView >

            {/* Success Modal */}
            < SuccessModal
                visible={showSuccessModal}
                onClose={handleSuccessModalClose}
            />
        </SafeAreaView >
    );
}