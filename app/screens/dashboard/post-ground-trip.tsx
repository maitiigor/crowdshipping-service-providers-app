import { router } from 'expo-router';
import { Formik } from 'formik';
import { CircleCheckIcon, HelpCircleIcon, LucideIcon, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import AirportSearch from '../../../components/Custom/AirportSearch';
import CustomToast from '../../../components/Custom/CustomToast';
import DateField from '../../../components/Custom/DateField';
import InputLabelText from '../../../components/Custom/InputLabelText';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, BellIcon, Icon } from '../../../components/ui/icon';
import { useToast } from '../../../components/ui/toast';
import { Airport, ApiError } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { saveAirTrip } from '../../../store/slices/airTripSlice';

interface FormData {
    departureCity: string;
    arrivalCity: string;
    airlineName: string;
    flightNumber: string;
    departureDate: string;
    arrivalDate: string;
    availableCapacityPounds: string;
    availableCapacityDimensions: string;
}

export default function GroundTripScreen() {
    const [formData, setFormData] = useState<FormData>({
        departureCity: '',
        arrivalCity: '',
        airlineName: '',
        flightNumber: '',
        departureDate: '',
        arrivalDate: '',
        availableCapacityPounds: '',
        availableCapacityDimensions: '',
    });
    const dispatch = useAppDispatch();
    const { airTrip, trips, loading, error } = useAppSelector((state) => state.airTrip);

    const validationSchema = Yup.object().shape({
        departureCity: Yup.string().required("Departure city is required"),
        arrivalCity: Yup.string().required("Arrival city is required"),
        airlineName: Yup.string().required("Airline name is required"),
        flightNumber: Yup.string().required("Flight number is required"),
        departureDate: Yup.date()
            .required("Departure date is required")
            .typeError("Invalid departure date"),
        arrivalDate: Yup.date()
            .required("Arrival date is required")
            .typeError("Invalid arrival date")
            .test(
                "date-difference",
                "Arrival date cannot be more than 3 days after departure date",
                function (arrivalDate) {
                    const { departureDate } = this.parent;
                    if (!departureDate || !arrivalDate) return true;

                    const dep = new Date(departureDate).getTime();
                    const arr = new Date(arrivalDate).getTime();

                    const diffInDays = (arr - dep) / (1000 * 60 * 60 * 24);
                    return diffInDays <= 3 && diffInDays >= 0;
                }
            ),
        availableCapacityPounds: Yup.string().required(
            "Available capacity (pounds) is required"
        ),
        availableCapacityDimensions: Yup.string().required(
            "Available capacity (dimensions) is required"
        ),
    });

    const [depatureAirport, setDepartureAirport] = useState<Airport>({
        iata: "",
        icao: "",
        name: "",
        city: "",
        country: "",
        latitude: 0,
        longitude: 0,
    });


    const [arrivalAirport, setArrivalAirport] = useState<Airport>({
        iata: "",
        icao: "",
        name: "",
        city: "",
        country: "",
        latitude: 0,
        longitude: 0,
    });


    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
        const newId = Math.random();
        toast.show({
            id: newId.toString(),
            placement: "top",
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                    <CustomToast
                        uniqueToastId={uniqueToastId}
                        icon={icon}
                        action={action}
                        title={title}
                        variant={variant}
                        description={description}
                    />
                );
            },
        });
    };

    const handlePostTrip = async (values: FormData) => {




        const payload = {
            departureCity: values.departureCity,
            departureAirport: depatureAirport,
            arrivalCity: values.arrivalCity,
            arrivalAirport: arrivalAirport,
            airlineName: values.airlineName,
            flightNumber: values.flightNumber,
            departureDate: values.departureDate,
            arrivalDate: values.arrivalDate,
            capacity: {
                pounds: values.availableCapacityPounds,
                dimension: values.availableCapacityDimensions,
            },
        };

        console.log(payload)

        try {

            const resultAction = await dispatch(saveAirTrip(payload));

            if (saveAirTrip.fulfilled.match(resultAction)) {

                showNewToast({
                    title: "Air Trip Saved",
                    description: "Your air trip has been saved",
                    icon: CircleCheckIcon,
                    action: "success",
                    variant: "solid",
                });
            }
            else {
                const errorMessage =
                    (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;
                showNewToast({
                    title: "Air Trip Save Failed",
                    description: errorMessage.message,
                    icon: HelpCircleIcon,
                    action: "error",
                    variant: "solid",
                });
            }
        } catch (error) {
            showNewToast({
                title: "Air Trip Save Failed",
                description: "Please try again later",
                icon: HelpCircleIcon,
                action: "error",
                variant: "solid",
            });

            console.log("save air trip error:", error);
        }
        // router.navigate('/screens/dashboard/review-bids')
    };



    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="bg-white h-16 px-4 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="lg" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-gray-900">Post Your Trip</Text>

                <TouchableOpacity className="p-2">
                    <View className="relative">
                        <Icon as={BellIcon} size="lg" className="text-[#E75B3B]" />
                        <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </View>
                </TouchableOpacity>
            </View>
            <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={handlePostTrip}>
                {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        <View className="px-4 py-6 space-y-6">
                            {/* Departure City */}
                            <View>
                                <AirportSearch
                                    type="departure"
                                    values={formData}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={setFieldValue}
                                    setAirport={setDepartureAirport}
                                />
                            </View>

                            <View>
                                <AirportSearch
                                    type="arrival"
                                    values={formData}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={setFieldValue}
                                    setAirport={setArrivalAirport}
                                />
                            </View>

                            {/* Airline Name */}
                            <ThemedView>
                                <InputLabelText className="">Airline Name</InputLabelText>
                                <TextInput
                                    placeholder="Airline Name"
                                    value={values.airlineName}
                                    onChangeText={handleChange("airlineName")}
                                    className="bg-[#FDF2F0] rounded-lg h-[55px] mb-2 px-4 py-4 text-base"
                                />
                                {touched.airlineName && errors.airlineName && (
                                    <Text style={{ color: "red", fontSize: 12 }}>{errors.airlineName}</Text>
                                )}
                            </ThemedView>

                            {/* Flight Number */}
                            <ThemedView>
                                <InputLabelText className="mb-2">Flight Number</InputLabelText>
                                <TextInput
                                    placeholder="Flight Nmber"
                                    value={values.flightNumber}
                                    onChangeText={handleChange("flightNumber")}
                                    className="bg-[#FDF2F0] mb-2 h-[55px] rounded-lg px-4 py-4 text-base"
                                />
                                {touched.airlineName && errors.airlineName && (
                                    <Text style={{ color: "red", fontSize: 12 }}>{errors.airlineName}</Text>
                                )}
                            </ThemedView>

                            {/* Departure Date */}

                            <ThemedView className='mb-2'>

                                <DateField
                                    label="Departure Date"
                                    labelClassName="b2_body"
                                    value={values.departureDate ? new Date(values.departureDate) : null}
                                    onChange={(d) => setFieldValue("departureDate", d?.toISOString() ?? "")}
                                />
                                {errors.departureDate && touched.departureDate && (
                                    <ThemedText type="b4_body" className="text-error-500">
                                        {String(errors.departureDate)}
                                    </ThemedText>
                                )}
                            </ThemedView>


                            {/* Arrival Date */}
                            <ThemedView className='mb-2'>

                                <DateField
                                    label="Arrival Date"
                                    labelClassName="b2_body"
                                    value={values.arrivalDate ? new Date(values.arrivalDate) : null}
                                    onChange={(d) => setFieldValue("arrivalDate", d?.toISOString() ?? "")}
                                />
                            </ThemedView>



                            {/* Available Capacity */}
                            <InputLabelText className="mb-2 w-full">Available Capacity</InputLabelText>
                            <ThemedView className='flex flex-row gap-3'>

                                <View className="mb-2 w-1/3">

                                    <TextInput
                                        placeholder="Pounds (lbs)"
                                        value={values.availableCapacityPounds}
                                        onChangeText={handleChange("availableCapacityPounds")}
                                        className="bg-[#FDF2F0] rounded-lg mb-3 h-[55px] px-4 py-4 text-base mb-3"
                                    />
                                    {touched.availableCapacityPounds && errors.availableCapacityPounds && (
                                        <Text style={{ color: "red", fontSize: 12 }}>{errors.availableCapacityPounds}</Text>
                                    )}
                                </View>

                                <View className="w-2/3">

                                    <TextInput
                                        placeholder="Dimension (LxWxH)"
                                        value={values.availableCapacityDimensions}
                                        onChangeText={handleChange("availableCapacityDimensions")}
                                        className="bg-[#FDF2F0] rounded-lg h-[55px] px-4 py-4 text-base mb-3"
                                    />

                                    {touched.availableCapacityDimensions && errors.availableCapacityDimensions && (
                                        <Text style={{ color: "red", fontSize: 12 }}>{errors.availableCapacityDimensions}</Text>
                                    )}
                                </View>
                            </ThemedView>
                            {/* Post Trip Button */}

                            <Button
                                size="xl"
                                className="bg-[#E75B3B] rounded-lg flex justify-center items-center shadow-sm"
                                onPress={() => handleSubmit()}
                            >
                                <ButtonText className="text-white font-semibold text-lg">
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Icon as={Plus} size="xl" className="text-white" /> Post Trip
                                        </>
                                    )}


                                </ButtonText>
                            </Button>


                        </View>
                    </ScrollView>
                )}
            </Formik>


        </SafeAreaView>
    );
}